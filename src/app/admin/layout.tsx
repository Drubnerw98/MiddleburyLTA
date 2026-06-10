import { redirect } from "next/navigation";
import { getUserIfAdmin } from "../../../lib/auth";

// Server-side gate for everything under /admin. The client-side
// WithAdminGuard only redirects after first render, which briefly ships
// admin UI to any logged-in non-admin; this blocks the render entirely.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserIfAdmin();
  if (!user) redirect("/");
  return children;
}
