// Preview route for the imported HeroGeometric component.
// Themed with Callen.ai content so we can decide whether to use it on the landing page.

import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function HeroPreviewPage() {
  return (
    <HeroGeometric
      badge="Callen.ai"
      title1="Voice AI for Dumb Lulu"
      title2="Every Business Call"
    />
  );
}
