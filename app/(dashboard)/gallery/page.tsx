import { redirect } from "next/navigation";
import { getDashboardPathByRole, requireUser } from "@/lib/auth";

export default async function LegacyGalleryPage() {
  const user = await requireUser();
  if (user.role === "STUDENT") redirect("/student/gallery");
  redirect(getDashboardPathByRole(user.role));
}
