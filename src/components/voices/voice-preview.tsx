// VoicePreview — circular play button with the voice's identity gradient.
// Holds its own <audio> element. Coordinates with other previews via the
// voice-playback store so only one preview can be audible at a time.
// Shows a Play icon while idle, a Pause icon + sliding waveform while
// playing, and a small CheckCircle "verified" badge in the bottom-right.

"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { gradientCssForId } from "@/lib/avatar-gradients";
import { useVoicePlayback } from "@/lib/voice-playback";
import type { Voice } from "@/lib/voice-library";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = {
  sm: 56,
  md: 64,
  lg: 112,
};

const ICON_PX: Record<Size, number> = {
  sm: 18,
  md: 20,
  lg: 34,
};

const BADGE_PX: Record<Size, number> = {
  sm: 14,
  md: 16,
  lg: 22,
};

type VoicePreviewProps = {
  voice: Voice;
  size?: Size;
  showBadge?: boolean;
  className?: string;
};

export function VoicePreview({
  voice,
  size = "md",
  showBadge = true,
  className,
}: VoicePreviewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentId, setCurrent } = useVoicePlayback();
  const playing = currentId === voice.id;

  // When another voice claims the playback slot, stop ours.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      audio.pause();
      audio.currentTime = 0;
      setLoading(false);
    }
  }, [playing]);

  const px = SIZE_PX[size];
  const iconPx = ICON_PX[size];
  const badgePx = BADGE_PX[size];

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setCurrent(null);
      return;
    }

    setLoading(true);
    setCurrent(voice.id);
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        setCurrent(null);
      });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? `Stop ${voice.name}` : `Play ${voice.name}`}
      className={cn(
        "relative shrink-0 rounded-2xl overflow-hidden group/preview",
        "outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "transition-transform duration-150 active:scale-[0.97]",
        className
      )}
      style={{
        width: px,
        height: px,
        background: gradientCssForId(voice.id),
      }}
    >
      <audio
        ref={audioRef}
        src={voice.audioSrc}
        preload="none"
        onEnded={() => {
          setCurrent(null);
        }}
      />

      {/* Hover dim layer */}
      <span
        className={cn(
          "absolute inset-0 transition-colors",
          playing
            ? "bg-black/35"
            : "bg-black/0 group-hover/preview:bg-black/25"
        )}
      />

      {/* Play / Pause icon — fades in on hover or while playing */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-white drop-shadow-sm transition-opacity",
          playing
            ? "opacity-100"
            : "opacity-0 group-hover/preview:opacity-100"
        )}
      >
        {playing ? (
          <Pause
            width={iconPx}
            height={iconPx}
            strokeWidth={2.5}
            fill="currentColor"
          />
        ) : (
          <Play
            width={iconPx}
            height={iconPx}
            strokeWidth={2.5}
            fill="currentColor"
          />
        )}
      </span>

      {/* Playing pulse ring */}
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-2xl ring-2 ring-white/60 pointer-events-none"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: [0.8, 0, 0.8], scale: [1, 1.04, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Mini waveform while playing (only visible on md/lg sizes) */}
      {playing && size !== "sm" && (
        <span className="absolute inset-x-0 bottom-1.5 flex items-end justify-center gap-[2px] h-3 px-3 pointer-events-none">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[2px] bg-white/85 rounded-full"
              animate={{
                height: ["20%", "100%", "40%", "85%", "30%"],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      )}

      {/* Verified badge */}
      {showBadge && (
        <span
          className="absolute right-1 top-1 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-sm"
          style={{ width: badgePx, height: badgePx }}
          aria-hidden
        >
          <BadgeCheck
            width={badgePx - 2}
            height={badgePx - 2}
            strokeWidth={2}
          />
        </span>
      )}

      {/* Loading dots — show briefly while audio fetches */}
      {loading && !playing && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="size-1.5 rounded-full bg-white/90 animate-pulse" />
        </span>
      )}
    </button>
  );
}
