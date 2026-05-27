import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-100">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h1 className="text-2xl font-black text-slate-950">Akses tidak diizinkan</h1>
          <p className="mt-2 text-sm text-slate-500">Role akun Anda tidak memiliki akses ke halaman ini.</p>
          <Link href="/" className="mt-5 inline-block"><Button>Kembali ke Beranda</Button></Link>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
