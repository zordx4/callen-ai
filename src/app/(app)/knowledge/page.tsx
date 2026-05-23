import { BookOpen } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function KnowledgeBasePage() {
  return (
    <PagePlaceholder
      badge="Day 5"
      title="Knowledge Base"
      subtitle="Upload your menu, FAQs, policies. Your agent grounds every answer in your own data."
      icon={BookOpen}
      comingNote="Drag-and-drop upload zone for PDFs, URLs, and text. Source list with chunk counts and indexing status. Chunk preview drawer with similarity search. Re-index, replace, or remove documents anytime."
    />
  );
}
