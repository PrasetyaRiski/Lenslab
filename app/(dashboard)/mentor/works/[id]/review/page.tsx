import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { WorkReviewPanel } from "@/components/admin/work-review-panel";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MentorWorkReviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole([Role.MENTOR, Role.ADMIN]);
  const { id } = await params;
  const work = await prisma.studentWork.findUnique({ where: { id }, include: { student: true } });
  if (!work) notFound();

  return (
    <div>
      <PageHeader title="Review Karya" description="Nilai karya menggunakan rubrik 100 poin." />
      <WorkReviewPanel work={work} />
    </div>
  );
}
