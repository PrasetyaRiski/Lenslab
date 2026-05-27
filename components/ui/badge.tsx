import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, tone = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "success" | "warning" | "info" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "default" && "bg-slate-100 text-slate-700",
        tone === "success" && "bg-emerald-100 text-emerald-700",
        tone === "warning" && "bg-amber-100 text-amber-700",
        tone === "info" && "bg-blue-100 text-blue-700",
        tone === "danger" && "bg-red-100 text-red-700",
        className
      )}
      {...props}
    />
  );
}
