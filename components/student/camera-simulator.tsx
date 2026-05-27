"use client";

import { useCallback, useMemo, useState } from "react";
import { Camera, CircleDot, Cpu } from "lucide-react";
import { CameraBody } from "@/components/student/camera-simulator/camera-body";
import { CameraControls } from "@/components/student/camera-simulator/camera-controls";
import type { SaveState, SimulatedShot } from "@/components/student/camera-simulator/types";
import {
  CameraPhysicsEngine,
  DEFAULT_ADVANCED_SETTINGS,
  DEFAULT_CAMERA_SETTINGS,
  scoreCameraAttempt,
  type AdvancedCameraSettings,
  type CameraSettings,
  type FocusPoint,
  type ShootingMode
} from "@/lib/camera-score";

type ControlMode = "basic" | "advanced";

function createShotId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `shot-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function playShutterSound() {
  if (typeof window === "undefined") return;

  const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  const AudioContextClass = window.AudioContext ?? audioWindow.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(165, now);
  oscillator.frequency.exponentialRampToValueAtTime(48, now + 0.075);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
  window.setTimeout(() => void context.close(), 180);
}

export function CameraSimulator() {
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS);
  const [advanced, setAdvanced] = useState<AdvancedCameraSettings>(DEFAULT_ADVANCED_SETTINGS);
  const [shots, setShots] = useState<SimulatedShot[]>([]);
  const [controlMode, setControlMode] = useState<ControlMode>("basic");
  const [learningMode, setLearningMode] = useState(true);
  const [isShooting, setIsShooting] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const score = useMemo(() => scoreCameraAttempt(settings), [settings]);
  const frameNumber = 1208 + shots.length;

  const updateSetting = useCallback(<K extends keyof CameraSettings>(key: K, value: CameraSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }, []);

  const updateAdvanced = useCallback(<K extends keyof AdvancedCameraSettings>(key: K, value: AdvancedCameraSettings[K]) => {
    setAdvanced((current) => ({ ...current, [key]: value }));
  }, []);

  const handleModeChange = useCallback((mode: ShootingMode) => {
    const preset = CameraPhysicsEngine.getModePreset(mode);
    setSettings((current) => ({ ...current, ...preset, shootingMode: mode }));
    setSaveState("idle");
    setMessage(`Mode ${mode} aktif. Dial menerapkan preset kamera DSLR untuk latihan cepat.`);
  }, []);

  const handleFocusPointChange = useCallback((value: FocusPoint) => {
    updateSetting("focusPoint", value);
  }, [updateSetting]);

  const handleShoot = useCallback(() => {
    const shot: SimulatedShot = {
      id: createShotId(),
      createdAt: new Date().toISOString(),
      settings: { ...settings },
      advanced: { ...advanced },
      score
    };

    setIsShooting(true);
    setIsFrozen(true);
    setShots((current) => [shot, ...current].slice(0, 6));
    setMessage(`Jepretan tersimpan ke fake gallery. Skor simulasi: ${score.totalScore}.`);
    playShutterSound();

    window.setTimeout(() => setIsShooting(false), 300);
    window.setTimeout(() => setIsFrozen(false), 520);
  }, [advanced, score, settings]);

  const saveAttempt = useCallback(async () => {
    setSaveState("saving");
    setMessage("");

    try {
      const res = await fetch("/api/simulations/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, advanced })
      });
      const data = await res.json();

      if (!res.ok) {
        setSaveState("error");
        setMessage(data.error ?? "Gagal menyimpan simulasi.");
        return;
      }

      setSaveState("saved");
      setMessage(`Pengaturan kamera tersimpan ke database. Skor: ${data.totalScore}.`);
    } catch {
      setSaveState("error");
      setMessage("Gagal menyimpan simulasi. Periksa koneksi atau sesi login.");
    }
  }, [advanced, settings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_CAMERA_SETTINGS);
    setAdvanced(DEFAULT_ADVANCED_SETTINGS);
    setSaveState("idle");
    setMessage("");
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-[radial-gradient(circle_at_16%_12%,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(34,211,238,0.12),transparent_26%),linear-gradient(135deg,#111113,#050506_48%,#09090b)] p-3 text-white shadow-[0_30px_110px_rgba(0,0,0,0.28)] md:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-red-200">
            <CircleDot className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            EOS style immersive trainer
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white md:text-4xl">Camera Simulator</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Body DSLR matte, live view realtime, mode dial interaktif, exposure physics, dan scoring jurnalistik tetap terhubung ke sistem lama.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-zinc-800 bg-black/55 p-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 shadow-inner">
          <div className="rounded-xl bg-zinc-950 px-3 py-2">
            <span className="flex items-center gap-1 text-zinc-500"><Camera className="h-3 w-3" /> Mode</span>
            <strong className="mt-1 block text-sm text-white">{settings.shootingMode}</strong>
          </div>
          <div className="rounded-xl bg-zinc-950 px-3 py-2">
            <span className="flex items-center gap-1 text-zinc-500"><Cpu className="h-3 w-3" /> Score</span>
            <strong className="mt-1 block text-sm text-amber-200">{score.totalScore}</strong>
          </div>
          <div className="rounded-xl bg-zinc-950 px-3 py-2">
            <span className="text-zinc-500">EV</span>
            <strong className="mt-1 block text-sm text-lime-200">{score.exposureMeter > 0 ? `+${score.exposureMeter}` : score.exposureMeter}</strong>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <CameraBody
          settings={settings}
          advanced={advanced}
          score={score}
          shots={shots}
          isShooting={isShooting}
          isFrozen={isFrozen}
          saveState={saveState}
          message={message}
          frameNumber={frameNumber}
          onModeChange={handleModeChange}
          onFocusPointChange={handleFocusPointChange}
          onShoot={handleShoot}
          onSave={saveAttempt}
          onReset={resetSettings}
        />
        <CameraControls
          settings={settings}
          advanced={advanced}
          score={score}
          controlMode={controlMode}
          learningMode={learningMode}
          saveState={saveState}
          onControlModeChange={setControlMode}
          onLearningModeChange={setLearningMode}
          onSettingChange={updateSetting}
          onAdvancedChange={updateAdvanced}
          onSave={saveAttempt}
          onReset={resetSettings}
        />
      </div>
    </section>
  );
}
