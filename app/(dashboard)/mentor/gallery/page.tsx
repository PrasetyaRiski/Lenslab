import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function MentorGalleryPage() {
  await requireRole([Role.MENTOR, Role.ADMIN]);
  const works = await prisma.studentWork.findMany({ where: { status: "PUBLISHED" }, include: { student: true }, orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <PageHeader title="Galeri Karya" description="Karya siswa yang sudah dipublikasikan." />
      {works.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <Card key={work.id}>
              <Badge tone="success">PUBLISHED</Badge>
              <CardTitle className="mt-4">{work.title}</CardTitle>
              <CardDescription>{work.student.name} - {work.category}</CardDescription>
              {work.previewUrl ? <a className="mt-4 inline-block text-sm font-bold text-amber-600" href={work.previewUrl} target="_blank">Preview file</a> : null}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Galeri masih kosong" description="Belum ada karya yang dipublikasikan." />
      )}
    </div>
  );
}
