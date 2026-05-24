// KPI card — upgraded with embedded sparkline, count-up animation,
// dramatic typography, and a peak marker. Still pure monochrome.

"use client";

import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";
import type { SparkPoint } from "@/lib/mock-data";

type KpiCardProps = {
  label: string;
  // Either raw value string OR numeric for count-up. If numeric, we
  // animate from 0 to that target.
  value: string;
  numericValue?: number;
  numericFormat?: (n: number) => string;
  delta?: number;
  unit?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  index?: number;
  sparkline?: SparkPoint[];
};

export function KpiCard({
  label,
  value,
  numericValue,
  numericFormat,
  delta,
  unit,
  icon: Icon,
  accent,
  index = 0,
  sparkline,
}: KpiCardProps) {
  const positive = delta !== undefined && delta > 0;
  const negative = delta !== undefined && delta < 0;
  const neutral = delta === 0;

  const gradientId = `kpi-spark-${label.replace(/\s+/g, "-").toLowerCase()}-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
      whileHover={{ y: -2 }}
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-all duration-200 group",
        accent
          ? "bg-neutral-950 text-white border-neutral-950 hover:shadow-2xl hover:shadow-neutral-900/40"
          : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/[0.04]"
      )}
    >
      <div className="relative z-10 px-5 pt-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <p
            className={cn(
              "text-[10px] uppercase tracking-widest font-semibold",
              accent ? "text-white/60" : "text-neutral-500"
            )}
          >
            {label}
          </p>
          {Icon && (
            <div
              className={cn(
                "size-7 rounded-lg flex items-center justify-center",
                accent ? "bg-white/10" : "bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors"
              )}
            >
              <Icon className="size-3.5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-4xl lg:text-5xl font-bold tracking-[-0.04em] tabular-nums leading-none">
            {numericValue !== undefined ? (
              <CountUp to={numericValue} duration={1.4} format={numericFormat} />
            ) : (
              value
            )}
          </span>
          {unit && (
            <span
              className={cn(
                "text-sm font-medium",
                accent ? "text-white/60" : "text-neutral-500"
              )}
            >
              {unit}
            </span>
          )}
        </div>

        {delta !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
                positive && (accent ? "bg-emerald-500/20 text-emerald-300" : "bg-neutral-900 text-white"),
                negative && (accent ? "bg-white/10 text-white/70" : "bg-neutral-100 text-neutral-700"),
                neutral && (accent ? "bg-white/10 text-white/60" : "bg-neutral-100 text-neutral-600")
              )}
            >
              {positive && <ArrowUp className="size-3" />}
              {negative && <ArrowDown className="size-3" />}
              {neutral && <Minus className="size-3" />}
              {Math.abs(delta)}%
            </span>
            <span
              className={cn(
                "text-[11px]",
                accent ? "text-white/50" : "text-neutral-500"
              )}
            >
              vs yesterday
            </span>
          </div>
        ) : (
          accent && (
            <div className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative rounded-full size-1.5 bg-emerald-400" />
              </span>
              streaming now
            </div>
          )
        )}
      </div>

      {/* Embedded sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="relative h-14 -mt-1 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sparkline}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={accent ? "#ffffff" : "#0a0a0a"}
                    stopOpacity={accent ? 0.45 : 0.22}
                  />
                  <stop
                    offset="100%"
                    stopColor={accent ? "#ffffff" : "#0a0a0a"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accent ? "#ffffff" : "#0a0a0a"}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: accent ? "#ffffff" : "#0a0a0a",
                  stroke: accent ? "#0a0a0a" : "#ffffff",
                  strokeWidth: 1.5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <span
            className={cn(
              "absolute bottom-1 left-3 text-[9px] uppercase tracking-widest font-medium",
              accent ? "text-white/40" : "text-neutral-400"
            )}
          >
            7d
          </span>
        </div>
      )}
    </motion.div>
  );
}
