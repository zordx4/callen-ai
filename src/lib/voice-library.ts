// Voice library — curated catalog for /voices and the Agent editor.
//
// 13 conversational US English voices hand-picked from ElevenLabs. The
// preview clips in /public/voices are the real ElevenLabs samples.
//
// IMPORTANT on the runtime voice: these exact ElevenLabs voices are not
// in Retell's default catalog, so each catalog id maps (via voice-map.ts)
// to the closest real Retell voice for actual calls. Previews are the
// real ElevenLabs voices; on-call audio is the mapped Retell voice until
// the ElevenLabs voices are imported into Retell (bring-your-own EL key),
// after which voice-map.ts is the single place to swap to the real ids.

export type VoiceLanguage = "English";
export type VoiceAccent = "American" | "British";
export type VoiceGender = "Male" | "Female";
export type VoiceAge = "Young adult" | "Adult" | "Middle aged";
export type VoiceCategory =
  | "Conversational"
  | "Customer Service"
  | "Sales"
  | "Receptionist"
  | "Order Taking"
  | "Healthcare"
  | "Narration"
  | "Concierge";

export type Voice = {
  id: string;             // catalog slug (mapped to a Retell id in voice-map)
  name: string;
  tagline: string;
  edgeVoice: string;      // source provider label (informational only)
  rate?: string;
  pitch?: string;
  language: VoiceLanguage;
  extraLanguages?: VoiceLanguage[];
  accent: VoiceAccent;
  gender: VoiceGender;
  age: VoiceAge;
  category: VoiceCategory;
  useCases: VoiceCategory[];
  sample: string;
  premium?: boolean;
  trending?: boolean;
  audioSrc: string;       // real ElevenLabs preview clip
};

// =============================================================
// Catalog (13 voices) — most-business-relevant first.
// =============================================================

export const VOICES: Voice[] = [
  {
    id: "eryn",
    name: "Eryn",
    tagline: "Friendly AI assistant, built for support",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Adult",
    category: "Customer Service",
    useCases: ["Customer Service", "Receptionist", "Conversational"],
    sample: "Hi, thanks for calling! I can help with orders, appointments, or any questions you have.",
    trending: true,
    audioSrc: "/voices/eryn.mp3",
  },
  {
    id: "lana",
    name: "Lana",
    tagline: "Warm, captivating and peaceful",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Adult",
    category: "Healthcare",
    useCases: ["Healthcare", "Customer Service", "Receptionist"],
    sample: "Of course, I understand. Let's find a time that works best for you, no rush at all.",
    trending: true,
    audioSrc: "/voices/lana.mp3",
  },
  {
    id: "adam",
    name: "Adam",
    tagline: "Engaging, friendly and bright",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Young adult",
    category: "Order Taking",
    useCases: ["Order Taking", "Customer Service", "Sales"],
    sample: "Great choice! That's one large pepperoni and a garlic bread. Anything to drink with that?",
    trending: true,
    audioSrc: "/voices/adam.mp3",
  },
  {
    id: "natalee",
    name: "Natalee",
    tagline: "Polished and welcoming",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Receptionist",
    useCases: ["Receptionist", "Customer Service", "Concierge"],
    sample: "Good morning! You've reached the front desk. Would you like to book, reschedule, or ask a question?",
    audioSrc: "/voices/natalee.mp3",
  },
  {
    id: "diana",
    name: "Diana",
    tagline: "Friendly and polished",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Adult",
    category: "Concierge",
    useCases: ["Concierge", "Receptionist", "Customer Service"],
    sample: "Certainly. I've noted a table for four at eight, and I'll text you a confirmation shortly.",
    audioSrc: "/voices/diana.mp3",
  },
  {
    id: "bella",
    name: "Bella",
    tagline: "Expressive and personable",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Conversational",
    useCases: ["Conversational", "Customer Service", "Sales"],
    sample: "Oh, totally, that happens all the time. Give me one second and I'll get it sorted for you.",
    audioSrc: "/voices/bella.mp3",
  },
  {
    id: "jack",
    name: "Jack",
    tagline: "Conversational and upbeat",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Young adult",
    category: "Sales",
    useCases: ["Sales", "Conversational", "Customer Service"],
    sample: "Good question! Most folks on this plan save about forty bucks a month. Want me to walk you through it?",
    audioSrc: "/voices/jack.mp3",
  },
  {
    id: "stokes",
    name: "Stokes",
    tagline: "Relaxing, casual and warm",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Adult",
    category: "Customer Service",
    useCases: ["Customer Service", "Conversational"],
    sample: "Hey, no worries at all. I hear you. Let me take a quick look and get this fixed up.",
    audioSrc: "/voices/stokes.mp3",
  },
  {
    id: "dan",
    name: "Dan",
    tagline: "Energetic and excited",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Young adult",
    category: "Sales",
    useCases: ["Sales", "Conversational"],
    sample: "Awesome, you're going to love this. Here's the short version, then I'll send the details over.",
    audioSrc: "/voices/dan.mp3",
  },
  {
    id: "chris",
    name: "Chris",
    tagline: "Friendly conversational guide",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Adult",
    category: "Conversational",
    useCases: ["Conversational", "Customer Service", "Narration"],
    sample: "Sure thing. Walk me through what happened and I'll take it from there, step by step.",
    audioSrc: "/voices/chris.mp3",
  },
  {
    id: "george",
    name: "George",
    tagline: "Casual, laid-back and neutral",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Adult",
    category: "Conversational",
    useCases: ["Conversational", "Customer Service"],
    sample: "Yeah, for sure. We can swap that out, same price. Anything else you want me to check?",
    audioSrc: "/voices/george.mp3",
  },
  {
    id: "dustin",
    name: "Dustin",
    tagline: "Smooth phone and on-hold voice",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Adult",
    category: "Customer Service",
    useCases: ["Customer Service", "Concierge", "Narration"],
    sample: "Thanks for your patience. Your claim has three steps, and here's exactly where each one stands.",
    audioSrc: "/voices/dustin.mp3",
  },
  {
    id: "kirk",
    name: "Kirk",
    tagline: "Deep, confident broadcast tone",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Middle aged",
    category: "Narration",
    useCases: ["Narration", "Concierge", "Sales"],
    sample: "Welcome, and thanks for calling. Let's get you taken care of right away.",
    audioSrc: "/voices/kirk.mp3",
  },
];

export function getVoice(id: string): Voice | undefined {
  return VOICES.find((v) => v.id === id);
}

export const DEFAULT_VOICE_ID = "eryn";

// Template voice assignment: stable, business-appropriate defaults.
const TEMPLATE_VOICE_OVERRIDES: Record<string, string> = {
  "restaurant-order": "adam",
  "clinic-reception": "lana",
  "sales-outbound": "dan",
  "concierge": "diana",
};

import { agentTemplates } from "./agent-templates";

const TEMPLATE_VOICE_MAP: Map<string, Voice> = (() => {
  const map = new Map<string, Voice>();
  agentTemplates.forEach((t, i) => {
    const overrideId = TEMPLATE_VOICE_OVERRIDES[t.id];
    const voice =
      (overrideId && VOICES.find((v) => v.id === overrideId)) ||
      VOICES[i % VOICES.length];
    map.set(t.id, voice);
  });
  return map;
})();

export function voiceForTemplateId(templateId: string): Voice {
  return TEMPLATE_VOICE_MAP.get(templateId) ?? VOICES[0];
}

export const TRENDING_VOICES = VOICES.filter((v) => v.trending);

const _activeCategories = new Set(VOICES.map((v) => v.category));
export const CATEGORY_FILTERS: VoiceCategory[] = (
  [
    "Customer Service",
    "Sales",
    "Receptionist",
    "Healthcare",
    "Conversational",
    "Narration",
    "Order Taking",
    "Concierge",
  ] as VoiceCategory[]
).filter((c) => _activeCategories.has(c));

export const LANGUAGE_FILTERS: VoiceLanguage[] = ["English"];

const _activeAccents = new Set(VOICES.map((v) => v.accent));
export const ACCENT_FILTERS: VoiceAccent[] = (
  ["American", "British"] as VoiceAccent[]
).filter((a) => _activeAccents.has(a));

export type UseCaseCard = {
  id: VoiceCategory;
  title: string;
  blurb: string;
  art: { from: string; via: string; to: string };
};

export const USE_CASE_CARDS: UseCaseCard[] = [
  {
    id: "Customer Service",
    title: "Customer Support",
    blurb: "Calm, clear voices that resolve issues without friction.",
    art: { from: "#bfdbfe", via: "#60a5fa", to: "#1e3a8a" },
  },
  {
    id: "Sales",
    title: "Sales and Renewals",
    blurb: "Confident, persuasive voices that move a conversation forward.",
    art: { from: "#fde68a", via: "#f59e0b", to: "#78350f" },
  },
  {
    id: "Receptionist",
    title: "Receptionist",
    blurb: "Warm, friendly voices for first-line greeting and routing.",
    art: { from: "#fbcfe8", via: "#ec4899", to: "#831843" },
  },
  {
    id: "Healthcare",
    title: "Healthcare",
    blurb: "Empathetic voices for clinics, triage, and patient follow-up.",
    art: { from: "#a7f3d0", via: "#10b981", to: "#064e3b" },
  },
  {
    id: "Conversational",
    title: "Conversational",
    blurb: "Natural, expressive voices for casual back-and-forth.",
    art: { from: "#c7d2fe", via: "#6366f1", to: "#1e1b4b" },
  },
  {
    id: "Narration",
    title: "Narration",
    blurb: "Cinematic, story-telling voices for explainers and previews.",
    art: { from: "#cbd5e1", via: "#64748b", to: "#0f172a" },
  },
];
