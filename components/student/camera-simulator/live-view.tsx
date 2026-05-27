import { motion } from "framer-motion";
import { CameraOverlay } from "@/components/student/camera-simulator/camera-overlay";
import { Histogram } from "@/components/student/camera-simulator/histogram";
import type { AdvancedCameraSettings, CameraScore, CameraSettings, FocusPoint } from "@/lib/camera-score";
import { cn } from "@/lib/utils";

type LiveViewProps = {
  settings: CameraSettings;
  advanced: AdvancedCameraSettings;
  score: CameraScore;
  isShooting: boolean;
  isFrozen: boolean;
  frameNumber: number;
  onFocusPointChange: (value: FocusPoint) => void;
};

function pictureStyleSaturation(style: string) {
  if (style === "Portrait") return 1.06;
  if (style === "Landscape") return 1.15;
  if (style === "Journalism") return 0.98;
  if (style === "Monochrome") return 0;
  return 1;
}

export function LiveView({ settings, advanced, score, isShooting, isFrozen, frameNumber, onFocusPointChange }: LiveViewProps) {
  const overexposed = score.exposureStatus === "OVER" && score.highlightOpacity > 0.05;
  const underexposed = score.exposureStatus === "UNDER";
  const frozenClass = isFrozen ? "scale-[1.015] opacity-90" : "scale-100 opacity-100";
  const saturation = score.saturation * pictureStyleSaturation(advanced.pictureStyle);

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-700/90 bg-black shadow-[inset_0_0_32px_rgba(0,0,0,0.9),0_0_0_7px_rgba(14,14,16,0.98),0_30px_80px_rgba(0,0,0,0.55)]">
      <div className="relative aspect-video">
        <motion.div
          className={cn("absolute inset-0 origin-center transition duration-300", frozenClass)}
          animate={isShooting ? { scale: [1, 1.018, 1], x: [0, -2, 1, 0] } : { scale: 1, x: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            filter: `brightness(${score.brightness}) contrast(${score.contrast}) saturate(${saturation}) grayscale(${advanced.pictureStyle === "Monochrome" ? 1 : 0})`
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-zinc-950 to-black"
            style={{
              backgroundImage: `radial-gradient(circle at 16% 20%, ${score.whiteBalanceGlow}, transparent 24%), radial-gradient(circle at 78% 36%, rgba(56,189,248,0.2), transparent 28%), linear-gradient(135deg,#1f2937 0%,#0f172a 42%,#020617 100%)`
            }}
          />

          <div
            className="absolute inset-x-0 top-0 h-[58%] origin-center bg-[radial-gradient(circle_at_18%_35%,rgba(255,244,214,0.55),transparent_11%),radial-gradient(circle_at_48%_28%,rgba(125,211,252,0.22),transparent_10%),radial-gradient(circle_at_78%_34%,rgba(248,113,113,0.25),transparent_12%),linear-gradient(180deg,rgba(30,41,59,0.9),rgba(15,23,42,0.35))]"
            style={{
              filter: `blur(${score.depthBlur * 0.45}px)`,
              transform: `scale(${score.focalCompression}) translateY(${score.backgroundShift}px)`
            }}
          />

          <div
            className="absolute bottom-[20%] left-0 right-0 h-[22%] bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900"
            style={{ filter: `blur(${score.depthBlur * 0.18}px)` }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[32%] bg-[linear-gradient(110deg,#111827_0_28%,#27272a_28%_31%,#0f172a_31%_58%,#3f3f46_58%_61%,#111827_61%)]" />

          <div
            className="absolute left-[17%] top-[31%] h-[34%] w-[18%] rounded-t-full bg-gradient-to-b from-zinc-100/95 via-slate-300/95 to-slate-900/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
            style={{ filter: `blur(${Math.max(0, score.motionBlur * 0.18)}px)` }}
          >
            <div className="absolute left-1/2 top-[10%] h-[25%] w-[42%] -translate-x-1/2 rounded-full bg-amber-200/90" />
            <div className="absolute bottom-0 left-[18%] h-[42%] w-[22%] rounded-t-md bg-red-700/90" />
            <div className="absolute bottom-0 right-[18%] h-[42%] w-[22%] rounded-t-md bg-blue-900/90" />
          </div>

          <div
            className="absolute right-[20%] top-[24%] h-[46%] w-[16%] rounded-[30%] bg-gradient-to-br from-amber-100/80 via-orange-400/45 to-red-900/60 shadow-[0_18px_46px_rgba(0,0,0,0.42)]"
            style={{
              filter: `blur(${score.motionBlur}px)`,
              transform: `translateX(${score.motionBlur * 1.8}px)`
            }}
          >
            <div className="absolute left-[28%] top-[16%] h-[20%] w-[44%] rounded-full bg-amber-100/90" />
            <div className="absolute bottom-[7%] left-[18%] h-[38%] w-[28%] rounded bg-black/70" />
            <div className="absolute bottom-[7%] right-[16%] h-[38%] w-[28%] rounded bg-black/70" />
          </div>

          <div
            className="absolute right-[38%] top-[42%] h-[14%] w-[20%] rounded-md bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950 shadow-xl"
            style={{ filter: `blur(${score.motionBlur * 0.5}px)` }}
          >
            <div className="absolute -right-7 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border-[5px] border-zinc-900 bg-sky-300/25" />
          </div>

          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              opacity: score.noiseOpacity,
              backgroundImage: `radial-gradient(rgba(255,255,255,${0.26 + score.noiseStrength * 0.5}) 0.7px, transparent 0.8px)`,
              backgroundSize: score.noiseStrength > 0.55 ? "5px 5px" : "8px 8px"
            }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: score.whiteBalanceTint }} />
          <div className="absolute inset-0 bg-black" style={{ opacity: score.shadowOpacity }} />

          {advanced.dynamicRangeOptimizer ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0_42%,rgba(255,255,255,0.05)_78%,transparent_100%)] opacity-70" />
          ) : null}

          {advanced.highlightAlert && overexposed ? (
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.92),transparent_18%),radial-gradient(circle_at_76%_35%,rgba(255,255,255,0.8),transparent_17%)]"
              animate={{ opacity: [score.highlightOpacity, score.highlightOpacity * 0.25, score.highlightOpacity] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          ) : null}

          {advanced.zebraExposure && overexposed ? (
            <div className="absolute inset-0 opacity-60 mix-blend-screen [background:repeating-linear-gradient(135deg,rgba(255,255,255,0.0)_0_8px,rgba(255,255,255,0.75)_8px_10px)]" />
          ) : null}
        </motion.div>

        <CameraOverlay
          settings={settings}
          advanced={advanced}
          score={score}
          frameNumber={frameNumber}
          isRecording={!underexposed}
          onFocusPointChange={onFocusPointChange}
        />

        <Histogram values={score.histogram} className="absolute right-3 top-10 z-30 hidden w-28 sm:block" />

        <motion.div
          className="pointer-events-none absolute inset-0 z-40 bg-white"
          animate={isShooting ? { opacity: [0, 0.88, 0] } : { opacity: 0 }}
          transition={{ duration: 0.28 }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          animate={isFrozen ? { opacity: [0.12, 0.2, 0] } : { opacity: 0 }}
          transition={{ duration: 0.38 }}
        />
      </div>
    </div>
  );
}
