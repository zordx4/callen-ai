// Callen.ai logo — minimal black orb mark + wordmark, ElevenLabs-style.
// Single solid dot with a tiny white "voice" highlight inside.

import { cn } from "@/lib/utils";

export function Logo({
  className,
  withWordmark = true,
  size = "default",
}: {
  className?: string;
  withWordmark?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  const dim = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";
  const text = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-[15px]";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <svg
        viewBox="0 0 16 16"
        className={dim}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Callen.ai"
      >
        {/* Solid dark orb */}
        <circle cx="8" cy="8" r="8" fill="currentColor" />
        {/* Tiny highlight (off-center, top-left) — subtle 3D feel */}
        <circle cx="5.5" cy="5.5" r="1.6" fill="white" fillOpacity="0.25" />
        {/* Voice dot in center */}
        <circle cx="8" cy="8" r="1" fill="white" />
      </svg>
      {withWordmark && (
        <span className={cn("font-semibold tracking-tight", text)}>
          Callen<span className="text-neutral-500 font-normal">.ai</span>
        </span>
      )}
    </div>
  );
}
