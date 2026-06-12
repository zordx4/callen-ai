// Pushes a Callen agent row to Retell: one Retell LLM (the brain config)
// + one Retell Agent (voice + transport) per Callen agent. Stores the
// resulting ids back on the row so subsequent saves update in place.

import "server-only";
import { retell } from "@/lib/retell/client";
import { toRetellVoiceId } from "@/lib/retell/voice-map";
import { SITE_URL } from "@/lib/site-url";

// Cheapest strong tool-calling default; override per-agent via
// agents.settings.model.
const DEFAULT_MODEL = "gemini-3.0-flash" as const;

export type CallenAgentRow = {
  id: string;
  workspace_id: string;
  name: string;
  system_prompt: string;
  greeting: string | null;
  voice_id: string | null;
  language: string;
  provider_agent_id: string | null;
  settings: Record<string, unknown>;
};

export type AgentSyncResult = {
  providerAgentId: string;
  providerLlmId: string;
};

// Voice tuning saved by the dashboard's mood controls (settings.voiceTuning).
type VoiceTuning = {
  voiceSpeed?: number;
  voiceTemperature?: number;
  responsiveness?: number;
  interruptionSensitivity?: number;
  backchannel?: boolean;
};

export async function syncAgentToRetell(agent: CallenAgentRow): Promise<AgentSyncResult> {
  const client = retell();
  const model = (agent.settings?.model as typeof DEFAULT_MODEL) ?? DEFAULT_MODEL;
  const existingLlmId = (agent.settings?.provider_llm_id as string) ?? null;
  const tuning = (agent.settings?.voiceTuning as VoiceTuning) ?? {};

  const llmPayload = {
    general_prompt: agent.system_prompt,
    begin_message: agent.greeting ?? null,
    model,
  };

  let llmId = existingLlmId;
  if (llmId) {
    await client.llm.update(llmId, llmPayload);
  } else {
    const llm = await client.llm.create(llmPayload);
    llmId = llm.llm_id;
  }

  const agentPayload = {
    agent_name: agent.name,
    voice_id: toRetellVoiceId(agent.voice_id),
    language: "en-US" as const,
    response_engine: { type: "retell-llm" as const, llm_id: llmId },
    webhook_url: `${SITE_URL}/api/webhooks/retell`,
    // Mood controls from the dashboard. Defaults match Retell's.
    voice_speed: tuning.voiceSpeed ?? 1,
    voice_temperature: tuning.voiceTemperature ?? 1,
    responsiveness: tuning.responsiveness ?? 1,
    interruption_sensitivity: tuning.interruptionSensitivity ?? 1,
    enable_backchannel: tuning.backchannel ?? true,
    // Callen agent id rides along on every webhook for cheap correlation.
    metadata: { callen_agent_id: agent.id, callen_workspace_id: agent.workspace_id },
  };

  let providerAgentId = agent.provider_agent_id;
  if (providerAgentId) {
    await client.agent.update(providerAgentId, agentPayload);
  } else {
    const created = await client.agent.create(agentPayload);
    providerAgentId = created.agent_id;
  }

  return { providerAgentId, providerLlmId: llmId };
}
