export {
  AF_MODES,
  APERTURES,
  CameraPhysicsEngine,
  DEFAULT_ADVANCED_SETTINGS,
  DEFAULT_CAMERA_SETTINGS,
  DRIVE_MODES,
  FILE_FORMATS,
  FOCAL_LENGTHS,
  FOCUS_POINTS,
  ISO_VALUES,
  METERING_MODES,
  PICTURE_STYLES,
  SHOOTING_MODES,
  SHUTTERS,
  WHITE_BALANCES,
  type AdvancedCameraSettings,
  type AfMode,
  type CameraScore,
  type CameraSettings,
  type DriveMode,
  type FileFormat,
  type FocusPoint,
  type MeteringMode,
  type PictureStyle,
  type ScoreInput,
  type ShootingMode
} from "@/lib/camera-physics-engine";

import { CameraPhysicsEngine, type ScoreInput } from "@/lib/camera-physics-engine";

export function getCameraSimulationState(input: ScoreInput) {
  return CameraPhysicsEngine.calculate(input);
}

export function scoreCameraAttempt(input: ScoreInput) {
  return CameraPhysicsEngine.scoreAttempt(input);
}
