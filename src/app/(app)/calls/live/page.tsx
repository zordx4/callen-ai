// Live Call Console (Day 3) — the demo hero of the dashboard.
// Three columns: active calls rail · transcript stream · intent/tool/sentiment rail.
// Everything runs off a single virtual clock that loops each call's scripted timeline.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Phone,
  Headphones,
  Mic,
  Sparkles,
  Wrench,
  Activity,
  ChevronRight,
  Radio,
  Clock,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Waveform } from "@/components/waveform";
import {
  liveCalls,
  type LiveCall,
  type LiveTurn,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// =============================================================
// Virtual clock — single ticker drives every panel.
// =============================================================

function useClockTick(intervalMs: number = 250) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

function elapsedFor(call: LiveCall, tick: number, intervalMs: number) {
  const realSeconds = (tick * intervalMs) / 1000;
  return (call.startedSecondsAgo + realSeconds) % call.loopLength;
}

function totalCallSeconds(call: LiveCall, tick: number, intervalMs: number) {
  // The "duration" badge in the rail keeps climbing across loops so it
  // feels like a long live call rather than a 45 sec reset.
  return call.startedSecondsAgo + Math.floor((tick * intervalMs) / 1000);
}

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Reveal a word-by-word slice of a turn based on elapsed time inside it.
function turnVisibleText(turn: LiveTurn, elapsed: number) {
  if (elapsed < turn.ts) return "";
  const into = Math.min(elapsed - turn.ts, turn.duration);
  const words = turn.text.split(" ");
  const ratio = turn.duration === 0 ? 1 : into / turn.duration;
  const visibleWords = Math.max(1, Math.ceil(words.length * Math.min(ratio + 0.05, 1)));
  return words.slice(0, visibleWords).join(" ");
}

function activeTurn(call: LiveCall, elapsed: number): LiveTurn | null {
  for (let i = call.turns.length - 1; i >= 0; i--) {
    const t = call.turns[i];
    if (elapsed >= t.ts && elapsed < t.ts + t.duration) return t;
  }
  return null;
}

// =============================================================
// Page
// =============================================================

const TICK_MS = 250;

export default function LiveCallsPage() {
  const tick = useClockTick(TICK_MS);
  const [selectedId, setSelectedId] = useState(liveCalls[0].id);
  const [listening, setListening] = useState(false);

  const selected = liveCalls.find((c) => c.id === selectedId) ?? liveCalls[0];
  const elapsed = elapsedFor(selected, tick, TICK_MS);
  const currentTurn = activeTurn(selected, elapsed);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-semibold tracking-widest uppercase mb-2">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Calls happening{" "}
            <span className="italic font-light">right now.</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Listen in, watch the agent reason, and step in when it matters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-neutral-200">
            <Radio className="size-3" />
            <span><span className="font-semibold text-neutral-900">{liveCalls.length}</span> active</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-neutral-200">
            <Clock className="size-3" />
            <span>Updated <span className="font-mono">{(tick / 4).toFixed(0)}s</span> in</span>
          </div>
        </div>
      </div>

      {/* 3 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px] gap-4">
        <ActiveCallsRail
          tick={tick}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <TranscriptColumn
          call={selected}
          elapsed={elapsed}
          currentTurn={currentTurn}
          listening={listening}
          onToggleListen={() => {
            setListening((v) => {
              const next = !v;
              toast(next ? "Now listening in" : "Stopped listening", {
                description: next
                  ? "The caller cannot hear you. Press again to drop."
                  : "Audio tap closed.",
              });
              return next;
            });
          }}
        />

        <RightRail call={selected} elapsed={elapsed} />
      </div>
    </div>
  );
}

// =============================================================
// Active calls rail (left)
// =============================================================

function ActiveCallsRail({
  tick,
  selectedId,
  onSelect,
}: {
  tick: number;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="space-y-3">
      <div className="px-1 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          Active calls
        </p>
        <span className="text-[10px] text-neutral-400 font-mono">
          {liveCalls.length} live
        </span>
      </div>

      <div className="space-y-2">
        {liveCalls.map((call) => {
          const isSelected = call.id === selectedId;
          const elapsed = elapsedFor(call, tick, TICK_MS);
          const turn = activeTurn(call, elapsed);
          const totalSec = totalCallSeconds(call, tick, TICK_MS);
          return (
            <button
              key={call.id}
              onClick={() => onSelect(call.id)}
              className={cn(
                "w-full text-left rounded-2xl border p-3.5 transition-all duration-200",
                isSelected
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-lg shadow-neutral-900/10"
                  : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex size-2">
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full animate-ping",
                      isSelected ? "bg-emerald-400/70" : "bg-emerald-500/60"
                    )}
                  />
                  <span
                    className={cn(
                      "relative rounded-full size-2",
                      isSelected ? "bg-emerald-400" : "bg-emerald-500"
                    )}
                  />
                </span>
                <span className={cn("text-[10px] uppercase tracking-widest font-semibold", isSelected ? "text-emerald-300" : "text-emerald-700")}>
                  Live
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono">
                  <span className={cn(isSelected ? "text-white/60" : "text-neutral-500")}>
                    {fmt(totalSec)}
                  </span>
                </span>
              </div>
              <p className="text-sm font-semibold tracking-tight tabular-nums">
                {call.callerNumber}
              </p>
              <p className={cn("text-[11px] mt-0.5", isSelected ? "text-white/60" : "text-neutral-500")}>
                {call.callerCity}
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold",
                    isSelected
                      ? "bg-white/10 text-white/80"
                      : "bg-neutral-100 text-neutral-700"
                  )}
                >
                  {call.language === "ur" ? "Urdu" : "English"}
                </span>
                {turn && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px]",
                      isSelected ? "text-white/70" : "text-neutral-500"
                    )}
                  >
                    <span className={cn("size-1 rounded-full", turn.speaker === "agent" ? "bg-neutral-400" : "bg-emerald-500")} />
                    {turn.speaker === "agent" ? "Agent speaking" : "Caller speaking"}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Static footer card for queue context */}
      <div className="rounded-2xl border border-dashed border-neutral-200 p-3.5 text-center">
        <p className="text-[11px] text-neutral-500">
          Queue: <span className="font-semibold text-neutral-900">0 waiting</span>
        </p>
        <p className="text-[10px] text-neutral-400 mt-0.5">Average pickup &lt; 800ms</p>
      </div>
    </aside>
  );
}

// =============================================================
// Transcript column (center)
// =============================================================

function TranscriptColumn({
  call,
  elapsed,
  currentTurn,
  listening,
  onToggleListen,
}: {
  call: LiveCall;
  elapsed: number;
  currentTurn: LiveTurn | null;
  listening: boolean;
  onToggleListen: () => void;
}) {
  // Build the list of visible bubbles, with the active one partially typed.
  const visibleTurns = useMemo(() => {
    const out: { turn: LiveTurn; index: number; isActive: boolean; text: string }[] = [];
    call.turns.forEach((turn, i) => {
      if (elapsed >= turn.ts) {
        const isActive = elapsed < turn.ts + turn.duration;
        const text = isActive ? turnVisibleText(turn, elapsed) : turn.text;
        out.push({ turn, index: i, isActive, text });
      }
    });
    return out;
  }, [call, elapsed]);

  // Auto-scroll the transcript area to the bottom whenever a new bubble lands.
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [visibleTurns.length, call.id]);

  // Track which loop iteration we're in so AnimatePresence can reset cleanly.
  const loopKey = `${call.id}-${Math.floor(elapsed * 1000) < 600 ? Math.random() : ""}`;

  const intensity: 0 | 1 | 2 = currentTurn ? 2 : 1;

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white overflow-hidden flex flex-col min-h-[640px]">
      {/* Call header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
        <div className="size-10 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
          <Phone className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-tight tabular-nums">
            {call.callerNumber}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · <span className="font-mono ml-0.5">{fmt(call.startedSecondsAgo + elapsed)}</span>
            </span>
            <span className="text-[11px] text-neutral-300">·</span>
            <span className="text-[11px] text-neutral-500">{call.callerCity}</span>
          </div>
        </div>

        <Waveform
          bars={18}
          maxHeight={26}
          barWidth={2}
          intensity={intensity}
          className="hidden sm:flex shrink-0"
        />

        <button
          onClick={onToggleListen}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
            listening
              ? "bg-neutral-950 text-white border-neutral-950"
              : "bg-white text-neutral-900 border-neutral-300 hover:border-neutral-400"
          )}
        >
          <Headphones className="size-3.5" />
          {listening ? "Listening" : "Listen in"}
        </button>
      </div>

      {/* Live banner with current speaker */}
      <div className="px-5 py-2 bg-neutral-50/60 border-b border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <Activity className="size-3" />
          <span>
            {currentTurn ? (
              <>
                <span className="font-semibold text-neutral-900">
                  {currentTurn.speaker === "agent" ? "Agent" : "Caller"}
                </span>{" "}
                speaking · {currentTurn.lang.toUpperCase()}
              </>
            ) : (
              <span className="text-neutral-500">Silence · waiting for next turn</span>
            )}
          </span>
        </span>
        {listening && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-emerald-700">
            <Shield className="size-3" />
            Tapped silently
          </span>
        )}
      </div>

      {/* Transcript scroll area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-5 space-y-3 max-h-[460px]"
      >
        <AnimatePresence initial={false}>
          {visibleTurns.map(({ turn, index, isActive, text }) => (
            <motion.div
              key={`${call.id}-${index}-${Math.floor(elapsed / call.loopLength)}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 0.9] }}
              className={turn.speaker === "agent" ? "flex justify-start" : "flex justify-end"}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5",
                  turn.speaker === "agent"
                    ? "bg-neutral-100 text-neutral-900 rounded-bl-md"
                    : "bg-neutral-950 text-white rounded-br-md"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={cn(
                      "text-[9px] uppercase tracking-widest font-semibold",
                      turn.speaker === "agent" ? "text-neutral-500" : "text-white/60"
                    )}
                  >
                    {turn.speaker} · {turn.lang.toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-mono",
                      turn.speaker === "agent" ? "text-neutral-400" : "text-white/40"
                    )}
                  >
                    {fmt(turn.ts)}
                  </span>
                </div>
                <p className="text-[13px] leading-snug">
                  {text}
                  {isActive && (
                    <span
                      className={cn(
                        "inline-block align-middle ml-1 w-[2px] h-3.5",
                        turn.speaker === "agent" ? "bg-neutral-700" : "bg-white"
                      )}
                      style={{ animation: "callen-blink 0.9s steps(2, end) infinite" }}
                    />
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer status */}
      <div className="px-5 py-3 border-t border-neutral-100 bg-white flex items-center gap-4 text-[11px] text-neutral-600">
        <div className="flex items-center gap-1.5">
          <Mic className="size-3" />
          STT: <span className="font-semibold text-neutral-900 ml-0.5">Whisper large-v3</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Sparkles className="size-3" />
          LLM: <span className="font-semibold text-neutral-900 ml-0.5">Gemini 2.5 Flash</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <Activity className="size-3" />
          TTS: <span className="font-semibold text-neutral-900 ml-0.5">Eleven v3</span>
        </div>
        <div className="ml-auto font-mono text-neutral-500 tabular-nums">
          {Math.floor(620 + Math.sin(elapsed * 0.6) * 90)}ms median
        </div>
      </div>

      {/* Local keyframes for the typing caret */}
      <style jsx>{`
        @keyframes callen-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Hidden loop reset key so React knows when to redraw — keeps lint quiet */}
      <span className="hidden">{loopKey}</span>
    </section>
  );
}

// =============================================================
// Right rail (intents, tools, sentiment)
// =============================================================

function RightRail({ call, elapsed }: { call: LiveCall; elapsed: number }) {
  return (
    <aside className="flex flex-col gap-4">
      <IntentTimeline call={call} elapsed={elapsed} />
      <ToolExecutionLog call={call} elapsed={elapsed} />
      <SentimentPanel call={call} elapsed={elapsed} />
    </aside>
  );
}

function IntentTimeline({ call, elapsed }: { call: LiveCall; elapsed: number }) {
  const revealed = call.intents.filter((i) => elapsed >= i.ts);
  const next = call.intents.find((i) => elapsed < i.ts);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <header className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
            Intents
          </p>
          <h3 className="text-base font-semibold tracking-tight">What the caller wants</h3>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono">
          {revealed.length}/{call.intents.length}
        </span>
      </header>

      <ol className="space-y-2">
        <AnimatePresence initial={false}>
          {revealed.map((intent, i) => (
            <motion.li
              key={`${call.id}-intent-${i}-${Math.floor(elapsed / call.loopLength)}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 px-3 py-2"
            >
              <span className="size-1.5 rounded-full bg-neutral-900 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold tracking-tight text-neutral-900 truncate">
                  {intent.intent}
                </p>
                <p className="text-[10px] text-neutral-500 font-mono">
                  at {fmt(intent.ts)}
                </p>
              </div>
              <ConfidenceBadge value={intent.confidence} />
            </motion.li>
          ))}
        </AnimatePresence>
        {next && (
          <li className="flex items-center gap-2.5 rounded-xl border border-dashed border-neutral-200 px-3 py-2 opacity-60">
            <span className="size-1.5 rounded-full bg-neutral-300 shrink-0" />
            <p className="text-[12px] text-neutral-400 italic">classifying...</p>
          </li>
        )}
      </ol>
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-neutral-600">
      <span className="relative w-10 h-1 rounded-full bg-neutral-200 overflow-hidden">
        <span
          className="absolute inset-y-0 left-0 bg-neutral-900 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </span>
      {pct}%
    </span>
  );
}

function ToolExecutionLog({ call, elapsed }: { call: LiveCall; elapsed: number }) {
  const revealed = call.toolCalls.filter((t) => elapsed >= t.ts);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <header className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
            Tool log
          </p>
          <h3 className="text-base font-semibold tracking-tight">MCP function calls</h3>
        </div>
        <Wrench className="size-3.5 text-neutral-400" />
      </header>

      {revealed.length === 0 ? (
        <p className="text-[12px] text-neutral-400 italic">No tool calls yet.</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {revealed.map((tc, i) => (
              <motion.li
                key={`${call.id}-tool-${i}-${Math.floor(elapsed / call.loopLength)}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-neutral-200 bg-neutral-950 text-white overflow-hidden"
              >
                <div className="px-3 py-2 flex items-center gap-2 border-b border-white/10">
                  <ChevronRight className="size-3 text-white/60" />
                  <span className="text-[12px] font-mono font-semibold">{tc.name}</span>
                  <span className="ml-auto inline-flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        tc.status === "success"
                          ? "bg-emerald-400"
                          : tc.status === "error"
                          ? "bg-rose-400"
                          : "bg-amber-400 animate-pulse"
                      )}
                    />
                    <span className="text-[10px] font-mono text-white/60">
                      {tc.durationMs}ms
                    </span>
                  </span>
                </div>
                <div className="px-3 py-2 space-y-1 bg-neutral-900/60">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                    args
                  </p>
                  <pre className="text-[10.5px] font-mono text-white/80 whitespace-pre-wrap break-all leading-snug">
                    {JSON.stringify(tc.args, null, 0).replace(/,/g, ", ")}
                  </pre>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold pt-1">
                    result
                  </p>
                  <pre className="text-[10.5px] font-mono text-emerald-300/90 whitespace-pre-wrap break-all leading-snug">
                    {tc.result}
                  </pre>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function SentimentPanel({ call, elapsed }: { call: LiveCall; elapsed: number }) {
  // Build a smooth series: include every seed point whose ts <= elapsed,
  // plus a current synthetic point at `elapsed` interpolated between seeds.
  const data = useMemo(() => {
    const series = call.sentiment.filter((p) => p.ts <= elapsed);
    if (series.length === 0) {
      series.push({ ts: 0, score: call.sentiment[0]?.score ?? 0 });
    }
    // Add a "now" point linearly interpolated between bounding seeds.
    const last = series[series.length - 1];
    const nextSeed = call.sentiment.find((p) => p.ts > elapsed);
    if (nextSeed && elapsed > last.ts) {
      const ratio = (elapsed - last.ts) / (nextSeed.ts - last.ts);
      series.push({
        ts: elapsed,
        score: last.score + (nextSeed.score - last.score) * ratio,
      });
    } else if (elapsed > last.ts) {
      series.push({ ts: elapsed, score: last.score });
    }
    return series;
  }, [call, elapsed]);

  const current = data[data.length - 1]?.score ?? 0;
  const tone =
    current > 0.4 ? "positive" : current < -0.2 ? "negative" : "neutral";

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <header className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
            Sentiment
          </p>
          <h3 className="text-base font-semibold tracking-tight">Caller mood over time</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums leading-none">
            {current >= 0 ? "+" : ""}
            {current.toFixed(2)}
          </p>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500 mt-1">
            {tone}
          </p>
        </div>
      </header>

      <div className="h-24 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
            <YAxis domain={[-1, 1]} hide />
            <ReferenceLine y={0} stroke="#e5e5e5" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#0a0a0a"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-1">
        <span>0:00</span>
        <span>now</span>
      </div>
    </div>
  );
}
