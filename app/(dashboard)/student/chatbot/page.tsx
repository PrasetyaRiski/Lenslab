import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Chatbot } from "@/components/student/chatbot";
import { requireRole } from "@/lib/auth";

export default async function ChatbotPage() {
  await requireRole([Role.STUDENT]);
  return (
    <div>
      <PageHeader title="JurnalisBot" description="Konsultasi ide liputan, angle berita, headline, caption, komposisi foto, dan etika jurnalistik." />
      <Chatbot />
    </div>
  );
}
