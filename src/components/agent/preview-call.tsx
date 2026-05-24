// Preview Call UI for the Agent Studio.
// A monochrome motion-animated sphere with layered motion that feels alive:
// counter-rotating conic gradients, a morphing inner blob, a drifting highlight,
// noise texture, and emanating wave rings while connected.

"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "connecting" | "connected" | "ending";

export function PreviewCall({ agentName }: { agentName: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const noiseId = useId();

  useEffect(() => {
    if (status !== "connected") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

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

  // Animation tempos shift with status. Faster when connected = "alive".
  const cwDuration = status === "connected" ? 7  : status === "connecting" ? 2  : 18;
  const ccwDuration = status === "connected" ? 11 : status === "connecting" ? 3  : 22;
  const blobDuration = status === "connected" ? 5  : status === "connecting" ? 2.4 : 9;
  const breath = status === "connected" ? 3.2 : 6;
  const isActive = status === "connected" || status === "connecting";

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

      {/* Sphere stack */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-10">
        {/* Emanating wave rings — only when connected */}
        {status === "connected" && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-neutral-900/15"
                style={{ width: 240, height: 240 }}
                animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.86,
                }}
              />
            ))}
          </>
        )}

        {/* Soft outer halo */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320,
            height: 320,
            background:
              "radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0) 70%)",
          }}
          animate={{ scale: isActive ? [1, 1.08, 1] : [1, 1.03, 1] }}
          transition={{
            duration: breath,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />

        {/* Sphere container — clips all the inner layers into a circle */}
        <motion.div
          className="relative size-[240px] rounded-full overflow-hidden bg-neutral-950"
          animate={{ scale: isActive ? [1, 1.03, 1] : [1, 1.015, 1] }}
          transition={{ duration: breath, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Layer A — base conic gradient, rotates clockwise */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 0deg, #0a0a0a 0deg, #525252 60deg, #1a1a1a 110deg, #737373 170deg, #0a0a0a 220deg, #404040 290deg, #0a0a0a 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: cwDuration, repeat: Infinity, ease: "linear" }}
          />

          {/* Layer B — counter-rotating conic, smaller and softer */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "8%",
              background:
                "conic-gradient(from 90deg, rgba(255,255,255,0.0) 0deg, rgba(255,255,255,0.18) 80deg, rgba(255,255,255,0.0) 160deg, rgba(255,255,255,0.12) 240deg, rgba(255,255,255,0.0) 360deg)",
              mixBlendMode: "screen",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: ccwDuration, repeat: Infinity, ease: "linear" }}
          />

          {/* Layer C — morphing inner blob that drifts */}
          <motion.div
            className="absolute"
            style={{
              top: "18%",
              left: "18%",
              width: "64%",
              height: "64%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 70%)",
              mixBlendMode: "screen",
              filter: "blur(6px)",
            }}
            animate={{
              borderRadius: [
                "60% 40% 55% 45% / 55% 45% 55% 45%",
                "40% 60% 45% 55% / 45% 55% 45% 55%",
                "55% 45% 60% 40% / 60% 40% 55% 45%",
                "50% 50% 50% 50% / 50% 50% 50% 50%",
                "60% 40% 55% 45% / 55% 45% 55% 45%",
              ],
              x: [-6, 8, -4, 6, -6],
              y: [4, -6, 8, -4, 4],
            }}
            transition={{
              duration: blobDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Layer D — drifting bright highlight */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "45%",
              height: "45%",
              top: "10%",
              left: "20%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 70%)",
              filter: "blur(8px)",
              mixBlendMode: "screen",
            }}
            animate={{
              x: [-10, 16, -4, 10, -10],
              y: [-6, 6, 12, -8, -6],
              opacity: isActive ? [0.7, 1, 0.85, 0.95, 0.7] : [0.5, 0.7, 0.55, 0.65, 0.5],
            }}
            transition={{
              duration: blobDuration * 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Layer E — noise texture */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none mix-blend-overlay"
            aria-hidden="true"
          >
            <filter id={noiseId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
          </svg>

          {/* Layer F — outer vignette for spherical depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </motion.div>

        {/* Phone button overlapping the bottom of the sphere */}
        <button
          onClick={onPhone}
          aria-label={status === "connected" ? "End call" : "Start call"}
          className={cn(
            "absolute bottom-[14px] left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-4 border-white z-20",
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
