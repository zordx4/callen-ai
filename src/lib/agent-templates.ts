// Agent template library powering /agent (Agent Studio).
// Each template has metadata for the browse card + a complete workflow
// definition that the WorkflowGraph component renders.

export type WorkflowNodeKind =
  | "start"
  | "speak"
  | "branch"
  | "tool"
  | "end";

export type WorkflowIcon =
  | "flag"
  | "message"
  | "help"
  | "wrench"
  | "card"
  | "check"
  | "hangup"
  | "calendar"
  | "dollar"
  | "search"
  | "transfer"
  | "graduate"
  | "userCheck"
  | "headphones"
  | "mic"
  | "menu"
  | "shopping"
  | "stethoscope"
  | "ticket"
  | "phone";

export type WorkflowNode = {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  description?: string;
  icon: WorkflowIcon;
  col: 0 | 1 | 2;  // column position
  row: number;     // row position (0 at top)
  extras?: number; // "+N" indicator inside the card
};

export type WorkflowEdge = {
  from: string;
  to: string;
  label?: string;
};

export type AgentTemplate = {
  id: string;
  name: string;
  description: string;
  category: "Customer Support" | "Education" | "Outreach" | "Receptionist" | "Sales";
  integrations: number;
  // Monochrome radial-gradient avatar (CSS background value).
  avatar: string;
  voice: string;
  languages: string[];
  // Short version of the system prompt for "View details".
  systemPrompt: string;
  workflow: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
};

// =============================================================
// Templates
// =============================================================

export const agentTemplates: AgentTemplate[] = [
  {
    id: "tpl-jjugnu",
    name: "Cheezious Order Agent",
    description: "Takes pizza and burger orders in casual Urdu and English, suggests deals, captures address, and routes complaints to a manager.",
    category: "Customer Support",
    integrations: 3,
    avatar: "radial-gradient(circle at 28% 30%, #f5f5f5 0%, #525252 40%, #0a0a0a 100%)",
    voice: "Amna (Urdu)",
    languages: ["Urdu", "English"],
    systemPrompt: "You are the AI call agent for Cheezious, Pakistan's popular pizza and burger chain. Be respectful, professional, and structured. Greet warmly with 'assalam alaikum' and 'khush amdeed'. Ask one question at a time. Confirm each item back to the caller. Suggest the relevant deal once, never push. Verify the delivery address. Restate the full order with total, payment method, and ETA before closing. Use polite forms (ji, shukria, bilkul). Default to Urdu, switch the moment the caller does. Keep each response under 25 words.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",     title: "Start",                                                                col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",  title: "Greet caller",  description: "Short casual opener. Match Urdu or English to the caller.",  col: 1, row: 1 },
        { id: "intent",  kind: "branch", icon: "help",     title: "Identify need", description: "New order, delivery status, or complaint.",                  col: 1, row: 2 },
        { id: "order",   kind: "tool",   icon: "shopping", title: "Take burger order", description: "Read menu, suggest a drink, capture address, confirm.",  col: 0, row: 3, extras: 2 },
        { id: "status",  kind: "tool",   icon: "search",   title: "Check delivery", description: "Pull rider location, share ETA, offer to ping rider.",      col: 1, row: 3 },
        { id: "escal",   kind: "tool",   icon: "transfer", title: "Escalate to manager", description: "Log complaint, promise call back inside an hour.",    col: 2, row: 3 },
        { id: "end",     kind: "end",    icon: "hangup",   title: "End",                                                                  col: 1, row: 4 },
      ],
      edges: [
        { from: "start",  to: "greet" },
        { from: "greet",  to: "intent" },
        { from: "intent", to: "order",  label: "Caller wants to order" },
        { from: "intent", to: "status", label: "Caller asks about delivery" },
        { from: "intent", to: "escal",  label: "Caller has a complaint" },
        { from: "order",  to: "end" },
        { from: "status", to: "end" },
        { from: "escal",  to: "end" },
      ],
    },
  },
  {
    id: "tpl-lahore-clinic",
    name: "Lahore Clinic Receptionist",
    description: "Books dental appointments, reschedules, and answers FAQs about services and pricing for Lahore Smile Clinic.",
    category: "Receptionist",
    integrations: 2,
    avatar: "radial-gradient(circle at 70% 35%, #fafafa 0%, #737373 35%, #171717 100%)",
    voice: "Zara (English)",
    languages: ["English", "Urdu"],
    systemPrompt: "You are the receptionist for Lahore Smile Clinic. Help patients book appointments, reschedule, and answer FAQs about services and pricing. Always confirm date, time, and contact number before booking.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",        title: "Start",                                                                col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",     title: "Greet patient",   description: "Confirm you have reached Lahore Smile Clinic.",         col: 1, row: 1 },
        { id: "verify",  kind: "tool",   icon: "userCheck",   title: "Verify patient",  description: "Look up the phone number. New patient or returning?",   col: 1, row: 2 },
        { id: "intent",  kind: "branch", icon: "help",        title: "Identify need",   description: "Booking, reschedule, or general question.",             col: 1, row: 3 },
        { id: "book",    kind: "tool",   icon: "calendar",    title: "Book slot",       description: "Check availability and confirm appointment.",           col: 0, row: 4 },
        { id: "answer",  kind: "speak",  icon: "stethoscope", title: "Answer FAQ",      description: "Use the knowledge base to answer service or pricing.",  col: 2, row: 4 },
        { id: "end",     kind: "end",    icon: "hangup",      title: "End",                                                                  col: 1, row: 5 },
      ],
      edges: [
        { from: "start",  to: "greet" },
        { from: "greet",  to: "verify" },
        { from: "verify", to: "intent" },
        { from: "intent", to: "book",   label: "Wants to book or reschedule" },
        { from: "intent", to: "answer", label: "Has a general question" },
        { from: "book",   to: "end" },
        { from: "answer", to: "end" },
      ],
    },
  },
  {
    id: "tpl-support-pro",
    name: "Customer Support Pro",
    description: "General-purpose support agent. Identifies technical vs account issues and resolves on call or escalates with a ticket.",
    category: "Customer Support",
    integrations: 4,
    avatar: "radial-gradient(circle at 50% 20%, #ededed 0%, #404040 50%, #0a0a0a 100%)",
    voice: "Jamie (Neutral)",
    languages: ["English"],
    systemPrompt: "You are a support representative. Open warmly, identify the issue, propose one concrete first step (not a list), verify identity before sharing account details, and confirm resolution before hanging up.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",     title: "Start",                                                                col: 1, row: 0 },
        { id: "ident",   kind: "speak",  icon: "help",     title: "Identify issue",  description: "Open warmly. Ask what they need help with today.",      col: 1, row: 1 },
        { id: "tech",    kind: "speak",  icon: "wrench",   title: "Troubleshoot",    description: "Methodical troubleshooting. Propose ONE concrete step.", col: 0, row: 2 },
        { id: "acct",    kind: "speak",  icon: "card",     title: "Account & Billing", description: "Account or billing question. Verify identity BEFORE sharing.", col: 2, row: 2 },
        { id: "resolve", kind: "branch", icon: "check",    title: "Resolve or escalate", description: "If resolved on the call, confirm the fix worked.",    col: 1, row: 3, extras: 2 },
        { id: "end",     kind: "end",    icon: "hangup",   title: "End",                                                                  col: 1, row: 4 },
      ],
      edges: [
        { from: "start",   to: "ident" },
        { from: "ident",   to: "tech",    label: "Caller has a technical issue" },
        { from: "ident",   to: "acct",    label: "Caller has an account question" },
        { from: "tech",    to: "resolve" },
        { from: "acct",    to: "resolve" },
        { from: "resolve", to: "end" },
      ],
    },
  },
  {
    id: "tpl-hotel-resv",
    name: "Hotel Reservation Agent",
    description: "Books hotel reservations, checks room availability, handles upgrades, and processes cancellations.",
    category: "Receptionist",
    integrations: 2,
    avatar: "radial-gradient(circle at 35% 65%, #f5f5f5 0%, #525252 45%, #171717 100%)",
    voice: "Sofia (Warm)",
    languages: ["English", "Urdu"],
    systemPrompt: "You are a hotel reservations agent. Greet the caller, check dates and availability, quote prices, suggest upgrades only when the room class is available, and confirm booking details twice before charging.",
    workflow: {
      nodes: [
        { id: "start",  kind: "start",  icon: "flag",     title: "Start",                                                              col: 1, row: 0 },
        { id: "greet",  kind: "speak",  icon: "message",  title: "Greet caller",  description: "Confirm hotel name and ask how to help.",               col: 1, row: 1 },
        { id: "check",  kind: "tool",   icon: "search",   title: "Check availability", description: "Capture dates, occupancy, and pull live inventory.", col: 1, row: 2 },
        { id: "quote",  kind: "tool",   icon: "dollar",   title: "Quote price",   description: "Quote nightly + total. Offer an upgrade if room available.", col: 1, row: 3, extras: 1 },
        { id: "book",   kind: "branch", icon: "calendar", title: "Book or hold",  description: "If caller accepts, book. Otherwise hold for 30 minutes.",  col: 1, row: 4 },
        { id: "end",    kind: "end",    icon: "hangup",   title: "End",                                                                col: 1, row: 5 },
      ],
      edges: [
        { from: "start", to: "greet" },
        { from: "greet", to: "check" },
        { from: "check", to: "quote" },
        { from: "quote", to: "book" },
        { from: "book",  to: "end" },
      ],
    },
  },
  {
    id: "tpl-lead-qual",
    name: "Inbound Lead Qualifier",
    description: "Qualifies inbound leads from web forms and ads, assesses budget and timeline, books demos for sales reps.",
    category: "Sales",
    integrations: 3,
    avatar: "radial-gradient(circle at 60% 30%, #e5e5e5 0%, #404040 40%, #0a0a0a 100%)",
    voice: "Alex (Energetic)",
    languages: ["English"],
    systemPrompt: "You are an SDR. Open with a hook tied to the form submission. Ask 3 qualifying questions: company size, current pain, timeline. Book a 20-minute demo if BANT is met, otherwise add to nurture sequence.",
    workflow: {
      nodes: [
        { id: "start",  kind: "start",  icon: "flag",       title: "Start",                                                                col: 1, row: 0 },
        { id: "hook",   kind: "speak",  icon: "message",    title: "Open with hook", description: "Reference the form submission. Confirm a good time.",   col: 1, row: 1 },
        { id: "qual",   kind: "speak",  icon: "userCheck",  title: "Qualify",        description: "Size, pain, timeline. Listen more than you speak.",     col: 1, row: 2 },
        { id: "route",  kind: "branch", icon: "help",       title: "Route",          description: "If qualified, book demo. Otherwise nurture.",            col: 1, row: 3 },
        { id: "demo",   kind: "tool",   icon: "calendar",   title: "Book demo",      description: "Find a 20 minute slot with the assigned rep.",          col: 0, row: 4 },
        { id: "nurt",   kind: "tool",   icon: "ticket",     title: "Add to nurture", description: "Drop into the email sequence and tag with reason.",     col: 2, row: 4 },
        { id: "end",    kind: "end",    icon: "hangup",     title: "End",                                                                  col: 1, row: 5 },
      ],
      edges: [
        { from: "start", to: "hook" },
        { from: "hook",  to: "qual" },
        { from: "qual",  to: "route" },
        { from: "route", to: "demo", label: "Qualified (BANT met)" },
        { from: "route", to: "nurt", label: "Not ready yet" },
        { from: "demo",  to: "end" },
        { from: "nurt",  to: "end" },
      ],
    },
  },
  {
    id: "tpl-lang-tutor",
    name: "Language Practice Tutor",
    description: "Interactive language learning that adapts to level, corrects pronunciation, and teaches new vocabulary.",
    category: "Education",
    integrations: 1,
    avatar: "radial-gradient(circle at 40% 40%, #fafafa 0%, #737373 30%, #262626 100%)",
    voice: "Olive (Patient)",
    languages: ["English", "Urdu"],
    systemPrompt: "You are a patient language tutor. Assess the learner's level in the first 30 seconds. Use short turns. Correct gently. Praise specific wins. End with a one-sentence summary of what they practiced.",
    workflow: {
      nodes: [
        { id: "start",  kind: "start",  icon: "flag",     title: "Start",                                                                col: 1, row: 0 },
        { id: "greet",  kind: "speak",  icon: "message",  title: "Greet learner",  description: "Welcome and ask which language they want to practice.", col: 1, row: 1 },
        { id: "assess", kind: "speak",  icon: "graduate", title: "Assess level",   description: "Quick prompts to calibrate beginner / intermediate / fluent.", col: 1, row: 2 },
        { id: "drill",  kind: "speak",  icon: "mic",      title: "Practice drill", description: "Pattern drill matched to level. Listen, correct, praise.", col: 1, row: 3, extras: 1 },
        { id: "wrap",   kind: "speak",  icon: "check",    title: "Wrap up",        description: "Summarise what was practiced and suggest next session.",  col: 1, row: 4 },
        { id: "end",    kind: "end",    icon: "hangup",   title: "End",                                                                  col: 1, row: 5 },
      ],
      edges: [
        { from: "start",  to: "greet" },
        { from: "greet",  to: "assess" },
        { from: "assess", to: "drill" },
        { from: "drill",  to: "wrap" },
        { from: "wrap",   to: "end" },
      ],
    },
  },
];

export const templateCategories = [
  "All",
  "Customer Support",
  "Education",
  "Outreach",
  "Receptionist",
  "Sales",
] as const;
