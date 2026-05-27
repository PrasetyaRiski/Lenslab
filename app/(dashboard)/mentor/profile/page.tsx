import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { requireRole } from "@/lib/auth";

export default async function MentorProfilePage() {
  const user = await requireRole([Role.MENTOR, Role.ADMIN]);
  return (
    <div>
      <PageHeader title="Profil Mentor" description="Informasi akun mentor LensLab." />
      <ProfileCard user={user} />
    </div>
  );
}
