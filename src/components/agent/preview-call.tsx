// Preview Call UI for the Agent Studio.
// The orb itself is now the shared SiriOrb component from
// /components/ui — this file just drives the call state (idle /
// connecting / connected / ending), the speaker label, and wires
// the per-template palette into the orb.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiriOrb } from "@/components/ui/siri-orb";

type Status = "idle" | "connecting" | "connected" | "ending";
type Speaker = "agent" | "caller" | "silence";

// Mixed turn lengths + short silences so the status pill reads as a
// real two-party conversation rather than a constant agent monologue.
const TURN_SEQUENCE: Array<{ speaker: Speaker; duration: number }> = [
  { speaker: "agent",   duration: 3400 },
  { speaker: "silence", duration: 380  },
  { speaker: "caller",  duration: 2200 },
  { speaker: "silence", duration: 520  },
  { speaker: "agent",   duration: 2800 },
  { speaker: "silence", duration: 340  },
  { speaker: "caller",  duration: 1900 },
  { speaker: "silence", duration: 620  },
  { speaker: "agent",   duration: 4100 },
  { speaker: "silence", duration: 460  },
  { speaker: "caller",  duration: 2600 },
  { speaker: "silence", duration: 700  },
];

const DEFAULT_COLORS = ["#a3a3a3", "#737373", "#404040"];

export function PreviewCall({
  agentName,
  colors = DEFAULT_COLORS,
}: {
  agentName: string;
  colors?: string[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speaker, setSpeaker] = useState<Speaker>("silence");

  // Elapsed counter while connected
  useEffect(() => {
    if (status !== "connected") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Status transitions
  useEffect(() => {
    if (status === "connecting") {
      const id = setTimeout(() => setStatus("connected"), 1200);
      return () => clearTimeout(id);
    }
    if (status === "ending") {
      const id = setTimeout(() => {
        setStatus("idle");
        setElapsed(0);
      }, 700);
      return () => clearTimeout(id);
    }
  }, [status]);

  // Turn-taking simulation drives the status pill label
  useEffect(() => {
    if (status !== "connected") {
      setSpeaker("silence");
      return;
    }
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idx = 0;
    const tick = () => {
      if (cancelled) return;
      const step = TURN_SEQUENCE[idx % TURN_SEQUENCE.length];
      const effective: Speaker =
        muted && step.speaker === "caller" ? "silence" : step.speaker;
      setSpeaker(effective);
      timeoutId = setTimeout(tick, step.duration);
      idx++;
    };
    tick();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [status, muted]);

  const onPhone = () => {
    if (status === "idle") setStatus("connecting");
    else if (status === "connected") setStatus("ending");
  };

  const isActive = status === "connected" || status === "connecting";
  const isSpeaking = status === "connected" && speaker !== "silence";

  // Map call state to orb rotation speed. Faster spin = more "alive".
  const animationDuration = isSpeaking
    ? 8
    : status === "connected"
      ? 14
      : status === "connecting" ? 9 : 20;

  // Map the template's previewColors array onto SiriOrb's c1/c2/c3.
  const orbColors = {
    c1: colors[0],
    c2: colors[1] ?? colors[0],
    c3: colors[2] ?? colors[1] ?? colors[0],
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-10">
      {/* Status pill */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border",
              status === "idle" && "bg-white text-neutral-600 border-neutral-200",
              status === "connecting" && "bg-white text-neutral-700 border-neutral-300",
              status === "connected" && "bg-neutral-950 text-white border-neutral-950",
              status === "ending" && "bg-white text-neutral-600 border-neutral-200"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "idle" && "bg-neutral-400",
                status === "connecting" && "bg-neutral-500 animate-pulse",
                status === "connected" && "bg-white animate-pulse",
                status === "ending" && "bg-neutral-400"
              )}
            />
            {status === "idle" && "Ready to call"}
            {status === "connecting" && "Connecting"}
            {status === "connected" && (
              <>
                {speaker === "agent" && (
                  <><span className="font-semibold">{agentName}</span> speaking</>
                )}
                {speaker === "caller" && (muted ? "Muted" : "You're speaking")}
                {speaker === "silence" && "Listening"}
                <span className="ml-1 font-mono opacity-80">
                  {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
                </span>
              </>
            )}
            {status === "ending" && "Ending call"}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Orb */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-10">
        <motion.div
          animate={{ scale: isActive ? [1, 1.02, 1] : [1, 1.01, 1] }}
          transition={{
            duration: isSpeaking ? 2.4 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <SiriOrb
            size="280px"
            colors={orbColors}
            animationDuration={animationDuration}
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* Phone button at the bottom of the sphere */}
        <button
          onClick={onPhone}
          aria-label={status === "connected" ? "End call" : "Start call"}
          className="absolute bottom-[18px] left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-4 border-white z-20 bg-neutral-950 hover:bg-neutral-800 text-white"
        >
          {status === "connected" ? (
            <PhoneOff className="size-4" />
          ) : (
            <Phone className="size-4" />
          )}
        </button>
      </div>

      {/* Settings + Mute pill */}
      <div className="inline-flex items-center gap-1.5 px-1.5 py-1.5 rounded-full bg-white border border-neutral-200 shadow-sm">
        <button
          className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors"
          aria-label="Settings"
        >
          <Settings className="size-3.5" />
        </button>
        <button
          onClick={() => setMuted((v) => !v)}
          className={cn(
            "h-8 px-3 rounded-full flex items-center gap-1.5 text-[12px] font-medium transition-colors",
            muted
              ? "bg-neutral-950 text-white"
              : "text-neutral-800 hover:bg-neutral-100"
          )}
          aria-pressed={muted}
        >
          {muted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>

      {/* Hint */}
      {status === "idle" && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-neutral-400 text-center">
          Tap the phone icon to talk to the agent.
        </p>
      )}
    </div>
  );
}
