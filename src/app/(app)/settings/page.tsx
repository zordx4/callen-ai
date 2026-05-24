import { Settings as SettingsIcon } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      badge="Account"
      title="Settings"
      subtitle="Workspace, billing, API keys, and notification preferences for your Callen account."
      icon={SettingsIcon}
      comingNote="Workspace details, plan and usage, payment method, API keys with rotation, webhook signing secrets, notification routing (email, Slack, SMS), and team-wide defaults."
    />
  );
}
