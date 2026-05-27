import type { ReactNode } from "react";
import { Aperture, BookOpen, Eye, Focus, Gauge, Info, RotateCcw, Save, SlidersHorizontal, Sun, Zap } from "lucide-react";
import { ExposureMeter } from "@/components/student/camera-simulator/exposure-meter";
import type { SaveState } from "@/components/student/camera-simulator/types";
import {
  AF_MODES,
  APERTURES,
  DRIVE_MODES,
  FILE_FORMATS,
  FOCAL_LENGTHS,
  FOCUS_POINTS,
  ISO_VALUES,
  METERING_MODES,
  PICTURE_STYLES,
  SHUTTERS,
  WHITE_BALANCES,
  type AdvancedCameraSettings,
  type CameraScore,
  type CameraSettings
} from "@/lib/camera-score";
import { cn } from "@/lib/utils";

type ControlMode = "basic" | "advanced";

type CameraControlsProps = {
  settings: CameraSettings;
  advanced: AdvancedCameraSettings;
  score: CameraScore;
  controlMode: ControlMode;
  learningMode: boolean;
  saveState: SaveState;
  onControlModeChange: (value: ControlMode) => void;
  onLearningModeChange: (value: boolean) => void;
  onSettingChange: <K extends keyof CameraSettings>(key: K, value: CameraSettings[K]) => void;
  onAdvancedChange: <K extends keyof AdvancedCameraSettings>(key: K, value: AdvancedCameraSettings[K]) => void;
  onSave: () => void;
  onReset: () => void;
};

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(24,24,27,0.92),rgba(3,3,3,0.72))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="mb-4 flex items-center gap-2 text-sm font-black text-zinc-100">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-black text-amber-300">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function nextValue<T>(values: readonly T[], current: T, direction: -1 | 1) {
  const index = values.findIndex((value) => value === current);
  const safeIndex = index === -1 ? 0 : index;
  return values[(safeIndex + direction + values.length) % values.length];
}

function ValueWheel<T extends string | number>({
  label,
  value,
  values,
  onChange,
  hint
}: {
  label: string;
  value: T;
  values: readonly T[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/55 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">{label}</span>
        {hint ? <LearningTip text={hint} /> : null}
      </div>
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => onChange(nextValue(values, value, -1))} className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-amber-300 hover:text-amber-200">-</button>
        <div className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-[#162a22] px-2 py-2 text-center font-mono text-lg font-black text-lime-200 shadow-inner">{value}</div>
        <button type="button" onClick={() => onChange(nextValue(values, value, 1))} className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-amber-300 hover:text-amber-200">+</button>
      </div>
    </div>
  );
}

function SegmentedGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  hint
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">{label}</span>
        {hint ? <LearningTip text={hint} /> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3 py-2 text-xs font-bold transition",
              option === value ? "border-red-400 bg-red-600/90 text-white shadow-[0_0_18px_rgba(239,68,68,0.28)]" : "border-zinc-800 bg-black/50 text-zinc-300 hover:border-amber-300 hover:text-amber-200"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-black/45 px-3 py-3 text-left">
      <span className="text-sm font-semibold text-zinc-200">{label}</span>
      <span className={cn("relative h-6 w-11 rounded-full border transition", checked ? "border-red-400 bg-red-600" : "border-zinc-700 bg-zinc-950")}>
        <span className={cn("absolute top-1 h-3.5 w-3.5 rounded-full bg-white transition", checked ? "left-6" : "left-1")} />
      </span>
    </button>
  );
}

function LearningTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <Info className="h-3.5 w-3.5 text-cyan-300" />
      <span className="pointer-events-none absolute right-0 top-5 z-40 hidden w-56 rounded-lg border border-cyan-300/20 bg-zinc-950 p-3 text-xs normal-case leading-5 tracking-normal text-zinc-200 shadow-2xl group-hover:block">
        {text}
      </span>
    </span>
  );
}

function EducationConsole({ score }: { score: CameraScore }) {
  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm leading-6 text-zinc-200">
      <div className="mb-2 flex items-center gap-2 font-black text-cyan-200">
        <BookOpen className="h-4 w-4" />
        Educational Mode
      </div>
      <p>{score.exposureExplanation}</p>
      <p className="mt-2">{score.blurReason}</p>
      <p className="mt-2">{score.noiseReason}</p>
    </div>
  );
}

export function CameraControls({
  settings,
  advanced,
  score,
  controlMode,
  learningMode,
  saveState,
  onControlModeChange,
  onLearningModeChange,
  onSettingChange,
  onAdvancedChange,
  onSave,
  onReset
}: CameraControlsProps) {
  return (
    <aside className="space-y-4 text-white">
      <div className="rounded-2xl border border-zinc-800 bg-black/60 p-3 shadow-[inset_0_0_18px_rgba(255,255,255,0.03)]">
        <div className="grid grid-cols-2 gap-2">
          {(["basic", "advanced"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onControlModeChange(mode)}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-black capitalize transition",
                controlMode === mode ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.28)]" : "bg-zinc-900 text-zinc-400 hover:text-zinc-100"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onLearningModeChange(!learningMode)}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition",
            learningMode ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100" : "border-zinc-800 bg-zinc-950 text-zinc-400"
          )}
        >
          <BookOpen className="h-4 w-4" />
          Mode belajar
        </button>
      </div>

      {controlMode === "basic" ? (
        <>
          <Section title="Exposure Triangle" icon={<Aperture className="h-4 w-4" />}>
            <div className="grid gap-3">
              <ValueWheel
                label="ISO wheel"
                value={settings.iso}
                values={ISO_VALUES}
                onChange={(value) => onSettingChange("iso", value)}
                hint="ISO menaikkan sensitivitas sensor. Semakin tinggi ISO, gambar lebih terang tetapi noise meningkat."
              />
              <ValueWheel
                label="Aperture dial"
                value={settings.aperture}
                values={APERTURES}
                onChange={(value) => onSettingChange("aperture", value)}
                hint="Angka f kecil membuka aperture besar: background lebih blur dan cahaya lebih banyak."
              />
              <ValueWheel
                label="Shutter wheel"
                value={settings.shutterSpeed}
                values={SHUTTERS}
                onChange={(value) => onSettingChange("shutterSpeed", value)}
                hint="Shutter lambat menangkap lebih banyak cahaya, tetapi subjek bergerak lebih mudah blur."
              />
            </div>
          </Section>

          <Section title="Focus and Drive" icon={<Focus className="h-4 w-4" />}>
            <div className="space-y-4">
              <SegmentedGroup label="AF system" value={settings.afMode} options={AF_MODES} onChange={(value) => onSettingChange("afMode", value)} />
              <SegmentedGroup label="Drive" value={settings.driveMode} options={DRIVE_MODES} onChange={(value) => onSettingChange("driveMode", value)} />
              <SegmentedGroup label="Focus point" value={settings.focusPoint} options={FOCUS_POINTS} onChange={(value) => onSettingChange("focusPoint", value)} />
            </div>
          </Section>

          <Section title="Color and Metering" icon={<Sun className="h-4 w-4" />}>
            <div className="space-y-4">
              <SegmentedGroup label="White balance" value={settings.whiteBalance} options={WHITE_BALANCES} onChange={(value) => onSettingChange("whiteBalance", value)} />
              <SegmentedGroup label="Metering" value={settings.meteringMode} options={METERING_MODES} onChange={(value) => onSettingChange("meteringMode", value)} />
              <ValueWheel label="Focal length" value={settings.focalLength} values={FOCAL_LENGTHS} onChange={(value) => onSettingChange("focalLength", value)} />
            </div>
          </Section>
        </>
      ) : (
        <>
          <Section title="Advanced Camera Menu" icon={<SlidersHorizontal className="h-4 w-4" />}>
            <div className="space-y-3">
              <ToggleRow label="Highlight alert" checked={advanced.highlightAlert} onChange={(value) => onAdvancedChange("highlightAlert", value)} />
              <ToggleRow label="Zebra exposure" checked={advanced.zebraExposure} onChange={(value) => onAdvancedChange("zebraExposure", value)} />
              <ToggleRow label="Image stabilization" checked={advanced.imageStabilization} onChange={(value) => onAdvancedChange("imageStabilization", value)} />
              <ToggleRow label="Dynamic range optimizer" checked={advanced.dynamicRangeOptimizer} onChange={(value) => onAdvancedChange("dynamicRangeOptimizer", value)} />
            </div>
          </Section>

          <Section title="Capture Profile" icon={<Eye className="h-4 w-4" />}>
            <div className="space-y-4">
              <SegmentedGroup label="Picture style" value={advanced.pictureStyle} options={PICTURE_STYLES} onChange={(value) => onAdvancedChange("pictureStyle", value)} />
              <SegmentedGroup label="RAW/JPEG" value={advanced.fileFormat} options={FILE_FORMATS} onChange={(value) => onAdvancedChange("fileFormat", value)} />
            </div>
          </Section>

          <Section title="Meter Readout" icon={<Gauge className="h-4 w-4" />}>
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-3">
              <div className="mb-2 flex items-center justify-between font-mono text-xs text-zinc-300">
                <span>EV {score.exposureMeter > 0 ? `+${score.exposureMeter}` : score.exposureMeter}</span>
                <span>{score.exposureStatus}</span>
              </div>
              <ExposureMeter value={score.exposureMeter} />
            </div>
          </Section>
        </>
      )}

      {learningMode ? <EducationConsole score={score} /> : null}

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onReset} className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-bold text-zinc-200 hover:border-amber-300 hover:text-amber-200">
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saveState === "saving"}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-[0_0_22px_rgba(220,38,38,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {saveState === "saving" ? "Saving" : "Simpan"}
        </button>
      </div>

      <div className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-amber-100">
          <Zap className="h-4 w-4" />
          Evaluasi Otomatis
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs text-zinc-300">
          <div className="rounded-lg bg-black/45 p-2">EXP <strong className="text-white">{score.exposureScore}/30</strong></div>
          <div className="rounded-lg bg-black/45 p-2">TV <strong className="text-white">{score.shutterScore}/20</strong></div>
          <div className="rounded-lg bg-black/45 p-2">AV <strong className="text-white">{score.apertureScore}/20</strong></div>
          <div className="rounded-lg bg-black/45 p-2">ISO <strong className="text-white">{score.isoScore}/15</strong></div>
          <div className="col-span-2 rounded-lg bg-black/45 p-2">WB <strong className="text-white">{score.wbScore}/15</strong></div>
        </div>
      </div>
    </aside>
  );
}
