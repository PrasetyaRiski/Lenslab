import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type HistogramProps = {
  values: number[];
  className?: string;
};

export function Histogram({ values, className }: HistogramProps) {
  return (
    <div className={cn("rounded-md border border-white/10 bg-black/45 p-2 text-white backdrop-blur", className)}>
      <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-zinc-400">
        <span>RGB</span>
        <BarChart3 className="h-3 w-3 text-amber-300" />
      </div>
      <div className="flex h-12 items-end gap-0.5">
        {values.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className="w-1 flex-1 rounded-t-sm bg-gradient-to-t from-cyan-400/70 via-amber-300/70 to-red-400/70"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    </div>
  );
}
