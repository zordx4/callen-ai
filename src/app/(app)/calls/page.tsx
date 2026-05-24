// Call History — functional. Search, filters, sort, pagination, drawer.
// Reads the 50 mock calls from src/lib/mock-data.ts.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  PhoneIncoming,
  CheckCircle2,
  ArrowRightLeft,
  PhoneMissed,
  Download,
  Smile,
  Frown,
  Meh,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calls as allCalls, sampleTranscript, type Call } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

type SortKey = "startedAt" | "durationSec" | "sentimentScore";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 12;

const INTENT_LABELS: Record<string, string> = {
  place_order: "Place order",
  reservation: "Reservation",
  menu_inquiry: "Menu inquiry",
  delivery_status: "Delivery status",
  complaint: "Complaint",
  hours_inquiry: "Hours",
  location_inquiry: "Location",
  general: "General",
};

export default function CallHistoryPage() {
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "ur" | "en">("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | Call["outcome"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("startedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const intents = useMemo(
    () => Array.from(new Set(allCalls.map((c) => c.intent))),
    []
  );

  const filtered = useMemo(() => {
    let list = allCalls.filter((c) => {
      if (langFilter !== "all" && c.language !== langFilter) return false;
      if (intentFilter !== "all" && c.intent !== intentFilter) return false;
      if (outcomeFilter !== "all" && c.outcome !== outcomeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.callerNumber.toLowerCase().includes(q) &&
          !c.intent.toLowerCase().includes(q) &&
          !(c.callerName ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
    list.sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      const cmp = av > bv ? 1 : av < bv ? -1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [search, langFilter, intentFilter, outcomeFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const drawerCall = drawerId ? allCalls.find((c) => c.id === drawerId) : null;

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Call history
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Search, filter, and inspect every call your agent has taken.
          </p>
        </div>
        <button
          onClick={() =>
            toast("Export queued", {
              description: `${filtered.length} calls will be emailed as a CSV.`,
            })
          }
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-neutral-200 text-sm font-medium hover:border-neutral-300 transition-colors"
        >
          <Download className="size-3.5" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by caller number, name, or intent..."
          className="pl-9 h-11 bg-white border-neutral-200"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <FilterChip
          label="Language"
          value={langFilter}
          onClear={() => setLangFilter("all")}
          options={[
            { value: "all", label: "All languages" },
            { value: "ur",  label: "Urdu" },
            { value: "en",  label: "English" },
          ]}
          onSelect={(v) => {
            setLangFilter(v as "all" | "ur" | "en");
            setPage(1);
          }}
        />
        <FilterChip
          label="Intent"
          value={intentFilter}
          onClear={() => setIntentFilter("all")}
          options={[
            { value: "all", label: "All intents" },
            ...intents.map((i) => ({ value: i, label: INTENT_LABELS[i] ?? i })),
          ]}
          onSelect={(v) => {
            setIntentFilter(v);
            setPage(1);
          }}
        />
        <FilterChip
          label="Outcome"
          value={outcomeFilter}
          onClear={() => setOutcomeFilter("all")}
          options={[
            { value: "all",        label: "All outcomes" },
            { value: "resolved",   label: "Resolved" },
            { value: "escalated",  label: "Escalated" },
            { value: "abandoned",  label: "Abandoned" },
          ]}
          onSelect={(v) => {
            setOutcomeFilter(v as "all" | Call["outcome"]);
            setPage(1);
          }}
        />
        <div className="ml-auto text-[12px] text-neutral-500 tabular-nums">
          {filtered.length} call{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <SortHeader className="col-span-3" label="Caller" active={false} onClick={() => {}} sortable={false} />
          <SortHeader
            className="col-span-2"
            label="Started"
            active={sortKey === "startedAt"}
            dir={sortDir}
            onClick={() => onSort("startedAt")}
          />
          <SortHeader
            className="col-span-1 justify-end text-right"
            label="Dur"
            active={sortKey === "durationSec"}
            dir={sortDir}
            onClick={() => onSort("durationSec")}
          />
          <div className="col-span-1">Lang</div>
          <div className="col-span-2">Intent</div>
          <div className="col-span-2">Outcome</div>
          <SortHeader
            className="col-span-1 justify-end text-right"
            label="Mood"
            active={sortKey === "sentimentScore"}
            dir={sortDir}
            onClick={() => onSort("sentimentScore")}
          />
        </div>

        {pageRows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold tracking-tight">No matching calls</p>
            <p className="text-xs text-neutral-500 mt-1">
              Try changing the filters or clearing the search.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {pageRows.map((c) => (
              <motion.button
                key={c.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setDrawerId(c.id)}
                className="w-full text-left grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors items-center"
              >
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <span className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                    <PhoneIncoming className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight truncate tabular-nums">
                      {c.callerNumber}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {c.callerName ?? "Unknown caller"}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-[12px] text-neutral-600 tabular-nums">
                  {new Date(c.startedAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                  {Math.floor(c.durationSec / 60)}:
                  {(c.durationSec % 60).toString().padStart(2, "0")}
                </div>
                <div className="col-span-1 text-[12px] text-neutral-600 uppercase">{c.language}</div>
                <div className="col-span-2 text-[12px] text-neutral-700 truncate">
                  {INTENT_LABELS[c.intent] ?? c.intent}
                </div>
                <div className="col-span-2">
                  <OutcomePill outcome={c.outcome} />
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  <SentimentBadge score={c.sentimentScore} />
                  <ChevronRight className="size-3.5 text-neutral-400" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[12px] text-neutral-600">
          <p>
            Page <span className="font-semibold">{safePage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span> ·{" "}
            <span className="tabular-nums">{filtered.length}</span> calls
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="size-8 rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 disabled:opacity-30 flex items-center justify-center"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="size-8 rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 disabled:opacity-30 flex items-center justify-center"
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <Sheet open={!!drawerCall} onOpenChange={(o) => !o && setDrawerId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          {drawerCall && <CallDrawer call={drawerCall} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// =============================================================
// Sub-components
// =============================================================

function SortHeader({
  label,
  className,
  active,
  dir,
  onClick,
  sortable = true,
}: {
  label: string;
  className?: string;
  active: boolean;
  dir?: SortDir;
  onClick: () => void;
  sortable?: boolean;
}) {
  if (!sortable) {
    return <div className={cn("flex items-center gap-1", className)}>{label}</div>;
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 hover:text-neutral-900 transition-colors",
        className
      )}
    >
      {label}
      {active &&
        (dir === "asc" ? (
          <ChevronUp className="size-3" />
        ) : (
          <ChevronDown className="size-3" />
        ))}
    </button>
  );
}

function OutcomePill({ outcome }: { outcome: Call["outcome"] }) {
  if (outcome === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
        <CheckCircle2 className="size-3" />
        Resolved
      </span>
    );
  }
  if (outcome === "escalated") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
        <ArrowRightLeft className="size-3" />
        Escalated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium">
      <PhoneMissed className="size-3" />
      Abandoned
    </span>
  );
}

function SentimentBadge({ score }: { score: number }) {
  const Icon = score > 0.3 ? Smile : score < -0.2 ? Frown : Meh;
  const color =
    score > 0.3
      ? "text-emerald-600"
      : score < -0.2
      ? "text-rose-600"
      : "text-neutral-500";
  return <Icon className={cn("size-3.5", color)} />;
}

function FilterChip({
  label,
  value,
  options,
  onSelect,
  onClear,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = value !== "all";
  const activeLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full border text-[12px] font-medium transition-colors",
          active
            ? "bg-neutral-950 text-white border-neutral-950"
            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
        )}
      >
        {active ? null : <Plus className="size-3" />}
        <span>
          {label}
          {active ? ": " : ""}
          {active ? activeLabel : ""}
        </span>
        {active && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 hover:bg-white/15 rounded-full p-0.5"
          >
            <X className="size-3" />
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-40 min-w-[180px] rounded-lg border border-neutral-200 bg-white shadow-lg py-1 max-h-64 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-[12px] hover:bg-neutral-50 transition-colors",
                  value === opt.value && "font-semibold"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================
// Drawer
// =============================================================

function CallDrawer({ call }: { call: Call }) {
  return (
    <>
      <SheetHeader className="px-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="size-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
            <PhoneIncoming className="size-4" />
          </span>
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base tabular-nums">{call.callerNumber}</SheetTitle>
            <SheetDescription className="text-xs">
              {new Date(call.startedAt).toLocaleString()} · {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <Stat label="Language" value={call.language.toUpperCase()} />
        <Stat label="Intent" value={INTENT_LABELS[call.intent] ?? call.intent} />
        <Stat
          label="Outcome"
          value={<OutcomePill outcome={call.outcome} />}
        />
        <Stat
          label="Sentiment"
          value={
            <span className="inline-flex items-center gap-1.5">
              <SentimentBadge score={call.sentimentScore} />
              <span className="font-mono text-[12px]">{call.sentimentScore.toFixed(2)}</span>
            </span>
          }
        />
        <Stat label="Cost" value={`$${call.cost.toFixed(3)}`} />
        <Stat label="Duration" value={`${Math.floor(call.durationSec / 60)}:${(call.durationSec % 60).toString().padStart(2, "0")}`} />
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">
          Transcript preview
        </p>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {sampleTranscript.map((seg, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg px-3 py-2 text-[12px] leading-snug",
                seg.speaker === "agent"
                  ? "bg-neutral-100 text-neutral-800"
                  : "bg-neutral-950 text-white"
              )}
            >
              <div
                className={cn(
                  "text-[9px] uppercase tracking-widest font-semibold mb-0.5",
                  seg.speaker === "agent" ? "text-neutral-500" : "text-white/60"
                )}
              >
                {seg.speaker} · {seg.language.toUpperCase()}
              </div>
              {seg.text}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() =>
          toast("Audio download queued", {
            description: "Recording will be emailed once it is ready.",
          })
        }
        className="mt-6 w-full inline-flex items-center justify-center gap-2 h-9 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        <Download className="size-3.5" />
        Download recording
      </button>
    </>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-0.5">{label}</p>
      <div className="text-[13px] font-semibold tracking-tight">{value}</div>
    </div>
  );
}
