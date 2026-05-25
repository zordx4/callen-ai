// Voice row card used in the trending grid + filtered library.
// Thumbnail on the left is the inline play button (VoicePreview); the rest
// of the card opens the detail sheet on click.

"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Voice } from "@/lib/voice-library";
import { VoicePreview } from "./voice-preview";
import { Sparkles } from "lucide-react";

const LANGUAGE_FLAG: Record<string, string> = {
  Urdu: "🇵🇰",
  English: "🇺🇸",
  "Urdu + English": "🇵🇰",
};

type VoiceCardProps = {
  voice: Voice;
  onOpen?: (id: string) => void;
  className?: string;
  variant?: "row" | "compact";
};

export function VoiceCard({
  voice,
  onOpen,
  className,
  variant = "row",
}: VoiceCardProps) {
  const extraCount = useMemo(
    () => (voice.extraLanguages?.length ?? 0),
    [voice.extraLanguages]
  );
  const flag = LANGUAGE_FLAG[voice.language] ?? "🌐";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(voice.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(voice.id);
        }
      }}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 pr-4",
        "hover:border-neutral-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        "transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
        className
      )}
    >
      <VoicePreview voice={voice} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[14px] font-semibold text-neutral-950 truncate tracking-tight">
            {voice.name}
            {variant === "row" && voice.tagline ? (
              <span className="text-neutral-700 font-normal">
                {" "}- {voice.tagline}
              </span>
            ) : null}
          </p>
          {voice.premium && (
            <Sparkles className="size-3.5 shrink-0 text-amber-500" />
          )}
        </div>
        <p className="text-[12px] text-neutral-500 mt-0.5">{voice.category}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-neutral-700">
          <span aria-hidden className="text-[13px] leading-none">{flag}</span>
          <span className="font-normal">{voice.language}</span>
          {extraCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600 ml-0.5">
              +{extraCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
