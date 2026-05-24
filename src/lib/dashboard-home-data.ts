// Dashboard home data + filter logic.
// One KpiDef per metric, plus deterministic helpers that derive
// the display value and chart series for any (range, granularity, agent) combo.

export type Range = "24h" | "7d" | "30d" | "90d";
export type Granularity = "hour" | "day" | "week";
export type AgentId = "all" | "a1" | "a2";

export interface RangeOption { value: Range; label: string }
export interface GranularityOption { value: Granularity; label: string }
export interface AgentOption { value: AgentId; label: string }

export const rangeOptions: RangeOption[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d",  label: "Last 7 days"   },
  { value: "30d", label: "Last 30 days"  },
  { value: "90d", label: "Last 90 days"  },
];

export const granularityOptions: GranularityOption[] = [
  { value: "hour", label: "Hour" },
  { value: "day",  label: "Day"  },
  { value: "week", label: "Week" },
];

export const agentOptions: AgentOption[] = [
  { value: "all", label: "All agents" },
  { value: "a1",  label: "Cheezious Order Agent" },
  { value: "a2",  label: "Lahore Smile Clinic Receptionist" },
];

// Only show granularities that make sense for the chosen range
export function granularitiesFor(range: Range): Granularity[] {
  if (range === "24h") return ["hour"];
  if (range === "7d")  return ["hour", "day"];
  if (range === "30d") return ["day", "week"];
  return ["day", "week"];
}

export function defaultGranularity(range: Range): Granularity {
  if (range === "24h") return "hour";
  if (range === "90d") return "week";
  return "day";
}

// Agent activity multiplier (mock: scales values to show the filter is real)
const agentMultiplier: Record<AgentId, number> = {
  all: 1.0,
  a1:  0.72,   // Cheezious takes ~72% of calls
  a2:  0.28,   // Lahore Smile takes ~28%
};

// Range -> number of days
export const rangeDays: Record<Range, number> = {
  "24h": 1,
  "7d":  7,
  "30d": 30,
  "90d": 90,
};

// =============================================================
// KPI definitions
// =============================================================

export type KpiType = "total" | "average" | "rate";

export interface KpiDef {
  key: string;
  label: string;
  unit?: string;
  type: KpiType;           // total: scales with range; average/rate: stays steady
  base: number;            // per-day for total, constant for average/rate
  format: (n: number) => string;
  noiseAmp?: number;       // 0..1 variance for the series
}

const fmtInt    = (n: number) => Math.round(n).toLocaleString();
const fmtFloat1 = (n: number) => n.toFixed(1);
const fmtTime   = (n: number) => `${Math.floor(n)}:${Math.round((n % 1) * 60).toString().padStart(2, "0")}`;
const fmtMs     = (n: number) => `${Math.round(n)}`;
const fmtPct    = (n: number) => n.toFixed(1);
const fmtUsdCent = (n: number) => `$${n.toFixed(3)}`;
const fmtUsd    = (n: number) => `$${n.toFixed(2)}`;
const fmtCount  = (n: number) => Math.round(n).toString();

export type TabKey = "General" | "Evaluation" | "Audio" | "Tools" | "LLMs" | "Knowledge Base" | "Data Collection" | "Advanced";

export const homeTabs: TabKey[] = [
  "General", "Evaluation", "Data Collection", "Audio", "Tools", "LLMs", "Knowledge Base", "Advanced",
];

export const tabKpis: Record<Exclude<TabKey, "Advanced">, KpiDef[]> = {
  General: [
    { key: "calls",      label: "Calls answered",          type: "total",   base: 335,  format: fmtInt },
    { key: "latency",    label: "Avg first-token latency", type: "average", base: 742,  unit: "ms",      format: fmtMs },
    { key: "resolution", label: "Resolution rate",         type: "rate",    base: 76.0, unit: "%",       format: fmtPct },
    { key: "aht",        label: "Avg handling time",       type: "average", base: 3.7,                   format: fmtTime, noiseAmp: 0.05 },
    { key: "urdu",       label: "Urdu share",              type: "rate",    base: 64.0, unit: "%",       format: fmtPct },
    { key: "tools",      label: "Tool invocations",        type: "total",   base: 260,                   format: fmtInt },
  ],
  Evaluation: [
    { key: "success",    label: "Success rate",            type: "rate",    base: 75.1, unit: "%", format: fmtPct },
    { key: "csat",       label: "Avg CSAT",                type: "average", base: 3.5,  unit: "/5", format: fmtFloat1, noiseAmp: 0.07 },
    { key: "fcr",        label: "First-contact resolution", type: "rate",   base: 68.4, unit: "%", format: fmtPct },
    { key: "escalation", label: "Escalation rate",         type: "rate",    base: 9.8,  unit: "%", format: fmtPct },
    { key: "sentiment",  label: "Avg sentiment",           type: "average", base: 0.42, unit: " (-1..1)", format: (n) => n.toFixed(2) },
    { key: "transfer",   label: "Human transfer rate",     type: "rate",    base: 6.2,  unit: "%", format: fmtPct },
  ],
  "Data Collection": [
    { key: "vars",       label: "Variables captured",      type: "total",   base: 1240,                  format: fmtInt },
    { key: "fillRate",   label: "Field-fill rate",         type: "rate",    base: 91.3, unit: "%",       format: fmtPct },
    { key: "validation", label: "Validation pass rate",    type: "rate",    base: 96.7, unit: "%",       format: fmtPct },
    { key: "piiRedact",  label: "PII redactions",          type: "total",   base: 78,                    format: fmtInt },
    { key: "schemaDrift",label: "Schema drift events",     type: "total",   base: 3,                     format: fmtCount,  noiseAmp: 0.6 },
    { key: "complete",   label: "Form completion rate",    type: "rate",    base: 87.4, unit: "%",       format: fmtPct },
  ],
  Audio: [
    { key: "sttLat",     label: "Avg STT latency",         type: "average", base: 184,  unit: "ms",      format: fmtMs },
    { key: "ttsLat",     label: "Avg TTS latency",         type: "average", base: 296,  unit: "ms",      format: fmtMs },
    { key: "wer",        label: "Word error rate",         type: "rate",    base: 4.2,  unit: "%",       format: fmtPct },
    { key: "bargein",    label: "Barge-in rate",           type: "rate",    base: 17.8, unit: "%",       format: fmtPct },
    { key: "dropoff",    label: "Audio dropoff",           type: "rate",    base: 1.9,  unit: "%",       format: fmtPct },
    { key: "mos",        label: "MOS quality",             type: "average", base: 4.3,  unit: "/5",      format: fmtFloat1, noiseAmp: 0.04 },
  ],
  Tools: [
    { key: "invocations",label: "Total invocations",       type: "total",   base: 260,                   format: fmtInt },
    { key: "successRate",label: "Success rate",            type: "rate",    base: 97.3, unit: "%",       format: fmtPct },
    { key: "toolLat",    label: "Avg tool latency",        type: "average", base: 412,  unit: "ms",      format: fmtMs },
    { key: "topTool",    label: "createOrder share",       type: "rate",    base: 54.6, unit: "%",       format: fmtPct },
    { key: "errors",     label: "Error rate",              type: "rate",    base: 2.7,  unit: "%",       format: fmtPct },
    { key: "mcpServers", label: "Active MCP servers",      type: "average", base: 4,                     format: fmtCount,  noiseAmp: 0 },
  ],
  LLMs: [
    { key: "promptTok",  label: "Prompt tokens",           type: "total",   base: 184_000,               format: (n) => `${(n/1000).toFixed(1)}K` },
    { key: "completion", label: "Completion tokens",       type: "total",   base: 76_400,                format: (n) => `${(n/1000).toFixed(1)}K` },
    { key: "tokensCall", label: "Avg tokens per call",     type: "average", base: 776,                   format: fmtInt },
    { key: "avgLlmCost", label: "Avg LLM cost / call",     type: "average", base: 0.053,                 format: fmtUsdCent },
    { key: "cacheHit",   label: "Prompt cache hit rate",   type: "rate",    base: 41.2, unit: "%",       format: fmtPct },
    { key: "totalLlm",   label: "Total LLM spend",         type: "total",   base: 17.8,                  format: fmtUsd },
  ],
  "Knowledge Base": [
    { key: "queries",    label: "KB queries",              type: "total",   base: 920,                   format: fmtInt },
    { key: "hitRate",    label: "Hit rate",                type: "rate",    base: 89.6, unit: "%",       format: fmtPct },
    { key: "chunks",     label: "Avg chunks retrieved",    type: "average", base: 3.4,                   format: fmtFloat1, noiseAmp: 0.05 },
    { key: "topDoc",     label: "Menu_2026.pdf share",     type: "rate",    base: 42.1, unit: "%",       format: fmtPct },
    { key: "missing",    label: "Missing-answer rate",     type: "rate",    base: 8.4,  unit: "%",       format: fmtPct },
    { key: "freshness",  label: "Avg doc age",             type: "average", base: 12.4, unit: " days",   format: fmtFloat1 },
  ],
};

// =============================================================
// Series derivation (deterministic noise)
// =============================================================

function hashKey(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

// -0.5..0.5 deterministic noise per (key, index)
function noiseAt(key: string, i: number): number {
  const h = hashKey(key);
  const x = Math.sin(h * 0.0001 + i * 1.71 + h * 0.013) * 10000;
  return (x - Math.floor(x)) - 0.5;
}

// Decide point count + axis labels for a (range, granularity)
function bucketing(range: Range, granularity: Granularity): { count: number; labels: string[] } {
  const days = rangeDays[range];
  if (granularity === "hour") {
    const count = range === "24h" ? 24 : 24; // cap at 24 hourly points for chart legibility
    const labels = Array.from({ length: count }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
    return { count, labels };
  }
  if (granularity === "week") {
    const count = Math.max(1, Math.ceil(days / 7));
    const labels = Array.from({ length: count }, (_, i) => `W${i + 1}`);
    return { count, labels };
  }
  // day
  if (range === "7d") {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return { count: 7, labels };
  }
  const count = days; // 1 (24h), 30 (30d), 90 (90d)
  const labels = Array.from({ length: count }, (_, i) => `D${i + 1}`);
  return { count, labels };
}

export interface ChartPoint { label: string; value: number }

export function valueForRangeAgent(kpi: KpiDef, range: Range, agent: AgentId): string {
  const days = rangeDays[range];
  const mult = agentMultiplier[agent];
  const value = kpi.type === "total"
    ? kpi.base * days * mult
    : kpi.base * (kpi.type === "rate" ? 1 : 1); // averages don't scale by agent count
  return kpi.format(value);
}

export function seriesFor(kpi: KpiDef, range: Range, granularity: Granularity, agent: AgentId): ChartPoint[] {
  const { count, labels } = bucketing(range, granularity);
  const days = rangeDays[range];
  const mult = agentMultiplier[agent];
  const amp = kpi.noiseAmp ?? 0.18;

  // Per-bucket baseline:
  //  total: spread across buckets
  //  average/rate: same value at each bucket (with noise)
  const total = kpi.base * days * mult;
  const baseline = kpi.type === "total" ? total / count : kpi.base;

  return labels.map((label, i) => {
    const v = baseline * (1 + noiseAt(kpi.key + agent + range + granularity, i) * amp * 2);
    return { label, value: Math.max(0, v) };
  });
}

// =============================================================
// Secondary cards — Success Rate + CSAT (14 buckets)
// =============================================================

export interface SecondaryKpi {
  label: string;
  unit?: string;
  base: number;
  format: (n: number) => string;
  trailingUnit?: string;
  href?: string;
  deltaUnit?: string;
}

export const secondaryKpis: SecondaryKpi[] = [
  { label: "Overall Success Rate", base: 75.1, format: fmtPct,    unit: "%",  href: "/analytics", deltaUnit: "pts" },
  { label: "Average CSAT Rating",  base: 3.5,  format: fmtFloat1,             href: "/analytics", trailingUnit: "★" },
];

export function secondarySeries(label: string, agent: AgentId): ChartPoint[] {
  return Array.from({ length: 14 }, (_, i) => ({
    label: `D${i + 1}`,
    value: 1 + noiseAt(label + agent, i) * 0.04, // small variance around 1, scaled in card
  }));
}

// =============================================================
// Active calls — small randomized "live" number that pulses
// =============================================================

export const activeCallsRange: [number, number] = [2, 7];
