import { PhoneCall } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function LiveCallsPage() {
  return (
    <PagePlaceholder
      badge="Day 3"
      title="Live Calls"
      subtitle="Watch active calls happen in real time. Listen in, take over, or let the agent handle it."
      icon={PhoneCall}
      comingNote="Active call list with green pulse indicators, transcript streams word-by-word, intent classification fires live, tool execution log updates per turn. Listen-in mode lets admins monitor any call without revealing presence."
    />
  );
}
