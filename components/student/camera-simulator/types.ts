import type { AdvancedCameraSettings, CameraScore, CameraSettings } from "@/lib/camera-score";

export type SimulatedShot = {
  id: string;
  createdAt: string;
  settings: CameraSettings;
  advanced: AdvancedCameraSettings;
  score: CameraScore;
};

export type SaveState = "idle" | "saving" | "saved" | "error";
