import { StudentWork, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type WorkWithStudent = StudentWork & { student: User };

export function WorkReviewPanel({ work }: { work: WorkWithStudent }) {
  const defaultRubric = Math.floor((work.score ?? 0) / 5);

  return (
    <Card>
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div>
          <Badge>{work.status}</Badge>
          <CardTitle className="mt-3">{work.title}</CardTitle>
          <p className="mt-1 text-sm text-slate-500">{work.student.name} - {work.student.className ?? "-"} - {work.category}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{work.description}</p>
          {work.caption ? <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Caption: {work.caption}</p> : null}
          {work.previewUrl ? <a href={work.previewUrl} target="_blank" className="mt-3 inline-block font-bold text-amber-600">Buka preview</a> : null}
        </div>
        <form action={`/api/works/${work.id}/review`} method="post" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tema</Label><Input name="themeScore" type="number" min={0} max={20} defaultValue={defaultRubric} /></div>
            <div><Label>Komposisi</Label><Input name="compositionScore" type="number" min={0} max={20} defaultValue={defaultRubric} /></div>
            <div><Label>Teknis</Label><Input name="technicalScore" type="number" min={0} max={20} defaultValue={defaultRubric} /></div>
            <div><Label>Caption</Label><Input name="captionScore" type="number" min={0} max={20} defaultValue={defaultRubric} /></div>
            <div><Label>Jurnalistik</Label><Input name="journalismScore" type="number" min={0} max={20} defaultValue={defaultRubric} /></div>
          </div>
          <Label>Skor manual fallback</Label>
          <Input name="score" type="number" min={0} max={100} defaultValue={work.score ?? 0} />
          <Label>Status</Label>
          <Select name="status" defaultValue={work.status === "SUBMITTED" ? "REVIEWED" : work.status}>
            <option value="REVIEWED">REVIEWED</option>
            <option value="REVISION">REVISION</option>
            <option value="APPROVED">APPROVED</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </Select>
          <Label>Feedback</Label>
          <Textarea name="feedback" defaultValue={work.feedback ?? ""} />
          <label className="flex items-center gap-2 text-sm"><input name="showFeedback" type="checkbox" defaultChecked={work.showFeedback} /> Tampilkan feedback di galeri</label>
          <Button type="submit">Simpan Review</Button>
        </form>
      </div>
    </Card>
  );
}
