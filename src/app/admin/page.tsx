"use client";

import AdminDashboardLayout from "../components/Admin/AdminDashboardLayout";
import WithAdminGuard from "../components/Auth/WithAdminGuard";

export default function AdminPage() {
  return (
    <WithAdminGuard>
      <AdminDashboardLayout />
    </WithAdminGuard>
  );
}
