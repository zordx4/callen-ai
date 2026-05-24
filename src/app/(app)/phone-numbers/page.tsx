import { Smartphone } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function PhoneNumbersPage() {
  return (
    <PagePlaceholder
      badge="Deploy"
      title="Phone numbers"
      subtitle="Buy a Pakistani number, port your existing line, or forward your landline into Callen."
      icon={Smartphone}
      comingNote="Twilio number marketplace filtered to +92 area codes, port-in flow for existing landlines, per number routing rules, and a default fallback to a human queue."
    />
  );
}
