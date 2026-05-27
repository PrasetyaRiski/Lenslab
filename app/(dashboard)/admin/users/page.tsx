import { Role } from "@prisma/client";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getLeaderboard } from "@/lib/score";

const statusMessages: Record<string, { tone: "success" | "danger"; text: string }> = {
  created: { tone: "success", text: "User berhasil dibuat." },
  updated: { tone: "success", text: "User berhasil diperbarui." },
  deleted: { tone: "success", text: "User berhasil dihapus." },
  invalid: { tone: "danger", text: "Data user belum valid." },
  email_taken: { tone: "danger", text: "Email sudah dipakai user lain." },
  cannot_delete_self: { tone: "danger", text: "Akun yang sedang dipakai tidak bisa dihapus." },
  cannot_demote_self: { tone: "danger", text: "Admin tidak bisa menurunkan role akunnya sendiri." },
  last_admin: { tone: "danger", text: "Admin terakhir tidak boleh dihapus atau diubah role-nya." },
  not_found: { tone: "danger", text: "User tidak ditemukan." }
};

export default async function AdminUsersPage({ searchParams }: { searchParams?: Promise<{ status?: string; role?: string; q?: string }> }) {
  const currentUser = await requireRole([Role.ADMIN]);
  const params = await searchParams;
  const status = params?.status ? statusMessages[params.status] : null;
  const role = params?.role && Object.values(Role).includes(params.role as Role) ? params.role as Role : undefined;
  const q = params?.q?.trim();
  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {})
    },
    orderBy: [{ role: "asc" }, { name: "asc" }]
  });
  const leaderboard = await getLeaderboard();

  return (
    <div>
      <PageHeader title="Kelola User" description="Tambah, edit role, filter, cari, dan hapus user." />
      {status ? (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${status.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {status.text}
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardTitle>Tambah user</CardTitle>
          <form action="/api/admin/users" method="post" className="mt-4 space-y-3">
            <div><Label>Nama</Label><Input name="name" required /></div>
            <div><Label>Email</Label><Input name="email" type="email" required /></div>
            <div><Label>Password awal</Label><Input name="password" type="password" minLength={6} required /></div>
            <div><Label>Role</Label><Select name="role" defaultValue="STUDENT"><option value="STUDENT">STUDENT</option><option value="MENTOR">MENTOR</option><option value="ADMIN">ADMIN</option></Select></div>
            <div><Label>Kelas</Label><Input name="className" placeholder="X-1" /></div>
            <Button type="submit">Tambah User</Button>
          </form>
        </Card>
        <Card>
          <form className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_auto]" action="/admin/users">
            <Input name="q" placeholder="Cari nama/email" defaultValue={q ?? ""} />
            <Select name="role" defaultValue={role ?? ""}>
              <option value="">Semua role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MENTOR">MENTOR</option>
              <option value="STUDENT">STUDENT</option>
            </Select>
            <Button type="submit" variant="outline">Filter</Button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3">User</th>
                  <th>Role</th>
                  <th>Kelas</th>
                  <th>Skor</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b align-top last:border-0">
                    <td className="py-3">
                      <form id={`user-${user.id}`} action={`/api/admin/users/${user.id}`} method="post" className="space-y-2">
                        <Input name="name" defaultValue={user.name} />
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </form>
                    </td>
                    <td className="py-3">
                      <Select form={`user-${user.id}`} name="role" defaultValue={user.role}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MENTOR">MENTOR</option>
                        <option value="STUDENT">STUDENT</option>
                      </Select>
                    </td>
                    <td className="py-3"><Input form={`user-${user.id}`} name="className" defaultValue={user.className ?? ""} /></td>
                    <td className="py-3">{user.role === "STUDENT" ? leaderboard.find((item) => item.id === user.id)?.totalScore ?? 0 : "-"}</td>
                    <td className="space-y-2 py-3 text-right">
                      <Button form={`user-${user.id}`} type="submit" size="sm" variant="outline">Simpan</Button>
                      {user.id !== currentUser.id ? (
                        <form action={`/api/admin/users/${user.id}/delete`} method="post">
                          <DeleteUserButton userName={user.name} />
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
