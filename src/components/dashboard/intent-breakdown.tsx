// Top intents — weightier bars with percentage chips + mini icons.

"use client";

import { motion } from "motion/react";
import {
  ShoppingBag,
  BookOpen,
  Truck,
  CalendarClock,
  MapPin,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { intentBreakdown, intentTotal } from "@/lib/mock-data";

const ICON_FOR_INTENT: Record<string, LucideIcon> = {
  "Place Order":      ShoppingBag,
  "Menu Inquiry":     BookOpen,
  "Delivery Status":  Truck,
  "Reservation":      CalendarClock,
  "Hours/Location":   MapPin,
  "Complaint":        AlertCircle,
};

export function IntentBreakdown() {
  const max = Math.max(...intentBreakdown.map((i) => i.count));
  const top = intentBreakdown[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl bg-white border border-neutral-200 p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
            Top intents
          </p>
          <h3 className="text-2xl font-bold tracking-tight leading-none">
            {top.intent}
          </h3>
          <p className="text-xs text-neutral-500 mt-1.5">
            <span className="font-mono font-semibold text-neutral-900">{intentTotal}</span> calls categorised · last 30 days
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {intentBreakdown.map((intent, i) => {
          const pct = (intent.count / max) * 100;
          const share = Math.round((intent.count / intentTotal) * 100);
          const Icon = ICON_FOR_INTENT[intent.intent];
          return (
            <motion.div
              key={intent.intent}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon className="size-3.5 text-neutral-500 shrink-0" />
                  )}
                  <span className="text-[13px] font-medium">{intent.intent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                    {share}%
                  </span>
                  <span className="text-xs text-neutral-500 tabular-nums w-8 text-right">
                    {intent.count}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #0a0a0a 0%, #404040 100%)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.7,
                    delay: 0.4 + i * 0.06,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
