// WhatsApp Business — connection status + template library + recent threads.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  Plus,
  CheckCircle2,
  Loader2,
  Trash2,
  Send,
  X,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type WaTemplate = {
  id: string;
  name: string;
  language: "ur" | "en";
  category: "Marketing" | "Utility" | "Authentication";
  status: "approved" | "pending" | "rejected";
  body: string;
};

const SEED_TEMPLATES: WaTemplate[] = [
  {
    id: "tpl_order_confirm",
    name: "order_confirmation",
    language: "ur",
    category: "Utility",
    status: "approved",
    body:
      "Assalam alaikum {{1}}! Aap ka order {{2}} confirm ho gaya hai. Total Rs. {{3}}. Tax ETA {{4}} minutes. Shukria, Cheezious team.",
  },
  {
    id: "tpl_rider_otw",
    name: "rider_on_the_way",
    language: "ur",
    category: "Utility",
    status: "approved",
    body:
      "Aap ka rider {{1}} aap ke address ke 5 minute door hai. Bell se pehle call karega. Shukria!",
  },
  {
    id: "tpl_review_request",
    name: "review_request",
    language: "en",
    category: "Marketing",
    status: "approved",
    body:
      "Hi {{1}}, thanks for ordering from Cheezious. Could you spare 10 seconds for a quick review? {{2}}",
  },
  {
    id: "tpl_promo_friday",
    name: "promo_friday_deal",
    language: "en",
    category: "Marketing",
    status: "pending",
    body:
      "Friday is on us, {{1}}. 20% off any large pizza when you order before 7 PM. Use code FRIDAY20.",
  },
  {
    id: "tpl_otp",
    name: "verification_otp",
    language: "en",
    category: "Authentication",
    status: "approved",
    body: "Your Cheezious verification code is {{1}}. It expires in 5 minutes.",
  },
];

type Thread = {
  id: string;
  from: string;
  channel: "voice" | "whatsapp";
  preview: string;
  meta: string;
  lang: "ur" | "en";
};

const RECENT_THREADS: Thread[] = [
  { id: "t1", from: "+92 312 4567890", channel: "whatsapp", preview: "Bhai aaj ka deal kya hai?",     meta: "now",     lang: "ur" },
  { id: "t2", from: "+92 333 7821145", channel: "voice",    preview: "Order JJ-7714 ki delivery?",     meta: "3m ago",  lang: "ur" },
  { id: "t3", from: "+92 300 1234567", channel: "whatsapp", preview: "Vegetarian options please.",      meta: "12m ago", lang: "en" },
  { id: "t4", from: "+92 345 9988772", channel: "whatsapp", preview: "Refund status?",                  meta: "1h ago",  lang: "en" },
];

export default function WhatsAppPage() {
  const [templates, setTemplates] = useState<WaTemplate[]>(SEED_TEMPLATES);
  const [addOpen, setAddOpen] = useState(false);
  const [connected, setConnected] = useState(true);

  const stats = useMemo(() => {
    return {
      approved: templates.filter((t) => t.status === "approved").length,
      pending: templates.filter((t) => t.status === "pending").length,
      total: templates.length,
    };
  }, [templates]);

  const removeTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast("Template removed");
  };

  const addTemplate = (t: Omit<WaTemplate, "id" | "status">) => {
    setTemplates((prev) => [
      {
        ...t,
        id: `tpl_${Date.now()}`,
        status: "pending",
      },
      ...prev,
    ]);
    toast("Template submitted", {
      description: "Meta will review and approve within 24 hours.",
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">WhatsApp</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Let your agent handle WhatsApp messages with the same brain that takes your calls.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus className="size-3.5" />
          New template
        </button>
      </div>

      {/* Connection status card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 mb-5 flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
          <MessageCircle className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-tight">
            Cheezious (verified business)
          </p>
          <div className="flex items-center gap-2 mt-1 text-[12px] text-neutral-600">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>+92 21 111 24 33 49 · WABA ID 1284402194</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Status
            </p>
            <p className="text-sm font-semibold inline-flex items-center gap-1.5">
              {connected ? (
                <>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </>
              ) : (
                <>
                  <span className="size-1.5 rounded-full bg-neutral-400" />
                  Disconnected
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              setConnected((v) => !v);
              toast(connected ? "Disconnected from WhatsApp" : "Reconnected to WhatsApp");
            }}
            className={cn(
              "h-9 px-3 rounded-full text-[12px] font-medium border transition-colors",
              connected
                ? "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300"
                : "bg-neutral-950 text-white border-neutral-950"
            )}
          >
            {connected ? "Disconnect" : "Reconnect"}
          </button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryTile label="Approved templates" value={stats.approved.toString()} sub={`${stats.total} total`} />
        <SummaryTile label="Pending review" value={stats.pending.toString()} sub="usually under 24h" />
        <SummaryTile label="Threads today" value="328" sub="across voice + WhatsApp" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Templates list */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
              Templates
            </p>
            <p className="text-[11px] text-neutral-500 tabular-nums">{templates.length}</p>
          </div>
          {templates.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-neutral-500">No templates yet.</p>
          ) : (
            <AnimatePresence initial={false}>
              {templates.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 py-3 border-b border-neutral-100 last:border-b-0 group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold tracking-tight font-mono">{t.name}</p>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                      {t.language}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                      {t.category}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium">
                      {t.status === "approved" && (
                        <>
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          <span className="text-emerald-700">Approved</span>
                        </>
                      )}
                      {t.status === "pending" && (
                        <>
                          <Loader2 className="size-3 animate-spin text-amber-600" />
                          <span className="text-amber-700">Pending</span>
                        </>
                      )}
                      {t.status === "rejected" && (
                        <>
                          <X className="size-3 text-rose-600" />
                          <span className="text-rose-700">Rejected</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[12px] text-neutral-700 leading-snug">
                    {t.body}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() =>
                        toast("Test message sent", {
                          description: "Check WhatsApp on your verified number.",
                        })
                      }
                      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-white border border-neutral-200 text-[11px] font-medium hover:border-neutral-300 transition-colors"
                    >
                      <Send className="size-3" />
                      Send test
                    </button>
                    <button
                      onClick={() => removeTemplate(t.id)}
                      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-white border border-neutral-200 text-[11px] font-medium hover:border-rose-300 hover:text-rose-700 transition-colors"
                    >
                      <Trash2 className="size-3" />
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Recent threads */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden h-fit">
          <div className="px-4 py-2.5 border-b border-neutral-200">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
              Recent threads
            </p>
          </div>
          {RECENT_THREADS.map((t) => (
            <div
              key={t.id}
              className="px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="size-1.5 rounded-full bg-neutral-300" />
                <p className="text-[11px] font-mono tabular-nums">{t.from}</p>
                <span className="ml-auto text-[10px] text-neutral-400">{t.meta}</span>
              </div>
              <p className="text-[12px] text-neutral-700 line-clamp-2 leading-snug">{t.preview}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wider">
                {t.channel} · {t.lang}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AddTemplateDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addTemplate}
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

function AddTemplateDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (t: Omit<WaTemplate, "id" | "status">) => void;
}) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState<"ur" | "en">("ur");
  const [category, setCategory] = useState<WaTemplate["category"]>("Utility");
  const [body, setBody] = useState("");

  const reset = () => {
    setName("");
    setLang("ur");
    setCategory("Utility");
    setBody("");
  };

  const submit = () => {
    if (!name.trim() || !body.trim()) return;
    onAdd({ name, language: lang, category, body });
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <MessageCircle className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>New WhatsApp template</DialogTitle>
        </div>
        <DialogDescription>
          Templates are reviewed by Meta. Use {"{{1}}, {{2}}"} for variables.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="t-name" className="text-xs">Name (snake_case)</Label>
            <Input
              id="t-name"
              placeholder="order_confirmation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-mono"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Language</Label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "ur" | "en")}
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm"
              >
                <option value="ur">Urdu</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WaTemplate["category"])}
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm"
              >
                <option>Utility</option>
                <option>Marketing</option>
                <option>Authentication</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-body" className="text-xs">Message body</Label>
            <Textarea
              id="t-body"
              placeholder="Assalam alaikum {{1}}! Aap ka order {{2}} confirm ho gaya..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
            <p className="text-[10px] text-neutral-500">
              Variables: {body.match(/\{\{\d+\}\}/g)?.length ?? 0}
            </p>
          </div>
        </div>

        <div className="-mx-4 -mb-4 mt-3 flex items-center justify-end gap-2 px-4 py-3 bg-neutral-50/60 border-t border-neutral-100 rounded-b-xl">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="h-8 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || !body.trim()}
            className={cn(
              "h-8 px-4 rounded-full text-sm font-medium transition-colors",
              !name.trim() || !body.trim()
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            )}
          >
            Submit for review
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
