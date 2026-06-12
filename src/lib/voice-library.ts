// Voice library — curated catalog for /voices and the Agent editor.
//
// 16 production voices for the US market, English only. Every id is a
// REAL Retell voice id (provider-prefixed), so whatever the user picks
// flows straight through agent sync to the live runtime with no mapping.
// Preview clips are Retell's official samples (S3-hosted mp3s).
//
// Cartesia voices = standard tier (cheapest per minute at equal latency).
// ElevenLabs voices = premium tier.

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
  id: string;             // Retell voice id — synced verbatim to the runtime
  name: string;
  tagline: string;        // short character description shown on card
  edgeVoice: string;      // provider label (informational only)
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
  audioSrc: string;
};

// =============================================================
// Catalog (16 voices)
// Ordered most-business-relevant first so the template round-robin
// fallback lands on safe defaults.
// =============================================================

export const VOICES: Voice[] = [
  // ---------- Customer-facing (clear, professional) ----------
  {
    id: "cartesia-Grace",
    name: "Grace",
    tagline: "Clear, warm and professional",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Middle aged",
    category: "Customer Service",
    useCases: ["Customer Service", "Receptionist", "Conversational"],
    sample:
      "Hi, thanks for calling! I can help with orders, appointments, and any questions about our hours.",
    trending: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-e69bca79-afd6-4f8c-969b-8596003e1559.mp3",
  },
  {
    id: "cartesia-Nico",
    name: "Nico",
    tagline: "Clear and steady",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Middle aged",
    category: "Customer Service",
    useCases: ["Customer Service", "Sales", "Conversational"],
    sample:
      "I hear you. Let me check that right now and I'll have an update for you in under a minute.",
    trending: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-d184915e-0757-4063-b8d4-0e218f05e770.mp3",
  },
  {
    id: "cartesia-Marissa",
    name: "Marissa",
    tagline: "Bright and upbeat",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Receptionist",
    useCases: ["Receptionist", "Customer Service", "Conversational"],
    sample:
      "Good morning! You've reached the front desk. Would you like to book, reschedule, or ask a question?",
    trending: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-Marissa.mp3",
  },
  {
    id: "cartesia-Brian",
    name: "Brian",
    tagline: "Friendly and energetic",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Young adult",
    category: "Order Taking",
    useCases: ["Order Taking", "Customer Service", "Sales"],
    sample:
      "Awesome choice. That's one large pepperoni and a garlic bread — anything to drink with that?",
    trending: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-ccb4cea5-13c8-4559-a9c8-e83bc8171c4d.mp3",
  },
  {
    id: "cartesia-Kate",
    name: "Kate",
    tagline: "Calm and reassuring",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Middle aged",
    category: "Healthcare",
    useCases: ["Healthcare", "Customer Service", "Receptionist"],
    sample:
      "I understand, and we'll get you seen as soon as possible. The earliest opening is tomorrow at nine.",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-14e8711c-e7f8-4efa-8eb3-aced878ddf6c.mp3",
  },
  {
    id: "cartesia-Sloane",
    name: "Sloane",
    tagline: "Polished and precise",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Middle aged",
    category: "Concierge",
    useCases: ["Concierge", "Receptionist", "Customer Service"],
    sample:
      "Certainly. I've noted a table for four at eight o'clock, and I'll send a confirmation text shortly.",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-Sloane.mp3",
  },
  // ---------- Sales / outbound ----------
  {
    id: "cartesia-Andrew",
    name: "Andrew",
    tagline: "Confident and persuasive",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Young adult",
    category: "Sales",
    useCases: ["Sales", "Conversational", "Customer Service"],
    sample:
      "Great question. Most customers on this plan save about forty dollars a month — want me to walk you through it?",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-57b18927-80da-4929-a185-517ccc549976.mp3",
  },
  {
    id: "cartesia-Lucas",
    name: "Lucas",
    tagline: "Direct and dependable",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Middle aged",
    category: "Sales",
    useCases: ["Sales", "Customer Service"],
    sample:
      "I'll keep this quick. Your renewal is due Friday, and I can lock in the current rate today.",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-20f1cc93-a4ac-42d9-8b6c-0279f1a08c58.mp3",
  },
  // ---------- Conversational / personality ----------
  {
    id: "cartesia-Hailey",
    name: "Hailey",
    tagline: "Natural and expressive",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Conversational",
    useCases: ["Conversational", "Customer Service", "Receptionist"],
    sample:
      "Oh totally, that happens all the time — give me one second and I'll sort it out for you.",
    trending: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-284d1552-ff0c-4068-ad6f-1eab97bee041.mp3",
  },
  {
    id: "cartesia-Nia",
    name: "Nia",
    tagline: "Warm with a smile in the voice",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Conversational",
    useCases: ["Conversational", "Customer Service"],
    sample:
      "Hey! So glad you called back. I found exactly what you were looking for yesterday.",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-27f71502-02de-4ae3-9360-035c7b89dfee.mp3",
  },
  {
    id: "cartesia-Chloe",
    name: "Chloe",
    tagline: "Easygoing and approachable",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Conversational",
    useCases: ["Conversational", "Order Taking"],
    sample:
      "No worries at all — we can swap that for the gluten-free base, same price.",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-Chloe.mp3",
  },
  {
    id: "cartesia-Michael",
    name: "Michael",
    tagline: "Grounded and trustworthy",
    edgeVoice: "Cartesia Sonic",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Middle aged",
    category: "Narration",
    useCases: ["Narration", "Customer Service"],
    sample:
      "Your claim has three steps: review, approval, and payout. Here's where each one stands.",
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/cartesia-a167e0f3-df7e-4d52-a9c3-f949145efdab.mp3",
  },
  // ---------- Premium tier (ElevenLabs) ----------
  {
    id: "11labs-Grace",
    name: "Grace Premium",
    tagline: "Studio-grade warmth",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Middle aged",
    category: "Customer Service",
    useCases: ["Customer Service", "Receptionist", "Concierge"],
    sample:
      "Thank you for holding. I've checked with the kitchen, and your order will be ready in fifteen minutes.",
    premium: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/grace.mp3",
  },
  {
    id: "11labs-Hailey",
    name: "Hailey Premium",
    tagline: "Vivid and lifelike",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Female",
    age: "Young adult",
    category: "Conversational",
    useCases: ["Conversational", "Sales", "Customer Service"],
    sample:
      "Honestly? The weekend slots fill up fast — let me grab you Saturday morning before it goes.",
    premium: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/11labs-9koBc4DQZJE0dLobwFBt.mp3",
  },
  {
    id: "11labs-Nico",
    name: "Nico Premium",
    tagline: "Deep and composed",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Middle aged",
    category: "Concierge",
    useCases: ["Concierge", "Narration", "Customer Service"],
    sample:
      "Of course. I've arranged the late checkout and a car to the airport at four.",
    premium: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/11labs-pdBC2RxjF7wu7aBAu86E.mp3",
  },
  {
    id: "11labs-Adrian",
    name: "Adrian Premium",
    tagline: "Crisp and charismatic",
    edgeVoice: "ElevenLabs",
    language: "English",
    accent: "American",
    gender: "Male",
    age: "Young adult",
    category: "Sales",
    useCases: ["Sales", "Conversational"],
    sample:
      "Here's the short version: better coverage, same bill. Want me to send over the details?",
    premium: true,
    audioSrc: "https://retell-utils-public.s3.us-west-2.amazonaws.com/adrian.mp3",
  },
];

export function getVoice(id: string): Voice | undefined {
  return VOICES.find((v) => v.id === id);
}

export const DEFAULT_VOICE_ID = "cartesia-Grace";

// Template voice assignment: stable, business-appropriate defaults.
const TEMPLATE_VOICE_OVERRIDES: Record<string, string> = {
  "restaurant-order": "cartesia-Brian",
  "clinic-reception": "cartesia-Kate",
  "sales-outbound": "cartesia-Andrew",
  "concierge": "cartesia-Sloane",
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

// Filter chip categories — only show ones that have voices in them.
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

// Use-case feature card surface — bigger tiles below the trending grid.
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
