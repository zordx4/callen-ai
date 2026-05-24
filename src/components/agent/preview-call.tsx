// Preview Call UI for the Agent Studio.
// Soft watercolor orb modelled on the ElevenLabs Conversational AI sphere:
// heavily blurred colour blobs that drift very slowly, a single soft
// specular highlight at the upper-left, a strong grain texture, and an
// asymmetric vignette that gives the orb a clear 3D ball feel.
// No rotating ribbons, no perimeter bars, no liquid distortion — the
// motion is the colour flow, nothing else.

"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "connecting" | "connected" | "ending";
type Speaker = "agent" | "caller" | "silence";

// Conversation cadence used when a call is connected. Drives the status
// pill label so the orb reads as a live two-party conversation.
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

const DEFAULT_COLORS = ["#a3a3a3", "#737373", "#404040", "#0a0a0a"];

// Each blob centres slightly off-frame so its soft edge always reaches
// well into the sphere as it drifts. Larger overlap = no visible seams.
const BLOB_ANCHORS: Array<{ top: string; left: string }> = [
  { top: "-25%", left: "-25%" },  // upper-left
  { top: "-25%", left: "35%"  },  // upper-right
  { top: "35%",  left: "35%"  },  // lower-right
  { top: "35%",  left: "-25%" },  // lower-left
  { top: "5%",   left: "5%"   },  // centre (5th colour if present)
];

// Very slow organic drift paths. Amplitudes (~20-30px) are intentionally
// modest and durations are long so the motion reads as a slowly stirred
// watercolour rather than animation.
const DRIFT_PATHS: Array<{ x: number[]; y: number[] }> = [
  { x: [0, 30, 0, -25, 0],  y: [-20, 6, 28, 0, -20] },
  { x: [0, -22, 6, 28, 0],  y: [22, -6, -25, 0, 22] },
  { x: [0, 20, -15, -22, 14, 0], y: [-14, 22, 6, -20, 10, -14] },
  { x: [0, -20, 0, 22, 0],  y: [16, 0, -22, 0, 16] },
  { x: [0, 8, -6, 5, 0],    y: [0, -5, 8, -4, 0] },
];

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
  const noiseId = useId();

  // Elapsed timer while connected
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

  // Long, viscous durations. Speaking slightly speeds things up, but
  // still slow enough that the orb stays calm.
  const blobBase = isSpeaking
    ? 12
    : status === "connected"
      ? 18
      : status === "connecting" ? 10 : 22;

  const breath = isSpeaking ? 3.2 : isActive ? 4.5 : 6;

  const highlightDrift = isSpeaking ? 10 : isActive ? 14 : 18;

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

      {/* Sphere stack */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-10">
        {/* Soft outer halo — barely visible ambient glow that breathes */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 360,
            height: 360,
            background: `radial-gradient(circle, ${colors[0]}24 0%, ${colors[0]}0a 38%, transparent 72%)`,
          }}
          animate={{ scale: isActive ? [1, 1.04, 1] : [1, 1.02, 1] }}
          transition={{ duration: breath, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        {/* The orb */}
        <motion.div
          className="relative size-[280px] rounded-full overflow-hidden shadow-lg shadow-neutral-900/10"
          style={{ background: colors[colors.length - 1] }}
          animate={{ scale: isActive ? [1, 1.014, 1] : [1, 1.008, 1] }}
          transition={{ duration: breath, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Heavily-blurred drifting colour blobs. The whole motion of the
              orb lives here. */}
          {colors.map((color, i) => {
            const anchor = BLOB_ANCHORS[i % BLOB_ANCHORS.length];
            const drift = DRIFT_PATHS[i % DRIFT_PATHS.length];
            const duration = blobBase + i * 3.5;
            return (
              <motion.div
                key={`${color}-${i}`}
                className="absolute pointer-events-none"
                style={{
                  top: anchor.top,
                  left: anchor.left,
                  width: "150%",
                  height: "150%",
                  background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}e0 22%, ${color}99 44%, ${color}3a 64%, transparent 80%)`,
                  filter: "blur(38px)",
                  mixBlendMode: "screen",
                  willChange: "transform",
                }}
                animate={{ x: drift.x, y: drift.y }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.6,
                }}
                aria-hidden="true"
              />
            );
          })}

          {/* Specular highlight — soft white kicker at the upper-left that
              drifts subtly. This is what makes the orb read as a 3D ball
              rather than a flat disc. */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "90%",
              height: "90%",
              top: "-18%",
              left: "-18%",
              background:
                "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 28%, rgba(255,255,255,0) 60%)",
              filter: "blur(6px)",
              mixBlendMode: "screen",
            }}
            animate={{
              x: [0, 10, -4, 8, 0],
              y: [0, -4, 8, -2, 0],
              opacity: isActive
                ? [0.85, 1, 0.9, 1, 0.85]
                : [0.7, 0.88, 0.78, 0.84, 0.7],
            }}
            transition={{
              duration: highlightDrift,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />

          {/* Heavy grain noise — this is the key texture that matches the
              ElevenLabs reference. Without it the orb looks plasticky. */}
          <svg
            className="absolute inset-0 w-full h-full opacity-55 pointer-events-none mix-blend-overlay"
            aria-hidden="true"
          >
            <filter id={noiseId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.75 0"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
          </svg>

          {/* Asymmetric vignette — transparent at upper-left, dark at
              lower-right. Gives a clear 3D ball feel with a light source
              from the top-left. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 30% 28%, transparent 38%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0.55) 100%)",
            }}
            aria-hidden="true"
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
