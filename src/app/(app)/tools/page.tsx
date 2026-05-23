import { Wrench } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function ToolsPage() {
  return (
    <PagePlaceholder
      badge="Day 5"
      title="Tools & Integrations"
      subtitle="Functions your agent can call to take action on customer requests."
      icon={Wrench}
      comingNote="Card grid per registered tool: name, MCP endpoint, JSON schema, last 30 days invocation count. Add Tool modal with schema editor and authentication picker. Connect to Cal.com, Stripe, your CRM, or any custom API."
    />
  );
}
