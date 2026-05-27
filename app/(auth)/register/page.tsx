import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleAuthLink } from "@/components/auth/google-auth-link";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getPostAuthRedirectPath, getSafeNextPath } from "@/lib/auth-paths";

const registerErrorMessages: Record<string, string> = {
  invalid_register: "Data pendaftaran belum valid.",
  email_taken: "Email sudah terdaftar. Silakan login atau gunakan email lain.",
  google_config: "Google OAuth belum dikonfigurasi. Isi GOOGLE_AUTH_CLIENT_ID dan GOOGLE_AUTH_CLIENT_SECRET di .env.",
  google_denied: "Login Google dibatalkan.",
  google_state_invalid: "Sesi login Google kedaluwarsa. Coba lagi.",
  google_login_failed: "Login Google gagal. Periksa konfigurasi OAuth atau coba beberapa saat lagi.",
  session_expired: "Sesi login sudah berakhir. Silakan masuk lagi."
};

export default async function RegisterPage({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params?.next);
  const user = await getCurrentUser();
  if (user) redirect(getPostAuthRedirectPath(user.role, nextPath));
  const errorMessage = params?.error ? registerErrorMessages[params.error] : null;

  return (
    <main className="flex min-h-screen flex-col bg-slate-950">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <h1 className="text-2xl font-black">Register Siswa</h1>
          <p className="mt-1 text-sm text-slate-500">Akun baru otomatis dibuat dengan role STUDENT.</p>
          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <div className="mt-6">
            <GoogleAuthLink next={nextPath}>Daftar dengan Google</GoogleAuthLink>
          </div>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">atau</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <form action="/api/auth/register" method="post" className="space-y-4">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            <div><Label>Nama Lengkap</Label><Input name="name" required /></div>
            <div><Label>Email</Label><Input name="email" type="email" required /></div>
            <div><Label>Kelas</Label><Input name="className" placeholder="X-1" /></div>
            <div><Label>Password</Label><Input name="password" type="password" minLength={6} required /></div>
            <Button type="submit" className="w-full">Buat Akun</Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">Sudah punya akun? <Link href="/login" className="font-bold text-amber-600">Login</Link></p>
        </Card>
      </div>
      <Footer variant="dark" />
    </main>
  );
}
