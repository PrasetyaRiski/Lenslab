import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const categories = ["Template Poster", "Preset Foto", "File Latihan Editing", "Elemen Grafis", "Template Caption", "Template Video", "Panduan Editing"];

export default async function MentorAssetsPage() {
  const user = await requireRole([Role.MENTOR, Role.ADMIN]);
  const assets = await prisma.asset.findMany({
    where: user.role === "MENTOR" ? { uploadedById: user.id } : {},
    include: { uploadedBy: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <PageHeader title="Kelola Asset" description="Upload dan kelola asset editing untuk siswa." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Upload asset</CardTitle>
          <form action="/api/assets" method="post" encType="multipart/form-data" className="mt-4 space-y-3">
            <div><Label>Judul</Label><Input name="title" required /></div>
            <div><Label>Kategori</Label><Select name="category">{categories.map((category) => <option key={category}>{category}</option>)}</Select></div>
            <Textarea name="description" placeholder="Deskripsi asset" />
            <div><Label>Visibility</Label><Select name="visibility"><option value="STUDENT_ONLY">STUDENT_ONLY</option><option value="PUBLIC">PUBLIC</option><option value="MENTOR_ONLY">MENTOR_ONLY</option></Select></div>
            <div><Label>Status</Label><Select name="status"><option value="PUBLISHED">PUBLISHED</option><option value="DRAFT">DRAFT</option></Select></div>
            <Input name="file" type="file" required />
            <Button type="submit">Upload Asset</Button>
          </form>
        </Card>
        <Card>
          <CardTitle>Daftar asset</CardTitle>
          <div className="mt-4 space-y-3">
            {assets.length ? assets.map((asset) => (
              <div key={asset.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between"><strong>{asset.title}</strong><Badge>{asset.status}</Badge></div>
                <p className="text-sm text-slate-500">{asset.category} - {asset.totalDownload} download - {asset.uploadedBy.name}</p>
              </div>
            )) : <EmptyState title="Belum ada asset" description="Upload asset pertama untuk siswa." />}
          </div>
        </Card>
      </div>
    </div>
  );
}
