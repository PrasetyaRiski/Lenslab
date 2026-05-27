import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function StudentMyWorksPage() {
  const user = await requireRole([Role.STUDENT]);
  const works = await prisma.studentWork.findMany({ where: { studentId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Karya Saya" description="Daftar karya yang sudah Anda unggah beserta status review mentor." />
      {works.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <Card key={work.id}>
              <Badge tone={work.status === "PUBLISHED" ? "success" : work.status === "REVISION" ? "danger" : "info"}>{work.status}</Badge>
              <CardTitle className="mt-4">{work.title}</CardTitle>
              <CardDescription>{work.description}</CardDescription>
              <p className="mt-3 text-sm text-slate-600">Skor: <strong>{work.score ?? "Belum dinilai"}</strong></p>
              {work.feedback ? <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{work.feedback}</p> : null}
              {work.previewUrl ? <a className="mt-3 inline-block text-sm font-bold text-amber-600" href={work.previewUrl} target="_blank">Buka file</a> : null}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada karya" description="Upload karya pertama Anda untuk mendapatkan feedback mentor." />
      )}
    </div>
  );
}
