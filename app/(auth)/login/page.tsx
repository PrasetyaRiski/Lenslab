import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera } from "lucide-react";
import { GoogleAuthLink } from "@/components/auth/google-auth-link";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getPostAuthRedirectPath, getSafeNextPath } from "@/lib/auth-paths";

const authErrorMessages: Record<string, string> = {
  google_config: "Google OAuth belum dikonfigurasi. Isi GOOGLE_AUTH_CLIENT_ID dan GOOGLE_AUTH_CLIENT_SECRET di .env.",
  google_denied: "Login Google dibatalkan.",
  google_state_invalid: "Sesi login Google kedaluwarsa. Coba lagi.",
  google_login_failed: "Login Google gagal. Periksa konfigurasi OAuth atau coba beberapa saat lagi.",
  invalid_login: "Data login tidak valid.",
  invalid_credentials: "Email atau password salah.",
  session_expired: "Sesi login sudah berakhir. Silakan masuk lagi."
};

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params?.next);
  const user = await getCurrentUser();
  if (user) redirect(getPostAuthRedirectPath(user.role, nextPath));

  const errorMessage = params?.error ? authErrorMessages[params.error] : null;

  return (
    <main className="flex min-h-screen flex-col bg-slate-950">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amberbrand text-white"><Camera className="h-7 w-7" /></div>
            <h1 className="text-2xl font-black">Login LensLab</h1>
            <p className="text-sm text-slate-500">Masuk sebagai admin, mentor, atau siswa.</p>
          </div>
          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <GoogleAuthLink next={nextPath}>Login dengan Google</GoogleAuthLink>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">atau</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <form action="/api/auth/login" method="post" className="space-y-4">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            <div><Label>Email</Label><Input name="email" type="email" placeholder="siswa@lenslab.test" required /></div>
            <div><Label>Password</Label><Input name="password" type="password" placeholder="password123" required /></div>
            <Button className="w-full" type="submit">Masuk</Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">Belum punya akun? <Link href="/register" className="font-bold text-amber-600">Daftar siswa</Link></p>
        </Card>
      </div>
      <Footer variant="dark" />
    </main>
  );
}
