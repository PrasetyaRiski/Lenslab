import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getDashboardPathByRole } from "@/lib/auth";

export async function PublicNavbar() {
  const user = await getCurrentUser();
  const dashboardHref = user ? getDashboardPathByRole(user.role) : "/login";
  const leaderboardHref = user ? `/${user.role.toLowerCase()}/leaderboard` : "/login";
  const galleryHref = user?.role === "STUDENT" ? "/student/gallery" : dashboardHref;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="rounded-xl bg-amberbrand p-2"><Camera className="h-5 w-5" /></span>
          <span className="text-lg font-black">LensLab</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
          <Link href="/about">Tentang</Link>
          <Link href={galleryHref}>Galeri</Link>
          <Link href={leaderboardHref}>Leaderboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href={dashboardHref}><Button size="sm">Dashboard</Button></Link>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Login</Button></Link>
              <Link href="/register"><Button size="sm">Register</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
