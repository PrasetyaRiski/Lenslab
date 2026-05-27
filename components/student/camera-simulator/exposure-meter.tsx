import { cn } from "@/lib/utils";

type ExposureMeterProps = {
  value: number;
  compact?: boolean;
};

function meterPosition(value: number) {
  return `${((value + 3) / 6) * 100}%`;
}

export function ExposureMeter({ value, compact = false }: ExposureMeterProps) {
  return (
    <div className={cn("font-mono text-[10px] text-zinc-300", compact ? "w-36" : "w-full")}>
      <div className="relative h-7">
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/30" />
        <div className="absolute inset-x-1 top-1/2 flex -translate-y-1/2 justify-between text-[9px] text-zinc-500">
          {["-3", "-2", "-1", "0", "+1", "+2", "+3"].map((tick) => (
            <span key={tick} className={tick === "0" ? "text-amber-300" : undefined}>{tick}</span>
          ))}
        </div>
        <div
          className="absolute top-1/2 h-4 w-1.5 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]"
          style={{ left: `calc(${meterPosition(value)} - 3px)` }}
        />
      </div>
    </div>
  );
}
