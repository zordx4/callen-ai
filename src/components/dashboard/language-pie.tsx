// Donut chart of language breakdown — Urdu vs English calls.

"use client";

import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { languageBreakdown } from "@/lib/mock-data";

// Use solid colors (gradients-via-url can fail to render in Recharts donuts)
const COLORS = ["#6366F1", "#EC4899"];
const SOLID = ["#6366F1", "#EC4899"];

export function LanguagePie() {
  const total = languageBreakdown.reduce((s, l) => s + l.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-card border border-border/60 p-6 flex flex-col"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight mb-1">Language mix</h3>
        <p className="text-xs text-muted-foreground">Calls handled today by language</p>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[180px]">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <defs>
              <linearGradient id="gradIndigo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
              <linearGradient id="gradPink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
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
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">handled</p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {languageBreakdown.map((lang, i) => (
          <div key={lang.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm shrink-0" style={{ background: SOLID[i] }} />
              <span className="font-medium">{lang.name}</span>
            </div>
            <span className="tabular-nums text-muted-foreground">{lang.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
