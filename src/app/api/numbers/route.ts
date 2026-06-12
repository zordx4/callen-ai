// POST /api/numbers — buy a Retell-managed number and bind it to an
// agent. Auth: session cookie for the agent lookup (RLS-scoped); the
// phone_numbers insert uses the service role because users are
// intentionally not allowed to write that table.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retell, isRetellConfigured } from "@/lib/retell/client";

const NUMBER_MONTHLY_COST_CENTS = 200; // Retell-managed: $2/mo

export async function POST(request: NextRequest) {
  if (!isRetellConfigured()) {
    return NextResponse.json(
      { error: "Voice runtime is not configured (RETELL_API_KEY missing)." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    agentId?: string;
    areaCode?: number;
  } | null;
  if (!body?.agentId) {
    return NextResponse.json({ error: "agentId is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: agent, error } = await supabase
    .from("agents")
    .select("id, workspace_id, name, provider_agent_id")
    .eq("id", body.agentId)
    .single();

  if (error || !agent) {
    return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  }
  if (!agent.provider_agent_id) {
    return NextResponse.json(
      { error: "Agent has not been synced to the voice runtime yet. Save the agent first." },
      { status: 409 }
    );
  }

  try {
    const purchased = await retell().phoneNumber.create({
      area_code: body.areaCode,
      nickname: `${agent.name} (Callen)`,
      inbound_agents: [{ agent_id: agent.provider_agent_id, weight: 1 }],
    });

    const admin = createAdminClient();
    const { data: numberRow, error: insertError } = await admin
      .from("phone_numbers")
      .insert({
        workspace_id: agent.workspace_id,
        agent_id: agent.id,
        e164: purchased.phone_number,
        provider: "retell",
        provider_number_id: purchased.phone_number,
        status: "active",
        monthly_cost_cents: NUMBER_MONTHLY_COST_CENTS,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Number purchased (${purchased.phone_number}) but failed to persist: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ number: numberRow });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown runtime error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
