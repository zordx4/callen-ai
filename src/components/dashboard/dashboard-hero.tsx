// Dashboard hero — the focal point at the top of /dashboard.
// Big number with count-up, full-width area sparkline, live latency
// ticker, and a row of secondary stats. Monochrome throughout.

"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { ArrowUp, Sparkles, Activity, Radio } from "lucide-react";
import { CountUp } from "@/components/count-up";
import {
  callVolumeByHour,
  dashboardKpis,
  liveLatencySeries,
} from "@/lib/mock-data";

function fmtMs(n: number) {
  return `${n}ms`;
}

// Ticks through the latency series so the number feels live.
function useLiveLatency() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % liveLatencySeries.length), 1400);
    return () => clearInterval(id);
  }, []);
  return liveLatencySeries[idx];
}

export function DashboardHero() {
  const latency = useLiveLatency();
  const totalToday = dashboardKpis.callsToday;
  const peakHour = callVolumeByHour.reduce((m, h) => (h.calls > m.calls ? h : m));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
      className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white mb-4"
    >
      {/* Subtle dotted backdrop */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />
      {/* Diagonal light streak */}
      <div
        className="absolute -top-32 -right-20 size-[420px] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-0">
        {/* LEFT: Headline stat */}
        <div className="p-6 lg:p-7 flex flex-col">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-semibold tracking-widest uppercase w-fit mb-4">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live · today
          </div>

          <p className="text-[11px] uppercase tracking-widest text-white/50 font-semibold mb-2">
            Calls handled
          </p>

          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-none tabular-nums">
              <CountUp to={totalToday} duration={1.4} />
            </span>
            <span
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold"
            >
              <ArrowUp className="size-3" />
              {dashboardKpis.callsTodayDelta}%
            </span>
          </div>
          <p className="text-[12.5px] text-white/60">
            vs <span className="font-mono">{Math.round(totalToday / (1 + dashboardKpis.callsTodayDelta / 100))}</span> calls
            yesterday · peak at <span className="font-mono">{peakHour.hour}</span>
          </p>

          {/* Secondary stat row */}
          <div className="mt-auto pt-6 grid grid-cols-3 gap-2">
            <SecondaryStat
              label="Latency"
              icon={Activity}
              value={fmtMs(latency)}
              hint="median · last 60s"
              ticking
            />
            <SecondaryStat
              label="Resolution"
              icon={Sparkles}
              value={`${Math.round(dashboardKpis.resolutionRate * 100)}%`}
              hint="self-served"
            />
            <SecondaryStat
              label="Live now"
              icon={Radio}
              value={dashboardKpis.activeCallsNow.toString()}
              hint="active calls"
              pulse
            />
          </div>
        </div>

        {/* RIGHT: Big sparkline */}
        <div className="relative min-h-[260px] lg:min-h-[280px]">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-white/40 z-10">
            <span>Volume · last 24h</span>
            <span className="font-mono normal-case text-white/50">
              peak {peakHour.calls} calls @ {peakHour.hour}
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={callVolumeByHour}
              margin={{ top: 38, right: 12, left: 12, bottom: 14 }}
            >
              <defs>
                <linearGradient id="heroAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }}
                axisLine={false}
                tickLine={false}
                interval={3}
                height={20}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.3)", strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "rgba(255,255,255,0.96)",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 11,
                  padding: "6px 10px",
                  color: "#0a0a0a",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "#737373", fontSize: 10 }}
                formatter={(value) => [`${value} calls`, ""] as [string, string]}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#ffffff"
                strokeWidth={1.6}
                fill="url(#heroAreaFill)"
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
                activeDot={{ r: 4, fill: "#ffffff", stroke: "#0a0a0a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}

// =============================================================
// Secondary stat (inside the hero footer)
// =============================================================

function SecondaryStat({
  label,
  icon: Icon,
  value,
  hint,
  ticking,
  pulse,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  hint: string;
  ticking?: boolean;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5 backdrop-blur-sm relative overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="size-3 text-white/50" />
        <span className="text-[9px] uppercase tracking-widest font-semibold text-white/50">
          {label}
        </span>
        {pulse && (
          <span className="ml-auto relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative rounded-full size-1.5 bg-emerald-400" />
          </span>
        )}
      </div>
      <p
        className={`text-base font-semibold tracking-tight tabular-nums leading-none ${
          ticking ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-white/40 mt-1 truncate">{hint}</p>
    </div>
  );
}
