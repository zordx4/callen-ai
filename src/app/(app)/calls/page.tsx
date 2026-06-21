// Call History — real data from Supabase (calls + call_turns).
// Search, outcome/sentiment filters, sort, pagination, and a drawer with
// the full transcript, summary, and recording link.

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  PhoneIncoming,
  PhoneOutgoing,
  CheckCircle2,
  ArrowRightLeft,
  PhoneMissed,
  Download,
  Smile,
  Frown,
  Meh,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

type Outcome = "booked" | "resolved" | "escalated" | "voicemail" | "missed" | "abandoned" | "other" | null;
type Sentiment = "positive" | "neutral" | "negative" | null;

type CallRow = {
  id: string;
  direction: "inbound" | "outbound";
  from_e164: string | null;
  to_e164: string | null;
  status: string;
  outcome: Outcome;
  sentiment: Sentiment;
  summary: string | null;
  recording_url: string | null;
  started_at: string | null;
  duration_seconds: number | null;
};

type Turn = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
};

type SortKey = "started_at" | "duration_seconds";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 12;
const supabase = createClient();

export default function CallHistoryPage() {
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | NonNullable<Outcome>>("all");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | NonNullable<Sentiment>>("all");
  const [sortKey, setSortKey] = useState<SortKey>("started_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("id, direction, from_e164, to_e164, status, outcome, sentiment, summary, recording_url, started_at, duration_seconds")
        .order("started_at", { ascending: false })
        .limit(500);
      if (error) {
        toast.error("Could not load calls", { description: error.message });
      } else {
        setCalls((data as CallRow[]) ?? []);
      }
      setLoaded(true);
    })();
  }, []);

  const filtered = useMemo(() => {
    const list = calls.filter((c) => {
      if (outcomeFilter !== "all" && c.outcome !== outcomeFilter) return false;
      if (sentimentFilter !== "all" && c.sentiment !== sentimentFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const num = (c.direction === "inbound" ? c.from_e164 : c.to_e164) ?? "";
        if (!num.toLowerCase().includes(q) && !(c.summary ?? "").toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
    list.sort((a, b) => {
      const av = (a[sortKey] ?? "") as string | number;
      const bv = (b[sortKey] ?? "") as string | number;
      const cmp = av > bv ? 1 : av < bv ? -1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [calls, search, outcomeFilter, sentimentFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const drawerCall = drawerId ? calls.find((c) => c.id === drawerId) : null;

  const onSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Call history</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Search, filter, and inspect every call your agents have taken.
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

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by caller number or summary..."
          className="pl-9 h-11 bg-white border-neutral-200"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <FilterChip
          label="Outcome"
          value={outcomeFilter}
          onClear={() => setOutcomeFilter("all")}
          options={[
            { value: "all", label: "All outcomes" },
            { value: "booked", label: "Booked" },
            { value: "resolved", label: "Resolved" },
            { value: "escalated", label: "Escalated" },
            { value: "voicemail", label: "Voicemail" },
            { value: "missed", label: "Missed" },
            { value: "abandoned", label: "Abandoned" },
          ]}
          onSelect={(v) => {
            setOutcomeFilter(v as "all" | NonNullable<Outcome>);
            setPage(1);
          }}
        />
        <FilterChip
          label="Sentiment"
          value={sentimentFilter}
          onClear={() => setSentimentFilter("all")}
          options={[
            { value: "all", label: "All sentiment" },
            { value: "positive", label: "Positive" },
            { value: "neutral", label: "Neutral" },
            { value: "negative", label: "Negative" },
          ]}
          onSelect={(v) => {
            setSentimentFilter(v as "all" | NonNullable<Sentiment>);
            setPage(1);
          }}
        />
        <div className="ml-auto text-[12px] text-neutral-500 tabular-nums">
          {filtered.length} call{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <div className="col-span-3">Caller</div>
          <SortHeader className="col-span-3" label="Started" active={sortKey === "started_at"} dir={sortDir} onClick={() => onSort("started_at")} />
          <SortHeader className="col-span-2 justify-end text-right" label="Duration" active={sortKey === "duration_seconds"} dir={sortDir} onClick={() => onSort("duration_seconds")} />
          <div className="col-span-2">Outcome</div>
          <div className="col-span-2 text-right">Mood</div>
        </div>

        {!loaded ? (
          <div className="p-12 text-center text-sm text-neutral-500">Loading calls...</div>
        ) : pageRows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold tracking-tight">
              {calls.length === 0 ? "No calls yet" : "No matching calls"}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {calls.length === 0
                ? "Once an agent answers its first call, it will appear here."
                : "Try changing the filters or clearing the search."}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {pageRows.map((c) => {
              const num = (c.direction === "inbound" ? c.from_e164 : c.to_e164) ?? "Unknown";
              const dur = c.duration_seconds ?? 0;
              return (
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
                      {c.direction === "inbound" ? <PhoneIncoming className="size-3.5" /> : <PhoneOutgoing className="size-3.5" />}
                    </span>
                    <p className="text-sm font-semibold tracking-tight truncate tabular-nums">{num}</p>
                  </div>
                  <div className="col-span-3 text-[12px] text-neutral-600 tabular-nums">
                    {c.started_at
                      ? new Date(c.started_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </div>
                  <div className="col-span-2 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
                    {Math.floor(dur / 60)}:{(dur % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="col-span-2">
                    <OutcomePill outcome={c.outcome} />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <SentimentBadge sentiment={c.sentiment} />
                    <ChevronRight className="size-3.5 text-neutral-400" />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[12px] text-neutral-600">
          <p>
            Page <span className="font-semibold">{safePage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span> ·{" "}
            <span className="tabular-nums">{filtered.length}</span> calls
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="size-8 rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 disabled:opacity-30 flex items-center justify-center" aria-label="Previous page">
              <ChevronLeft className="size-3.5" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="size-8 rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 disabled:opacity-30 flex items-center justify-center" aria-label="Next page">
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <Sheet open={!!drawerCall} onOpenChange={(o) => !o && setDrawerId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          {drawerCall && <CallDrawer call={drawerCall} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SortHeader({
  label,
  className,
  active,
  dir,
  onClick,
}: {
  label: string;
  className?: string;
  active: boolean;
  dir?: SortDir;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-1 hover:text-neutral-900 transition-colors", className)}>
      {label}
      {active && (dir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
    </button>
  );
}

function OutcomePill({ outcome }: { outcome: Outcome }) {
  if (outcome === "booked" || outcome === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
        <CheckCircle2 className="size-3" />
        {outcome === "booked" ? "Booked" : "Resolved"}
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
  if (outcome === "missed" || outcome === "abandoned" || outcome === "voicemail") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium">
        <PhoneMissed className="size-3" />
        {outcome[0].toUpperCase() + outcome.slice(1)}
      </span>
    );
  }
  return <span className="text-[10px] text-neutral-500 font-medium">—</span>;
}

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  if (sentiment === "positive") return <Smile className="size-3.5 text-emerald-600" />;
  if (sentiment === "negative") return <Frown className="size-3.5 text-rose-600" />;
  return <Meh className="size-3.5 text-neutral-500" />;
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
          active ? "bg-neutral-950 text-white border-neutral-950" : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
        )}
      >
        {active ? null : <Plus className="size-3" />}
        <span>{label}{active ? `: ${activeLabel}` : ""}</span>
        {active && (
          <span onClick={(e) => { e.stopPropagation(); onClear(); }} className="ml-0.5 hover:bg-white/15 rounded-full p-0.5">
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
                onClick={() => { onSelect(opt.value); setOpen(false); }}
                className={cn("w-full text-left px-3 py-1.5 text-[12px] hover:bg-neutral-50 transition-colors", value === opt.value && "font-semibold")}
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

function CallDrawer({ call }: { call: CallRow }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loadingTurns, setLoadingTurns] = useState(true);
  const num = (call.direction === "inbound" ? call.from_e164 : call.to_e164) ?? "Unknown";
  const dur = call.duration_seconds ?? 0;

  useEffect(() => {
    (async () => {
      setLoadingTurns(true);
      const { data } = await supabase
        .from("call_turns")
        .select("role, content")
        .eq("call_id", call.id)
        .order("ms_offset", { ascending: true });
      setTurns((data as Turn[]) ?? []);
      setLoadingTurns(false);
    })();
  }, [call.id]);

  return (
    <>
      <SheetHeader className="px-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="size-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
            {call.direction === "inbound" ? <PhoneIncoming className="size-4" /> : <PhoneOutgoing className="size-4" />}
          </span>
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base tabular-nums">{num}</SheetTitle>
            <SheetDescription className="text-xs">
              {call.started_at ? new Date(call.started_at).toLocaleString() : "—"} · {Math.floor(dur / 60)}m {dur % 60}s
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <Stat label="Direction" value={call.direction === "inbound" ? "Inbound" : "Outbound"} />
        <Stat label="Status" value={call.status} />
        <Stat label="Outcome" value={<OutcomePill outcome={call.outcome} />} />
        <Stat label="Sentiment" value={<span className="inline-flex items-center gap-1.5"><SentimentBadge sentiment={call.sentiment} /><span className="text-[12px] capitalize">{call.sentiment ?? "—"}</span></span>} />
        <Stat label="Duration" value={`${Math.floor(dur / 60)}:${(dur % 60).toString().padStart(2, "0")}`} />
        <Stat label="Recording" value={call.recording_url ? <a href={call.recording_url} target="_blank" rel="noreferrer" className="text-[12px] underline">Open</a> : "—"} />
      </div>

      {call.summary && (
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">Summary</p>
          <p className="text-[13px] text-neutral-700 leading-relaxed rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2.5">
            {call.summary}
          </p>
        </div>
      )}

      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">Transcript</p>
        {loadingTurns ? (
          <p className="text-[12px] text-neutral-500">Loading transcript...</p>
        ) : turns.length === 0 ? (
          <p className="text-[12px] text-neutral-500">No transcript was captured for this call.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {turns.map((seg, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg px-3 py-2 text-[12px] leading-snug",
                  seg.role === "assistant" ? "bg-neutral-100 text-neutral-800" : seg.role === "user" ? "bg-neutral-950 text-white" : "bg-amber-50 text-amber-800 border border-amber-200"
                )}
              >
                <div className={cn("text-[9px] uppercase tracking-widest font-semibold mb-0.5", seg.role === "assistant" ? "text-neutral-500" : seg.role === "user" ? "text-white/60" : "text-amber-600")}>
                  {seg.role === "assistant" ? "Agent" : seg.role === "user" ? "Caller" : seg.role}
                </div>
                {seg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {call.recording_url && (
        <a
          href={call.recording_url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 h-9 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Download className="size-3.5" />
          Open recording
        </a>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-0.5">{label}</p>
      <div className="text-[13px] font-semibold tracking-tight capitalize">{value}</div>
    </div>
  );
}
