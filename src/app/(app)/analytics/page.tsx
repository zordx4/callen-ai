export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Volume, language mix, intent distribution, resolution rate.</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
        Day 6: Six-card grid with volume timeseries, language pie, intent bars, funnels.
      </div>
    </div>
  );
}
