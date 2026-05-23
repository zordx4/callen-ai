// LogoMarquee — infinite horizontal scroll of integration partner names.
// Uses CSS animation for perfect smoothness (no JS frame stutter).

"use client";

import { cn } from "@/lib/utils";

const ITEMS = [
  "Twilio", "OpenAI", "ElevenLabs", "Whisper", "Google AI", "Anthropic",
  "Cal.com", "HubSpot", "Salesforce", "Stripe", "WhatsApp", "Zendesk",
  "Slack", "Notion", "Linear", "Pipedrive",
];

export function LogoMarquee({ className }: { className?: string }) {
  // Duplicate the list so the loop is seamless
  const rows = [...ITEMS, ...ITEMS];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap py-2">
        {rows.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="mx-6 lg:mx-10 text-neutral-400 hover:text-neutral-900 transition-colors text-lg font-semibold tracking-tight shrink-0"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
