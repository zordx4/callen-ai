import { MessageCircle } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function WhatsAppPage() {
  return (
    <PagePlaceholder
      badge="Deploy"
      title="WhatsApp"
      subtitle="Let your agent handle WhatsApp Business messages with the same brain that takes your calls."
      icon={MessageCircle}
      comingNote="WhatsApp Business API setup, template message library, voice note transcription, and a shared inbox view that threads voice + WhatsApp conversations from the same caller."
    />
  );
}
