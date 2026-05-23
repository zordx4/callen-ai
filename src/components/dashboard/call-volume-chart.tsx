// Call volume chart — monochrome black bars on white.

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
      className="rounded-2xl bg-white border border-neutral-200 p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight mb-1">Call volume</h3>
          <p className="text-xs text-neutral-500">Calls handled per hour today</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{totalToday}</p>
          <p className="text-xs text-neutral-500">Total · Peak at {peakHour.hour}</p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={callVolumeByHour} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: "#a3a3a3" }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#a3a3a3" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                background: "#0a0a0a",
                border: "none",
                borderRadius: 8,
                fontSize: 11,
                padding: "6px 10px",
                color: "white",
              }}
              labelStyle={{ color: "#a3a3a3", fontSize: 10 }}
              itemStyle={{ color: "white" }}
              formatter={(value: number) => [`${value} calls`, ""]}
            />
            <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
              {callVolumeByHour.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.hour === peakHour.hour ? "#0a0a0a" : "#0a0a0a"}
                  fillOpacity={d.hour === peakHour.hour ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
