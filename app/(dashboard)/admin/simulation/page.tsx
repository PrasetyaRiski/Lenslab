import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function AdminSimulationPage() {
  await requireRole([Role.ADMIN]);
  const scenarios = await prisma.simulationScenario.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Kelola Simulasi" description="Atur skenario latihan kamera dan rekomendasi exposure." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Skenario baru</CardTitle>
          <form action="/api/simulation-scenarios" method="post" className="mt-4 space-y-3">
            <div><Label>Judul</Label><Input name="title" required /></div>
            <div><Label>Slug</Label><Input name="slug" required /></div>
            <div><Label>Deskripsi</Label><Textarea name="description" required /></div>
            <div className="grid gap-3 md:grid-cols-2">
              <div><Label>ISO Ideal</Label><Input name="idealIso" type="number" defaultValue={400} /></div>
              <div><Label>Aperture</Label><Input name="idealAperture" defaultValue="f/5.6" /></div>
              <div><Label>Shutter</Label><Input name="idealShutter" defaultValue="1/125" /></div>
              <div><Label>White Balance</Label><Input name="idealWhiteBalance" defaultValue="Auto" /></div>
              <div><Label>Focal Length</Label><Input name="idealFocalLength" defaultValue="35mm" /></div>
              <div><Label>Lighting</Label><Input name="lighting" defaultValue="mixed" /></div>
              <div><Label>Movement</Label><Input name="movement" defaultValue="medium" /></div>
            </div>
            <div><Label>Goal</Label><Input name="goal" defaultValue="latihan umum" /></div>
            <Button type="submit">Tambah Skenario</Button>
          </form>
        </Card>
        <div className="grid gap-4">
          {scenarios.length ? scenarios.map((scenario) => (
            <Card key={scenario.id}>
              <CardTitle>{scenario.title}</CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
              <p className="mt-3 text-sm text-slate-500">
                ISO {scenario.idealIso} - {scenario.idealAperture} - {scenario.idealShutter} - {scenario.idealWhiteBalance} - {scenario.idealFocalLength}
              </p>
            </Card>
          )) : <EmptyState title="Belum ada skenario" description="Tambahkan skenario kamera pertama untuk siswa." />}
        </div>
      </div>
    </div>
  );
}
