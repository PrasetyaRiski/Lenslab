"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { Role } from "@prisma/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function DashboardShell({ children, name, role }: { children: ReactNode; name: string; role: Role }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={role} />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu navigasi">
          <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-slate-950/45" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative h-full w-[min(20rem,calc(100vw-2rem))] bg-white shadow-2xl">
            <Button type="button" variant="ghost" size="sm" aria-label="Tutup menu" onClick={() => setMobileSidebarOpen(false)} className="absolute right-7 top-7 z-10 h-9 w-9 p-0 text-white hover:bg-white/10 focus:ring-white/60">
              <X className="h-5 w-5" />
            </Button>
            <Sidebar role={role} onNavigate={() => setMobileSidebarOpen(false)} className="block h-full min-h-0 w-full overflow-y-auto border-r-0 p-4" />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={name} role={role} onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
