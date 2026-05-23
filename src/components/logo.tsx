// Callen.ai logo — minimal black-and-white mark.
// Black filled rounded square + white "C" mark with a voice-dot accent.
// Wordmark: "Callen" bold + ".ai" lighter.

import { cn } from "@/lib/utils";

export function Logo({ className, withWordmark = true, size = "default" }: {
  className?: string;
  withWordmark?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  const dim = size === "sm" ? "size-6" : size === "lg" ? "size-9" : "size-7";
  const text = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className={dim}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Callen.ai"
      >
        {/* Black rounded square background */}
        <rect width="32" height="32" rx="8" fill="currentColor" />
        {/* Stylised "C" arc — white */}
        <path
          d="M22 11.5C20.5 9 17.5 8 14.5 9C11.5 10 9.5 12.5 9.5 16C9.5 19.5 11.5 22 14.5 23C17.5 24 20.5 23 22 20.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Voice-wave dots inside the C (three dots, middle largest) */}
        <circle cx="13.5" cy="16" r="1.1" fill="white" />
        <circle cx="16.5" cy="16" r="1.5" fill="white" />
        <circle cx="19.5" cy="16" r="1.1" fill="white" />
      </svg>
      {withWordmark && (
        <span className={cn("font-semibold tracking-tight", text)}>
          Callen<span className="text-neutral-500 font-normal">.ai</span>
        </span>
      )}
    </div>
  );
}
