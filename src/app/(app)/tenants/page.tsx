import { Building2 } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function TenantsPage() {
  return (
    <PagePlaceholder
      badge="Day 7 · Super-admin"
      title="Tenants"
      subtitle="Platform-wide tenant administration. Add, suspend, or upgrade businesses on the platform."
      icon={Building2}
      comingNote="Sortable table of every tenant with plan, MRR, active calls right now, total minutes used this month, and a suspended toggle. Visible only to users with the platform-owner role."
    />
  );
}
