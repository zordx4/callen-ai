// Agent Studio editor mockup. All 7 tabs are clickable and show
// distinct, hand-designed content. Pure black/white grayscale.

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Flag, GitBranch, MessageCircle, Globe, BookOpen,
  Copy, Play, Pause, FileText, Wrench, BarChart3, Code, Settings as SettingsIcon,
  Plus, CheckCircle2, MoreHorizontal, Sliders, Mic,
} from "lucide-react";

type Tab = "Agent" | "Workflow" | "Knowledge" | "Tools" | "Evaluation" | "Widget" | "Settings";

const TABS: Tab[] = ["Agent", "Workflow", "Knowledge", "Tools", "Evaluation", "Widget", "Settings"];

export function AgentStudioMockup() {
  const [active, setActive] = useState<Tab>("Workflow");

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 border border-neutral-200/80 shadow-2xl shadow-neutral-900/10 aspect-[4/3] min-h-[480px]">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Window header */}
      <div className="relative px-5 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="size-4 text-neutral-500" />
          <span className="text-base font-semibold tracking-tight">Restaurant Reception Agent</span>
        </div>

        {/* Tabs (clickable) */}
        <div className="flex items-center gap-0.5 -mb-px text-[13px] overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={
                active === t
                  ? "px-3 py-2 border-b-2 border-neutral-900 text-neutral-900 font-medium whitespace-nowrap"
                  : "px-3 py-2 text-neutral-500 hover:text-neutral-800 whitespace-nowrap transition-colors"
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="relative px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            {active === "Agent" && <AgentTab />}
            {active === "Workflow" && <WorkflowTab />}
            {active === "Knowledge" && <KnowledgeTab />}
            {active === "Tools" && <ToolsTab />}
            {active === "Evaluation" && <EvaluationTab />}
            {active === "Widget" && <WidgetTab />}
            {active === "Settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============== AGENT TAB ============== */
function AgentTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white border border-neutral-200 p-3.5">
        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">System prompt</label>
        <p className="mt-1.5 text-[12px] text-neutral-800 leading-relaxed">
          You are the order taker for Johnny &amp; Jugnu, a popular Pakistani burger chain. Match the caller&apos;s tone. Default to casual Urdu, switch to English when they do. Take orders, suggest a drink, capture address, confirm.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white border border-neutral-200 p-3.5">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Primary voice</label>
          <div className="flex items-center gap-2 mt-2">
            <button className="size-6 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Play className="size-3" />
            </button>
            <span className="text-[12px] font-semibold">Amna · Urdu</span>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-neutral-200 p-3.5">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Languages</label>
          <div className="flex gap-1.5 mt-2">
            {["UR", "EN", "+1"].map((l, i) => (
              <span
                key={l}
                className={
                  i < 2
                    ? "px-2 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-semibold"
                    : "px-2 py-0.5 rounded-md bg-neutral-100 border border-dashed border-neutral-300 text-neutral-500 text-[10px] font-medium"
                }
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== WORKFLOW TAB (original tree) ============== */
function WorkflowTab() {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-4 py-3 w-[260px]"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Flag className="size-3.5 text-neutral-500" />
          <span className="text-xs font-semibold text-neutral-900">Start</span>
        </div>
        <p className="text-[11px] text-neutral-600 leading-snug">
          Hello, Johnny &amp; Jugnu. Aaj kya order karna hai?
        </p>
      </motion.div>

      <svg className="my-2" width="2" height="32" viewBox="0 0 2 32" fill="none">
        <line x1="1" y1="0" x2="1" y2="32" stroke="#737373" strokeWidth="1.2" strokeDasharray="3 2" />
      </svg>

      <div className="text-[11px] text-neutral-500 mb-3 italic">caller intent · place_order</div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[420px]">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-3.5 py-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <GitBranch className="size-3.5 text-neutral-700" />
            <span className="text-[11px] font-semibold text-neutral-900">Take order</span>
          </div>
          <p className="text-[10px] text-neutral-600 leading-snug">
            Collect items, address, payment. Confirm total.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-3.5 py-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <MessageCircle className="size-3.5 text-neutral-700" />
            <span className="text-[11px] font-semibold text-neutral-900">Answer FAQ</span>
          </div>
          <p className="text-[10px] text-neutral-600 leading-snug">
            Hours, location, menu, policies. Grounded in KB.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 rounded-xl bg-white/80 backdrop-blur border border-neutral-200/80 px-3 py-1.5 flex items-center gap-1.5"
      >
        <Globe className="size-3 text-neutral-500" />
        <span className="text-[10px] font-medium text-neutral-700">Global</span>
        <span className="text-neutral-400">·</span>
        <BookOpen className="size-3 text-neutral-500" />
        <span className="text-[10px] font-medium text-neutral-700">Knowledge Base</span>
      </motion.div>
    </div>
  );
}

/* ============== KNOWLEDGE TAB ============== */
function KnowledgeTab() {
  const docs = [
    { icon: FileText, name: "Menu_2026.pdf", chunks: 47, status: "Indexed" },
    { icon: FileText, name: "Delivery_Policies.pdf", chunks: 12, status: "Indexed" },
    { icon: FileText, name: "FAQ.txt", chunks: 23, status: "Indexed" },
    { icon: FileText, name: "Promotions_June.pdf", chunks: 8, status: "Pending" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-neutral-500 font-medium">4 sources · 90 chunks · last sync 12m ago</span>
        <button className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900 text-white font-medium">
          <Plus className="size-3" /> Upload
        </button>
      </div>
      {docs.map((d, i) => (
        <motion.div
          key={d.name}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl bg-white border border-neutral-200 px-3 py-2.5 flex items-center gap-2.5"
        >
          <div className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <d.icon className="size-3.5 text-neutral-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate">{d.name}</p>
            <p className="text-[10px] text-neutral-500">{d.chunks} chunks</p>
          </div>
          <span
            className={
              d.status === "Indexed"
                ? "text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-white font-medium"
                : "text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-medium"
            }
          >
            {d.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ============== TOOLS TAB ============== */
function ToolsTab() {
  const tools = [
    { name: "createOrder", desc: "Place a new food order", calls: "142", icon: Wrench },
    { name: "checkOrderStatus", desc: "Lookup existing order", calls: "87", icon: Wrench },
    { name: "transferToHuman", desc: "Escalate to live agent", calls: "14", icon: Wrench },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-neutral-500 font-medium">3 tools registered · MCP enabled</span>
        <button className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900 text-white font-medium">
          <Plus className="size-3" /> Add tool
        </button>
      </div>
      {tools.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl bg-white border border-neutral-200 px-3 py-2.5 flex items-center gap-2.5"
        >
          <div className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <Code className="size-3.5 text-neutral-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold font-mono">{t.name}</p>
            <p className="text-[10px] text-neutral-500">{t.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-bold tabular-nums">{t.calls}</p>
            <p className="text-[9px] text-neutral-500">30d</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============== EVALUATION TAB ============== */
function EvaluationTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white border border-neutral-200 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">A/B test · running</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-white font-medium">LIVE</span>
        </div>
        <p className="text-[12px] text-neutral-700 mb-3">Prompt v3 vs v4 (warmer Urdu greeting)</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider">v3 · control</p>
            <p className="text-xl font-bold tabular-nums mt-0.5">78%</p>
            <p className="text-[9px] text-neutral-500">resolution rate</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider">v4 · variant</p>
            <p className="text-xl font-bold tabular-nums mt-0.5">86%</p>
            <p className="text-[9px] text-neutral-700">+8 pts</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-neutral-200 p-3.5">
        <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">Recent runs</p>
        {[
          { name: "Order flow", score: "94%", verdict: "pass" },
          { name: "FAQ accuracy", score: "91%", verdict: "pass" },
          { name: "Edge case: cancellation", score: "67%", verdict: "review" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-t border-neutral-100 first:border-t-0">
            <span className="text-[11px] text-neutral-700">{r.name}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold tabular-nums">{r.score}</span>
              {r.verdict === "pass" ? (
                <CheckCircle2 className="size-3 text-neutral-900" />
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-medium">review</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============== WIDGET TAB ============== */
function WidgetTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-neutral-950 text-white p-3.5 font-mono text-[10px] leading-relaxed">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-[9px] uppercase tracking-widest">Embed code</span>
          <button className="size-5 rounded bg-white/10 flex items-center justify-center">
            <Copy className="size-3" />
          </button>
        </div>
        <pre className="text-white/90">
          {`<script
  src="https://cdn.callen.ai/widget.js"
  data-agent="restaurant-recpt"
  defer
></script>
<callen-widget
  position="bottom-right"
  theme="light"
/>`}
        </pre>
      </div>

      <div className="rounded-xl bg-white border border-neutral-200 p-3.5">
        <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">Preview</p>
        <div className="aspect-[3/2] rounded-lg bg-neutral-50 border border-neutral-200 relative flex items-end justify-end p-2">
          <div className="size-8 rounded-full bg-neutral-900" />
          <div className="absolute bottom-12 right-2 text-[9px] px-2 py-1 rounded-md bg-neutral-900 text-white">
            Hi! Ask me anything
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== SETTINGS TAB ============== */
function SettingsTab() {
  return (
    <div className="space-y-2">
      {[
        { label: "Business hours", value: "Mon–Sun · 9 AM to 11 PM (PKT)", icon: SettingsIcon },
        { label: "Call recording", value: "On · with caller consent", icon: Mic },
        { label: "Escalation rule", value: "If sentiment < -0.5 → +92 311 8000000", icon: Sliders },
        { label: "Data retention", value: "Transcripts kept 365 days", icon: SettingsIcon },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl bg-white border border-neutral-200 px-3 py-2.5 flex items-center gap-2.5"
        >
          <div className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <s.icon className="size-3.5 text-neutral-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">{s.label}</p>
            <p className="text-[12px] text-neutral-900 font-medium">{s.value}</p>
          </div>
          <MoreHorizontal className="size-4 text-neutral-400" />
        </motion.div>
      ))}
    </div>
  );
}
