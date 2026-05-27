import { Role } from "@prisma/client";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function AdminBadgesPage() {
  await requireRole([Role.ADMIN]);
  const badges = await prisma.badge.findMany({ include: { users: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader title="Kelola Badge" description="Badge otomatis diberikan berdasarkan skor dan aktivitas siswa." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardTitle>Badge baru</CardTitle>
          <form action="/api/badges" method="post" className="mt-4 space-y-3">
            <div><Label>Nama</Label><Input name="name" required /></div>
            <div><Label>Deskripsi</Label><Textarea name="description" required /></div>
            <div><Label>Icon</Label><Input name="icon" defaultValue="Award" required /></div>
            <div><Label>Rule</Label><Input name="rule" placeholder="score>=100" required /></div>
            <div><Label>Minimal Skor</Label><Input name="minScore" type="number" min={0} /></div>
            <Button type="submit">Tambah Badge</Button>
          </form>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {badges.length ? badges.map((badge) => (
            <Card key={badge.id}>
              <div className="mb-3 inline-flex rounded-xl bg-amber-50 p-3 text-amber-700"><Award className="h-5 w-5" /></div>
              <CardTitle>{badge.name}</CardTitle>
              <CardDescription>{badge.description}</CardDescription>
              <p className="mt-3 text-sm text-slate-500">{badge.users.length} siswa - rule {badge.rule}</p>
            </Card>
          )) : <EmptyState title="Belum ada badge" description="Tambahkan badge pertama untuk gamifikasi siswa." />}
        </div>
      </div>
    </div>
  );
}
