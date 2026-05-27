import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Aperture, CircleDot, Mountain, Moon, PersonStanding, RotateCw, ShieldQuestion, Trophy } from "lucide-react";
import { SHOOTING_MODES, type ShootingMode } from "@/lib/camera-score";
import { cn } from "@/lib/utils";

type ModeDialProps = {
  value: ShootingMode;
  onChange: (value: ShootingMode) => void;
};

const iconMap: Record<ShootingMode, ComponentType<{ className?: string }>> = {
  Auto: ShieldQuestion,
  P: CircleDot,
  Av: Aperture,
  Tv: RotateCw,
  M: CircleDot,
  Portrait: PersonStanding,
  Landscape: Mountain,
  Sports: Trophy,
  Night: Moon
};

const shortLabel: Record<ShootingMode, string> = {
  Auto: "A+",
  P: "P",
  Av: "Av",
  Tv: "Tv",
  M: "M",
  Portrait: "POR",
  Landscape: "LAND",
  Sports: "SPRT",
  Night: "NITE"
};

export function ModeDial({ value, onChange }: ModeDialProps) {
  const activeIndex = SHOOTING_MODES.indexOf(value);
  const step = 360 / SHOOTING_MODES.length;

  return (
    <div className="relative h-36 w-36 shrink-0 rounded-full bg-black/70 p-3 shadow-[inset_0_3px_10px_rgba(255,255,255,0.08),inset_0_-18px_28px_rgba(0,0,0,0.75),0_18px_36px_rgba(0,0,0,0.5)]">
      <div className="absolute left-1/2 top-[-8px] z-20 h-0 w-0 -translate-x-1/2 border-x-[9px] border-b-[14px] border-x-transparent border-b-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
      <motion.div
        className="relative h-full w-full rounded-full border border-zinc-700 bg-[radial-gradient(circle_at_35%_28%,#52525b,#18181b_48%,#050505_80%)]"
        animate={{ rotate: -activeIndex * step }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      >
        <div className="absolute inset-4 rounded-full border border-zinc-800 bg-[radial-gradient(circle,#202024,#09090b_72%)] shadow-inner" />
        {SHOOTING_MODES.map((mode, index) => {
          const angle = index * step - 90;
          const radius = 48;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          const active = mode === value;
          const Icon = iconMap[mode];
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={cn(
                "absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[9px] font-black transition",
                active ? "border-red-400 bg-red-600 text-white shadow-[0_0_18px_rgba(239,68,68,0.72)]" : "border-zinc-600 bg-zinc-950 text-zinc-300 hover:border-amber-300 hover:text-amber-200"
              )}
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${activeIndex * step}deg)` }}
              title={mode}
            >
              {mode === "Portrait" || mode === "Landscape" || mode === "Sports" || mode === "Night" || mode === "Auto" ? (
                <Icon className="h-4 w-4" />
              ) : (
                shortLabel[mode]
              )}
            </button>
          );
        })}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 text-center">
        <span className="rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200 shadow">{value}</span>
      </div>
    </div>
  );
}
