import Link from "next/link";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function StudentMaterialsPage() {
  await requireRole([Role.STUDENT]);
  const materials = await prisma.material.findMany({ where: { status: "PUBLISHED" }, include: { category: true }, orderBy: { orderNumber: "asc" } });
  return (
    <div>
      <PageHeader title="Materi Pembelajaran" description="Baca materi fotografi jurnalistik dan tandai selesai setelah memahami isinya." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {materials.map((material) => (
          <Card key={material.id}>
            <Badge>{material.category.name}</Badge>
            <CardTitle className="mt-4">{material.title}</CardTitle>
            <CardDescription>{material.summary}</CardDescription>
            <Link href={`/student/materials/${material.slug}`} className="mt-5 inline-block"><Button>Baca Materi</Button></Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
