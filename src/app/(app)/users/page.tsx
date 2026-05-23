import { Users } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function UsersPage() {
  return (
    <PagePlaceholder
      badge="Day 7"
      title="Users & Roles"
      subtitle="Invite teammates and decide who can manage agents, view calls, or only see analytics."
      icon={Users}
      comingNote="Per-tenant user list with role pills (admin, manager, viewer). Add User modal with role picker and MFA toggle. Bulk-invite via CSV upload. Audit log of every permission change."
    />
  );
}
