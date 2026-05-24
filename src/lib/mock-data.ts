// Mock data for the entire dashboard.
// Every screen reads from here. When we wire real backend later, only mock-api.ts changes.

export type Tenant = {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "archived";
  logoColor: string; // for the tenant avatar circle
};

export type User = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  avatarUrl?: string;
};

export type AgentConfig = {
  id: string;
  tenantId: string;
  name: string;
  voiceId: string;
  voiceName: string;
  languages: ("ur" | "en")[];
  systemPrompt: string;
  isActive: boolean;
  version: number;
};

export type Call = {
  id: string;
  tenantId: string;
  callerNumber: string;
  callerName?: string;
  startedAt: string; // ISO
  endedAt: string;
  durationSec: number;
  language: "ur" | "en";
  intent: string;
  outcome: "resolved" | "escalated" | "abandoned";
  sentimentScore: number; // -1 to 1
  recordingUrl?: string;
  cost: number;
};

export type TranscriptSegment = {
  speaker: "caller" | "agent";
  text: string;
  language: "ur" | "en";
  ts: number; // seconds into call
  confidence: number;
};

export type Tool = {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  endpoint: string;
  schema: object;
  invocationsLast30d: number;
};

export type KbDocument = {
  id: string;
  tenantId: string;
  name: string;
  source: "pdf" | "url" | "txt";
  chunks: number;
  uploadedAt: string;
  status: "indexed" | "pending" | "failed";
  sizeBytes: number;
};

// =============================================================
// SEED DATA
// =============================================================

export const tenants: Tenant[] = [
  { id: "t1", name: "Cheezious", plan: "pro", status: "active", logoColor: "#F59E0B" },
  { id: "t2", name: "Lahore Smile Clinic", plan: "pro", status: "active", logoColor: "#10B981" },
  { id: "t3", name: "Islamabad Tech Solutions", plan: "enterprise", status: "active", logoColor: "#3B82F6" },
];

export const currentUser: User = {
  id: "u1",
  tenantId: "t1",
  name: "Muhammad Talha Dilshad",
  email: "talha@cheezious.com.pk",
  role: "admin",
};

export const agentConfigs: AgentConfig[] = [
  {
    id: "a1", tenantId: "t1", name: "Cheezious Order Agent",
    voiceId: "voice_ur_amna", voiceName: "Amna (Urdu)",
    languages: ["ur", "en"], systemPrompt: "You are the AI call agent for Cheezious, Pakistan's popular pizza and burger chain. Be respectful, professional, and structured. Greet warmly with 'assalam alaikum' and 'khush amdeed'. Ask one question at a time. Confirm each item back to the caller. Suggest the relevant deal once, never push. Verify the delivery address. Restate the full order with total, payment method, and ETA before closing. Use polite forms (ji, shukria, bilkul). Default to Urdu, switch the moment the caller does. Keep each response under 25 words.",
    isActive: true, version: 7,
  },
  {
    id: "a2", tenantId: "t2", name: "Lahore Smile Clinic Receptionist",
    voiceId: "voice_en_zara", voiceName: "Zara (English)",
    languages: ["en", "ur"], systemPrompt: "You are the receptionist for Lahore Smile Clinic. Help patients book appointments, reschedule, and answer FAQs about services and pricing.",
    isActive: true, version: 3,
  },
];

// Generate 50 realistic calls
const intents = [
  "place_order", "reservation", "menu_inquiry", "delivery_status",
  "complaint", "hours_inquiry", "location_inquiry", "general",
];
const outcomes: Call["outcome"][] = ["resolved", "resolved", "resolved", "resolved", "escalated", "abandoned"];

function generateCalls(): Call[] {
  const calls: Call[] = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    const startedAt = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const duration = Math.floor(45 + Math.random() * 240);
    const endedAt = new Date(startedAt.getTime() + duration * 1000);
    const lang = Math.random() > 0.4 ? "ur" : "en";
    calls.push({
      id: `c${i + 1}`,
      tenantId: "t1",
      callerNumber: `+9230${Math.floor(10000000 + Math.random() * 89999999)}`,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationSec: duration,
      language: lang as "ur" | "en",
      intent: intents[Math.floor(Math.random() * intents.length)],
      outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
      sentimentScore: -0.5 + Math.random() * 1.5,
      cost: +(duration / 60 * 0.08).toFixed(3),
    });
  }
  return calls.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export const calls: Call[] = generateCalls();

// Sample transcript for one call (for the detail page)
export const sampleTranscript: TranscriptSegment[] = [
  { speaker: "agent",  text: "Assalam alaikum, Cheezious mein khush amdeed. Bataiye kya pasand karain gay?", language: "ur", ts: 0.5,  confidence: 0.98 },
  { speaker: "caller", text: "Walaikum salam. Ek peri peri pizza medium aur cheesy fries.", language: "ur", ts: 5.0,  confidence: 0.94 },
  { speaker: "agent",  text: "Bohat acha. Drink ke sath deal len gay? Pepsi 1.5 litre sirf 150 rupay mein.", language: "ur", ts: 9.5,  confidence: 0.97 },
  { speaker: "caller", text: "Haan Pepsi add kar dein.", language: "ur", ts: 14.0, confidence: 0.96 },
  { speaker: "agent",  text: "Bilkul. Address verify karne ke liye, apna delivery location bata dijiye.", language: "ur", ts: 17.0, confidence: 0.98 },
  { speaker: "caller", text: "DHA Phase 6, House 42 Street 9, Karachi.", language: "en", ts: 21.0, confidence: 0.95 },
  { speaker: "agent",  text: "Shukria. Aap ka order: peri peri pizza, cheesy fries, Pepsi. Total 1,890 rupay cash on delivery. Order CH-7821 confirm, 35 minute mein pohonch jaye ga.", language: "ur", ts: 26.0, confidence: 0.98 },
];

export const tools: Tool[] = [
  { id: "tl1", tenantId: "t1", name: "createOrder", description: "Create a new food order in the POS system", endpoint: "https://api.cheezious.com.pk/orders", schema: { type: "object", properties: { items: { type: "array" }, address: { type: "string" } } }, invocationsLast30d: 142 },
  { id: "tl2", tenantId: "t1", name: "checkDeliveryStatus", description: "Look up the status of an existing order", endpoint: "https://api.cheezious.com.pk/orders/status", schema: { type: "object", properties: { orderId: { type: "string" } } }, invocationsLast30d: 87 },
  { id: "tl3", tenantId: "t1", name: "transferToHuman", description: "Transfer the call to a human agent", endpoint: "internal://escalate", schema: { type: "object", properties: { reason: { type: "string" } } }, invocationsLast30d: 14 },
];

export const kbDocuments: KbDocument[] = [
  { id: "k1", tenantId: "t1", name: "Menu_2026.pdf", source: "pdf", chunks: 47, uploadedAt: "2026-05-15T10:30:00Z", status: "indexed", sizeBytes: 284_000 },
  { id: "k2", tenantId: "t1", name: "Delivery_Policies.pdf", source: "pdf", chunks: 12, uploadedAt: "2026-05-18T14:20:00Z", status: "indexed", sizeBytes: 89_000 },
  { id: "k3", tenantId: "t1", name: "FAQ.txt", source: "txt", chunks: 23, uploadedAt: "2026-05-20T09:00:00Z", status: "indexed", sizeBytes: 12_000 },
  { id: "k4", tenantId: "t1", name: "Promotions_June.pdf", source: "pdf", chunks: 8, uploadedAt: "2026-05-22T11:15:00Z", status: "pending", sizeBytes: 156_000 },
];

// Pre-computed KPI metrics for dashboard cards
export const dashboardKpis = {
  callsToday: 38,
  callsTodayDelta: 12, // % vs yesterday
  avgHandlingTimeSec: 124,
  ahtDelta: -8,
  resolutionRate: 0.83,
  resolutionDelta: 4,
  activeCallsNow: 2,
};

// Call volume by hour (today) - 24 entries
export const callVolumeByHour = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${hour.toString().padStart(2, "0")}:00`,
  calls: hour < 8 || hour > 22 ? Math.floor(Math.random() * 2) : Math.floor(3 + Math.random() * 8),
}));

// Language breakdown
export const languageBreakdown = [
  { name: "Urdu", value: 62, fill: "#3B82F6" },
  { name: "English", value: 38, fill: "#10B981" },
];

// Intent breakdown
export const intentBreakdown = [
  { intent: "Place Order", count: 142 },
  { intent: "Menu Inquiry", count: 87 },
  { intent: "Delivery Status", count: 65 },
  { intent: "Reservation", count: 48 },
  { intent: "Hours/Location", count: 33 },
  { intent: "Complaint", count: 12 },
];

// =============================================================
// DASHBOARD WIDGETS (visual uplift)
// =============================================================

// 7-day mini history for the KPI card sparklines.
// Values approximate the corresponding metric trend; the chart shape is
// what carries the visual weight on a small chip.
export type SparkPoint = { d: number; v: number };

export const kpiSparklines: Record<
  "callsToday" | "aht" | "resolution" | "activeNow",
  SparkPoint[]
> = {
  callsToday:  [{ d: 0, v: 24 }, { d: 1, v: 28 }, { d: 2, v: 22 }, { d: 3, v: 31 }, { d: 4, v: 27 }, { d: 5, v: 34 }, { d: 6, v: 38 }],
  aht:         [{ d: 0, v: 142 }, { d: 1, v: 138 }, { d: 2, v: 145 }, { d: 3, v: 132 }, { d: 4, v: 128 }, { d: 5, v: 130 }, { d: 6, v: 124 }],
  resolution:  [{ d: 0, v: 76 }, { d: 1, v: 78 }, { d: 2, v: 79 }, { d: 3, v: 81 }, { d: 4, v: 80 }, { d: 5, v: 82 }, { d: 6, v: 83 }],
  activeNow:   [{ d: 0, v: 1 }, { d: 1, v: 2 }, { d: 2, v: 1 }, { d: 3, v: 3 }, { d: 4, v: 2 }, { d: 5, v: 2 }, { d: 6, v: 2 }],
};

// Live latency series for the hero ticker. 24 points covering the last
// ~12 minutes of agent response time in ms.
export const liveLatencySeries = [
  680, 720, 695, 740, 705, 660, 710, 690, 730, 685, 715, 700,
  675, 695, 720, 710, 685, 700, 690, 705, 720, 695, 680, 710,
];

// Top intents normalised as percentage of total.
export const intentTotal = intentBreakdown.reduce((s, i) => s + i.count, 0);

// Caller geography for a "top cities" widget (cities, calls today).
export const topCallerCities = [
  { city: "Karachi",      calls: 21, share: 55 },
  { city: "Lahore",       calls: 9,  share: 24 },
  { city: "Islamabad",    calls: 5,  share: 13 },
  { city: "Rawalpindi",   calls: 3,  share: 8  },
];

// =============================================================
// LIVE CALL CONSOLE (Day 3) - scripted calls that loop in real time.
// Each call has a deterministic timeline of turns, intents, tool calls,
// and sentiment points. The page advances a virtual clock and reveals
// items as their `ts` is reached.
// =============================================================

export type LiveTurn = {
  speaker: "caller" | "agent";
  text: string;
  lang: "ur" | "en";
  ts: number;       // seconds into call when this turn STARTS
  duration: number; // seconds the speech lasts (for waveform)
};

export type LiveIntent = {
  ts: number;
  intent: string;
  confidence: number;
};

export type LiveToolCall = {
  ts: number;
  name: string;
  args: Record<string, unknown>;
  result: string;
  durationMs: number;
  status: "success" | "running" | "error";
};

export type LiveSentimentPoint = {
  ts: number;
  score: number; // -1 to 1
};

export type LiveCall = {
  id: string;
  tenantId: string;
  callerNumber: string;
  callerCity: string;
  language: "ur" | "en";
  startedSecondsAgo: number;  // seed offset so calls look mid-flight on load
  loopLength: number;         // total seconds before script restarts
  turns: LiveTurn[];
  intents: LiveIntent[];
  toolCalls: LiveToolCall[];
  sentiment: LiveSentimentPoint[];
};

export const liveCalls: LiveCall[] = [
  {
    id: "lc1",
    tenantId: "t1",
    callerNumber: "+92 312 4567890",
    callerCity: "Karachi · DHA Phase 6",
    language: "ur",
    startedSecondsAgo: 14,
    loopLength: 56,
    turns: [
      { speaker: "agent",  ts: 0.5,  duration: 2.5, lang: "ur", text: "Hello, Cheezious. Aaj kya order karna hai?" },
      { speaker: "caller", ts: 4.0,  duration: 3.2, lang: "ur", text: "Bhai, ek peri peri pizza aur cheesy fries de do." },
      { speaker: "agent",  ts: 8.0,  duration: 3.0, lang: "ur", text: "Done. Drink lenge sath? Coke chhoti 90 rupees mein hai." },
      { speaker: "caller", ts: 12.0, duration: 1.8, lang: "ur", text: "Haan ek Coke chhota." },
      { speaker: "agent",  ts: 14.5, duration: 3.8, lang: "ur", text: "Theek hai. Total 1,290 rupees ban gaya. Address bata dein." },
      { speaker: "caller", ts: 19.5, duration: 2.8, lang: "en", text: "DHA Phase 6, House 42, Street 9." },
      { speaker: "agent",  ts: 23.0, duration: 2.5, lang: "ur", text: "Phone yehi number rakhun bill ke liye?" },
      { speaker: "caller", ts: 26.5, duration: 1.0, lang: "ur", text: "Haan same." },
      { speaker: "agent",  ts: 28.5, duration: 2.5, lang: "ur", text: "Aik moment, order place kar raha hun." },
      { speaker: "agent",  ts: 32.0, duration: 5.0, lang: "ur", text: "Order CH-7821 confirm ho gaya. 30 minute mein pohonchayega. Cash on delivery sahi?" },
      { speaker: "caller", ts: 38.5, duration: 1.8, lang: "ur", text: "Haan cash. Shukria!" },
      { speaker: "agent",  ts: 41.0, duration: 2.0, lang: "ur", text: "Welcome. Allah hafiz." },
    ],
    intents: [
      { ts: 5.5,  intent: "place_order",       confidence: 0.95 },
      { ts: 9.5,  intent: "suggest_upsell",    confidence: 0.88 },
      { ts: 20.5, intent: "capture_address",   confidence: 0.97 },
      { ts: 33.0, intent: "confirm_payment",   confidence: 0.93 },
    ],
    toolCalls: [
      { ts: 28.8, name: "lookupMenuItems", args: { items: ["PERI_PERI_PIZZA", "CHEESY_FRIES_REG", "COKE_REG"] }, result: "{ available: true, subtotal: 1290 }", durationMs: 184, status: "success" },
      { ts: 30.5, name: "createOrder",     args: { items: ["PERI_PERI_PIZZA", "CHEESY_FRIES_REG", "COKE_REG"], address: "H42 St9 DHA Ph6", phone: "+923124567890", payment: "cash" }, result: "{ orderId: \"CH-7821\", eta: 30 }", durationMs: 612, status: "success" },
    ],
    sentiment: [
      { ts: 0,  score: 0.20 },
      { ts: 10, score: 0.45 },
      { ts: 20, score: 0.55 },
      { ts: 30, score: 0.70 },
      { ts: 40, score: 0.85 },
    ],
  },
  {
    id: "lc2",
    tenantId: "t1",
    callerNumber: "+92 333 7821145",
    callerCity: "Karachi · Clifton",
    language: "en",
    startedSecondsAgo: 47,
    loopLength: 50,
    turns: [
      { speaker: "agent",  ts: 0.5,  duration: 2.5, lang: "en", text: "Hello, Cheezious. Amna here." },
      { speaker: "caller", ts: 3.8,  duration: 4.5, lang: "en", text: "Hey, I placed an order like an hour back, CH-7714. Still hasn't shown up." },
      { speaker: "agent",  ts: 9.5,  duration: 3.0, lang: "en", text: "Sorry about that, let me pull up CH-7714 quickly." },
      { speaker: "agent",  ts: 13.5, duration: 4.8, lang: "en", text: "Your rider left the kitchen 8 minutes ago, he is 2 km out. About 6 minutes." },
      { speaker: "caller", ts: 19.5, duration: 4.2, lang: "en", text: "Oh okay, the app was off then. Can you ask him to call before he rings the bell?" },
      { speaker: "agent",  ts: 25.0, duration: 4.5, lang: "en", text: "Done. I have pinged the rider with your number, he will call first. Anything else?" },
      { speaker: "caller", ts: 31.0, duration: 1.5, lang: "en", text: "No that's it, thanks." },
      { speaker: "agent",  ts: 34.0, duration: 2.8, lang: "en", text: "Thanks for choosing Cheezious." },
    ],
    intents: [
      { ts: 5.5,  intent: "delivery_status", confidence: 0.96 },
      { ts: 21.0, intent: "contact_rider",   confidence: 0.91 },
    ],
    toolCalls: [
      { ts: 10.5, name: "checkDeliveryStatus", args: { orderId: "CH-7714" }, result: "{ status: \"out_for_delivery\", etaMin: 6, riderKm: 2.1 }", durationMs: 248, status: "success" },
      { ts: 26.5, name: "notifyRider",         args: { orderId: "CH-7714", callerPhone: "+923337821145", note: "call_before_arrival" }, result: "{ sent: true }", durationMs: 142, status: "success" },
    ],
    sentiment: [
      { ts: 0,  score: -0.25 },
      { ts: 10, score: -0.10 },
      { ts: 20, score:  0.20 },
      { ts: 28, score:  0.55 },
      { ts: 36, score:  0.72 },
    ],
  },
  {
    id: "lc3",
    tenantId: "t1",
    callerNumber: "+92 301 9988772",
    callerCity: "Karachi · Gulshan-e-Iqbal",
    language: "ur",
    startedSecondsAgo: 6,
    loopLength: 44,
    turns: [
      { speaker: "agent",  ts: 0.5,  duration: 2.0, lang: "ur", text: "Hello, Cheezious. Bolen." },
      { speaker: "caller", ts: 3.5,  duration: 4.8, lang: "ur", text: "Bhai, kal raat ki buffalo wings bohat hi zyada teekhi thi. Khaayi nahi gayi." },
      { speaker: "agent",  ts: 9.5,  duration: 3.5, lang: "ur", text: "Oh sorry yaar. Order number bata sakte ho?" },
      { speaker: "caller", ts: 14.0, duration: 1.5, lang: "ur", text: "CH-7689." },
      { speaker: "agent",  ts: 16.5, duration: 2.5, lang: "ur", text: "Aik second, check karta hun." },
      { speaker: "agent",  ts: 20.0, duration: 5.5, lang: "ur", text: "Mil gaya. Aap ki shikayat manager ko forward kar di. Aap ko ek hour mein call back ayega aur next order pe compensation milegi." },
      { speaker: "caller", ts: 26.5, duration: 2.0, lang: "ur", text: "Theek hai. Shukria bhai." },
      { speaker: "agent",  ts: 30.0, duration: 2.5, lang: "ur", text: "Welcome. Allah hafiz." },
    ],
    intents: [
      { ts: 6.5,  intent: "complaint",     confidence: 0.92 },
      { ts: 15.0, intent: "lookup_order",  confidence: 0.95 },
      { ts: 22.0, intent: "escalate",      confidence: 0.90 },
    ],
    toolCalls: [
      { ts: 17.0, name: "lookupOrder",     args: { orderId: "CH-7689" }, result: "{ found: true, items: [\"BUFFALO_WINGS_8PC\"], total: 890 }", durationMs: 196, status: "success" },
      { ts: 22.0, name: "transferToHuman", args: { reason: "spice_complaint", ticketId: "CH-7689", priority: "high" }, result: "{ ticket: \"ESC-441\", queue: \"manager\" }", durationMs: 88,  status: "success" },
    ],
    sentiment: [
      { ts: 0,  score:  0.00 },
      { ts: 8,  score: -0.50 },
      { ts: 18, score: -0.25 },
      { ts: 26, score:  0.15 },
      { ts: 32, score:  0.40 },
    ],
  },
];
