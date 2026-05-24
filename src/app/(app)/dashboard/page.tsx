// Dashboard home — ElevenLabs-style.
// Functional filters (range, granularity, agent), all 8 tabs render real
// KPI strips with relevant Callen.ai metrics. Advanced tab is the settings panel.

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Plus, ChevronDown, Calendar, BarChart3, Bot,
  Settings2, Webhook, ShieldAlert, KeyRound,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiChartCard } from "@/components/dashboard/home/kpi-chart-card";
import { SecondaryCard } from "@/components/dashboard/home/secondary-card";
import {
  activeCallsRange,
  agentOptions,
  defaultGranularity,
  granularitiesFor,
  granularityOptions,
  homeTabs,
  rangeOptions,
  secondaryKpis,
  type AgentId,
  type Granularity,
  type Range,
  type TabKey,
} from "@/lib/dashboard-home-data";

function getGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

function firstName(fullName?: string): string {
  if (!fullName) return "there";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 3 && parts[0].toLowerCase() === "muhammad") return parts[1];
  return parts[0];
}

export default function DashboardPage() {
  const hydrated = useHasHydrated();
  const tenant = useAppStore((s) => s.currentTenant);
  const user = useAppStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<TabKey>("General");
  const [range, setRange] = useState<Range>("7d");
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [agent, setAgent] = useState<AgentId>("all");
  const [activeCalls, setActiveCalls] = useState(3);

  // When range changes, force granularity to the sensible default for that range
  useEffect(() => {
    const allowed = granularitiesFor(range);
    if (!allowed.includes(granularity)) setGranularity(defaultGranularity(range));
  }, [range, granularity]);

  // Live active-calls counter — drifts up and down once every few seconds
  useEffect(() => {
    const [lo, hi] = activeCallsRange;
    const id = setInterval(() => {
      setActiveCalls((prev) => {
        const drift = Math.random() < 0.5 ? -1 : 1;
        const next = prev + drift;
        if (next < lo) return lo;
        if (next > hi) return hi;
        return next;
      });
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const allowedGranularities = useMemo(() => granularitiesFor(range), [range]);
  const rangeLabel = rangeOptions.find((r) => r.value === range)?.label ?? "Last 7 days";
  const granLabel = granularityOptions.find((g) => g.value === granularity)?.label ?? "Day";
  const agentLabel = agentOptions.find((a) => a.value === agent)?.label ?? "All agents";

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[460px] w-full rounded-3xl" />
      </div>
    );
  }

  const greeting = getGreeting();
  const name = firstName(user?.name);

  const handleSaveView = () => {
    toast.success(`View saved: ${rangeLabel} · ${granLabel} · ${agentLabel}`);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Top row */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <Link
          href="/calls/live"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors group"
        >
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-40" />
            <span className="relative inline-flex rounded-full size-2 bg-neutral-900" />
          </span>
          <span className="text-sm text-neutral-700">
            Active calls: <span className="font-semibold text-neutral-950 tabular-nums">{activeCalls}</span>
          </span>
          <span className="text-xs text-neutral-400 group-hover:text-neutral-900 transition-colors hidden sm:inline">
            view live
            <span aria-hidden> →</span>
          </span>
        </Link>
        <Link
          href="/analytics"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-950 transition-colors inline-flex items-center gap-1.5"
        >
          Deep analytics
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        <p className="text-sm text-neutral-500 mb-1.5">{tenant.name} workspace</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-[1.05]">
          {greeting}, {name}
        </h1>
      </div>

      {/* Tab nav */}
      <div className="border-b border-neutral-200 mb-6 -mx-2">
        <nav className="flex gap-1 overflow-x-auto no-scrollbar">
          {homeTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-2.5 text-sm font-medium tracking-tight whitespace-nowrap transition-colors relative",
                  isActive ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                {tab}
                {isActive && (
                  <motion.div
                    layoutId="home-tab-underline"
                    className="absolute -bottom-px left-3 right-3 h-[2px] bg-neutral-950"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={handleSaveView}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-sm text-neutral-700 font-medium"
        >
          <Plus className="size-3.5" />
          Create view
        </button>

        <FilterDropdown
          icon={<Calendar className="size-3.5" />}
          label={rangeLabel}
          options={rangeOptions}
          value={range}
          onChange={(v) => setRange(v as Range)}
        />

        <FilterDropdown
          icon={<BarChart3 className="size-3.5" />}
          label={granLabel}
          options={granularityOptions.filter((g) => allowedGranularities.includes(g.value))}
          value={granularity}
          onChange={(v) => setGranularity(v as Granularity)}
        />

        <FilterDropdown
          icon={<Bot className="size-3.5" />}
          label={agentLabel}
          options={agentOptions}
          value={agent}
          onChange={(v) => setAgent(v as AgentId)}
          minWidth={220}
        />
      </div>

      {/* Main panel */}
      {activeTab === "Advanced" ? (
        <AdvancedPanel />
      ) : (
        <>
          <KpiChartCard
            tab={activeTab as Exclude<TabKey, "Advanced">}
            range={range}
            granularity={granularity}
            agent={agent}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SecondaryCard kpi={secondaryKpis[0]} agent={agent} gradientId="sec-grad-success" />
            <SecondaryCard kpi={secondaryKpis[1]} agent={agent} gradientId="sec-grad-csat" />
          </div>
        </>
      )}
    </div>
  );
}

// --- Filter dropdown ---------------------------------------------------------

interface FilterOption { value: string; label: string }
interface FilterDropdownProps {
  icon?: ReactNode;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
  minWidth?: number;
}

function FilterDropdown({ icon, label, options, value, onChange, minWidth }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50 transition-colors text-sm text-neutral-950 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {icon}
        {label}
        <ChevronDown className="size-3.5 text-neutral-500 -mr-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={minWidth ? { minWidth: `${minWidth}px` } : undefined}
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="cursor-pointer"
          >
            <span className={cn("flex-1", opt.value === value && "font-semibold")}>
              {opt.label}
            </span>
            {opt.value === value && <span className="text-neutral-500 ml-2">·</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- Advanced panel ----------------------------------------------------------

function AdvancedPanel() {
  const items = [
    { icon: ShieldAlert, title: "Escalation rules",   sub: "If-then routing for human handoff" },
    { icon: Settings2,   title: "Compliance & PII",   sub: "Redaction patterns, consent prompts, retention" },
    { icon: Webhook,     title: "Webhooks",           sub: "Outbound POST on call.end, escalation, tool.error" },
    { icon: KeyRound,    title: "API keys",           sub: "Provisioning and rotation for REST + WebSocket" },
  ];
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-100">
        <h3 className="text-lg font-bold tracking-tight">Advanced configuration</h3>
        <p className="text-sm text-neutral-600 mt-0.5">Operational controls that sit beyond day-to-day metrics.</p>
      </div>
      <div className="grid sm:grid-cols-2 divide-x divide-y divide-neutral-100">
        {items.map((it) => (
          <Link
            key={it.title}
            href="/settings"
            className="flex items-start gap-4 px-6 py-5 hover:bg-neutral-50 transition-colors group"
          >
            <div className="size-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-950 transition-colors flex items-center justify-center shrink-0">
              <it.icon className="size-5 text-neutral-700 group-hover:text-white transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">{it.title}</p>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{it.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
