"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { Camera, LayoutDashboard, BookOpen, ClipboardList, Trophy, UploadCloud, Images, Bot, FileDown, Users, Settings, BadgeCheck, HelpCircle, SlidersHorizontal, Award, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const studentLinks = [
  ["Dashboard", "/student/dashboard", LayoutDashboard],
  ["Materi", "/student/materials", BookOpen],
  ["Simulasi Kamera", "/student/simulator", Camera],
  ["Kuis", "/student/quizzes", ClipboardList],
  ["Hasil Kuis", "/student/quiz-results", BadgeCheck],
  ["Asset Editing", "/student/assets", FileDown],
  ["Upload Karya", "/student/upload-work", UploadCloud],
  ["Karya Saya", "/student/my-works", Images],
  ["Galeri Karya", "/student/gallery", Images],
  ["JurnalisBot", "/student/chatbot", Bot],
  ["Leaderboard", "/student/leaderboard", Trophy],
  ["Profil", "/student/profile", UserRound]
] as const;

const adminLinks = [
  ["Dashboard", "/admin/dashboard", LayoutDashboard],
  ["Kelola User", "/admin/users", Users],
  ["Kelola Materi", "/admin/materials", BookOpen],
  ["Kelola Kategori", "/admin/categories", Settings],
  ["Kelola Kuis", "/admin/quizzes", ClipboardList],
  ["Kelola Soal", "/admin/questions", HelpCircle],
  ["Kelola Simulasi", "/admin/simulation", SlidersHorizontal],
  ["Kelola Asset", "/admin/assets", FileDown],
  ["Kelola Karya", "/admin/works", Images],
  ["Review Karya", "/admin/works", UploadCloud],
  ["Kelola Galeri", "/admin/gallery", Images],
  ["Leaderboard", "/admin/leaderboard", Trophy],
  ["Kelola Badge", "/admin/badges", Award],
  ["Pengaturan", "/admin/settings", Settings],
  ["Profil", "/admin/profile", UserRound]
] as const;

const mentorLinks = [
  ["Dashboard", "/mentor/dashboard", LayoutDashboard],
  ["Kelola Materi", "/mentor/materials", BookOpen],
  ["Kelola Kuis", "/mentor/quizzes", ClipboardList],
  ["Kelola Soal", "/mentor/questions", HelpCircle],
  ["Kelola Asset", "/mentor/assets", FileDown],
  ["Review Karya", "/mentor/works", UploadCloud],
  ["Galeri Karya", "/mentor/gallery", Images],
  ["Leaderboard", "/mentor/leaderboard", Trophy],
  ["Profil", "/mentor/profile", UserRound]
] as const;

export function Sidebar({ role, className, onNavigate }: { role: Role; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = role === "STUDENT" ? studentLinks : role === "MENTOR" ? mentorLinks : adminLinks;
  return (
    <aside className={cn("min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-4", className ?? "hidden lg:block")}>
      <Link href="/" onClick={onNavigate} className="mb-6 flex items-center gap-2 rounded-2xl bg-slate-950 p-3 text-white">
        <span className="rounded-xl bg-amberbrand p-2"><Camera className="h-5 w-5" /></span>
        <span className="font-black">LensLab</span>
      </Link>
      <nav className="space-y-1">
        {links.map(([label, href, Icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
          <Link key={`${label}-${href}`} href={href} onClick={onNavigate} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-amber-50 hover:text-amber-700", active && "bg-amber-50 text-amber-700")}>
            <Icon className="h-4 w-4" /> {label}
          </Link>
          );
        })}
      </nav>
    </aside>
  );
}
