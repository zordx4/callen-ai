export default function TenantsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform-wide tenant administration (super-admin only).</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
        Day 7: Tenants table with plan, MRR, active calls, suspended toggle.
      </div>
    </div>
  );
}
