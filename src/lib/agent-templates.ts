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
  // CSS background value rendered as the template's avatar tile.
  avatar: string;
  // 3 to 4 hex colours used by the live preview sphere to drive the
  // drifting motion blobs. Pulled from the avatar so the sphere and the
  // template card feel like the same identity.
  previewColors: string[];
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
    avatar: "radial-gradient(circle at 28% 30%, #fde68a 0%, transparent 38%), radial-gradient(circle at 75% 38%, #fb7185 0%, transparent 45%), radial-gradient(circle at 55% 80%, #c084fc 0%, transparent 50%), linear-gradient(135deg, #fb923c, #db2777 70%, #7e22ce)",
    previewColors: ["#fde68a", "#fb7185", "#c084fc", "#fb923c"],
    voice: "Amna (Urdu)",
    languages: ["Urdu", "English"],
    systemPrompt: "You are the AI call agent for Cheezious, Pakistan's popular pizza and burger chain. Be respectful, professional, and structured. Greet warmly with 'assalam alaikum' and 'khush amdeed'. Ask one question at a time. Confirm each item back to the caller. Suggest the relevant deal once, never push. Verify the delivery address. Restate the full order with total, payment method, and ETA before closing. Use polite forms (ji, shukria, bilkul). Default to Urdu, switch the moment the caller does. Keep each response under 25 words.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",      title: "Start",                                                                                              col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",   title: "Greet caller",        description: "Open with 'assalam alaikum, khush amdeed'. Confirm Cheezious.",  col: 1, row: 1 },
        { id: "verify",  kind: "tool",   icon: "userCheck", title: "Verify caller",       description: "Look up phone in CRM. Returning caller? Pull order history.",   col: 1, row: 2 },
        { id: "intent",  kind: "branch", icon: "help",      title: "Identify need",       description: "New order, delivery status, complaint, or store hours.",        col: 1, row: 3 },
        { id: "order",   kind: "speak",  icon: "shopping",  title: "Take order",          description: "Read menu sections. Capture each item and confirm back.",       col: 0, row: 4, extras: 2 },
        { id: "status",  kind: "tool",   icon: "search",    title: "Check status",        description: "Pull live rider position. Share ETA in minutes.",              col: 1, row: 4 },
        { id: "comp",    kind: "speak",  icon: "ticket",    title: "Log complaint",       description: "Listen actively. Note specific issue with order context.",     col: 2, row: 4 },
        { id: "deal",    kind: "speak",  icon: "menu",      title: "Suggest one deal",    description: "Offer the most relevant active promo. Never push twice.",      col: 0, row: 5 },
        { id: "rider",   kind: "tool",   icon: "phone",     title: "Notify rider",        description: "Share caller's number with rider. Promise call before bell.",  col: 1, row: 5 },
        { id: "escal",   kind: "tool",   icon: "transfer",  title: "Transfer to manager", description: "Queue callback. Pass transcript and sentiment to manager.",    col: 2, row: 5 },
        { id: "confirm", kind: "tool",   icon: "card",      title: "Confirm order",       description: "Restate full order, total, payment, and 30 minute ETA.",      col: 0, row: 6 },
        { id: "end",     kind: "end",    icon: "hangup",    title: "End",                                                                                                col: 1, row: 7 },
      ],
      edges: [
        { from: "start",   to: "greet" },
        { from: "greet",   to: "verify" },
        { from: "verify",  to: "intent" },
        { from: "intent",  to: "order",  label: "Caller wants to order" },
        { from: "intent",  to: "status", label: "Caller asks about delivery" },
        { from: "intent",  to: "comp",   label: "Caller has a complaint" },
        { from: "order",   to: "deal" },
        { from: "deal",    to: "confirm" },
        { from: "confirm", to: "end" },
        { from: "status",  to: "rider" },
        { from: "rider",   to: "end" },
        { from: "comp",    to: "escal" },
        { from: "escal",   to: "end" },
      ],
    },
  },
  {
    id: "tpl-lahore-clinic",
    name: "Lahore Clinic Receptionist",
    description: "Books dental appointments, reschedules, and answers FAQs about services and pricing for Lahore Smile Clinic.",
    category: "Receptionist",
    integrations: 2,
    avatar: "radial-gradient(circle at 25% 25%, #5eead4 0%, transparent 40%), radial-gradient(circle at 75% 75%, #1e40af 0%, transparent 55%), radial-gradient(circle at 55% 50%, #2563eb 0%, transparent 60%), linear-gradient(135deg, #0ea5e9, #1e3a8a)",
    previewColors: ["#5eead4", "#3b82f6", "#1e40af", "#0ea5e9"],
    voice: "Zara (English)",
    languages: ["English", "Urdu"],
    systemPrompt: "You are the receptionist for Lahore Smile Clinic. Help patients book appointments, reschedule, and answer FAQs about services and pricing. Always confirm date, time, and contact number before booking.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",        title: "Start",                                                                                              col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",     title: "Greet patient",      description: "Confirm Lahore Smile Clinic. Ask how to help today.",            col: 1, row: 1 },
        { id: "verify",  kind: "tool",   icon: "userCheck",   title: "Verify patient",     description: "Look up phone in records. New patient or returning?",            col: 1, row: 2 },
        { id: "intent",  kind: "branch", icon: "help",        title: "Identify need",      description: "Booking, reschedule, general question, or emergency.",            col: 1, row: 3 },
        { id: "avail",   kind: "tool",   icon: "calendar",    title: "Check availability", description: "Pull open slots by service and provider for the next 14 days.",  col: 0, row: 4 },
        { id: "faq",     kind: "speak",  icon: "stethoscope", title: "Answer FAQ",         description: "Use the knowledge base to answer service, pricing, or hours.",    col: 1, row: 4 },
        { id: "emerg",   kind: "tool",   icon: "phone",       title: "Emergency transfer", description: "Immediate transfer to the on-call dentist queue.",                col: 2, row: 4 },
        { id: "book",    kind: "tool",   icon: "calendar",    title: "Book slot",          description: "Confirm time, save in calendar, send SMS reminder + Google invite.", col: 0, row: 5 },
        { id: "end",     kind: "end",    icon: "hangup",      title: "End",                                                                                                col: 1, row: 6 },
      ],
      edges: [
        { from: "start",  to: "greet" },
        { from: "greet",  to: "verify" },
        { from: "verify", to: "intent" },
        { from: "intent", to: "avail",  label: "Wants to book or reschedule" },
        { from: "intent", to: "faq",    label: "Has a general question" },
        { from: "intent", to: "emerg",  label: "Emergency situation" },
        { from: "avail",  to: "book" },
        { from: "book",   to: "end" },
        { from: "faq",    to: "end" },
        { from: "emerg",  to: "end" },
      ],
    },
  },
  {
    id: "tpl-support-pro",
    name: "Customer Support Pro",
    description: "General-purpose support agent. Identifies technical vs account issues and resolves on call or escalates with a ticket.",
    category: "Customer Support",
    integrations: 4,
    avatar: "radial-gradient(circle at 30% 28%, #99f6e4 0%, transparent 40%), radial-gradient(circle at 72% 70%, #0f766e 0%, transparent 55%), linear-gradient(135deg, #14b8a6, #134e4a)",
    previewColors: ["#99f6e4", "#14b8a6", "#0f766e", "#134e4a"],
    voice: "Jamie (Neutral)",
    languages: ["English"],
    systemPrompt: "You are a support representative. Open warmly, identify the issue, propose one concrete first step (not a list), verify identity before sharing account details, and confirm resolution before hanging up.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",      title: "Start",                                                                                                  col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",   title: "Greet caller",        description: "Open warmly. Use the caller's name if the CRM has it.",             col: 1, row: 1 },
        { id: "listen",  kind: "speak",  icon: "help",      title: "Listen for issue",    description: "Let the caller describe it once before asking clarifying questions.", col: 1, row: 2 },
        { id: "verify",  kind: "tool",   icon: "userCheck", title: "Verify identity",     description: "Confirm two account facts before sharing any private data.",        col: 1, row: 3 },
        { id: "branch",  kind: "branch", icon: "help",      title: "Route the call",     description: "Technical, account, or billing.",                                    col: 1, row: 4 },
        { id: "tech",    kind: "speak",  icon: "wrench",    title: "Troubleshoot",       description: "Methodical. Propose ONE concrete first step, not a list.",           col: 0, row: 5 },
        { id: "acct",    kind: "tool",   icon: "card",      title: "Account lookup",     description: "Pull account state. Surface the most likely root cause first.",      col: 1, row: 5 },
        { id: "bill",    kind: "tool",   icon: "dollar",    title: "Billing lookup",     description: "Pull last 30 days of charges and the current invoice.",              col: 2, row: 5 },
        { id: "resolve", kind: "branch", icon: "check",     title: "Resolved or escalate", description: "Confirm the fix worked. Otherwise queue an escalation.",            col: 1, row: 6, extras: 2 },
        { id: "escal",   kind: "tool",   icon: "transfer",  title: "File ticket",        description: "Attach full transcript + intent timeline. Promise 24h callback.",    col: 2, row: 7 },
        { id: "end",     kind: "end",    icon: "hangup",    title: "End",                                                                                                    col: 1, row: 7 },
      ],
      edges: [
        { from: "start",   to: "greet" },
        { from: "greet",   to: "listen" },
        { from: "listen",  to: "verify" },
        { from: "verify",  to: "branch" },
        { from: "branch",  to: "tech",    label: "Technical issue" },
        { from: "branch",  to: "acct",    label: "Account question" },
        { from: "branch",  to: "bill",    label: "Billing question" },
        { from: "tech",    to: "resolve" },
        { from: "acct",    to: "resolve" },
        { from: "bill",    to: "resolve" },
        { from: "resolve", to: "end",   label: "Resolved on the call" },
        { from: "resolve", to: "escal", label: "Needs escalation" },
        { from: "escal",   to: "end" },
      ],
    },
  },
  {
    id: "tpl-hotel-resv",
    name: "Hotel Reservation Agent",
    description: "Books hotel reservations, checks room availability, handles upgrades, and processes cancellations.",
    category: "Receptionist",
    integrations: 2,
    avatar: "radial-gradient(circle at 30% 30%, #fbcfe8 0%, transparent 38%), radial-gradient(circle at 72% 70%, #a21caf 0%, transparent 55%), linear-gradient(135deg, #ec4899, #6b21a8)",
    previewColors: ["#fbcfe8", "#ec4899", "#a21caf", "#6b21a8"],
    voice: "Sofia (Warm)",
    languages: ["English", "Urdu"],
    systemPrompt: "You are a hotel reservations agent. Greet the caller, check dates and availability, quote prices, suggest upgrades only when the room class is available, and confirm booking details twice before charging.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",     title: "Start",                                                                                              col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",  title: "Greet caller",        description: "Welcome to the property. Ask how to help today.",              col: 1, row: 1 },
        { id: "intent",  kind: "branch", icon: "help",     title: "Identify need",       description: "New booking, modify a stay, or cancel a booking.",             col: 1, row: 2 },
        { id: "check",   kind: "tool",   icon: "search",   title: "Check availability",  description: "Capture dates, occupancy, room type. Pull live inventory.",     col: 0, row: 3 },
        { id: "modify",  kind: "tool",   icon: "calendar", title: "Find booking",        description: "Locate the booking. Show change options and any fees.",         col: 1, row: 3 },
        { id: "cancel",  kind: "tool",   icon: "hangup",   title: "Cancel booking",      description: "Apply cancellation policy. Issue refund if eligible.",          col: 2, row: 3 },
        { id: "quote",   kind: "speak",  icon: "dollar",   title: "Quote price",         description: "Quote nightly + total. Mention what's included in the rate.",   col: 0, row: 4 },
        { id: "upgrade", kind: "speak",  icon: "ticket",   title: "Offer upgrade",       description: "Suggest one upgrade only when the room class is available.",    col: 0, row: 5 },
        { id: "book",    kind: "tool",   icon: "card",     title: "Confirm and charge",  description: "Take card hold. Restate full details. Send email + SMS.",       col: 0, row: 6 },
        { id: "end",     kind: "end",    icon: "hangup",   title: "End",                                                                                                col: 1, row: 7 },
      ],
      edges: [
        { from: "start",   to: "greet" },
        { from: "greet",   to: "intent" },
        { from: "intent",  to: "check",  label: "New booking" },
        { from: "intent",  to: "modify", label: "Modify a stay" },
        { from: "intent",  to: "cancel", label: "Cancel a booking" },
        { from: "check",   to: "quote" },
        { from: "quote",   to: "upgrade" },
        { from: "upgrade", to: "book" },
        { from: "book",    to: "end" },
        { from: "modify",  to: "end" },
        { from: "cancel",  to: "end" },
      ],
    },
  },
  {
    id: "tpl-lead-qual",
    name: "Inbound Lead Qualifier",
    description: "Qualifies inbound leads from web forms and ads, assesses budget and timeline, books demos for sales reps.",
    category: "Sales",
    integrations: 3,
    avatar: "radial-gradient(circle at 25% 25%, #c7d2fe 0%, transparent 40%), radial-gradient(circle at 70% 70%, #4338ca 0%, transparent 55%), linear-gradient(135deg, #6366f1, #1e1b4b)",
    previewColors: ["#c7d2fe", "#6366f1", "#4338ca", "#a855f7"],
    voice: "Alex (Energetic)",
    languages: ["English"],
    systemPrompt: "You are an SDR. Open with a hook tied to the form submission. Ask 3 qualifying questions: company size, current pain, timeline. Book a 20-minute demo if BANT is met, otherwise add to nurture sequence.",
    workflow: {
      nodes: [
        { id: "start",    kind: "start",  icon: "flag",      title: "Start",                                                                                              col: 1, row: 0 },
        { id: "hook",     kind: "speak",  icon: "message",   title: "Open with hook",     description: "Reference the exact form they submitted. Confirm a good time.",  col: 1, row: 1 },
        { id: "name",     kind: "speak",  icon: "userCheck", title: "Capture profile",    description: "Name, role, and company size. Tag the call automatically.",       col: 1, row: 2 },
        { id: "pain",     kind: "speak",  icon: "help",      title: "Listen for pain",    description: "Ask 'what triggered this for you now?' Then listen.",             col: 1, row: 3 },
        { id: "timeline", kind: "speak",  icon: "calendar",  title: "Probe timeline",     description: "Buying actively or browsing? Decision in 30, 60, or 90 days?",    col: 1, row: 4 },
        { id: "budget",   kind: "speak",  icon: "dollar",    title: "Confirm budget",     description: "Range only, don't anchor first. Ask if they own the budget.",      col: 1, row: 5 },
        { id: "route",    kind: "branch", icon: "help",      title: "Route",              description: "BANT met? Book a demo. Otherwise drop into nurture.",             col: 1, row: 6 },
        { id: "demo",     kind: "tool",   icon: "calendar",  title: "Book demo",          description: "Find a 20 min slot with the assigned rep. Confirm via email.",    col: 0, row: 7 },
        { id: "nurt",     kind: "tool",   icon: "ticket",    title: "Add to nurture",     description: "Drop into the email sequence and tag with the disqualify reason.", col: 2, row: 7 },
        { id: "end",      kind: "end",    icon: "hangup",    title: "End",                                                                                                col: 1, row: 8 },
      ],
      edges: [
        { from: "start",    to: "hook" },
        { from: "hook",     to: "name" },
        { from: "name",     to: "pain" },
        { from: "pain",     to: "timeline" },
        { from: "timeline", to: "budget" },
        { from: "budget",   to: "route" },
        { from: "route",    to: "demo", label: "Qualified · BANT met" },
        { from: "route",    to: "nurt", label: "Not ready yet" },
        { from: "demo",     to: "end" },
        { from: "nurt",     to: "end" },
      ],
    },
  },
  {
    id: "tpl-lang-tutor",
    name: "Language Practice Tutor",
    description: "Interactive language learning that adapts to level, corrects pronunciation, and teaches new vocabulary.",
    category: "Education",
    integrations: 1,
    avatar: "radial-gradient(circle at 30% 25%, #d9f99d 0%, transparent 40%), radial-gradient(circle at 70% 70%, #16a34a 0%, transparent 55%), radial-gradient(circle at 55% 55%, #65a30d 0%, transparent 60%), linear-gradient(135deg, #84cc16, #14532d)",
    previewColors: ["#d9f99d", "#84cc16", "#65a30d", "#16a34a"],
    voice: "Olive (Patient)",
    languages: ["English", "Urdu"],
    systemPrompt: "You are a patient language tutor. Assess the learner's level in the first 30 seconds. Use short turns. Correct gently. Praise specific wins. End with a one-sentence summary of what they practiced.",
    workflow: {
      nodes: [
        { id: "start",   kind: "start",  icon: "flag",     title: "Start",                                                                                              col: 1, row: 0 },
        { id: "greet",   kind: "speak",  icon: "message",  title: "Greet learner",      description: "Welcome and ask which language to practice today.",            col: 1, row: 1 },
        { id: "assess",  kind: "speak",  icon: "graduate", title: "Assess level",       description: "Three short prompts to calibrate the learner's current level.",  col: 1, row: 2 },
        { id: "level",   kind: "branch", icon: "help",     title: "Pick lesson",        description: "Choose drill set: beginner, intermediate, or fluent.",           col: 1, row: 3 },
        { id: "beg",     kind: "speak",  icon: "mic",      title: "Beginner drill",     description: "Word and short-phrase repetition at slow tempo.",                col: 0, row: 4 },
        { id: "int",     kind: "speak",  icon: "mic",      title: "Intermediate drill", description: "Dialogue role-play at normal conversational tempo.",             col: 1, row: 4 },
        { id: "flu",     kind: "speak",  icon: "mic",      title: "Fluent drill",       description: "Open conversation. Idioms, slang, and humour welcome.",          col: 2, row: 4 },
        { id: "correct", kind: "speak",  icon: "headphones", title: "Correct gently",   description: "Step in mid-sentence for clear errors. Praise specific wins.",   col: 1, row: 5 },
        { id: "wrap",    kind: "speak",  icon: "check",    title: "Wrap up",            description: "Summarise what was practiced and suggest the next session.",      col: 1, row: 6 },
        { id: "end",     kind: "end",    icon: "hangup",   title: "End",                                                                                                col: 1, row: 7 },
      ],
      edges: [
        { from: "start",  to: "greet" },
        { from: "greet",  to: "assess" },
        { from: "assess", to: "level" },
        { from: "level",  to: "beg", label: "Beginner" },
        { from: "level",  to: "int", label: "Intermediate" },
        { from: "level",  to: "flu", label: "Fluent" },
        { from: "beg",    to: "correct" },
        { from: "int",    to: "correct" },
        { from: "flu",    to: "correct" },
        { from: "correct", to: "wrap" },
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
