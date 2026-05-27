import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-amberbrand focus:ring-2 focus:ring-amberbrand/20", className)} {...props}>{children}</select>;
}
