export default function EscalationsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Escalation Rules</h1>
        <p className="text-sm text-muted-foreground mt-1">When to hand the call off to a human agent.</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
        Day 7: If-then rule cards (trigger type, threshold, target action).
      </div>
    </div>
  );
}
