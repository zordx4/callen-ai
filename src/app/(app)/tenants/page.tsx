// Tenants — super-admin table of every workspace.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Building2,
  CheckCircle2,
  Pause,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type TenantRow = {
  id: string;
  name: string;
  industry: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "archived";
  ownerName: string;
  ownerEmail: string;
  mrrUSD: number;
  callsThisMonth: number;
  createdAt: string;
};

const TENANTS: TenantRow[] = [
  { id: "t1", name: "Cheezious",            industry: "Restaurants", plan: "pro",        status: "active",    ownerName: "Muhammad Talha",  ownerEmail: "talha@cheezious.pk",   mrrUSD: 199,  callsThisMonth: 1842,   createdAt: "2026-04-10T08:00:00Z" },
  { id: "t2", name: "Lahore Smile Clinic",  industry: "Healthcare",  plan: "pro",        status: "active",    ownerName: "Dr. Sara Iqbal",  ownerEmail: "sara@lahoresmile.pk",  mrrUSD: 199,  callsThisMonth: 612,    createdAt: "2026-04-20T11:00:00Z" },
  { id: "t3", name: "Bykea Operations",     industry: "Logistics",   plan: "enterprise", status: "active",    ownerName: "Ahmed Khan",      ownerEmail: "ahmed@bykea.com",      mrrUSD: 899,  callsThisMonth: 8412,   createdAt: "2026-04-05T09:30:00Z" },
  { id: "t4", name: "JS Bank Customer Care", industry: "Banking",    plan: "enterprise", status: "active",    ownerName: "Bilal Khalid",    ownerEmail: "bilal.k@jsbl.com",     mrrUSD: 1299, callsThisMonth: 14_812, createdAt: "2026-03-15T10:00:00Z" },
  { id: "t5", name: "OPTP",                 industry: "Restaurants", plan: "pro",        status: "active",    ownerName: "Hassan Raza",     ownerEmail: "hassan@optp.com.pk",   mrrUSD: 199,  callsThisMonth: 942,    createdAt: "2026-05-02T14:00:00Z" },
  { id: "t6", name: "Cheetay Couriers",     industry: "Logistics",   plan: "pro",        status: "suspended", ownerName: "Faisal Ahmed",    ownerEmail: "faisal@cheetay.com",   mrrUSD: 199,  callsThisMonth: 0,      createdAt: "2026-04-22T11:00:00Z" },
  { id: "t7", name: "Marina Dental",        industry: "Healthcare",  plan: "free",       status: "active",    ownerName: "Dr. Rabia Anwar", ownerEmail: "r.anwar@marinadent.pk", mrrUSD: 0,    callsThisMonth: 88,     createdAt: "2026-05-10T13:00:00Z" },
  { id: "t8", name: "Hardee's Pakistan",    industry: "Restaurants", plan: "enterprise", status: "active",    ownerName: "Imran Saeed",     ownerEmail: "imran@hardees.pk",     mrrUSD: 899,  callsThisMonth: 6204,   createdAt: "2026-04-01T08:00:00Z" },
  { id: "t9", name: "Domino's Pakistan",    industry: "Restaurants", plan: "enterprise", status: "active",    ownerName: "Asad Mehmood",    ownerEmail: "asad@dominos.com.pk",  mrrUSD: 899,  callsThisMonth: 9124,   createdAt: "2026-03-28T08:00:00Z" },
  { id: "t10", name: "SadaPay Support",     industry: "Fintech",     plan: "enterprise", status: "active",    ownerName: "Maria Aslam",     ownerEmail: "maria@sadapay.pk",     mrrUSD: 1299, callsThisMonth: 12_842, createdAt: "2026-03-12T08:00:00Z" },
  { id: "t11", name: "Tooso Express",       industry: "Logistics",   plan: "free",       status: "archived",  ownerName: "Hamza Ali",       ownerEmail: "hamza@tooso.pk",       mrrUSD: 0,    callsThisMonth: 0,      createdAt: "2026-02-20T08:00:00Z" },
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantRow[]>(TENANTS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TenantRow["status"]>("all");

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.industry.toLowerCase().includes(q) &&
          !t.ownerName.toLowerCase().includes(q) &&
          !t.ownerEmail.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [tenants, search, status]);

  const totalMrr = tenants.reduce((s, t) => s + t.mrrUSD, 0);
  const activeCount = tenants.filter((t) => t.status === "active").length;
  const totalCalls = tenants.reduce((s, t) => s + t.callsThisMonth, 0);

  const updateStatus = (id: string, next: TenantRow["status"]) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
          Super-admin
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tenants</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Every workspace running on Callen. Suspend or archive any tenant.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Tile label="Active tenants"   value={activeCount.toString()}            sub={`${tenants.length} total`} />
        <Tile label="Total MRR"        value={`$${totalMrr.toLocaleString()}`}    sub="across all workspaces" />
        <Tile label="Calls this month" value={totalCalls.toLocaleString()}        sub="aggregate" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tenant, owner, email, or industry..."
            className="pl-9 h-11 bg-white border-neutral-200"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "active", "suspended", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "h-11 px-3 rounded-md border text-[12px] font-medium capitalize transition-colors",
                status === s
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <div className="col-span-3">Tenant</div>
          <div className="col-span-2">Industry</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-1">Plan</div>
          <div className="col-span-1 text-right">MRR</div>
          <div className="col-span-1 text-right">Calls</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-500">No tenants match.</p>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 items-center"
              >
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <span className="size-8 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-700">
                    <Building2 className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight truncate">{t.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      since {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-[12px] text-neutral-700 truncate">{t.industry}</div>
                <div className="col-span-2 min-w-0">
                  <p className="text-[12px] text-neutral-700 truncate">{t.ownerName}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{t.ownerEmail}</p>
                </div>
                <div className="col-span-1">
                  <PlanBadge plan={t.plan} />
                </div>
                <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                  ${t.mrrUSD.toLocaleString()}
                </div>
                <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                  {t.callsThisMonth.toLocaleString()}
                </div>
                <div className="col-span-1">
                  <StatusBadge status={t.status} />
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {t.status === "active" ? (
                    <button
                      onClick={() => {
                        updateStatus(t.id, "suspended");
                        toast(`${t.name} suspended`);
                      }}
                      className="p-1 rounded hover:bg-neutral-100"
                      aria-label="Suspend"
                    >
                      <Pause className="size-3.5 text-neutral-500" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        updateStatus(t.id, "active");
                        toast(`${t.name} reactivated`);
                      }}
                      className="p-1 rounded hover:bg-neutral-100"
                      aria-label="Reactivate"
                    >
                      <CheckCircle2 className="size-3.5 text-neutral-500" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateStatus(t.id, "archived");
                      toast(`${t.name} archived`);
                    }}
                    className="p-1 rounded hover:bg-neutral-100"
                    aria-label="Archive"
                  >
                    <Archive className="size-3.5 text-neutral-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="text-[11px] text-neutral-500 mt-0.5">{sub}</p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: TenantRow["plan"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border",
        plan === "free"
          ? "bg-white text-neutral-700 border-neutral-200"
          : plan === "pro"
          ? "bg-neutral-100 text-neutral-800 border-neutral-200"
          : "bg-neutral-950 text-white border-neutral-950"
      )}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status }: { status: TenantRow["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
        <Pause className="size-3" />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
      <Archive className="size-3" />
      Archived
    </span>
  );
}
