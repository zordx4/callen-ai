import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      badge="Day 6"
      title="Analytics"
      subtitle="Deep insights on call volume, language mix, intent distribution, sentiment, and resolution rate."
      icon={BarChart3}
      comingNote="Six-card grid with call volume timeseries, language pie, intent bar chart, resolution funnel, escalation rate over time, and top callers leaderboard. Filter by date range, language, tenant. Export anything to CSV or PDF."
    />
  );
}
