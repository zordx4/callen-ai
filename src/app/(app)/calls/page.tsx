import { History } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function CallHistoryPage() {
  return (
    <PagePlaceholder
      badge="Day 6"
      title="Call History"
      subtitle="Search, filter, and replay every call your agent has handled."
      icon={History}
      comingNote="Filterable table of all calls with date, language, intent, outcome, duration, and transcript search. Click any row to open Call Detail with sentiment timeline, intent timeline, tool execution log, and audio player."
    />
  );
}
