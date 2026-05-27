import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({ name, role }: { name: string; role: string }) {
  const profileHref = role === "ADMIN" ? "/admin/profile" : role === "MENTOR" ? "/mentor/profile" : "/student/profile";
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Selamat datang,</p>
          <h1 className="text-lg font-black text-slate-900">{name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href={profileHref} className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 sm:flex"><UserRound className="h-4 w-4" /> {role}</Link>
          <form action="/api/auth/logout" method="post"><Button type="submit" variant="outline" size="sm"><LogOut className="mr-2 h-4 w-4" /> Logout</Button></form>
        </div>
      </div>
    </header>
  );
}
