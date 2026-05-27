import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title = "Belum ada data", description = "Data akan tampil di sini setelah tersedia." }: { title?: string; description?: string }) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-500"><Inbox className="h-7 w-7" /></div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </Card>
  );
}
