import { PageHeader } from "@/components/layout/page-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div>
      <PageHeader title="Profil" description="Informasi akun LensLab Anda." />
      <ProfileCard user={user} />
    </div>
  );
}
