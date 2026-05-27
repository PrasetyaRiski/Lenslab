export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400, 12800] as const;
export const APERTURES = ["f/1.8", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16", "f/22"] as const;
export const SHUTTERS = ["1/15", "1/30", "1/60", "1/125", "1/250", "1/500", "1/1000", "1/2000"] as const;
export const WHITE_BALANCES = ["Auto", "Daylight", "Cloudy", "Shade", "Tungsten", "Fluorescent"] as const;
export const FOCAL_LENGTHS = ["24mm", "35mm", "50mm", "85mm", "135mm", "200mm"] as const;
export const SHOOTING_MODES = ["Auto", "P", "Av", "Tv", "M", "Portrait", "Landscape", "Sports", "Night"] as const;
export const METERING_MODES = ["Evaluative", "Spot", "Center-weighted"] as const;
export const DRIVE_MODES = ["Single", "Continuous Low", "Continuous High", "Silent"] as const;
export const AF_MODES = ["AF-S", "AF-C", "MF"] as const;
export const FOCUS_POINTS = ["center", "left", "right", "multi-point"] as const;
export const PICTURE_STYLES = ["Standard", "Journalism", "Portrait", "Landscape", "Monochrome"] as const;
export const FILE_FORMATS = ["RAW", "JPEG", "RAW+JPEG"] as const;

export type ShootingMode = (typeof SHOOTING_MODES)[number];
export type MeteringMode = (typeof METERING_MODES)[number];
export type DriveMode = (typeof DRIVE_MODES)[number];
export type AfMode = (typeof AF_MODES)[number];
export type FocusPoint = (typeof FOCUS_POINTS)[number];
export type PictureStyle = (typeof PICTURE_STYLES)[number];
export type FileFormat = (typeof FILE_FORMATS)[number];

export type CameraSettings = {
  shootingMode: ShootingMode;
  iso: number;
  aperture: string;
  shutterSpeed: string;
  whiteBalance: string;
  focalLength: string;
  meteringMode: MeteringMode;
  driveMode: DriveMode;
  afMode: AfMode;
  focusPoint: FocusPoint;
};

export type AdvancedCameraSettings = {
  highlightAlert: boolean;
  zebraExposure: boolean;
  pictureStyle: PictureStyle;
  fileFormat: FileFormat;
  imageStabilization: boolean;
  dynamicRangeOptimizer: boolean;
};

export type ScoreInput = {
  iso: number;
  aperture: string;
  shutterSpeed: string;
  whiteBalance: string;
  focalLength?: string;
};

export type CameraPhysicsState = {
  apertureValue: number;
  shutterSeconds: number;
  focalLength: number;
  exposureMeter: number;
  exposureStatus: "UNDER" | "NORMAL" | "OVER";
  brightness: number;
  contrast: number;
  saturation: number;
  motionBlur: number;
  depthBlur: number;
  noiseStrength: number;
  noiseOpacity: number;
  handheldSafe: boolean;
  whiteBalanceTint: string;
  whiteBalanceGlow: string;
  focalCompression: number;
  backgroundShift: number;
  highlightOpacity: number;
  shadowOpacity: number;
  histogram: number[];
  dynamicRangeScore: number;
  exposureExplanation: string;
  blurReason: string;
  noiseReason: string;
};

export type CameraScore = CameraPhysicsState & {
  exposureScore: number;
  shutterScore: number;
  apertureScore: number;
  isoScore: number;
  wbScore: number;
  totalScore: number;
  feedback: string;
};

export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  shootingMode: "M",
  iso: 400,
  aperture: "f/5.6",
  shutterSpeed: "1/125",
  whiteBalance: "Auto",
  focalLength: "35mm",
  meteringMode: "Evaluative",
  driveMode: "Single",
  afMode: "AF-S",
  focusPoint: "center"
};

export const DEFAULT_ADVANCED_SETTINGS: AdvancedCameraSettings = {
  highlightAlert: true,
  zebraExposure: false,
  pictureStyle: "Journalism",
  fileFormat: "RAW+JPEG",
  imageStabilization: true,
  dynamicRangeOptimizer: true
};

const apertureMap: Record<string, number> = {
  "f/1.8": 1.8,
  "f/2.8": 2.8,
  "f/4": 4,
  "f/5.6": 5.6,
  "f/8": 8,
  "f/11": 11,
  "f/16": 16,
  "f/22": 22
};

const whiteBalanceMap: Record<string, { tint: string; glow: string; label: string }> = {
  Auto: { tint: "rgba(255,255,255,0.02)", glow: "rgba(125,211,252,0.12)", label: "netral otomatis" },
  Daylight: { tint: "rgba(255,244,214,0.08)", glow: "rgba(250,204,21,0.18)", label: "hangat siang" },
  Cloudy: { tint: "rgba(255,218,177,0.13)", glow: "rgba(251,146,60,0.22)", label: "soft warm" },
  Shade: { tint: "rgba(255,202,148,0.17)", glow: "rgba(249,115,22,0.22)", label: "hangat teduh" },
  Tungsten: { tint: "rgba(255,170,92,0.18)", glow: "rgba(245,158,11,0.25)", label: "warm tungsten" },
  Fluorescent: { tint: "rgba(121,255,184,0.13)", glow: "rgba(74,222,128,0.22)", label: "green tint" }
};

const modePresets: Record<ShootingMode, Partial<CameraSettings>> = {
  Auto: {
    iso: 400,
    aperture: "f/5.6",
    shutterSpeed: "1/125",
    whiteBalance: "Auto",
    focalLength: "35mm",
    afMode: "AF-S",
    driveMode: "Single",
    meteringMode: "Evaluative",
    focusPoint: "multi-point"
  },
  P: {
    iso: 400,
    aperture: "f/4",
    shutterSpeed: "1/250",
    whiteBalance: "Auto",
    focalLength: "35mm",
    afMode: "AF-S",
    driveMode: "Single",
    meteringMode: "Evaluative"
  },
  Av: {
    iso: 200,
    aperture: "f/2.8",
    shutterSpeed: "1/250",
    whiteBalance: "Daylight",
    focalLength: "50mm",
    afMode: "AF-S",
    driveMode: "Single"
  },
  Tv: {
    iso: 800,
    aperture: "f/4",
    shutterSpeed: "1/1000",
    whiteBalance: "Auto",
    focalLength: "85mm",
    afMode: "AF-C",
    driveMode: "Continuous Low"
  },
  M: {},
  Portrait: {
    iso: 200,
    aperture: "f/1.8",
    shutterSpeed: "1/250",
    whiteBalance: "Cloudy",
    focalLength: "85mm",
    afMode: "AF-S",
    driveMode: "Single",
    meteringMode: "Center-weighted",
    focusPoint: "center"
  },
  Landscape: {
    iso: 100,
    aperture: "f/11",
    shutterSpeed: "1/125",
    whiteBalance: "Daylight",
    focalLength: "24mm",
    afMode: "AF-S",
    driveMode: "Single",
    meteringMode: "Evaluative",
    focusPoint: "multi-point"
  },
  Sports: {
    iso: 800,
    aperture: "f/4",
    shutterSpeed: "1/1000",
    whiteBalance: "Auto",
    focalLength: "135mm",
    afMode: "AF-C",
    driveMode: "Continuous High",
    meteringMode: "Evaluative",
    focusPoint: "right"
  },
  Night: {
    iso: 3200,
    aperture: "f/2.8",
    shutterSpeed: "1/30",
    whiteBalance: "Tungsten",
    focalLength: "35mm",
    afMode: "AF-S",
    driveMode: "Silent",
    meteringMode: "Spot",
    focusPoint: "center"
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 2) {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

function parseShutter(value: string) {
  const [top, bottom] = value.split("/").map(Number);
  if (!top || !bottom) return 1 / 125;
  return top / bottom;
}

function parseFocalLength(value?: string) {
  return Number((value ?? "35mm").replace("mm", "")) || 35;
}

function parseAperture(value: string) {
  return apertureMap[value] ?? 5.6;
}

function createHistogram(exposureMeter: number, noiseStrength: number) {
  const center = clamp(8 + exposureMeter * 2.8, 1.5, 15.5);
  return Array.from({ length: 18 }, (_, index) => {
    const distance = Math.abs(index - center);
    const curve = Math.max(0.08, 1 - distance / 8);
    const spike = noiseStrength * (index % 3 === 0 ? 0.2 : 0.08);
    return clamp(round((curve ** 1.8 + spike) * 100, 0), 8, 96);
  });
}

function calculate(input: ScoreInput): CameraPhysicsState {
  const apertureValue = parseAperture(input.aperture);
  const shutterSeconds = parseShutter(input.shutterSpeed);
  const focalLength = parseFocalLength(input.focalLength);
  const cameraEv100 = Math.log2((apertureValue * apertureValue) / shutterSeconds);
  const effectiveEv = cameraEv100 - Math.log2(input.iso / 100);
  const targetJournalismEv = 10;
  const exposureMeter = clamp(round(targetJournalismEv - effectiveEv), -3, 3);

  let exposureStatus: CameraPhysicsState["exposureStatus"] = "NORMAL";
  if (exposureMeter <= -0.7) exposureStatus = "UNDER";
  if (exposureMeter >= 0.7) exposureStatus = "OVER";

  const brightness = clamp(round(0.88 + exposureMeter * 0.21), 0.26, 1.68);
  const contrast = clamp(round(1.02 + Math.abs(exposureMeter) * 0.05), 0.9, 1.22);
  const saturation = clamp(round(1.02 - Math.max(0, exposureMeter - 1.7) * 0.08), 0.82, 1.1);
  const motionBlur = clamp(round(Math.max(0, Math.log2(shutterSeconds / (1 / 250))) * 2.15), 0, 10);
  const depthBlur = clamp(round((5.6 / apertureValue - 0.7) * 7.2), 0, 12);
  const isoStops = Math.max(0, Math.log2(input.iso / 100));
  const noiseStrength = clamp(round((isoStops / 7) ** 1.4), 0.02, 1);
  const noiseOpacity = clamp(round(0.04 + noiseStrength * 0.36), 0.04, 0.42);
  const stabilizationFactor = shutterSeconds <= 1 / 30 ? 1.8 : 1;
  const handheldSafe = shutterSeconds <= stabilizationFactor / Math.max(30, focalLength);
  const wb = whiteBalanceMap[input.whiteBalance] ?? whiteBalanceMap.Auto;
  const focalCompression = clamp(round(0.94 + (focalLength - 24) / 150), 0.86, 1.95);
  const backgroundShift = clamp(round((focalLength - 35) / 16), -1.2, 8);
  const highlightOpacity = clamp(round((exposureMeter - 0.85) / 2.2), 0, 0.88);
  const shadowOpacity = clamp(round((-exposureMeter - 0.65) / 2.4), 0, 0.86);
  const dynamicRangeScore = clamp(round(100 - Math.abs(exposureMeter) * 18 - noiseStrength * 14, 0), 28, 100);
  const histogram = createHistogram(exposureMeter, noiseStrength);

  const exposureExplanation =
    exposureStatus === "NORMAL"
      ? "Exposure seimbang: highlight masih tertahan dan bayangan masih punya detail."
      : exposureStatus === "UNDER"
        ? "Gambar gelap karena kombinasi ISO rendah, aperture sempit, atau shutter terlalu cepat membatasi cahaya."
        : "Highlight mulai pecah karena terlalu banyak cahaya masuk ke sensor.";
  const blurReason =
    motionBlur <= 1
      ? "Gerakan relatif beku; shutter cukup cepat untuk subjek berita."
      : handheldSafe
        ? "Ada sedikit motion blur kreatif, tetapi masih aman untuk handheld."
        : "Blur muncul karena shutter lambat dibanding focal length dan gerakan kamera.";
  const noiseReason =
    input.iso <= 800
      ? "Noise rendah; detail halus masih bersih."
      : input.iso <= 3200
        ? "Noise mulai terlihat, masih wajar untuk kondisi liputan minim cahaya."
        : "Noise tinggi; tekstur digital akan tampak jelas di area gelap.";

  return {
    apertureValue,
    shutterSeconds,
    focalLength,
    exposureMeter,
    exposureStatus,
    brightness,
    contrast,
    saturation,
    motionBlur,
    depthBlur,
    noiseStrength,
    noiseOpacity,
    handheldSafe,
    whiteBalanceTint: wb.tint,
    whiteBalanceGlow: wb.glow,
    focalCompression,
    backgroundShift,
    highlightOpacity,
    shadowOpacity,
    histogram,
    dynamicRangeScore,
    exposureExplanation,
    blurReason,
    noiseReason
  };
}

function scoreAttempt(input: ScoreInput): CameraScore {
  const state = calculate(input);
  const exposureScore = Math.abs(state.exposureMeter) <= 0.35 ? 30 : Math.abs(state.exposureMeter) <= 0.85 ? 23 : Math.abs(state.exposureMeter) <= 1.6 ? 12 : 4;
  const shutterScore = state.handheldSafe ? 20 : state.shutterSeconds <= 1 / 60 ? 12 : 5;
  const apertureScore = state.apertureValue >= 2.8 && state.apertureValue <= 8 ? 20 : state.apertureValue < 2.8 || state.apertureValue <= 11 ? 15 : 8;
  const isoScore = input.iso <= 400 ? 15 : input.iso <= 1600 ? 11 : input.iso <= 3200 ? 7 : 3;
  const wbScore = ["Auto", "Daylight", "Cloudy", "Shade"].includes(input.whiteBalance) ? 15 : 10;
  const totalScore = exposureScore + shutterScore + apertureScore + isoScore + wbScore;

  const feedbackParts = [
    state.exposureExplanation,
    state.blurReason,
    apertureScore >= 20
      ? "Aperture berada di rentang fleksibel untuk liputan jurnalistik."
      : "Aperture ekstrem; bagus untuk efek khusus, tetapi perlu kontrol fokus lebih teliti.",
    state.noiseReason,
    wbScore >= 15
      ? "White balance cocok untuk kondisi umum."
      : "White balance memberi karakter warna kuat; pastikan sesuai sumber cahaya."
  ];

  return {
    ...state,
    exposureScore,
    shutterScore,
    apertureScore,
    isoScore,
    wbScore,
    totalScore,
    feedback: feedbackParts.join(" ")
  };
}

function getModePreset(mode: ShootingMode) {
  return modePresets[mode];
}

export const CameraPhysicsEngine = {
  calculate,
  scoreAttempt,
  getModePreset,
  parseAperture,
  parseShutter,
  parseFocalLength
};
