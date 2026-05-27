import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={user.name} role={user.role} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
