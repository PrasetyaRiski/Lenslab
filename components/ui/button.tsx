import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "md", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "danger"; size?: "sm" | "md" | "lg" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-amberbrand disabled:cursor-not-allowed disabled:opacity-60",
        variant === "default" && "bg-amberbrand text-white shadow-soft hover:bg-amber-600",
        variant === "outline" && "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
