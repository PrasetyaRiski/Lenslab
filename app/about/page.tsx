import { Footer } from "@/components/layout/footer";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <section className="mx-auto max-w-4xl px-4 py-14">
        <Card>
          <h1 className="text-3xl font-black text-slate-950">Tentang LensLab</h1>
          <p className="mt-4 leading-7 text-slate-600">LensLab adalah platform pembelajaran digital untuk membantu ekstrakurikuler jurnalistik sekolah berjalan lebih terstruktur. Siswa dapat mempelajari materi, mencoba simulasi kamera, mengerjakan kuis, mengunduh asset latihan, mengunggah karya, dan menerima feedback mentor.</p>
          <p className="mt-4 leading-7 text-slate-600">Platform ini dirancang dengan pendekatan learning by doing: siswa belajar konsep, berlatih melalui simulasi, menghasilkan karya, lalu mendapatkan apresiasi melalui skor, badge, dan galeri.</p>
        </Card>
      </section>
      <Footer />
    </main>
  );
}
