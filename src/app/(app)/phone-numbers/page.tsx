// Phone Numbers — real Retell-managed numbers.
// Lists this workspace's numbers from Supabase, buys new ones through
// POST /api/numbers (which provisions on Retell and binds to an agent).

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Phone,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useCustomAgentsStore, useCustomAgentsHydrated } from "@/lib/custom-agents-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type NumberRow = {
  id: string;
  e164: string;
  agent_id: string | null;
  status: "provisioning" | "active" | "released";
  monthly_cost_cents: number;
  created_at: string;
};

const supabase = createClient();

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState<NumberRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [buyOpen, setBuyOpen] = useState(false);

  const agents = useCustomAgentsStore((s) => s.agents);
  useCustomAgentsHydrated();

  const agentName = (id: string | null) =>
    agents.find((a) => a.id === id)?.name ?? "Unassigned";

  async function refresh() {
    const { data, error } = await supabase
      .from("phone_numbers")
      .select("id, e164, agent_id, status, monthly_cost_cents, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Could not load numbers", { description: error.message });
    } else {
      setNumbers((data as NumberRow[]) ?? []);
    }
    setLoaded(true);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return numbers;
    const q = search.toLowerCase();
    return numbers.filter(
      (n) =>
        n.e164.toLowerCase().includes(q) ||
        agentName(n.agent_id).toLowerCase().includes(q)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numbers, search, agents]);

  const totalCost = numbers.reduce((s, n) => s + n.monthly_cost_cents, 0) / 100;
  const activeCount = numbers.filter((n) => n.status === "active").length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Phone numbers</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Buy a US number for an agent, or forward your existing business line into Callen.
          </p>
        </div>
        <button
          onClick={() => setBuyOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus className="size-3.5" />
          Buy number
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryTile label="Active numbers" value={`${activeCount}`} sub={`${numbers.length} total`} />
        <SummaryTile label="Connected agents" value={`${new Set(numbers.map((n) => n.agent_id).filter(Boolean)).size}`} sub="receiving calls" />
        <SummaryTile label="Monthly cost" value={`$${totalCost.toFixed(2)}`} sub="rolls into next invoice" />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by number or agent..."
          className="pl-9 h-11 bg-white border-neutral-200"
        />
      </div>

      {/* Connected numbers table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <div className="col-span-5">Number</div>
          <div className="col-span-3">Agent</div>
          <div className="col-span-2 text-right">Cost / mo</div>
          <div className="col-span-2">Status</div>
        </div>
        {!loaded ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-500">Loading numbers...</p>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-semibold tracking-tight">
              {numbers.length === 0 ? "No numbers yet" : "No numbers match that search"}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {numbers.length === 0
                ? "Buy your first number to put an agent on a real phone line."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 items-center"
              >
                <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                  <span className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                    <Phone className="size-3.5" />
                  </span>
                  <p className="text-sm font-semibold tracking-tight tabular-nums truncate">{n.e164}</p>
                </div>
                <div className="col-span-3 text-[12px] text-neutral-700 truncate">{agentName(n.agent_id)}</div>
                <div className="col-span-2 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                  ${(n.monthly_cost_cents / 100).toFixed(2)}
                </div>
                <div className="col-span-2">
                  {n.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <CheckCircle2 className="size-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                      <Loader2 className="size-3 animate-spin" /> {n.status}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <BuyNumberDialog
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onBought={() => {
          setBuyOpen(false);
          void refresh();
        }}
      />
    </div>
  );
}

function SummaryTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="text-[11px] text-neutral-500 mt-0.5">{sub}</p>
    </div>
  );
}

function BuyNumberDialog({
  open,
  onClose,
  onBought,
}: {
  open: boolean;
  onClose: () => void;
  onBought: () => void;
}) {
  const agents = useCustomAgentsStore((s) => s.agents);
  const publishedAgents = agents.filter((a) => a.status === "published");
  const [agentId, setAgentId] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (open && !agentId && publishedAgents[0]) setAgentId(publishedAgents[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, publishedAgents.length]);

  async function buy() {
    if (!agentId) {
      toast.error("Pick an agent first");
      return;
    }
    setBuying(true);
    try {
      const res = await fetch("/api/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          areaCode: areaCode ? Number(areaCode) : undefined,
        }),
      });
      const body = (await res.json().catch(() => null)) as
        | { number?: { e164: string }; error?: string }
        | null;
      if (!res.ok) {
        throw new Error(body?.error ?? `Purchase failed (${res.status})`);
      }
      toast.success("Number provisioned", {
        description: `${body?.number?.e164 ?? "Your new number"} is bound to the agent.`,
      });
      onBought();
    } catch (err) {
      toast.error("Could not buy number", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBuying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <Phone className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Buy a phone number</DialogTitle>
        </div>
        <DialogDescription>
          Provisions a US number on the voice runtime and binds it to the agent. $2/month, billed to your account.
        </DialogDescription>

        <div className="space-y-4 mt-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Assign to agent</Label>
            {publishedAgents.length === 0 ? (
              <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                You need a published agent first. Create one and hit Publish, then come back here.
              </p>
            ) : (
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm"
              >
                {publishedAgents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Preferred area code (optional)</Label>
            <Input
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="e.g. 415"
              inputMode="numeric"
              className="h-10 bg-white border-neutral-200"
            />
            <p className="text-[11px] text-neutral-500">
              Leave blank to get any available US number.
            </p>
          </div>
        </div>

        <div className="-mx-4 -mb-4 mt-4 flex items-center justify-end gap-2 px-4 py-3 bg-neutral-50/60 border-t border-neutral-100 rounded-b-xl">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={buy}
            disabled={buying || publishedAgents.length === 0}
            className="inline-flex items-center gap-2 h-8 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40"
          >
            {buying && <Loader2 className="size-3.5 animate-spin" />}
            {buying ? "Provisioning..." : "Buy number"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
