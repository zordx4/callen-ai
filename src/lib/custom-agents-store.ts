// Custom-agents store — persisted via Zustand so anything the user creates
// in the Create-Agent wizard survives reloads. Mirrors the skipHydration +
// useHydrated() pattern used by the other workspace stores.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export type CustomAgentType = "personal" | "business" | "blank";
export type CustomAgentStatus = "draft" | "published";

export type CustomAgent = {
  id: string;
  name: string;
  type: CustomAgentType | null;
  industry: string | null;
  useCase: string | null;
  voiceId: string;             // -> Voice in voice-library
  website: string;
  mainGoal: string;            // the wizard's free-text "what should the agent do"
  chatOnly: boolean;
  systemPrompt: string;        // editable on the detail page; derives from mainGoal
  firstMessage: string;        // editable on the detail page
  llm: string;                 // default "Gemini 2.5 Flash"
  createdAt: string;
  status: CustomAgentStatus;
};

type AddInput = {
  name: string;
  type: CustomAgentType | null;
  industry: string | null;
  useCase: string | null;
  voiceId: string;
  website: string;
  mainGoal: string;
  chatOnly: boolean;
  systemPrompt?: string;
  firstMessage?: string;
  llm?: string;
};

type Store = {
  agents: CustomAgent[];
  addAgent: (a: AddInput) => string;       // returns new id
  updateAgent: (id: string, patch: Partial<CustomAgent>) => void;
  removeAgent: (id: string) => void;
};

function defaultSystemPrompt(name: string, mainGoal: string): string {
  const persona = name && name.trim().length > 0 ? name.trim() : "the agent";
  return [
    `# Personality`,
    `You are ${persona}, a respectful, professional, and patient voice agent for an inbound Pakistani telephony line. You are highly knowledgeable about the business you serve and are fluent in both Urdu and English. Match the caller's language the moment they switch.`,
    ``,
    `# Goal`,
    mainGoal && mainGoal.trim().length > 0
      ? mainGoal.trim()
      : `Help every caller reach a clear resolution in one call.`,
    ``,
    `# Style`,
    `Greet warmly (assalam alaikum / khush amdeed). Ask one question at a time. Confirm each detail back. Use polite forms (ji, shukria, bilkul). Restate full order or action before closing. Keep each response under 25 words.`,
  ].join("\n");
}

function defaultFirstMessage(): string {
  return "[warmly] Assalam-o-alaikum, aap ne Callen-powered line par call ki hai. Main aap ki kis tarah madad kar sakta hoon?";
}

export const useCustomAgentsStore = create<Store>()(
  persist(
    (set) => ({
      agents: [],
      addAgent: (input) => {
        const id = `agent_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e4).toString(36)}`;
        const now = new Date().toISOString();
        const agent: CustomAgent = {
          id,
          name: input.name,
          type: input.type,
          industry: input.industry,
          useCase: input.useCase,
          voiceId: input.voiceId,
          website: input.website,
          mainGoal: input.mainGoal,
          chatOnly: input.chatOnly,
          systemPrompt:
            input.systemPrompt ??
            defaultSystemPrompt(input.name, input.mainGoal),
          firstMessage: input.firstMessage ?? defaultFirstMessage(),
          llm: input.llm ?? "Gemini 2.5 Flash",
          createdAt: now,
          status: "draft",
        };
        set((s) => ({ agents: [agent, ...s.agents] }));
        return id;
      },
      updateAgent: (id, patch) =>
        set((s) => ({
          agents: s.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      removeAgent: (id) =>
        set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
    }),
    {
      name: "callen-custom-agents-v1",
      skipHydration: true,
    }
  )
);

export function useCustomAgentsHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useCustomAgentsStore.persist.rehydrate();
    const unsub = useCustomAgentsStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    if (useCustomAgentsStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}
