import Link from "next/link";
import { ArrowRight, Bot, Camera, Download, GraduationCap, Trophy, UploadCloud } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser, getDashboardPathByRole, getStartLearningPathByRole } from "@/lib/auth";

const features = [
  ["Simulasi DSLR", "Latihan ISO, aperture, shutter, white balance, dan focal length dengan skor otomatis.", Camera],
  ["Materi & Kuis", "Materi fotografi jurnalistik, kuis interaktif, pembahasan, dan progress belajar.", GraduationCap],
  ["Asset Editing", "Download template, preset, file latihan, dan panduan editing dari mentor.", Download],
  ["Upload Karya", "Kirim karya foto, artikel, poster, video, atau mading untuk direview mentor.", UploadCloud],
  ["JurnalisBot", "Konsultasi ide liputan, angle, headline, caption, dan pertanyaan wawancara.", Bot],
  ["Leaderboard", "Skor, badge, ranking kelas, dan apresiasi untuk siswa aktif.", Trophy]
] as const;

export default async function HomePage() {
  const user = await getCurrentUser();
  const startLearningHref = user ? getStartLearningPathByRole(user.role) : "/login";
  const dashboardHref = user ? getDashboardPathByRole(user.role) : "/login";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.26),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(30,64,175,0.3),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">Platform Ekstrakurikuler Jurnalistik Sekolah</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">Belajar jurnalistik dengan simulasi, karya, dan skor nyata.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">LensLab membantu siswa memahami kamera DSLR, menulis caption 5W+1H, mengerjakan kuis, mengunduh asset editing, mengunggah karya, dan mendapatkan feedback mentor.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={startLearningHref}><Button size="lg">Mulai Belajar <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
              <Link href={dashboardHref}><Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">Masuk Dashboard</Button></Link>
            </div>
          </div>
          <Card className="border-white/10 bg-white/10 text-white backdrop-blur">
            <div className="rounded-2xl bg-slate-900 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></div>
                <span className="text-xs text-slate-400">Viewfinder Preview</span>
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-amber-950">
                <div className="rounded-full border-4 border-white/30 p-12">
                  <Camera className="h-16 w-16 text-amber-300" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-xl bg-white/10 p-3"><p className="text-slate-400">ISO</p><p className="font-black">400</p></div>
                <div className="rounded-xl bg-white/10 p-3"><p className="text-slate-400">Aperture</p><p className="font-black">f/5.6</p></div>
                <div className="rounded-xl bg-white/10 p-3"><p className="text-slate-400">Shutter</p><p className="font-black">1/250</p></div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black">Fitur lengkap untuk kelas jurnalistik</h2>
          <p className="mt-2 text-slate-300">Dibangun untuk alur belajar, praktik, evaluasi, dan publikasi karya siswa.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, desc, Icon]) => (
            <Card key={title} className="border-white/10 bg-white/5 text-white">
              <div className="mb-4 w-max rounded-2xl bg-amber-400/15 p-3 text-amber-300"><Icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
            </Card>
          ))}
        </div>
      </section>
      <Footer variant="dark" />
    </main>
  );
}
