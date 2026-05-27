import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function ReviewWorksPage() {
  await requireRole([Role.ADMIN]);
  const works = await prisma.studentWork.findMany({ include: { student: true }, orderBy: { createdAt: "desc" } });
  return <div><PageHeader title="Review Karya" description="Nilai karya siswa menggunakan rubrik 100 poin dan publikasikan karya terbaik ke galeri." /><div className="grid gap-4">{works.map((work) => <Card key={work.id}><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><div><Badge>{work.status}</Badge><CardTitle className="mt-3">{work.title}</CardTitle><p className="mt-1 text-sm text-slate-500">{work.student.name} • {work.student.className ?? "-"} • {work.category}</p><p className="mt-3 text-sm leading-6 text-slate-600">{work.description}</p>{work.caption ? <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Caption: {work.caption}</p> : null}{work.previewUrl ? <a href={work.previewUrl} target="_blank" className="mt-3 inline-block font-bold text-amber-600">Buka preview</a> : null}</div><form action={`/api/works/${work.id}/review`} method="post" className="space-y-3"><Label>Skor total rubrik</Label><Input name="score" type="number" min={0} max={100} defaultValue={work.score ?? 0} /><Label>Status</Label><Select name="status" defaultValue={work.status === "SUBMITTED" ? "REVIEWED" : work.status}><option value="REVIEWED">REVIEWED</option><option value="REVISION">REVISION</option><option value="APPROVED">APPROVED</option><option value="PUBLISHED">PUBLISHED</option></Select><Label>Feedback</Label><Textarea name="feedback" defaultValue={work.feedback ?? ""} /><label className="flex items-center gap-2 text-sm"><input name="showFeedback" type="checkbox" defaultChecked={work.showFeedback} /> Tampilkan feedback di galeri</label><Button type="submit">Simpan Review</Button></form></div></Card>)}</div></div>;
}
