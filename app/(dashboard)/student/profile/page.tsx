import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { requireRole } from "@/lib/auth";

export default async function StudentProfilePage() {
  const user = await requireRole([Role.STUDENT]);
  return (
    <div>
      <PageHeader title="Profil Siswa" description="Informasi akun dan identitas kelas Anda." />
      <ProfileCard user={user} />
    </div>
  );
}
