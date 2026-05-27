import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { requireRole } from "@/lib/auth";

export default async function AdminProfilePage() {
  const user = await requireRole([Role.ADMIN]);
  return (
    <div>
      <PageHeader title="Profil Admin" description="Informasi akun administrator LensLab." />
      <ProfileCard user={user} />
    </div>
  );
}
