import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function renderMarkdown(content: string) {
  return content.split("\n").map((line, idx) => {
    if (line.startsWith("# ")) return <h1 key={idx}>{line.replace("# ", "")}</h1>;
    if (line.startsWith("## ")) return <h2 key={idx}>{line.replace("## ", "")}</h2>;
    if (!line.trim()) return null;
    return <p key={idx}>{line}</p>;
  });
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireRole([Role.STUDENT]);
  const { slug } = await params;
  const material = await prisma.material.findUnique({ where: { slug }, include: { category: true } });
  if (!material || material.status !== "PUBLISHED") notFound();

  return (
    <div>
      <PageHeader title={material.title} description={material.summary} />
      <Card className="prose-lens max-w-none">{renderMarkdown(material.content)}</Card>
      <form action="/api/material-progress" method="post" className="mt-5">
        <input type="hidden" name="materialId" value={material.id} />
        <input type="hidden" name="slug" value={material.slug} />
        <Button type="submit">Tandai selesai +10 poin</Button>
      </form>
    </div>
  );
}
