import { cn } from "@/lib/utils";

type GoogleAuthLinkProps = {
  children: string;
  className?: string;
  next?: string | null;
};

function GoogleMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900 shadow-sm">
      G
    </span>
  );
}

export function GoogleAuthLink({ children, className, next }: GoogleAuthLinkProps) {
  const href = next ? `/api/auth/google?next=${encodeURIComponent(next)}` : "/api/auth/google";

  return (
    <a
      href={href}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amberbrand/30",
        className
      )}
    >
      <GoogleMark />
      {children}
    </a>
  );
}
