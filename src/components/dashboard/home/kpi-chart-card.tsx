// KpiChartCard — 6 clickable KPI tabs + linked area chart.
// Reacts to (tab, range, granularity, agent) filters from the parent.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import {
  tabKpis,
  valueForRangeAgent,
  seriesFor,
  type Range,
  type Granularity,
  type AgentId,
  type TabKey,
} from "@/lib/dashboard-home-data";

interface KpiChartCardProps {
  tab: Exclude<TabKey, "Advanced">;
  range: Range;
  granularity: Granularity;
  agent: AgentId;
}

export function KpiChartCard({ tab, range, granularity, agent }: KpiChartCardProps) {
  const kpis = tabKpis[tab];
  const [activeKey, setActiveKey] = useState(kpis[0].key);

  // When the tab changes, reset the active KPI to that tab's first
  useEffect(() => {
    setActiveKey(kpis[0].key);
  }, [tab, kpis]);

  const active = kpis.find((k) => k.key === activeKey) ?? kpis[0];
  const data = seriesFor(active, range, granularity, agent);
  const tickFormatter = active.format;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden">
      {/* KPI tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-neutral-100">
        {kpis.map((kpi, idx) => {
          const isActive = activeKey === kpi.key;
          const display = valueForRangeAgent(kpi, range, agent);
          return (
            <button
              key={kpi.key}
              onClick={() => setActiveKey(kpi.key)}
              className={cn(
                "text-left px-5 py-4 transition-colors relative group cursor-pointer",
                idx > 0 && "lg:border-l border-neutral-100",
                isActive ? "bg-neutral-50" : "bg-white hover:bg-neutral-50/60"
              )}
            >
              <div className="text-[11px] text-neutral-500 uppercase tracking-[0.08em] font-medium mb-1.5 truncate">
                {kpi.label}
              </div>
              <div className="flex items-baseline gap-1.5">
                <motion.span
                  key={display}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "text-2xl lg:text-[26px] font-bold tracking-tight tabular-nums",
                    isActive ? "text-neutral-950" : "text-neutral-700"
                  )}
                >
                  {display}
                </motion.span>
                {kpi.unit && <span className="text-[13px] text-neutral-500">{kpi.unit}</span>}
              </div>
              {isActive && (
                <motion.div
                  layoutId="kpi-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="px-3 lg:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tab}-${activeKey}-${range}-${granularity}-${agent}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            <ResponsiveContainer width="100%" height={320} minWidth={1}>
              <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="kpi-area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#171717" stopOpacity={0.14} />
                    <stop offset="100%" stopColor="#171717" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#737373" }}
                  dy={6}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#737373" }}
                  tickFormatter={tickFormatter}
                  width={64}
                />
                <Tooltip
                  cursor={{ stroke: "#a3a3a3", strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                    fontSize: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  formatter={(v) => [tickFormatter(Number(v)), active.label]}
                  labelStyle={{ color: "#737373", fontSize: 11, marginBottom: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#171717"
                  strokeWidth={2}
                  fill="url(#kpi-area-gradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#171717", stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
