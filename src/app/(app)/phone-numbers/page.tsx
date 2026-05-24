// Phone Numbers — buy + connect Twilio numbers.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Phone,
  PhoneOff,
  Search,
  Trash2,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ConnectedNumber = {
  id: string;
  number: string;
  country: string;
  flag: string;
  provider: "Twilio" | "Vonage" | "Plivo";
  agent: string;
  capabilities: ("voice" | "sms" | "mms")[];
  monthlyCostUSD: number;
  status: "active" | "provisioning";
  callsThisMonth: number;
};

const SEED_NUMBERS: ConnectedNumber[] = [
  { id: "n1", number: "+92 21 111 24 33 49", country: "Pakistan",         flag: "🇵🇰", provider: "Twilio", agent: "Cheezious Order Agent",     capabilities: ["voice", "sms"], monthlyCostUSD: 4.5, status: "active",       callsThisMonth: 1842 },
  { id: "n2", number: "+92 42 111 24 33 50", country: "Pakistan",         flag: "🇵🇰", provider: "Twilio", agent: "Cheezious Order Agent",     capabilities: ["voice"],        monthlyCostUSD: 4.5, status: "active",       callsThisMonth: 1124 },
  { id: "n3", number: "+92 51 111 24 33 51", country: "Pakistan",         flag: "🇵🇰", provider: "Twilio", agent: "Lahore Smile Receptionist", capabilities: ["voice", "sms"], monthlyCostUSD: 4.5, status: "active",       callsThisMonth: 612  },
  { id: "n4", number: "+971 4 524 9 200",    country: "United Arab Emirates", flag: "🇦🇪", provider: "Twilio", agent: "Cheezious Order Agent", capabilities: ["voice"],        monthlyCostUSD: 6,   status: "provisioning", callsThisMonth: 0    },
];

const MARKETPLACE_NUMBERS = [
  { number: "+92 21 111 24 33 78", country: "Pakistan",   flag: "🇵🇰", city: "Karachi",     monthlyCostUSD: 4.5, capabilities: ["voice", "sms"] as const },
  { number: "+92 42 111 24 33 99", country: "Pakistan",   flag: "🇵🇰", city: "Lahore",      monthlyCostUSD: 4.5, capabilities: ["voice", "sms"] as const },
  { number: "+92 51 111 24 33 17", country: "Pakistan",   flag: "🇵🇰", city: "Islamabad",   monthlyCostUSD: 4.5, capabilities: ["voice"] as const },
  { number: "+92 91 111 24 33 28", country: "Pakistan",   flag: "🇵🇰", city: "Peshawar",    monthlyCostUSD: 4.5, capabilities: ["voice", "sms"] as const },
  { number: "+1 415 555 0188",     country: "United States", flag: "🇺🇸", city: "San Francisco", monthlyCostUSD: 1.5, capabilities: ["voice", "sms", "mms"] as const },
  { number: "+44 20 7946 0123",    country: "United Kingdom", flag: "🇬🇧", city: "London",   monthlyCostUSD: 2.0, capabilities: ["voice", "sms"] as const },
];

const AGENTS = ["Cheezious Order Agent", "Lahore Smile Receptionist", "Custom Agent"];

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState<ConnectedNumber[]>(SEED_NUMBERS);
  const [search, setSearch] = useState("");
  const [buyOpen, setBuyOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return numbers;
    const q = search.toLowerCase();
    return numbers.filter(
      (n) =>
        n.number.toLowerCase().includes(q) ||
        n.country.toLowerCase().includes(q) ||
        n.agent.toLowerCase().includes(q)
    );
  }, [numbers, search]);

  const totalCost = numbers.reduce((s, n) => s + n.monthlyCostUSD, 0);
  const totalCalls = numbers.reduce((s, n) => s + n.callsThisMonth, 0);

  const buy = (
    template: typeof MARKETPLACE_NUMBERS[number],
    agent: string
  ) => {
    setNumbers((prev) => [
      {
        id: `n_${Date.now()}`,
        number: template.number,
        country: template.country,
        flag: template.flag,
        provider: "Twilio",
        agent,
        capabilities: [...template.capabilities],
        monthlyCostUSD: template.monthlyCostUSD,
        status: "provisioning",
        callsThisMonth: 0,
      },
      ...prev,
    ]);
    toast(`Provisioning ${template.number}`, {
      description: "Number will be active within 2 minutes.",
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Phone numbers</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Buy a Pakistani number, port your existing line, or forward your landline into Callen.
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
        <SummaryTile label="Active numbers" value={`${numbers.filter((n) => n.status === "active").length}`} sub={`${numbers.length} total`} />
        <SummaryTile label="Calls this month" value={totalCalls.toLocaleString()} sub="across all numbers" />
        <SummaryTile label="Monthly cost" value={`$${totalCost.toFixed(2)}`} sub="rolls into next invoice" />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by number, country, or agent..."
          className="pl-9 h-11 bg-white border-neutral-200"
        />
      </div>

      {/* Connected numbers table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <div className="col-span-4">Number</div>
          <div className="col-span-2">Agent</div>
          <div className="col-span-2">Capabilities</div>
          <div className="col-span-1 text-right">Calls / mo</div>
          <div className="col-span-1 text-right">Cost</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-500">No numbers match that search.</p>
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
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0" aria-hidden="true">{n.flag}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight tabular-nums truncate">{n.number}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{n.country} · {n.provider}</p>
                  </div>
                </div>
                <div className="col-span-2 text-[12px] text-neutral-700 truncate">{n.agent}</div>
                <div className="col-span-2 flex gap-1.5">
                  {n.capabilities.map((c) => (
                    <span
                      key={c}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                  {n.callsThisMonth.toLocaleString()}
                </div>
                <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                  ${n.monthlyCostUSD.toFixed(2)}
                </div>
                <div className="col-span-1">
                  {n.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <CheckCircle2 className="size-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                      <Loader2 className="size-3 animate-spin" /> Provisioning
                    </span>
                  )}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    onClick={() =>
                      toast("Forwarding paused", {
                        description: `${n.number} will not receive new calls.`,
                      })
                    }
                    className="p-1 rounded hover:bg-neutral-100"
                    aria-label="Pause"
                  >
                    <PhoneOff className="size-3.5 text-neutral-500" />
                  </button>
                  <button
                    onClick={() => {
                      setNumbers((prev) => prev.filter((x) => x.id !== n.id));
                      toast("Number released");
                    }}
                    className="p-1 rounded hover:bg-neutral-100"
                    aria-label="Release"
                  >
                    <Trash2 className="size-3.5 text-neutral-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <BuyNumberDialog open={buyOpen} onClose={() => setBuyOpen(false)} onBuy={buy} />
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
  onBuy,
}: {
  open: boolean;
  onClose: () => void;
  onBuy: (n: typeof MARKETPLACE_NUMBERS[number], agent: string) => void;
}) {
  const [country, setCountry] = useState<"all" | string>("all");
  const [agent, setAgent] = useState(AGENTS[0]);

  const countries = useMemo(
    () => Array.from(new Set(MARKETPLACE_NUMBERS.map((m) => m.country))),
    []
  );

  const filtered = MARKETPLACE_NUMBERS.filter((m) =>
    country === "all" ? true : m.country === country
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setCountry("all");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <Phone className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Buy a phone number</DialogTitle>
        </div>
        <DialogDescription>
          Pick a country, choose an available number, and assign it to an agent.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Country</Label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCountry("all")}
                className={cn(
                  "h-7 px-2.5 rounded-full text-[12px] font-medium border transition-colors",
                  country === "all"
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-white text-neutral-700 border-neutral-200"
                )}
              >
                All
              </button>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={cn(
                    "h-7 px-2.5 rounded-full text-[12px] font-medium border transition-colors",
                    country === c
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-700 border-neutral-200"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Assign to agent</Label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm"
            >
              {AGENTS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Available numbers</Label>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filtered.map((n, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-3 py-2 bg-white"
                >
                  <span className="text-lg" aria-hidden="true">{n.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold tabular-nums truncate">{n.number}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{n.city}, {n.country}</p>
                  </div>
                  <div className="flex gap-1">
                    {n.capabilities.map((c) => (
                      <span
                        key={c}
                        className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    ${n.monthlyCostUSD}/mo
                  </span>
                  <button
                    onClick={() => {
                      onBuy(n, agent);
                      onClose();
                    }}
                    className="h-7 px-2.5 rounded-full bg-neutral-950 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="-mx-4 -mb-4 mt-3 flex items-center justify-end gap-2 px-4 py-3 bg-neutral-50/60 border-t border-neutral-100 rounded-b-xl">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
