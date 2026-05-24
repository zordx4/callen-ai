import { Boxes } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function IntegrationsPage() {
  return (
    <PagePlaceholder
      badge="Configure · Alpha"
      title="Integrations"
      subtitle="Connect your existing tools so the agent can push orders, sync customers, and act on real data."
      icon={Boxes}
      comingNote="One click connectors for Foodpanda, Cheetay, Bykea, Easypaisa, JazzCash, and HubSpot. Webhook builder for everything else. OAuth status, last sync timestamps, and per integration scopes."
    />
  );
}
