// KPI card — monochrome design matching landing aesthetic.

"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  delta?: number;
  unit?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  index?: number;
};

export function KpiCard({ label, value, delta, unit, icon: Icon, accent, index = 0 }: KpiCardProps) {
  const positive = delta !== undefined && delta > 0;
  const negative = delta !== undefined && delta < 0;
  const neutral = delta === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
      className={cn(
        "rounded-2xl p-5 border transition-colors",
        accent
          ? "bg-neutral-950 text-white border-neutral-950"
          : "bg-white border-neutral-200 hover:border-neutral-300"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className={cn("text-[10px] uppercase tracking-widest font-semibold", accent ? "text-white/60" : "text-neutral-500")}>
          {label}
        </p>
        {Icon && (
          <div className={cn(
            "size-7 rounded-lg flex items-center justify-center",
            accent ? "bg-white/10" : "bg-neutral-100"
          )}>
            <Icon className="size-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-3xl lg:text-4xl font-bold tracking-tight tabular-nums">{value}</span>
        {unit && <span className={cn("text-sm font-medium", accent ? "text-white/60" : "text-neutral-500")}>{unit}</span>}
      </div>

      {delta !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
              positive && (accent ? "bg-white/15 text-white" : "bg-neutral-900 text-white"),
              negative && (accent ? "bg-white/10 text-white/70" : "bg-neutral-100 text-neutral-700"),
              neutral && (accent ? "bg-white/10 text-white/60" : "bg-neutral-100 text-neutral-600")
            )}
          >
            {positive && <ArrowUp className="size-3" />}
            {negative && <ArrowDown className="size-3" />}
            {neutral && <Minus className="size-3" />}
            {Math.abs(delta)}%
          </span>
          <span className={cn("text-[11px]", accent ? "text-white/50" : "text-neutral-500")}>vs yesterday</span>
        </div>
      )}
    </motion.div>
  );
}
