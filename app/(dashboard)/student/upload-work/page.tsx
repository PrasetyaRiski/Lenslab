import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth";

const categories = ["Foto jurnalistik", "Artikel berita", "Video liputan", "Poster", "Desain majalah dinding", "Hasil editing foto", "Tugas liputan"];

const statusMessages: Record<string, string> = {
  file_too_large: "File terlalu besar. Maksimal 25MB.",
  file_type: "Format file belum didukung. Gunakan JPG, PNG, WEBP, PDF, atau MP4."
};

export default async function UploadWorkPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  await requireRole([Role.STUDENT]);
  const params = await searchParams;
  const status = params?.status ? statusMessages[params.status] : null;
  return (
    <div>
      <PageHeader title="Upload Karya" description="Unggah karya jurnalistik Anda ke Google Drive sekolah dan minta feedback mentor." />
      <Card className="max-w-3xl">
        {status ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{status}</div> : null}
        <form action="/api/works" method="post" encType="multipart/form-data" className="space-y-4">
          <div><Label>Judul Karya</Label><Input name="title" required /></div>
          <div><Label>Kategori</Label><Select name="category">{categories.map((item) => <option key={item}>{item}</option>)}</Select></div>
          <div><Label>Deskripsi</Label><Textarea name="description" required /></div>
          <div><Label>Caption / Narasi 5W+1H</Label><Textarea name="caption" /></div>
          <div><Label>Catatan untuk Mentor</Label><Textarea name="noteForMentor" /></div>
          <div><Label>File Karya</Label><Input name="file" type="file" required /></div>
          <Button type="submit">Upload Karya +30 poin</Button>
        </form>
      </Card>
    </div>
  );
}
