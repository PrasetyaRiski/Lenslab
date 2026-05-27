import { Category, Material } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type MaterialWithOptional = Partial<Material>;

export function MaterialForm({ categories, material }: { categories: Category[]; material?: MaterialWithOptional }) {
  const action = material?.id ? `/api/materials/${material.id}` : "/api/materials";
  return (
    <form action={action} method="post" className="space-y-4">
      {material?.id ? <input type="hidden" name="_method" value="PATCH" /> : null}
      <div><Label>Judul</Label><Input name="title" defaultValue={material?.title ?? ""} required /></div>
      <div><Label>Slug</Label><Input name="slug" defaultValue={material?.slug ?? ""} placeholder="judul-materi" required /></div>
      <div><Label>Ringkasan</Label><Textarea name="summary" defaultValue={material?.summary ?? ""} required /></div>
      <div><Label>Konten Markdown</Label><Textarea name="content" defaultValue={material?.content ?? ""} required /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Kategori</Label><Select name="categoryId" defaultValue={material?.categoryId ?? categories[0]?.id}>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</Select></div>
        <div><Label>Status</Label><Select name="status" defaultValue={material?.status ?? "DRAFT"}><option value="DRAFT">DRAFT</option><option value="PUBLISHED">PUBLISHED</option></Select></div>
      </div>
      <div><Label>Thumbnail URL</Label><Input name="thumbnail" defaultValue={material?.thumbnail ?? ""} /></div>
      <div><Label>Urutan</Label><Input name="orderNumber" type="number" defaultValue={material?.orderNumber ?? 0} /></div>
      <Button type="submit">Simpan Materi</Button>
    </form>
  );
}
