// Preview Call UI for the Agent Studio.
// Colourful organic sphere that pulls its palette from the active
// template's `previewColors`. Each colour renders as a heavily-blurred
// blob that drifts independently, giving the aurora / voice-vibe feel
// from the ElevenLabs reference. Adds a soft specular highlight, a
// noise grain, and a vignette for spherical depth.

"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "connecting" | "connected" | "ending";
type Speaker = "agent" | "caller" | "silence";

// Conversation cadence used when a call is connected. Mixed turn lengths
// + short silences give the sphere a real two-party feel rather than
// a constant hum.
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

// Fallback palette for callers that don't pass `colors`. Keeps the
// monochrome look the component originally shipped with.
const DEFAULT_COLORS = ["#a3a3a3", "#737373", "#404040", "#0a0a0a"];

// Anchor positions per blob (percent offsets). Each color claims a
// different region of the sphere so they don't all stack in the middle.
const BLOB_ANCHORS: Array<{ top: string; left: string }> = [
  { top: "-15%", left: "-15%" },  // top-left
  { top: "-10%", left: "55%"  },  // top-right
  { top: "55%",  left: "55%"  },  // bottom-right
  { top: "55%",  left: "-15%" },  // bottom-left
  { top: "25%",  left: "25%"  },  // center (5th color if present)
];

// Distinct drift paths per blob index so they don't move in lockstep.
const DRIFT_PATHS: Array<{ x: number[]; y: number[]; s: number[] }> = [
  { x: [0, 22, -10, 14, 0], y: [0, -14, 18, -8, 0], s: [1, 1.12, 0.94, 1.08, 1] },
  { x: [0, -18, 12, -10, 0], y: [0, 10, -16, 14, 0], s: [1, 0.92, 1.15, 0.98, 1] },
  { x: [0, 14, -16, 8, 0], y: [0, -18, 10, -6, 0], s: [1, 1.08, 0.92, 1.12, 1] },
  { x: [0, -12, 16, -14, 0], y: [0, 12, -10, 16, 0], s: [1, 1.1, 1.02, 0.96, 1] },
  { x: [0, 8, -8, 6, 0], y: [0, -6, 8, -4, 0], s: [1, 1.04, 0.98, 1.06, 1] },
];

// Voice-waveform bars hugging the sphere's perimeter.
const BAR_COUNT = 56;
const RING_RADIUS = 128;

// Deterministic 0..1 noise per bar index so amplitudes feel organic
// without being random on every render.
function barNoise(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

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
  const liquidId = useId();

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

  // Turn-taking simulation. Drives bar amplitude, sphere reactivity,
  // and the status-pill label so the sphere reads as a live two-party
  // conversation rather than constant hum.
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
      // While muted, the caller can't actually be speaking — collapse
      // their turns into silence.
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

  // Tempos compound:
  //   - idle: slow meditative
  //   - connecting: warming up
  //   - connected + silence: calmer (between turns)
  //   - connected + speaking: fully alive
  const isActive = status === "connected" || status === "connecting";
  const isSpeaking = status === "connected" && speaker !== "silence";

  const blobBase = isSpeaking
    ? 6
    : status === "connected"
      ? 10
      : status === "connecting" ? 4 : 12;

  const breath = isSpeaking
    ? 2.4
    : status === "connected"
      ? 4
      : 6;

  // Planet-style rotation of the whole colour orbit. Speeds up under
  // active speech, slows in silences.
  const rotateDuration = isSpeaking
    ? 14
    : status === "connected"
      ? 22
      : status === "connecting" ? 12 : 28;

  // Per-speaker tint. Agent uses the lead colour, caller uses the
  // second (most templates have 3-4 colours; fall back gracefully).
  const agentColor = colors[0] ?? "#ffffff";
  const callerColor = colors[1] ?? colors[colors.length - 1] ?? agentColor;
  const speakerColor =
    speaker === "agent" ? agentColor : speaker === "caller" ? callerColor : agentColor;

  // Backplate uses the last (typically darkest) colour so blobs read
  // clearly against it.
  const backplate = colors[colors.length - 1] ?? "#0a0a0a";

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
      <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-10">
        {/* Wave rings — only emanate during active speech. Tinted by the
            current speaker so they read as that voice carrying outward. */}
        {isSpeaking && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={`${speaker}-${i}`}
                className="absolute rounded-full border"
                style={{ width: 240, height: 240, borderColor: `${speakerColor}40` }}
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.74,
                }}
              />
            ))}
          </>
        )}

        {/* Soft outer halo, tinted by the lead colour */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320,
            height: 320,
            background: `radial-gradient(circle, ${colors[0]}1f 0%, ${colors[0]}0a 35%, transparent 70%)`,
          }}
          animate={{ scale: isActive ? [1, 1.08, 1] : [1, 1.03, 1] }}
          transition={{ duration: breath, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        {/* Voice-waveform bars around the perimeter — reads as
            "someone is speaking" when connected, breathes softly when
            idle. Stagger creates a traveling wave around the ring. */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox="-150 -150 300 300"
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const angle = (i / BAR_COUNT) * 360;
            const variance = barNoise(i);
            const baseH = 2;
            const maxH = isSpeaking
              ? 6 + variance * 10
              : isActive
                ? 2.8 + variance * 1.6
                : 2.4 + variance * 1.2;
            const duration = isSpeaking
              ? 0.32 + variance * 0.42
              : 0.9 + variance * 0.7;
            const delay = (i / BAR_COUNT) * 1.4;
            const opacity = isSpeaking
              ? [0.7, 1, 0.7]
              : isActive
                ? [0.35, 0.55, 0.35]
                : [0.22, 0.38, 0.22];
            return (
              <g key={i} transform={`rotate(${angle})`}>
                <motion.rect
                  x={-0.75}
                  width={1.5}
                  rx={0.75}
                  animate={{
                    y: [-RING_RADIUS - baseH, -RING_RADIUS - maxH, -RING_RADIUS - baseH],
                    height: [baseH, maxH, baseH],
                    opacity,
                    fill: speakerColor,
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                    fill: { duration: 0.4, ease: "easeOut" },
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Liquid displacement filter — applied to the colour orbit so
            the gradient flows like a liquid rather than just translating.
            Three SMIL animations compound: noise frequency, noise seed,
            and displacement strength all breathe on independent loops. */}
        <svg className="absolute size-0 pointer-events-none" aria-hidden>
          <defs>
            <filter id={liquidId} x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.013"
                numOctaves="2"
                seed="3"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.010;0.018;0.012;0.016;0.010"
                  dur="16s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="seed"
                  values="1;5;9;13;17;1"
                  dur="32s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
              >
                <animate
                  attributeName="scale"
                  values="18;30;22;28;18"
                  dur="11s"
                  repeatCount="indefinite"
                />
              </feDisplacementMap>
            </filter>
          </defs>
        </svg>

        {/* Sphere container — clips all the inner layers into a circle */}
        <motion.div
          className="relative size-[240px] rounded-full overflow-hidden"
          style={{ background: backplate }}
          animate={{ scale: isActive ? [1, 1.03, 1] : [1, 1.015, 1] }}
          transition={{ duration: breath, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Rotating orbit — the whole colour layer spins like a planet.
              Individual blobs still drift inside this frame, AND the
              liquid filter continuously displaces the gradient pixels,
              so the motion compounds: planetary rotation + internal
              drift + liquid flow. */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              willChange: "transform, filter",
              filter: `url(#${liquidId})`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: rotateDuration, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            {colors.map((color, i) => {
              const anchor = BLOB_ANCHORS[i % BLOB_ANCHORS.length];
              const drift = DRIFT_PATHS[i % DRIFT_PATHS.length];
              const duration = blobBase + i * 1.7;
              return (
                <motion.div
                  key={`${color}-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    top: anchor.top,
                    left: anchor.left,
                    width: "85%",
                    height: "85%",
                    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}cc 25%, ${color}66 50%, transparent 75%)`,
                    filter: "blur(22px)",
                    mixBlendMode: "screen",
                    willChange: "transform",
                  }}
                  animate={{ x: drift.x, y: drift.y, scale: drift.s }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                />
              );
            })}
          </motion.div>

          {/* Soft specular highlight — gives the sphere a 3D top-lit feel */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "50%",
              height: "50%",
              top: "8%",
              left: "20%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 35%, rgba(255,255,255,0) 70%)",
              filter: "blur(10px)",
              mixBlendMode: "screen",
            }}
            animate={{
              x: [-8, 14, -4, 10, -8],
              y: [-4, 4, 10, -6, -4],
              opacity: isActive ? [0.75, 1, 0.85, 0.95, 0.75] : [0.55, 0.75, 0.6, 0.7, 0.55],
            }}
            transition={{
              duration: blobBase * 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />

          {/* Grain — the texture that makes it read as "voice vibe" rather than plastic */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.22] pointer-events-none mix-blend-overlay"
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

          {/* Vignette for spherical depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Phone button overlapping the bottom of the sphere */}
        <button
          onClick={onPhone}
          aria-label={status === "connected" ? "End call" : "Start call"}
          className={cn(
            "absolute bottom-[14px] left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-4 border-white z-20",
            status === "connected"
              ? "bg-neutral-950 hover:bg-neutral-800 text-white"
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
