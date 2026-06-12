// POST /api/webhooks/retell — ingestion point for call lifecycle events
// (call_started, call_ended, call_analyzed). Signature-verified, stored
// raw for idempotency/debugging, then projected into calls / call_turns /
// usage_events with the service role.

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RetellTranscriptTurn = {
  role: "agent" | "user" | "transfer_target";
  content: string;
};

type RetellWebhookCall = {
  call_id: string;
  agent_id?: string;
  direction?: "inbound" | "outbound";
  from_number?: string;
  to_number?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  disconnection_reason?: string;
  recording_url?: string;
  transcript_object?: RetellTranscriptTurn[];
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: "Negative" | "Positive" | "Neutral" | "Unknown";
    call_successful?: boolean;
    in_voicemail?: boolean;
  };
  metadata?: { callen_agent_id?: string; callen_workspace_id?: string };
};

type RetellWebhookBody = {
  event: "call_started" | "call_ended" | "call_analyzed";
  call: RetellWebhookCall;
};

// Per Retell docs: x-retell-signature is an HMAC-SHA256 hex digest of the
// raw request body keyed with the API key.
function verifySignature(rawBody: string, signature: string | null): boolean {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey || !signature) return false;
  const expected = crypto.createHmac("sha256", apiKey).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function mapStatus(reason: string | undefined): string {
  if (!reason) return "completed";
  if (reason === "voicemail_reached") return "voicemail";
  if (reason === "call_transfer" || reason === "transfer_bridged") return "transferred";
  if (reason === "dial_no_answer" || reason === "dial_busy") return "no_answer";
  if (reason.startsWith("error_")) return "failed";
  return "completed";
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-retell-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let body: RetellWebhookBody;
  try {
    body = JSON.parse(rawBody) as RetellWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const admin = createAdminClient();
  const eventKey = `${body.event}:${body.call?.call_id ?? "unknown"}`;

  // Store raw event first; the unique key makes redelivery a no-op.
  const { error: insertEventError } = await admin
    .from("webhook_events")
    .insert({
      provider: "retell",
      event_type: body.event,
      provider_event_id: eventKey,
      payload: body,
    });
  if (insertEventError?.code === "23505") {
    return new NextResponse(null, { status: 204 }); // duplicate delivery
  }

  let processingError: string | null = null;
  try {
    await processEvent(admin, body);
  } catch (err) {
    processingError = err instanceof Error ? err.message : "unknown error";
  }

  await admin
    .from("webhook_events")
    .update({ processed: !processingError, error: processingError })
    .eq("provider_event_id", eventKey);

  // Always 2xx after storage: Retell retries on 5xx, and we already have
  // the payload persisted for replay.
  return new NextResponse(null, { status: 204 });
}

async function processEvent(
  admin: ReturnType<typeof createAdminClient>,
  body: RetellWebhookBody
) {
  const call = body.call;
  if (!call?.call_id) throw new Error("missing call_id");

  // Resolve workspace + agent: prefer the metadata we stamped at sync
  // time, fall back to provider_agent_id lookup.
  let workspaceId = call.metadata?.callen_workspace_id ?? null;
  let agentId = call.metadata?.callen_agent_id ?? null;
  if (!workspaceId && call.agent_id) {
    const { data: agentRow } = await admin
      .from("agents")
      .select("id, workspace_id")
      .eq("provider_agent_id", call.agent_id)
      .maybeSingle();
    workspaceId = agentRow?.workspace_id ?? null;
    agentId = agentRow?.id ?? null;
  }
  if (!workspaceId) throw new Error(`no workspace for provider agent ${call.agent_id}`);

  if (body.event === "call_started") {
    await admin.from("calls").upsert(
      {
        workspace_id: workspaceId,
        agent_id: agentId,
        provider_call_id: call.call_id,
        direction: call.direction ?? "inbound",
        from_e164: call.from_number ?? null,
        to_e164: call.to_number ?? null,
        status: "in_progress",
        started_at: call.start_timestamp ? new Date(call.start_timestamp).toISOString() : new Date().toISOString(),
      },
      { onConflict: "provider_call_id" }
    );
    return;
  }

  if (body.event === "call_ended") {
    const durationSeconds = call.duration_ms ? Math.round(call.duration_ms / 1000) : null;
    const { data: callRow, error } = await admin
      .from("calls")
      .upsert(
        {
          workspace_id: workspaceId,
          agent_id: agentId,
          provider_call_id: call.call_id,
          direction: call.direction ?? "inbound",
          from_e164: call.from_number ?? null,
          to_e164: call.to_number ?? null,
          status: mapStatus(call.disconnection_reason),
          ended_reason: call.disconnection_reason ?? null,
          started_at: call.start_timestamp ? new Date(call.start_timestamp).toISOString() : null,
          ended_at: call.end_timestamp ? new Date(call.end_timestamp).toISOString() : new Date().toISOString(),
          duration_seconds: durationSeconds,
          recording_url: call.recording_url ?? null,
        },
        { onConflict: "provider_call_id" }
      )
      .select("id")
      .single();
    if (error || !callRow) throw new Error(error?.message ?? "failed to upsert call");

    if (call.transcript_object?.length) {
      // Replace turns wholesale: call_ended carries the full transcript.
      await admin.from("call_turns").delete().eq("call_id", callRow.id);
      await admin.from("call_turns").insert(
        call.transcript_object.map((turn, i) => ({
          call_id: callRow.id,
          workspace_id: workspaceId,
          role: turn.role === "agent" ? "assistant" : turn.role === "user" ? "user" : "system",
          content: turn.content,
          ms_offset: i,
        }))
      );
    }

    if (durationSeconds && durationSeconds > 0) {
      await admin.from("usage_events").insert({
        workspace_id: workspaceId,
        agent_id: agentId,
        call_id: callRow.id,
        kind: "call_minutes",
        quantity: Math.round((durationSeconds / 60) * 100) / 100,
        unit: "minutes",
      });
    }
    return;
  }

  if (body.event === "call_analyzed") {
    const analysis = call.call_analysis ?? {};
    const sentiment =
      analysis.user_sentiment && analysis.user_sentiment !== "Unknown"
        ? analysis.user_sentiment.toLowerCase()
        : null;
    const { data: existing } = await admin
      .from("calls")
      .select("id, status")
      .eq("provider_call_id", call.call_id)
      .maybeSingle();

    const outcome = analysis.in_voicemail
      ? "voicemail"
      : existing?.status === "transferred"
        ? "escalated"
        : analysis.call_successful
          ? "resolved"
          : "other";

    await admin
      .from("calls")
      .update({
        summary: analysis.call_summary ?? null,
        sentiment,
        outcome,
      })
      .eq("provider_call_id", call.call_id);
    return;
  }
}
