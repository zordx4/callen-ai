// Custom-agents store — persisted via Zustand so anything the user creates
// in the Create-Agent wizard survives reloads. Mirrors the skipHydration +
// useHydrated() pattern used by the other workspace stores.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import {
  buildSystemPrompt,
  buildFirstMessage,
  DEFAULT_LLM_ID,
} from "./agent-meta";
import { getVoice } from "./voice-library";

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
  systemPrompt: string;        // editable on the detail page; derived from the rest
  firstMessage: string;        // editable on the detail page
  llm: string;                 // LlmModel.id
  defaultLanguage: string;     // primary language id
  additionalLanguages: string[]; // secondary languages, e.g. ["English"]
  behaviorTraits: string[];    // BehaviorTrait ids selected by the user
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
  defaultLanguage?: string;
  additionalLanguages?: string[];
  behaviorTraits?: string[];
};

type Store = {
  agents: CustomAgent[];
  addAgent: (a: AddInput) => string;       // returns new id
  updateAgent: (id: string, patch: Partial<CustomAgent>) => void;
  removeAgent: (id: string) => void;
  // Rebuild systemPrompt + firstMessage from the agent's current config.
  // Useful from the editor's "Regenerate" button.
  regeneratePromptForAgent: (id: string) => void;
};

// Picks the most natural default language from the chosen voice.
function defaultLanguageForVoice(voiceId: string): string {
  const v = getVoice(voiceId);
  if (!v) return "Urdu";
  if (v.language === "Urdu + English") return "Urdu";
  return v.language;
}

export const useCustomAgentsStore = create<Store>()(
  persist(
    (set, get) => ({
      agents: [],
      addAgent: (input) => {
        const id = `agent_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e4).toString(36)}`;
        const now = new Date().toISOString();
        const defaultLanguage =
          input.defaultLanguage ?? defaultLanguageForVoice(input.voiceId);
        const additionalLanguages =
          input.additionalLanguages ??
          (defaultLanguage === "Urdu" ? ["English"] : ["Urdu"]);
        const behaviorTraits = input.behaviorTraits ?? ["respectful", "patient", "warm"];

        const generated = buildSystemPrompt({
          name: input.name,
          industry: input.industry,
          useCase: input.useCase,
          website: input.website,
          mainGoal: input.mainGoal,
          defaultLanguage,
          additionalLanguages,
          behaviorTraits,
        });

        const firstMessage =
          input.firstMessage ??
          buildFirstMessage({
            name: input.name,
            useCase: input.useCase,
            defaultLanguage,
          });

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
          systemPrompt: input.systemPrompt ?? generated,
          firstMessage,
          llm: input.llm ?? DEFAULT_LLM_ID,
          defaultLanguage,
          additionalLanguages,
          behaviorTraits,
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
      regeneratePromptForAgent: (id) => {
        const agent = get().agents.find((a) => a.id === id);
        if (!agent) return;
        const systemPrompt = buildSystemPrompt({
          name: agent.name,
          industry: agent.industry,
          useCase: agent.useCase,
          website: agent.website,
          mainGoal: agent.mainGoal,
          defaultLanguage: agent.defaultLanguage,
          additionalLanguages: agent.additionalLanguages,
          behaviorTraits: agent.behaviorTraits,
        });
        const firstMessage = buildFirstMessage({
          name: agent.name,
          useCase: agent.useCase,
          defaultLanguage: agent.defaultLanguage,
        });
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === id ? { ...a, systemPrompt, firstMessage } : a
          ),
        }));
      },
    }),
    {
      // Bumped from v1 -> v2 to invalidate any localStorage from before
      // the schema gained language / behaviorTraits fields. Existing
      // demo agents in localStorage would crash the editor otherwise.
      name: "callen-custom-agents-v2",
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
