// Preview Call UI for the Agent Studio.
// A monochrome motion-animated sphere that represents the agent's voice
// state. Tap the phone button to "connect" — the sphere accelerates and a
// fake conversation status appears.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "connecting" | "connected" | "ending";

export function PreviewCall({ agentName }: { agentName: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Tick the elapsed counter while connected.
  useEffect(() => {
    if (status !== "connected") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // State transitions.
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

  const onPhone = () => {
    if (status === "idle") setStatus("connecting");
    else if (status === "connected") setStatus("ending");
  };

  // Rotation speed depends on status.
  const rotateDuration =
    status === "connected" ? 6 : status === "connecting" ? 1.4 : 14;
  const sphereScale = status === "connected" ? 1 : status === "connecting" ? 0.94 : 0.9;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-10">
      {/* Status pill */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2">
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
                status === "connecting" && "bg-amber-500 animate-pulse",
                status === "connected" && "bg-emerald-400 animate-pulse",
                status === "ending" && "bg-neutral-400"
              )}
            />
            {status === "idle" && "Ready to call"}
            {status === "connecting" && "Connecting"}
            {status === "connected" && (
              <>
                Talking to <span className="font-semibold">{agentName}</span>
                <span className="ml-1 font-mono opacity-80">
                  {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
                </span>
              </>
            )}
            {status === "ending" && "Ending call"}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sphere */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-10">
        {/* Soft outer halo */}
        <motion.div
          className="absolute inset-[-30px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 70%)",
          }}
          animate={{
            scale: status === "connected" ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: status === "connected" ? Infinity : 0,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />

        {/* Rotating conic-gradient sphere */}
        <motion.div
          className="relative size-[240px] rounded-full overflow-hidden"
          animate={{
            rotate: 360,
            scale: sphereScale,
          }}
          transition={{
            rotate: {
              duration: rotateDuration,
              repeat: Infinity,
              ease: "linear",
            },
            scale: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
          }}
          style={{
            background:
              "conic-gradient(from 0deg, #0a0a0a 0deg, #525252 40deg, #1a1a1a 90deg, #737373 140deg, #0a0a0a 200deg, #404040 260deg, #0a0a0a 320deg, #525252 360deg)",
          }}
        >
          {/* Inner light spot for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 45%)",
            }}
          />
          {/* Outer vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </motion.div>

        {/* Phone button overlapping the bottom of the sphere */}
        <button
          onClick={onPhone}
          aria-label={status === "connected" ? "End call" : "Start call"}
          className={cn(
            "absolute bottom-[-4px] left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-4 border-white",
            status === "connected"
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-neutral-950 hover:bg-neutral-800 text-white"
          )}
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
