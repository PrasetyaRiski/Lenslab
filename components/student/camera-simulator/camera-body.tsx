import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Image as ImageIcon, Menu, RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { LiveView } from "@/components/student/camera-simulator/live-view";
import { ModeDial } from "@/components/student/camera-simulator/mode-dial";
import { ShutterButton } from "@/components/student/camera-simulator/shutter-button";
import type { SaveState, SimulatedShot } from "@/components/student/camera-simulator/types";
import type { AdvancedCameraSettings, CameraScore, CameraSettings, FocusPoint, ShootingMode } from "@/lib/camera-score";
import { cn } from "@/lib/utils";

type CameraBodyProps = {
  settings: CameraSettings;
  advanced: AdvancedCameraSettings;
  score: CameraScore;
  shots: SimulatedShot[];
  isShooting: boolean;
  isFrozen: boolean;
  saveState: SaveState;
  message: string;
  frameNumber: number;
  onModeChange: (value: ShootingMode) => void;
  onFocusPointChange: (value: FocusPoint) => void;
  onShoot: () => void;
  onSave: () => void;
  onReset: () => void;
};

function statusLabel(score: CameraScore) {
  if (score.totalScore >= 90) return "Excellent";
  if (score.totalScore >= 75) return "Very Good";
  if (score.totalScore >= 60) return "Good";
  return "Adjust";
}

function TopLcd({ settings, score, saveState }: { settings: CameraSettings; score: CameraScore; saveState: SaveState }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-lime-300/15 bg-[#26382f] p-3 font-mono text-[#bff6ca] shadow-[inset_0_0_18px_rgba(0,0,0,0.72)]">
      <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-[0.14em] text-[#7fb88d]">
        <span>Mode</span>
        <span>ISO</span>
        <span>Av</span>
        <span>Tv</span>
      </div>
      <div className="mt-1 grid grid-cols-4 gap-2 text-center text-sm font-black md:text-base">
        <span>{settings.shootingMode}</span>
        <span>{settings.iso}</span>
        <span>{settings.aperture.replace("f/", "")}</span>
        <span>{settings.shutterSpeed}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
        <span>DR {score.dynamicRangeScore}</span>
        <span>{statusLabel(score)}</span>
        <span className={saveState === "saved" ? "text-lime-200" : "text-[#7fb88d]"}>{saveState === "saving" ? "WRITE" : "READY"}</span>
      </div>
    </div>
  );
}

function PhysicalButton({ children, active = false, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-[linear-gradient(145deg,#2f2f35,#070707)] text-zinc-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.08),0_8px_14px_rgba(0,0,0,0.42)] transition hover:text-amber-200",
        active && "border-red-500/80 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.34)]"
      )}
    >
      {children}
    </button>
  );
}

function ShotGallery({ shots }: { shots: SimulatedShot[] }) {
  return (
    <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/45 p-3 shadow-[inset_0_0_18px_rgba(0,0,0,0.5)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
          <ImageIcon className="h-4 w-4 text-amber-300" />
          Fake Photo Gallery
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{shots.length}/6</span>
      </div>
      {shots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">Tekan shutter untuk membuat hasil jepretan simulasi.</div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shots.map((shot) => (
            <div key={shot.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
              <div
                className="relative aspect-video"
                style={{
                  filter: `brightness(${shot.score.brightness}) contrast(${shot.score.contrast}) saturate(${shot.advanced.pictureStyle === "Monochrome" ? 0 : shot.score.saturation})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-zinc-900 to-black" />
                <div className="absolute inset-0" style={{ backgroundColor: shot.score.whiteBalanceTint }} />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-zinc-800" />
                <div className="absolute left-[24%] top-[30%] h-[42%] w-[18%] rounded-t-full bg-amber-100/80" style={{ filter: `blur(${shot.score.depthBlur * 0.2}px)` }} />
                <div className="absolute right-[25%] top-[30%] h-[38%] w-[16%] rounded-t-full bg-red-400/70" style={{ filter: `blur(${shot.score.motionBlur * 0.55}px)` }} />
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 font-mono text-[9px] text-zinc-400">
                <span>{shot.settings.iso}</span>
                <span>{shot.settings.aperture}</span>
                <span>{shot.score.totalScore}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CameraBody({
  settings,
  advanced,
  score,
  shots,
  isShooting,
  isFrozen,
  saveState,
  message,
  frameNumber,
  onModeChange,
  onFocusPointChange,
  onShoot,
  onSave,
  onReset
}: CameraBodyProps) {
  return (
    <div>
      <motion.div
        className="relative mx-auto max-w-6xl"
        animate={isShooting ? { rotate: [0, -0.35, 0.3, 0], y: [0, -2, 1, 0] } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="absolute left-[40%] top-0 z-10 hidden h-12 w-48 -translate-y-6 rounded-t-2xl border border-zinc-800 bg-[linear-gradient(180deg,#1f1f23,#050505)] shadow-2xl lg:block">
          <div className="mx-auto mt-2 h-5 w-24 rounded-md border border-zinc-700 bg-zinc-950 shadow-inner" />
        </div>

        <div className="absolute left-1/2 top-4 z-20 hidden h-20 w-52 -translate-x-1/2 rounded-t-[38px] border border-zinc-800 bg-[radial-gradient(circle_at_50%_18%,#3f3f46,#111113_55%,#030303)] shadow-[0_18px_50px_rgba(0,0,0,0.5)] lg:block">
          <div className="mx-auto mt-6 h-9 w-28 rounded-b-2xl rounded-t-md border border-cyan-300/20 bg-cyan-950/45 shadow-[inset_0_0_20px_rgba(34,211,238,0.12)]" />
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-[radial-gradient(circle_at_15%_15%,rgba(82,82,91,0.36),transparent_25%),linear-gradient(145deg,#202024,#08080a_52%,#020202)] p-4 pt-8 text-white shadow-[inset_0_3px_8px_rgba(255,255,255,0.06),inset_0_-42px_60px_rgba(0,0,0,0.72),0_36px_95px_rgba(0,0,0,0.45)] md:p-6 lg:pt-12">
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:7px_7px]" />
          <div className="absolute bottom-0 right-0 top-0 hidden w-[18%] rounded-l-[42px] border-l border-white/5 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(0,0,0,0.6)),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.12),transparent_24%)] shadow-[inset_18px_0_30px_rgba(255,255,255,0.03)] lg:block" />

          <div className="relative z-10 mb-5 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center justify-between gap-3 lg:w-52 lg:justify-start">
              <ModeDial value={settings.shootingMode} onChange={onModeChange} />
              <div className="lg:hidden">
                <ShutterButton onShoot={onShoot} isShooting={isShooting} className="h-16 w-16" />
              </div>
            </div>

            <TopLcd settings={settings} score={score} saveState={saveState} />

            <div className="hidden items-center gap-4 lg:flex">
              <div className="grid grid-cols-2 gap-2">
                <PhysicalButton onClick={onSave} active={saveState === "saved"}><Save className="h-4 w-4" /></PhysicalButton>
                <PhysicalButton onClick={onReset}><RotateCcw className="h-4 w-4" /></PhysicalButton>
                <PhysicalButton active={advanced.highlightAlert}><SlidersHorizontal className="h-4 w-4" /></PhysicalButton>
                <PhysicalButton active={advanced.dynamicRangeOptimizer}><Menu className="h-4 w-4" /></PhysicalButton>
              </div>
              <ShutterButton onShoot={onShoot} isShooting={isShooting} />
            </div>
          </div>

          <div className="relative z-10 grid gap-5 lg:grid-cols-[72px_minmax(0,1fr)_150px] lg:items-center">
            <div className="hidden flex-col items-center gap-3 lg:flex">
              <div className="h-20 w-12 rounded-full border border-zinc-700 bg-[linear-gradient(90deg,#050505,#2b2b31,#050505)] shadow-inner" />
              <div className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-950" />
              <div className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-950" />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-black/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                <span className="flex items-center gap-2"><Cpu className="h-3.5 w-3.5 text-cyan-300" /> DIGIC EDU LIVE VIEW</span>
                <span className="flex items-center gap-2 text-lime-300"><CheckCircle2 className="h-3.5 w-3.5" /> Focus lock</span>
              </div>
              <LiveView
                settings={settings}
                advanced={advanced}
                score={score}
                isShooting={isShooting}
                isFrozen={isFrozen}
                frameNumber={frameNumber}
                onFocusPointChange={onFocusPointChange}
              />
            </div>

            <div className="hidden h-full min-h-[310px] rounded-[34px] border border-zinc-800 bg-[linear-gradient(160deg,#1d1d22,#050505)] p-4 shadow-[inset_12px_0_22px_rgba(255,255,255,0.04),inset_-22px_0_30px_rgba(0,0,0,0.85)] lg:block">
              <div className="mb-5 h-24 rounded-[28px] bg-[radial-gradient(circle_at_65%_40%,rgba(255,255,255,0.18),transparent_28%),#08080a] shadow-inner" />
              <div className="space-y-3">
                <div className="h-10 rounded-full border border-zinc-700 bg-zinc-950 shadow-inner" />
                <div className="h-10 rounded-full border border-zinc-700 bg-zinc-950 shadow-inner" />
                <div className="h-10 rounded-full border border-zinc-700 bg-zinc-950 shadow-inner" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap gap-2 lg:hidden">
            <button type="button" onClick={onSave} className="rounded-full border border-zinc-700 bg-black/45 px-4 py-2 text-xs font-bold text-zinc-200">Simpan Skor</button>
            <button type="button" onClick={onReset} className="rounded-full border border-zinc-700 bg-black/45 px-4 py-2 text-xs font-bold text-zinc-200">Reset</button>
          </div>
        </div>
      </motion.div>

      {message ? (
        <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100 shadow-[0_0_22px_rgba(245,158,11,0.12)]">{message}</div>
      ) : null}

      <ShotGallery shots={shots} />
    </div>
  );
}
