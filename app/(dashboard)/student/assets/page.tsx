import { FileDown } from "lucide-react";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function StudentAssetsPage() {
  await requireRole([Role.STUDENT]);
  const assets = await prisma.asset.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHeader title="Asset Editing Center" description="Download template, preset, file latihan, dan panduan editing dari mentor." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <Badge tone="warning">{asset.category}</Badge>
            <CardTitle className="mt-4">{asset.title}</CardTitle>
            <CardDescription>{asset.description}</CardDescription>
            <p className="mt-3 text-xs text-slate-500">{asset.fileName} • {asset.totalDownload} download</p>
            <form action={`/api/assets/${asset.id}/download`} method="post" className="mt-5">
              <Button type="submit"><FileDown className="mr-2 h-4 w-4" /> Download +10 poin</Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
