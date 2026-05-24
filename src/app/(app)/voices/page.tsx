import { Mic } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function VoicesPage() {
  return (
    <PagePlaceholder
      badge="Configure"
      title="Voices"
      subtitle="Manage the voices your agent uses, preview samples, and clone new voices from short audio."
      icon={Mic}
      comingNote="Voice library with Eleven v3 presets, language tags (Urdu, English, Punjabi), preview play buttons, and a Clone Voice flow that takes a 30 second sample."
    />
  );
}
