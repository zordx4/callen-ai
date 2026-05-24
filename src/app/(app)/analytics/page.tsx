// Analytics — the deep call dashboard. Moved here from /dashboard so /dashboard
// can serve as the at-a-glance home (ElevenLabs-style).

"use client";

import { Phone, Clock, CheckCircle2, Radio } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CallVolumeChart } from "@/components/dashboard/call-volume-chart";
import { LanguagePie } from "@/components/dashboard/language-pie";
import { IntentBreakdown } from "@/components/dashboard/intent-breakdown";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { dashboardKpis, kpiSparklines } from "@/lib/mock-data";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AnalyticsPage() {
  const hydrated = useHasHydrated();
  const tenant = useAppStore((s) => s.currentTenant);

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-neutral-500 mb-1.5">{tenant.name} analytics</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Deep call analytics
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl">
          Volume, language mix, intent distribution, resolution rate, and recent activity at a glance.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <KpiCard
          index={0}
          label="Calls today"
          value={dashboardKpis.callsToday.toString()}
          numericValue={dashboardKpis.callsToday}
          delta={dashboardKpis.callsTodayDelta}
          icon={Phone}
          sparkline={kpiSparklines.callsToday}
        />
        <KpiCard
          index={1}
          label="Avg handling time"
          value={formatTime(dashboardKpis.avgHandlingTimeSec)}
          delta={dashboardKpis.ahtDelta}
          icon={Clock}
          sparkline={kpiSparklines.aht}
        />
        <KpiCard
          index={2}
          label="Resolution rate"
          value={`${Math.round(dashboardKpis.resolutionRate * 100)}`}
          numericValue={Math.round(dashboardKpis.resolutionRate * 100)}
          unit="%"
          delta={dashboardKpis.resolutionDelta}
          icon={CheckCircle2}
          sparkline={kpiSparklines.resolution}
        />
        <KpiCard
          index={3}
          label="Active calls"
          value={dashboardKpis.activeCallsNow.toString()}
          numericValue={dashboardKpis.activeCallsNow}
          unit="live"
          icon={Radio}
          accent
          sparkline={kpiSparklines.activeNow}
        />
      </div>

      {/* Charts row 1: Call volume + Language pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
        <div className="lg:col-span-2">
          <CallVolumeChart />
        </div>
        <LanguagePie />
      </div>

      {/* Charts row 2: Intent breakdown + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <IntentBreakdown />
        <RecentActivity />
      </div>
    </div>
  );
}
