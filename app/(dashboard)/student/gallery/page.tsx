import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function StudentGalleryPage() {
  await requireRole([Role.STUDENT]);
  const works = await prisma.studentWork.findMany({ where: { status: "PUBLISHED" }, include: { student: true }, orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <PageHeader title="Galeri Karya Siswa" description="Karya yang sudah disetujui dan dipublikasikan oleh mentor." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {works.map((work) => (
          <Card key={work.id}>
            <Badge tone="success">{work.category}</Badge>
            <CardTitle className="mt-4">{work.title}</CardTitle>
            <CardDescription>{work.caption || work.description}</CardDescription>
            <p className="mt-3 text-sm text-slate-600">Oleh <strong>{work.student.name}</strong> - {work.student.className ?? "-"}</p>
            <p className="text-sm text-slate-600">Skor: <strong>{work.score ?? 0}</strong></p>
            {work.previewUrl ? <a className="mt-4 inline-block text-sm font-bold text-amber-600" href={work.previewUrl} target="_blank">Preview file</a> : null}
            {work.showFeedback && work.feedback ? <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Feedback: {work.feedback}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
