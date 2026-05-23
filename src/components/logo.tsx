// Callen.ai logo — "Voice C" mark.
// Black rounded square + bold white C arc + 3 voice-wave dots (small-large-small)
// inside the C representing the audio level rising and falling.
// Reads cleanly at 16px, scales up nicely.

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
  const dim = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";
  const text = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-[15px]";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className={dim}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Callen.ai"
      >
        {/* Rounded black square */}
        <rect width="32" height="32" rx="8" fill="currentColor" />

        {/* Bold "C" arc — opens to the right. Drawn as a stroke. */}
        <path
          d="M 23 11 C 20.5 8.5, 17 8, 14 9.5 C 10.5 11.2, 8.5 13.8, 8.5 16 C 8.5 18.2, 10.5 20.8, 14 22.5 C 17 24, 20.5 23.5, 23 21"
          stroke="white"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Three voice-wave dots inside the C — small / large / small, like audio levels */}
        <circle cx="14.5" cy="16" r="1.1" fill="white" />
        <circle cx="17.5" cy="16" r="1.6" fill="white" />
        <circle cx="20.5" cy="16" r="1.1" fill="white" />
      </svg>
      {withWordmark && (
        <span className={cn("font-semibold tracking-tight", text)}>
          Callen<span className="text-neutral-500 font-normal">.ai</span>
        </span>
      )}
    </div>
  );
}
