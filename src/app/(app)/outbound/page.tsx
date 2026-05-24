import { PhoneOutgoing } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function OutboundPage() {
  return (
    <PagePlaceholder
      badge="Deploy"
      title="Outbound campaigns"
      subtitle="Schedule the agent to call customer lists for confirmations, follow-ups, and feedback."
      icon={PhoneOutgoing}
      comingNote="CSV upload of caller lists, per-campaign script and language, rate limiting and quiet hours, retry logic for missed calls, and a live dashboard of campaign progress."
    />
  );
}
