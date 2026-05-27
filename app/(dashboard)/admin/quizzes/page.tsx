import Link from "next/link";
import { Role } from "@prisma/client";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function AdminQuizzesPage() {
  await requireRole([Role.ADMIN]);
  const quizzes = await prisma.quiz.findMany({ include: { questions: true, material: true }, orderBy: { createdAt: "desc" } });
  return <div><PageHeader title="Kelola Kuis" description="Buat kuis dan soal untuk menguji pemahaman siswa." action={<Link href="/admin/quizzes/create"><Button><Plus className="mr-2 h-4 w-4" /> Kuis Baru</Button></Link>} /><Card><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3">Judul</th><th>Materi</th><th>Soal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{quizzes.map((q) => <tr key={q.id} className="border-b last:border-0"><td className="py-3 font-bold">{q.title}</td><td>{q.material?.title ?? "-"}</td><td>{q.questions.length}</td><td><Badge>{q.status}</Badge></td><td><Link className="font-bold text-amber-600" href={`/admin/quizzes/${q.id}/edit`}>Edit</Link></td></tr>)}</tbody></table></Card></div>;
}
