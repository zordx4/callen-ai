// Call volume chart — 24-hour bar chart of today's call distribution.

"use client";

import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { callVolumeByHour } from "@/lib/mock-data";

export function CallVolumeChart() {
  const totalToday = callVolumeByHour.reduce((s, h) => s + h.calls, 0);
  const peakHour = callVolumeByHour.reduce((max, h) => (h.calls > max.calls ? h : max));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-card border border-border/60 p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight mb-1">Call volume</h3>
          <p className="text-xs text-muted-foreground">Calls handled per hour today</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{totalToday}</p>
          <p className="text-xs text-muted-foreground">Total · Peak at {peakHour.hour}</p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={callVolumeByHour} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: "#999" }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#999" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "rgba(99,102,241,0.08)" }}
              contentStyle={{
                background: "white",
                border: "1px solid #E8E4DA",
                borderRadius: 8,
                fontSize: 12,
                padding: "6px 10px",
              }}
              labelStyle={{ color: "#666", fontSize: 11 }}
              formatter={(value: number) => [`${value} calls`, ""]}
            />
            <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
              {callVolumeByHour.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.hour === peakHour.hour ? "url(#gradPeak)" : "#0A0A0A"}
                  fillOpacity={d.hour === peakHour.hour ? 1 : 0.85}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="gradPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
