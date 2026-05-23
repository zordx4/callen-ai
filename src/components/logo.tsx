// Callen.ai logo: stylised "C" with a voice-wave glyph.

import { cn } from "@/lib/utils";

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Callen.ai logo"
      >
        <defs>
          <linearGradient id="callen-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        {/* Background black rounded square */}
        <rect width="32" height="32" rx="8" fill="currentColor" />
        {/* Stylised "C" arc */}
        <path
          d="M22 11.5C20.5 9 17.5 8 14.5 9C11.5 10 9.5 12.5 9.5 16C9.5 19.5 11.5 22 14.5 23C17.5 24 20.5 23 22 20.5"
          stroke="url(#callen-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Voice wave dots inside the C */}
        <circle cx="13.5" cy="16" r="1.2" fill="white" />
        <circle cx="16.5" cy="16" r="1.6" fill="white" />
        <circle cx="19.5" cy="16" r="1.2" fill="white" />
      </svg>
      {withWordmark && (
        <span className="font-semibold tracking-tight text-base">
          Callen<span className="text-muted-foreground font-normal">.ai</span>
        </span>
      )}
    </div>
  );
}
