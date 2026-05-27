import { Material, Quiz } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function QuizForm({ materials, quiz }: { materials: Material[]; quiz?: Partial<Quiz> }) {
  const action = quiz?.id ? `/api/quizzes/${quiz.id}` : "/api/quizzes";
  return (
    <form action={action} method="post" className="space-y-4">
      {quiz?.id ? <input type="hidden" name="_method" value="PATCH" /> : null}
      <div><Label>Judul</Label><Input name="title" defaultValue={quiz?.title ?? ""} required /></div>
      <div><Label>Deskripsi</Label><Textarea name="description" defaultValue={quiz?.description ?? ""} required /></div>
      <div className="grid gap-4 md:grid-cols-3"><div><Label>Materi</Label><Select name="materialId" defaultValue={quiz?.materialId ?? ""}><option value="">Tanpa materi</option>{materials.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</Select></div><div><Label>Durasi Menit</Label><Input name="durationMinutes" type="number" defaultValue={quiz?.durationMinutes ?? 15} /></div><div><Label>Minimum Score</Label><Input name="minimumScore" type="number" defaultValue={quiz?.minimumScore ?? 70} /></div></div>
      <div><Label>Status</Label><Select name="status" defaultValue={quiz?.status ?? "DRAFT"}><option value="DRAFT">DRAFT</option><option value="PUBLISHED">PUBLISHED</option></Select></div>
      <Button type="submit">Simpan Kuis</Button>
    </form>
  );
}
