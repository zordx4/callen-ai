// Call volume chart — gradient area, smooth curve, peak marker.

"use client";

import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { callVolumeByHour } from "@/lib/mock-data";

export function CallVolumeChart() {
  const totalToday = callVolumeByHour.reduce((s, h) => s + h.calls, 0);
  const peakHour = callVolumeByHour.reduce((max, h) =>
    h.calls > max.calls ? h : max
  );
  const avgPerHour = Math.round(totalToday / 24);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-white border border-neutral-200 p-6 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
            Call volume
          </p>
          <h3 className="text-2xl font-bold tracking-tight tabular-nums leading-none">
            {totalToday}
            <span className="text-sm font-medium text-neutral-500 ml-1.5">today</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1.5">
            Peak at <span className="font-mono font-semibold text-neutral-900">{peakHour.hour}</span>{" "}
            · avg <span className="font-mono">{avgPerHour}</span>/h
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700">
            <span className="size-1 rounded-full bg-neutral-900" />
            Updated 12s ago
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={callVolumeByHour}
            margin={{ top: 8, right: 4, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="volumeAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0a0a" stopOpacity={0.28} />
                <stop offset="55%" stopColor="#0a0a0a" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#0a0a0a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#f5f5f5"
              strokeDasharray="3 3"
            />
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
              cursor={{ stroke: "#0a0a0a", strokeWidth: 1, strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#0a0a0a",
                border: "none",
                borderRadius: 8,
                fontSize: 11,
                padding: "6px 10px",
                color: "white",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              }}
              labelStyle={{ color: "#a3a3a3", fontSize: 10 }}
              itemStyle={{ color: "white" }}
              formatter={(value) => [`${value} calls`, ""] as [string, string]}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#0a0a0a"
              strokeWidth={1.8}
              fill="url(#volumeAreaFill)"
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
              activeDot={{
                r: 5,
                fill: "#0a0a0a",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
