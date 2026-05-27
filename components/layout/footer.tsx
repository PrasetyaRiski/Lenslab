import { cn } from "@/lib/utils";

type FooterProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Footer({ variant = "light", className }: FooterProps) {
  const dark = variant === "dark";

  return (
    <footer
      className={cn(
        "border-t px-4 py-6 text-center text-sm",
        dark ? "border-white/10 bg-slate-950 text-slate-400" : "border-slate-200 bg-white text-slate-500",
        className
      )}
    >
      <p className={cn("font-semibold", dark ? "text-slate-300" : "text-slate-700")}>
        &copy; 2026 LensLab. By Prasetya Riski Wa&rsquo;afan.
      </p>
      <p className="mt-1 text-xs">Platform edukasi jurnalistik sekolah.</p>
    </footer>
  );
}
