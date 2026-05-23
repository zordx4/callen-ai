// Horizontal bar chart of top intents from the last 30 days.

"use client";

import { motion } from "motion/react";
import { intentBreakdown } from "@/lib/mock-data";

export function IntentBreakdown() {
  const max = Math.max(...intentBreakdown.map((i) => i.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl bg-white border border-neutral-200 p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight mb-1">Top intents</h3>
          <p className="text-xs text-neutral-500">What customers called about · last 30 days</p>
        </div>
      </div>

      <div className="space-y-3">
        {intentBreakdown.map((intent, i) => {
          const pct = (intent.count / max) * 100;
          return (
            <motion.div
              key={intent.intent}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm font-medium">{intent.intent}</span>
                <span className="text-xs text-neutral-500 tabular-nums">{intent.count}</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-neutral-950 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
