// Language breakdown donut — pure monochrome.

"use client";

import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { languageBreakdown } from "@/lib/mock-data";

// Pure black + mid-gray for monochrome differentiation
const COLORS = ["#0a0a0a", "#a3a3a3"];

export function LanguagePie() {
  const total = languageBreakdown.reduce((s, l) => s + l.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-white border border-neutral-200 p-6 flex flex-col"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight mb-1">Language mix</h3>
        <p className="text-xs text-neutral-500">Calls handled today by language</p>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[180px]">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={languageBreakdown}
              dataKey="value"
              innerRadius={50}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              paddingAngle={2}
              stroke="none"
            >
              {languageBreakdown.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold tabular-nums">{total}%</p>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500">handled</p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {languageBreakdown.map((lang, i) => (
          <div key={lang.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm shrink-0" style={{ background: COLORS[i] }} />
              <span className="font-medium">{lang.name}</span>
            </div>
            <span className="tabular-nums text-neutral-500">{lang.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
