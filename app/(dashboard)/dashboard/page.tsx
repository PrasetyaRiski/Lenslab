import { redirect } from "next/navigation";
import { getDashboardPathByRole, requireUser } from "@/lib/auth";

export default async function DashboardRedirectPage() {
  const user = await requireUser();
  redirect(getDashboardPathByRole(user.role));
}
