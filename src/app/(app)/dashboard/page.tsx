// Dashboard home — KPI cards + charts + recent activity.

"use client";

import { Phone, Clock, CheckCircle2, Radio } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CallVolumeChart } from "@/components/dashboard/call-volume-chart";
import { LanguagePie } from "@/components/dashboard/language-pie";
import { IntentBreakdown } from "@/components/dashboard/intent-breakdown";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { dashboardKpis } from "@/lib/mock-data";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DashboardPage() {
  const hydrated = useHasHydrated();
  const tenant = useAppStore((s) => s.currentTenant);

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-display-md mb-1">
            Welcome back to <span className="text-gradient-callen">{tenant.name}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your AI voice agent today.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated · just now
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <KpiCard
          index={0}
          label="Calls today"
          value={dashboardKpis.callsToday.toString()}
          delta={dashboardKpis.callsTodayDelta}
          icon={Phone}
        />
        <KpiCard
          index={1}
          label="Avg handling time"
          value={formatTime(dashboardKpis.avgHandlingTimeSec)}
          delta={dashboardKpis.ahtDelta}
          icon={Clock}
        />
        <KpiCard
          index={2}
          label="Resolution rate"
          value={`${Math.round(dashboardKpis.resolutionRate * 100)}`}
          unit="%"
          delta={dashboardKpis.resolutionDelta}
          icon={CheckCircle2}
        />
        <KpiCard
          index={3}
          label="Active calls"
          value={dashboardKpis.activeCallsNow.toString()}
          unit="live"
          icon={Radio}
          accent
        />
      </div>

      {/* Charts row 1: Call volume (2/3) + Language pie (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
        <div className="lg:col-span-2">
          <CallVolumeChart />
        </div>
        <LanguagePie />
      </div>

      {/* Charts row 2: Intent breakdown (1/2) + Recent activity (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <IntentBreakdown />
        <RecentActivity />
      </div>
    </div>
  );
}
