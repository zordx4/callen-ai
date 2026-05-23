// Dashboard home — KPIs, charts, recent activity.
// Day 1 placeholder. Day 2 fills in the real KPI cards + charts.

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your AI voice agent activity.</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
        Day 2: KPI cards + call volume chart + language pie + recent activity feed will live here.
      </div>
    </div>
  );
}
