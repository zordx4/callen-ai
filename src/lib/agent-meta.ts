// Shared metadata + smart generators for the Create-Agent wizard
// and the agent editor. Centralised so the wizard, editor, and store
// all draw from one source of truth.

import {
  ShoppingBag,
  HeartPulse,
  Landmark,
  Home,
  GraduationCap,
  Plane,
  Car,
  Briefcase,
  Cpu,
  Building2,
  UtensilsCrossed,
  Factory,
  HeartHandshake,
  Scale,
  HandHeart,
  Tv,
  HelpCircle,
  Headphones,
  TrendingUp,
  BookOpen,
  Calendar,
  Users,
  Phone,
  ShoppingCart,
  CalendarCheck,
  Star,
  Truck,
  Heart,
  Hourglass,
  Scissors,
  Sun,
  Crown,
  Smile,
  Shield,
  Rocket,
  AlertCircle,
  Target,
  Search,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";

// =============================================================
// Industries
// =============================================================

export type IndustryOption = { id: string; label: string; icon: LucideIcon };

export const INDUSTRIES: IndustryOption[] = [
  { id: "retail",        label: "Retail & E-commerce",   icon: ShoppingBag },
  { id: "healthcare",    label: "Healthcare & Medical",   icon: HeartPulse },
  { id: "finance",       label: "Finance & Banking",      icon: Landmark },
  { id: "real-estate",   label: "Real Estate",            icon: Home },
  { id: "education",     label: "Education & Training",   icon: GraduationCap },
  { id: "hospitality",   label: "Hospitality & Travel",   icon: Plane },
  { id: "automotive",    label: "Automotive",             icon: Car },
  { id: "professional",  label: "Professional Services",  icon: Briefcase },
  { id: "technology",    label: "Technology & Software",  icon: Cpu },
  { id: "government",    label: "Government & Public",    icon: Building2 },
  { id: "food",          label: "Food & Beverage",        icon: UtensilsCrossed },
  { id: "manufacturing", label: "Manufacturing",          icon: Factory },
  { id: "fitness",       label: "Fitness & Wellness",     icon: HeartHandshake },
  { id: "legal",         label: "Legal Services",         icon: Scale },
  { id: "nonprofit",     label: "Non-Profit",             icon: HandHeart },
  { id: "media",         label: "Media & Entertainment",  icon: Tv },
  { id: "other",         label: "Other",                  icon: HelpCircle },
];

export function industryLabel(id: string | null | undefined): string {
  if (!id) return "";
  return INDUSTRIES.find((i) => i.id === id)?.label ?? "";
}

// =============================================================
// Use cases
// =============================================================

export type UseCaseOption = { id: string; label: string; icon: LucideIcon };

export const USE_CASES: UseCaseOption[] = [
  { id: "customer-support",  label: "Customer Support",       icon: Headphones },
  { id: "outbound-sales",    label: "Outbound Sales",         icon: TrendingUp },
  { id: "learning",          label: "Learning and Development", icon: BookOpen },
  { id: "scheduling",        label: "Scheduling",             icon: Calendar },
  { id: "lead-qualification",label: "Lead Qualification",     icon: Users },
  { id: "answering",         label: "Answering Service",      icon: Phone },
  { id: "order-taking",      label: "Order Taking",           icon: ShoppingCart },
  { id: "reservation",       label: "Reservation Management", icon: CalendarCheck },
  { id: "menu-rec",          label: "Menu Recommendations",   icon: Star },
  { id: "delivery",          label: "Delivery Tracking",      icon: Truck },
  { id: "loyalty",           label: "Loyalty Programs",       icon: Heart },
  { id: "nutrition",         label: "Nutritional Information",icon: Heart },
  { id: "other",             label: "Other",                  icon: HelpCircle },
];

export function useCaseLabel(id: string | null | undefined): string {
  if (!id) return "";
  return USE_CASES.find((u) => u.id === id)?.label ?? "";
}

// =============================================================
// LLM models (3 per provider)
// =============================================================

export type LlmProvider = "Google" | "OpenAI" | "Anthropic";

export type LlmModel = {
  id: string;
  provider: LlmProvider;
  label: string;
  description: string;
};

export const LLM_MODELS: LlmModel[] = [
  { id: "gemini-2.5-pro",   provider: "Google",    label: "Gemini 2.5 Pro",    description: "Top reasoning · 1M context · highest quality" },
  { id: "gemini-2.5-flash", provider: "Google",    label: "Gemini 2.5 Flash",  description: "Fast + cheap · great default for voice agents" },
  { id: "gemini-2.0-flash", provider: "Google",    label: "Gemini 2.0 Flash",  description: "Previous-gen flash · lowest cost" },
  { id: "gpt-4o",           provider: "OpenAI",    label: "GPT-4o",            description: "Flagship multimodal · strong tool use" },
  { id: "gpt-4o-mini",      provider: "OpenAI",    label: "GPT-4o Mini",       description: "Fast + cheap · solid for simple flows" },
  { id: "gpt-4-turbo",      provider: "OpenAI",    label: "GPT-4 Turbo",       description: "Long context · classic strong reasoning" },
  { id: "claude-opus-4.7",  provider: "Anthropic", label: "Claude Opus 4.7",   description: "Top-tier · best at nuance and refusal" },
  { id: "claude-sonnet-4.7",provider: "Anthropic", label: "Claude Sonnet 4.7", description: "Balanced workhorse · default for production" },
  { id: "claude-haiku-4.7", provider: "Anthropic", label: "Claude Haiku 4.7",  description: "Fastest · ideal for tight latency budgets" },
];

export const DEFAULT_LLM_ID = "gemini-2.5-flash";

export function llmById(id: string | null | undefined): LlmModel | undefined {
  if (!id) return undefined;
  return LLM_MODELS.find((m) => m.id === id);
}

export function llmLabel(id: string | null | undefined): string {
  return llmById(id)?.label ?? "Gemini 2.5 Flash";
}

// =============================================================
// Behaviour traits — chips the user can toggle to colour the agent's
// reply style. Selected trait prompt lines are appended to the
// generated systemPrompt's Style section.
// =============================================================

export type BehaviorTrait = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  prompt: string;            // line spliced into the generated Style section
};

export const BEHAVIOR_TRAITS: BehaviorTrait[] = [
  {
    id: "respectful",
    label: "Respectful",
    icon: HandHeart,
    description: "Polite forms and titles throughout.",
    prompt: "Use polite forms and titles. Default to 'ji', 'sir', 'madam' as appropriate.",
  },
  {
    id: "empathetic",
    label: "Empathetic",
    icon: Heart,
    description: "Acknowledge feelings before solutions.",
    prompt: "Acknowledge how the caller feels before moving to a solution. Mirror their emotional tone.",
  },
  {
    id: "patient",
    label: "Patient",
    icon: Hourglass,
    description: "Never rush, rephrase calmly when asked.",
    prompt: "Never rush. If a caller asks for something to be repeated or rephrased, do so calmly without sounding frustrated.",
  },
  {
    id: "concise",
    label: "Concise",
    icon: Scissors,
    description: "Short turns, no filler.",
    prompt: "Keep each turn under 20 words. Drop filler phrases and small talk.",
  },
  {
    id: "warm",
    label: "Warm",
    icon: Sun,
    description: "Use the caller's name, sound happy to help.",
    prompt: "Use the caller's name when known. Sound genuinely happy to help.",
  },
  {
    id: "formal",
    label: "Formal",
    icon: Crown,
    description: "Formal register, no slang or contractions.",
    prompt: "Use a formal register. Avoid contractions and slang. Address the caller respectfully.",
  },
  {
    id: "playful",
    label: "Playful",
    icon: Smile,
    description: "Light humour when appropriate.",
    prompt: "Light humour where it fits. Keep the tone upbeat without joking about the caller's problem.",
  },
  {
    id: "authoritative",
    label: "Authoritative",
    icon: Shield,
    description: "Confident, decisive, quotes policy clearly.",
    prompt: "Be confident and decisive. Quote policy plainly when needed.",
  },
  {
    id: "encouraging",
    label: "Encouraging",
    icon: Rocket,
    description: "Celebrate small wins, praise specific actions.",
    prompt: "Celebrate small wins. Praise specific actions the caller took.",
  },
  {
    id: "apologetic",
    label: "Apologetic",
    icon: AlertCircle,
    description: "Acknowledge problems openly, own mistakes first.",
    prompt: "Acknowledge problems openly. Own mistakes before fixing them.",
  },
  {
    id: "solution-focused",
    label: "Solution-focused",
    icon: Target,
    description: "Move to action, always end with next step.",
    prompt: "Move to action quickly. Always end a turn with a clear next step.",
  },
  {
    id: "detail-oriented",
    label: "Detail-oriented",
    icon: Search,
    description: "Confirm dates, amounts, addresses by repeating.",
    prompt: "Confirm specifics: dates, amounts, addresses. Repeat them back to verify.",
  },
];

export function traitsToPromptLines(traitIds: string[]): string[] {
  return traitIds
    .map((id) => BEHAVIOR_TRAITS.find((t) => t.id === id)?.prompt)
    .filter((p): p is string => Boolean(p));
}

// =============================================================
// Languages
// =============================================================

export type LanguageOption = {
  id: string;
  label: string;
  flag: string;       // emoji flag for UI only (identity surface)
};

// Scoped to the languages we actually ship voices for. Pakistani SMB
// telephony is overwhelmingly Urdu + English code-mix anyway. Expand
// later when the voice library grows.
export const LANGUAGES: LanguageOption[] = [
  { id: "Urdu",    label: "Urdu",    flag: "🇵🇰" },
  { id: "English", label: "English", flag: "🇺🇸" },
];

export function languageFor(id: string | undefined | null): LanguageOption | undefined {
  if (!id) return undefined;
  return LANGUAGES.find((l) => l.id === id);
}

// =============================================================
// Smart system-prompt + first-message generators
// =============================================================

export interface PromptInput {
  name: string;
  industry: string | null;
  useCase: string | null;
  website: string;
  mainGoal: string;
  defaultLanguage: string;
  additionalLanguages: string[];
  behaviorTraits: string[];
}

export function buildSystemPrompt(input: PromptInput): string {
  const persona = input.name.trim() || "the agent";
  const industry = industryLabel(input.industry);
  const useCase = useCaseLabel(input.useCase);
  const goal = input.mainGoal.trim() || "Help every caller reach a clear resolution in one call.";

  const allLanguages = [
    input.defaultLanguage,
    ...input.additionalLanguages.filter((l) => l !== input.defaultLanguage),
  ];

  const traitLines = traitsToPromptLines(input.behaviorTraits);

  const sections: string[] = [];

  // -------- Personality --------
  sections.push(
    [
      "# Personality",
      `You are ${persona}, a professional voice agent on an inbound Pakistani telephony line.${
        industry ? ` You represent a ${industry.toLowerCase()} business.` : ""
      }`,
      `You are fluent in ${allLanguages.join(" and ")}. Match the caller's language the moment they switch.`,
    ].join("\n")
  );

  // -------- Goal --------
  sections.push(["# Goal", goal].join("\n"));

  // -------- Use case --------
  if (useCase) {
    sections.push(
      [
        "# Primary use case",
        `You specialise in ${useCase.toLowerCase()}. Stay within this scope and escalate anything outside to a human agent.`,
      ].join("\n")
    );
  }

  // -------- Knowledge --------
  const knowledgeBits: string[] = [];
  if (input.website.trim()) {
    knowledgeBits.push(
      `Reference ${input.website.trim()} for product, pricing, and policy details. Quote it when relevant.`
    );
  }
  knowledgeBits.push(
    "Use the connected knowledge base for menus, pricing, hours, FAQs, and SOPs. Never invent details that are not in your sources."
  );
  sections.push(["# Knowledge", knowledgeBits.join(" ")].join("\n"));

  // -------- Style --------
  const baseStyle = [
    "Greet warmly: 'assalam alaikum' or 'khush amdeed' in Urdu, 'hello' or 'good morning' in English.",
    "Ask one question at a time.",
    "Confirm each detail back to the caller.",
    "Restate the full order or action before closing the call.",
    "Use polite forms (ji, shukria, bilkul, bohat acha).",
    "Keep each response under 25 words.",
  ];
  const styleLines = [...baseStyle, ...traitLines];
  sections.push(
    ["# Style", styleLines.map((l) => `- ${l}`).join("\n")].join("\n")
  );

  // -------- Limits --------
  sections.push(
    [
      "# Limits",
      "- Never invent prices, hours, or policies. If unknown, say so and offer to escalate.",
      "- Never share another customer's information.",
      "- Transfer to a human for refunds over Rs. 5,000, legal questions, or repeated complaints.",
    ].join("\n")
  );

  return sections.join("\n\n");
}

export function buildFirstMessage(input: {
  name: string;
  useCase: string | null;
  defaultLanguage: string;
}): string {
  const useCase = (input.useCase ?? "").trim();
  const name = input.name.trim() || "this Callen line";
  const ur = input.defaultLanguage === "Urdu";

  // Use-case-specific openers
  const openers: Record<string, { ur: string; en: string }> = {
    "order-taking": {
      ur: `[warmly] Assalam-o-alaikum, ${name} mein khush amdeed. Aap kya order karna chahein ge?`,
      en: `[warmly] Welcome to ${name}. What can I get started for you today?`,
    },
    scheduling: {
      ur: `[warmly] Assalam-o-alaikum, ${name}. Kya aap appointment book karna chahein ge ya reschedule?`,
      en: `[warmly] Hi, you've reached ${name}. Would you like to book or change an appointment?`,
    },
    "customer-support": {
      ur: `[warmly] Assalam-o-alaikum, ${name} support. Main aap ki kis tarah madad kar sakta hoon?`,
      en: `[warmly] Hi, you've reached ${name} support. How can I help today?`,
    },
    "lead-qualification": {
      ur: `[warmly] Assalam-o-alaikum, ${name}. Kya aap apnay business ke baray mein thori detail share karain ge?`,
      en: `[warmly] Hi, this is ${name}. Could you tell me a bit about what you're looking for?`,
    },
    answering: {
      ur: `[warmly] Assalam-o-alaikum, ${name}. Kya main aap ki madad kar sakta hoon?`,
      en: `[warmly] Hello, you've reached ${name}. How can I help?`,
    },
    reservation: {
      ur: `[warmly] Assalam-o-alaikum, ${name}. Kya aap reservation karna chahein ge?`,
      en: `[warmly] Hi, ${name} here. Would you like to make a reservation?`,
    },
    "outbound-sales": {
      ur: `[warmly] Assalam-o-alaikum, main ${name} se baat kar raha hoon. Kya yeh baat karne ka acha waqt hai?`,
      en: `[warmly] Hi, this is ${name}. Do you have a couple of minutes to chat?`,
    },
    delivery: {
      ur: `[warmly] Assalam-o-alaikum, ${name}. Aap apna order number bata sakte hain?`,
      en: `[warmly] Hi, ${name} here. Could you share your order number?`,
    },
  };

  const fallback = {
    ur: `[warmly] Assalam-o-alaikum, ${name}. Aap ki kis tarah madad kar sakta hoon?`,
    en: `[warmly] Hi, this is ${name}. How can I help you today?`,
  };

  const set = openers[useCase] ?? fallback;
  return ur ? set.ur : set.en;
}

// Note exported here so the wizard and editor render the icons by id.
export type { LucideIcon };
