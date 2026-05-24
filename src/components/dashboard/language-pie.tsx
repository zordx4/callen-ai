// Language breakdown donut with a bolder visual + animated legend.

"use client";

import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { languageBreakdown } from "@/lib/mock-data";

const COLORS = ["#0a0a0a", "#a3a3a3"];

export function LanguagePie() {
  const total = languageBreakdown.reduce((s, l) => s + l.value, 0);
  const dominant = languageBreakdown.reduce((m, l) => (l.value > m.value ? l : m));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-white border border-neutral-200 p-6 flex flex-col"
    >
      <div className="mb-2">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
          Language mix
        </p>
        <h3 className="text-2xl font-bold tracking-tight leading-none">
          {dominant.value}
          <span className="text-sm font-medium text-neutral-500 ml-1.5">% {dominant.name}</span>
        </h3>
        <p className="text-xs text-neutral-500 mt-1.5">
          Calls handled today by language
        </p>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[170px]">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={languageBreakdown}
              dataKey="value"
              innerRadius={54}
              outerRadius={82}
              startAngle={90}
              endAngle={450}
              paddingAngle={3}
              stroke="none"
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
            >
              {languageBreakdown.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.p
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-3xl font-bold tabular-nums tracking-tight leading-none"
          >
            {total}%
          </motion.p>
          <p className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1.5 font-semibold">
            handled
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {languageBreakdown.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-sm shrink-0"
                style={{ background: COLORS[i] }}
              />
              <span className="font-medium">{lang.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: COLORS[i] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.value}%` }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.08, ease: "easeOut" }}
                />
              </div>
              <span className="tabular-nums text-neutral-700 font-semibold text-xs w-8 text-right">
                {lang.value}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
