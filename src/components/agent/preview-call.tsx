// Preview Call UI for the Agent Studio.
// Click the phone button and the assigned voice's mp3 plays through the
// orb so the user can actually hear what the agent sounds like before
// publishing it. No more scripted two-party conversation simulation —
// the playback IS the preview.

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Volume2, VolumeX, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiriOrb } from "@/components/ui/siri-orb";

type Status = "idle" | "connecting" | "playing" | "ending";

const DEFAULT_COLORS = ["#a3a3a3", "#737373", "#404040"];

export function PreviewCall({
  agentName,
  colors = DEFAULT_COLORS,
  voiceAudioSrc,
}: {
  agentName: string;
  colors?: string[];
  voiceAudioSrc?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // If the selected agent changes (different voice), stop and reset.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setStatus("idle");
    setElapsed(0);
  }, [voiceAudioSrc]);

  // Elapsed counter while playing
  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Status transitions: connecting → playing, ending → idle.
  useEffect(() => {
    if (status === "connecting") {
      const id = setTimeout(() => {
        const audio = audioRef.current;
        if (!audio) {
          setStatus("idle");
          return;
        }
        audio.currentTime = 0;
        audio
          .play()
          .then(() => setStatus("playing"))
          .catch(() => setStatus("idle"));
      }, 550);
      return () => clearTimeout(id);
    }
    if (status === "ending") {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      const id = setTimeout(() => {
        setStatus("idle");
        setElapsed(0);
      }, 600);
      return () => clearTimeout(id);
    }
    if (status === "idle") {
      setElapsed(0);
    }
  }, [status]);

  // Mute toggles volume on the live audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : 1;
  }, [muted]);

  const onPhone = () => {
    if (status === "idle") setStatus("connecting");
    else if (status === "playing" || status === "connecting") setStatus("ending");
  };

  const onAudioEnded = () => {
    setStatus("idle");
    setElapsed(0);
  };

  const isActive = status === "playing" || status === "connecting";
  const isSpeaking = status === "playing";

  // Map call state to orb rotation speed. Faster spin = more "alive".
  const animationDuration = isSpeaking ? 7 : status === "connecting" ? 11 : 20;

  // Map the template's previewColors array onto SiriOrb's c1/c2/c3.
  const orbColors = {
    c1: colors[1] ?? colors[0],
    c2: colors[2] ?? colors[1] ?? colors[0],
    c3: colors[3] ?? colors[2] ?? colors[1] ?? colors[0],
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-10">
      {/* Audio element — only mounted when we have a source. */}
      {voiceAudioSrc && (
        <audio
          ref={audioRef}
          src={voiceAudioSrc}
          preload="auto"
          onEnded={onAudioEnded}
        />
      )}

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
              status === "playing" && "bg-neutral-950 text-white border-neutral-950",
              status === "ending" && "bg-white text-neutral-600 border-neutral-200"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "idle" && "bg-neutral-400",
                status === "connecting" && "bg-neutral-500 animate-pulse",
                status === "playing" && "bg-white animate-pulse",
                status === "ending" && "bg-neutral-400"
              )}
            />
            {status === "idle" && "Ready to call"}
            {status === "connecting" && "Connecting"}
            {status === "playing" && (
              <>
                <span className="font-semibold">{agentName}</span> speaking
                <span className="ml-1 font-mono opacity-80">
                  {Math.floor(elapsed / 60)}:
                  {(elapsed % 60).toString().padStart(2, "0")}
                </span>
              </>
            )}
            {status === "ending" && "Ending call"}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Orb */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-10">
        <div style={{ filter: "brightness(0.92) saturate(1.0)" }}>
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
        </div>

        {/* Phone button */}
        <button
          onClick={onPhone}
          aria-label={isActive ? "End call" : "Start call"}
          className="absolute bottom-[18px] left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-4 border-white z-20 bg-neutral-950 hover:bg-neutral-800 text-white"
        >
          {isActive ? (
            <PhoneOff className="size-4" />
          ) : (
            <Phone className="size-4" />
          )}
        </button>
      </div>

      {/* Mute + Settings pill — controls the audio output volume now */}
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
          {muted ? (
            <VolumeX className="size-3.5" />
          ) : (
            <Volume2 className="size-3.5" />
          )}
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>

      {/* Hint */}
      {status === "idle" && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-neutral-400 text-center">
          Tap the phone icon to hear how this agent sounds.
        </p>
      )}
    </div>
  );
}
