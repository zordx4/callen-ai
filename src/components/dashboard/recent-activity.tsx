// Recent calls feed — last 6 calls with intent + outcome chips.

"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { PhoneIncoming, ArrowRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { calls } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const outcomeIcon = {
  resolved: CheckCircle2,
  escalated: AlertCircle,
  abandoned: XCircle,
};

const outcomeColor = {
  resolved: "text-emerald-600",
  escalated: "text-amber-600",
  abandoned: "text-rose-600",
};

function formatIntent(intent: string) {
  return intent.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export function RecentActivity() {
  const recentCalls = calls.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl bg-card border border-border/60 p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight mb-1">Recent calls</h3>
          <p className="text-xs text-muted-foreground">Live feed · auto-updates</p>
        </div>
        <Link
          href="/calls"
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </div>

      <ul className="space-y-1">
        {recentCalls.map((call, i) => {
          const Icon = outcomeIcon[call.outcome];
          return (
            <motion.li
              key={call.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.4 + i * 0.04 }}
            >
              <Link
                href={`/calls`}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-foreground/5 transition-colors group"
              >
                <div className="size-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <PhoneIncoming className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{call.callerNumber}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                    <span className="font-mono uppercase">{call.language}</span>
                    <span>·</span>
                    <span>{formatIntent(call.intent)}</span>
                    <span>·</span>
                    <span>{call.durationSec}s</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Icon className={cn("size-4 ml-auto", outcomeColor[call.outcome])} />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(call.startedAt), { addSuffix: false })}
                  </p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
