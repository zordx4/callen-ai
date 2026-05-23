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
  { id: "t1", name: "Karachi Bites Restaurant", plan: "pro", status: "active", logoColor: "#F59E0B" },
  { id: "t2", name: "Lahore Smile Clinic", plan: "pro", status: "active", logoColor: "#10B981" },
  { id: "t3", name: "Islamabad Tech Solutions", plan: "enterprise", status: "active", logoColor: "#3B82F6" },
];

export const currentUser: User = {
  id: "u1",
  tenantId: "t1",
  name: "Muhammad Talha Dilshad",
  email: "talha@karachibites.pk",
  role: "admin",
};

export const agentConfigs: AgentConfig[] = [
  {
    id: "a1", tenantId: "t1", name: "Karachi Bites Reception Agent",
    voiceId: "voice_ur_amna", voiceName: "Amna (Urdu)",
    languages: ["ur", "en"], systemPrompt: "You are the AI receptionist for Karachi Bites, a Pakistani fast-food restaurant in Karachi. Help callers place orders, answer menu questions, and take reservations. Be warm and use simple Urdu or English based on what the caller uses.",
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
  { speaker: "agent", text: "Karachi Bites mein khush amdeed! Main aapki kya madad kar sakta hoon?", language: "ur", ts: 0.5, confidence: 0.98 },
  { speaker: "caller", text: "Hello, I want to order a family deal for delivery", language: "en", ts: 4.2, confidence: 0.94 },
  { speaker: "agent", text: "Of course! Our Family Feast deal includes a large pizza, 4 chicken pieces, fries, and 1.5L drink for 2499 rupees. Should I proceed with that?", language: "en", ts: 9.1, confidence: 0.97 },
  { speaker: "caller", text: "Yes please. Delivery to Defence Phase 6", language: "en", ts: 18.4, confidence: 0.96 },
  { speaker: "agent", text: "Got it. Defence Phase 6. Can I have your full address and phone number?", language: "en", ts: 22.8, confidence: 0.98 },
  { speaker: "caller", text: "House 42, Street 9, Phase 6. Phone is the one I am calling from", language: "en", ts: 28.0, confidence: 0.95 },
  { speaker: "agent", text: "Perfect. Your order is confirmed. Total is 2499 rupees, delivery in 35-45 minutes. Order number is KB-7821.", language: "en", ts: 35.2, confidence: 0.98 },
];

export const tools: Tool[] = [
  { id: "tl1", tenantId: "t1", name: "createOrder", description: "Create a new food order in the POS system", endpoint: "https://api.karachibites.pk/orders", schema: { type: "object", properties: { items: { type: "array" }, address: { type: "string" } } }, invocationsLast30d: 142 },
  { id: "tl2", tenantId: "t1", name: "checkDeliveryStatus", description: "Look up the status of an existing order", endpoint: "https://api.karachibites.pk/orders/status", schema: { type: "object", properties: { orderId: { type: "string" } } }, invocationsLast30d: 87 },
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
