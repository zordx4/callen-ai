import { GitBranch } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function EscalationsPage() {
  return (
    <PagePlaceholder
      badge="Day 7"
      title="Escalation Rules"
      subtitle="Decide when your agent should hand the call off to a human."
      icon={GitBranch}
      comingNote="If-then rule cards with trigger types (explicit request, low confidence streak, negative sentiment, time of day), thresholds, and target actions (transfer to phone, transfer to queue, send SMS). Reorder, enable, or disable rules without redeploying."
    />
  );
}
