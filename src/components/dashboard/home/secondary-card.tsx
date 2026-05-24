// SecondaryCard — sparkline KPI tile. Clickable, links to deeper analytics.

"use client";

import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  secondarySeries,
  type SecondaryKpi,
  type AgentId,
} from "@/lib/dashboard-home-data";

interface SecondaryCardProps {
  kpi: SecondaryKpi;
  agent: AgentId;
  gradientId: string;
}

export function SecondaryCard({ kpi, agent, gradientId }: SecondaryCardProps) {
  // Tiny per-agent variation so the value reads differently when switching
  const agentDelta = agent === "a1" ? 1.6 : agent === "a2" ? -2.8 : 2.3;
  const value = kpi.base * (1 + agentDelta * 0.005);
  const delta = parseFloat((agentDelta).toFixed(1));
  const isUp = delta >= 0;
  const DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight;

  const series = secondarySeries(kpi.label, agent).map(({ label, value: v }) => ({
    label,
    value: kpi.base * v,
  }));

  const Wrapper = kpi.href ? Link : "div";
  const wrapperProps = kpi.href ? { href: kpi.href } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="block rounded-3xl border border-neutral-200 bg-white p-6 group hover:border-neutral-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-[0.08em] font-medium mb-2">{kpi.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums tracking-tight">
              {kpi.format(value)}{kpi.unit && <span className="text-2xl text-neutral-700 ml-0.5">{kpi.unit}</span>}
            </span>
            {kpi.trailingUnit && (
              <span className="text-2xl text-neutral-700 leading-none">{kpi.trailingUnit}</span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full bg-neutral-100 text-neutral-700",
          )}
        >
          <DeltaIcon className="size-3" />
          {isUp ? "+" : ""}{delta}{kpi.deltaUnit ? ` ${kpi.deltaUnit}` : ""}
        </span>
      </div>
      <div className="h-20 -mx-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={series} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#171717" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#171717" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#171717" strokeWidth={1.5} fill={`url(#${gradientId})`} dot={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                fontSize: "11px",
                padding: "4px 8px",
              }}
              labelFormatter={() => ""}
              formatter={(v: number) => [kpi.format(v), ""]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Wrapper>
  );
}
