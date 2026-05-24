// UnifiedFeedMockup — live channel feed where conversations from voice,
// WhatsApp, web chat, and mobile stream into a single unified inbox.
// New rows slide in every ~3.2s, push older rows down, oldest fades out.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare, Globe2, Smartphone } from "lucide-react";

type Channel = "voice" | "whatsapp" | "web" | "mobile";
type Status = "live" | "replying" | "resolved";

type Entry = {
  id: string;
  channel: Channel;
  from: string;
  preview: string;
  meta: string;
  status: Status;
};

const CHANNEL_META: Record<Channel, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  voice: { icon: Phone, label: "Voice" },
  whatsapp: { icon: MessageSquare, label: "WhatsApp" },
  web: { icon: Globe2, label: "Web" },
  mobile: { icon: Smartphone, label: "Mobile" },
};

// Initial seeded feed (newest at top)
const SEED: Entry[] = [
  { id: "s1", channel: "voice", from: "+92 312 456 7890", preview: "Ek peri peri pizza medium aur cheesy fries", meta: "00:23 · streaming", status: "live" },
  { id: "s2", channel: "whatsapp", from: "+92 333 123 4567", preview: "Hi! Any deals on the cheese lava burger tonight?", meta: "agent replying", status: "replying" },
  { id: "s3", channel: "web", from: "anon · 9k2f3a", preview: "What are your delivery hours?", meta: "resolved · 8s ago", status: "resolved" },
  { id: "s4", channel: "mobile", from: "user_8821", preview: "Track order CH-7821 please", meta: "resolved · 2m ago", status: "resolved" },
];

// Rotation pool — new entries appear at top
const POOL: Omit<Entry, "id">[] = [
  { channel: "voice", from: "+92 321 555 1212", preview: "Buffalo wings 8pc, garlic dip extra", meta: "00:08 · streaming", status: "live" },
  { channel: "whatsapp", from: "+92 304 887 6655", preview: "Aaj raat ki delivery available hai?", meta: "agent replying", status: "replying" },
  { channel: "voice", from: "+92 345 222 1010", preview: "Cheese lava burger, no jalapenos please", meta: "00:14 · streaming", status: "live" },
  { channel: "web", from: "anon · 4m1xkz", preview: "How do I cancel an order?", meta: "agent replying", status: "replying" },
  { channel: "mobile", from: "user_3344", preview: "Brownie was 10/10, will order again", meta: "resolved · just now", status: "resolved" },
  { channel: "whatsapp", from: "+92 300 444 9999", preview: "Shukria, order received bilkul time pe!", meta: "resolved · just now", status: "resolved" },
  { channel: "voice", from: "+92 333 010 2030", preview: "Cheesy fries available hai aaj?", meta: "00:05 · streaming", status: "live" },
  { channel: "web", from: "anon · ph88x2", preview: "Any deals on shakes this week?", meta: "agent replying", status: "replying" },
];

export function UnifiedFeedMockup() {
  const [entries, setEntries] = useState<Entry[]>(SEED);
  const [poolIdx, setPoolIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      const seed = POOL[poolIdx % POOL.length];
      const id = `e${Date.now()}`;
      setEntries((prev) => {
        const next: Entry[] = [{ id, ...seed }, ...prev];
        if (next.length > 5) next.pop();
        return next;
      });
      setPoolIdx((i) => i + 1);
    }, 3000);
    return () => clearInterval(t);
  }, [poolIdx]);

  const liveCount = entries.filter((e) => e.status === "live").length;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 border border-neutral-200/80 shadow-2xl shadow-neutral-900/10 aspect-[4/5]">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Inner panel */}
      <div className="relative h-full p-4">
        <div className="h-full rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Inbox · all channels</p>
              <p className="text-sm font-bold tracking-tight">Cheezious</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-neutral-950 text-white text-[10px] font-semibold">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="size-1.5 rounded-full bg-emerald-300"
              />
              <span className="tabular-nums">{liveCount}</span> live
            </div>
          </div>

          {/* Feed list */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {entries.map((e, i) => {
                const { icon: Icon, label } = CHANNEL_META[e.channel];
                const isTop = i === 0;
                return (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: -28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.2, 0.65, 0.3, 0.9],
                      opacity: { duration: 0.3 },
                    }}
                    className={`border-b border-neutral-100 last:border-0 px-4 py-2.5 ${isTop ? "bg-neutral-50/60" : "bg-white"}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="size-7 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="size-3.5 text-neutral-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[11px] font-semibold tracking-tight">
                            <span className="text-neutral-500 font-normal">{label}</span>
                            <span className="text-neutral-400 mx-1.5">·</span>
                            <span>{e.from}</span>
                          </p>
                          <StatusPill status={e.status} />
                        </div>
                        <p className="text-[12px] text-neutral-700 truncate mt-0.5">{e.preview}</p>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{e.meta}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer summary */}
          <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
            <span>One agent · {Object.values(CHANNEL_META).map((c) => c.label).join(" · ")}</span>
            <span className="font-mono">752ms avg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-neutral-900 font-semibold">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="size-1 rounded-full bg-neutral-900"
        />
        Live
      </span>
    );
  }
  if (status === "replying") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-neutral-700 font-semibold">
        <span className="size-1 rounded-full bg-neutral-600" />
        Replying
      </span>
    );
  }
  return (
    <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
      Done
    </span>
  );
}
