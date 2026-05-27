import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({ title, value, icon: Icon, caption }: { title: string; value: string | number; icon: LucideIcon; caption?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
          {caption ? <p className="mt-2 text-xs text-slate-500">{caption}</p> : null}
        </div>
        <div className="rounded-2xl bg-amber-100 p-3 text-amber-700"><Icon className="h-6 w-6" /></div>
      </div>
    </Card>
  );
}
