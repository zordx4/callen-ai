import { Bot } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function AgentStudioPage() {
  return (
    <PagePlaceholder
      badge="Day 4"
      title="Agent Studio"
      subtitle="Configure how your AI voice agent thinks, sounds, and behaves on every call."
      icon={Bot}
      comingNote="System prompt editor, voice selector with preview, language toggles (Urdu/English), business hours grid, escalation rules, and a Try-It panel that lets you talk to your agent in the browser before publishing."
    />
  );
}
