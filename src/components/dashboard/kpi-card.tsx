// KPI card for the dashboard home — number + delta + sparkline.

"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  delta?: number; // percent change vs previous period
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
          ? "bg-foreground text-background border-foreground/20"
          : "bg-card border-border/60"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className={cn("text-xs uppercase tracking-wider font-medium", accent ? "text-background/70" : "text-muted-foreground")}>
          {label}
        </p>
        {Icon && (
          <div className={cn(
            "size-7 rounded-lg flex items-center justify-center",
            accent ? "bg-background/10" : "bg-foreground/5"
          )}>
            <Icon className="size-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-3xl lg:text-4xl font-bold tracking-tight tabular-nums">{value}</span>
        {unit && <span className={cn("text-sm font-medium", accent ? "text-background/60" : "text-muted-foreground")}>{unit}</span>}
      </div>

      {delta !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
              positive && (accent ? "bg-emerald-400/20 text-emerald-300" : "bg-emerald-50 text-emerald-700"),
              negative && (accent ? "bg-rose-400/20 text-rose-300" : "bg-rose-50 text-rose-700"),
              neutral && (accent ? "bg-background/10 text-background/60" : "bg-muted text-muted-foreground")
            )}
          >
            {positive && <ArrowUp className="size-3" />}
            {negative && <ArrowDown className="size-3" />}
            {neutral && <Minus className="size-3" />}
            {Math.abs(delta)}%
          </span>
          <span className={cn("text-xs", accent ? "text-background/50" : "text-muted-foreground")}>vs yesterday</span>
        </div>
      )}
    </motion.div>
  );
}
