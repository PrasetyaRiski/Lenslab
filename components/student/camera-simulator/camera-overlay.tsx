import { BatteryFull, Circle, Crosshair, HardDrive, Zap } from "lucide-react";
import { ExposureMeter } from "@/components/student/camera-simulator/exposure-meter";
import type { AdvancedCameraSettings, CameraScore, CameraSettings, FocusPoint } from "@/lib/camera-score";
import { cn } from "@/lib/utils";

type CameraOverlayProps = {
  settings: CameraSettings;
  advanced: AdvancedCameraSettings;
  score: CameraScore;
  frameNumber: number;
  isRecording: boolean;
  onFocusPointChange: (value: FocusPoint) => void;
};

const focusPoints: Array<{ id: FocusPoint; className: string; label: string }> = [
  { id: "left", className: "left-[29%] top-1/2", label: "AF kiri" },
  { id: "center", className: "left-1/2 top-1/2", label: "AF tengah" },
  { id: "right", className: "left-[71%] top-1/2", label: "AF kanan" }
];

export function CameraOverlay({ settings, advanced, score, frameNumber, isRecording, onFocusPointChange }: CameraOverlayProps) {
  const activeMulti = settings.focusPoint === "multi-point";

  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:33.333%_33.333%] opacity-55" />

      <div className="absolute left-3 right-3 top-2 flex items-center justify-between font-mono text-[10px] text-white/90 md:text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded bg-red-600/90 px-1.5 py-0.5 text-[9px] font-bold tracking-widest">REC</span>
          <span className={cn("flex items-center gap-1", isRecording ? "text-red-300" : "text-zinc-400")}>
            <Circle className={cn("h-2.5 w-2.5 fill-current", isRecording ? "animate-pulse" : "opacity-50")} />
            LIVE
          </span>
          <span>{advanced.fileFormat}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 sm:flex"><Zap className="h-3 w-3 text-amber-300" /> {settings.whiteBalance}</span>
          <span className="hidden items-center gap-1 sm:flex"><HardDrive className="h-3 w-3 text-cyan-300" /> 248</span>
          <span className="flex items-center gap-1"><BatteryFull className="h-4 w-4 text-lime-300" /> 82%</span>
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-0">
        {focusPoints.map((point) => {
          const active = activeMulti || settings.focusPoint === point.id;
          return (
            <button
              key={point.id}
              type="button"
              aria-label={point.label}
              onClick={() => onFocusPointChange(point.id)}
              className={cn(
                "absolute h-8 w-11 -translate-x-1/2 -translate-y-1/2 border transition md:h-10 md:w-14",
                active ? "border-lime-300 shadow-[0_0_16px_rgba(190,242,100,0.65)]" : "border-white/35 hover:border-white/80",
                point.className
              )}
            >
              <span className={cn("absolute inset-1 border", active ? "border-lime-200/80" : "border-white/15")} />
            </button>
          );
        })}
        <button
          type="button"
          aria-label="AF multi point"
          onClick={() => onFocusPointChange("multi-point")}
          className={cn(
            "absolute left-1/2 top-[37%] h-20 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition",
            activeMulti ? "border-lime-300/90 shadow-[0_0_22px_rgba(190,242,100,0.35)]" : "border-white/20 hover:border-white/60"
          )}
        />
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
        <div className="rounded-md border border-white/10 bg-black/45 px-2.5 py-1.5 font-mono text-[10px] leading-5 backdrop-blur md:text-xs">
          <div className="flex gap-3">
            <span>ISO {settings.iso}</span>
            <span>{settings.shutterSpeed}</span>
            <span>{settings.aperture}</span>
            <span className="hidden sm:inline">{settings.focalLength}</span>
          </div>
          <ExposureMeter value={score.exposureMeter} compact />
        </div>
        <div className="rounded-md border border-white/10 bg-black/45 px-2.5 py-1.5 font-mono text-[10px] leading-5 backdrop-blur md:text-xs">
          <div className="flex items-center gap-2">
            <Crosshair className="h-3.5 w-3.5 text-lime-300" />
            <span>{settings.afMode}</span>
            <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.8)]" />
          </div>
          <div className="text-zinc-300">IMG_{String(frameNumber).padStart(4, "0")}.CR3</div>
        </div>
      </div>
    </div>
  );
}
