import { Card } from "@/components/ui/card";

type ProfileCardProps = {
  user: {
    name: string;
    email: string;
    role: string;
    className?: string | null;
    avatarUrl?: string | null;
  };
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="max-w-xl">
      {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="mb-5 h-20 w-20 rounded-full object-cover" /> : null}
      <p className="text-sm text-slate-500">Nama</p><p className="mb-4 font-bold">{user.name}</p>
      <p className="text-sm text-slate-500">Email</p><p className="mb-4 font-bold">{user.email}</p>
      <p className="text-sm text-slate-500">Role</p><p className="mb-4 font-bold">{user.role}</p>
      <p className="text-sm text-slate-500">Kelas</p><p className="font-bold">{user.className ?? "-"}</p>
    </Card>
  );
}
