import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type ShutterButtonProps = {
  onShoot: () => void;
  isShooting: boolean;
  disabled?: boolean;
  className?: string;
};

export function ShutterButton({ onShoot, isShooting, disabled = false, className }: ShutterButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onShoot}
      disabled={disabled || isShooting}
      whileTap={{ scale: 0.9, y: 2 }}
      className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-full border border-red-900/80 bg-[radial-gradient(circle_at_35%_28%,#fca5a5,#dc2626_38%,#450a0a_76%)] shadow-[inset_0_4px_10px_rgba(255,255,255,0.28),inset_0_-16px_24px_rgba(69,10,10,0.9),0_14px_28px_rgba(0,0,0,0.55)] transition disabled:cursor-not-allowed disabled:opacity-70",
        isShooting && "shadow-[0_0_30px_rgba(248,113,113,0.7)]",
        className
      )}
      aria-label="Tekan shutter"
    >
      <span className="absolute inset-2 rounded-full border border-white/20" />
      <Camera className="h-7 w-7 text-white drop-shadow" />
      <span className="absolute -bottom-6 font-mono text-[9px] uppercase tracking-[0.2em] text-red-200">Shutter</span>
    </motion.button>
  );
}
