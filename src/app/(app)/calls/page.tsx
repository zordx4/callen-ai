export default function CallHistoryPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Call History</h1>
        <p className="text-sm text-muted-foreground mt-1">Search, filter, and replay past calls.</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
        Day 6: Filterable table of all calls. Click a row to open Call Detail.
      </div>
    </div>
  );
}
