// src/app/admin/page.tsx
"use client";

import AdminPostForm from "../components/AdminPostForm";
import WithAdminGuard from "../components/Auth/WithAdminGuard";

export default function AdminPage() {
  return (
    <WithAdminGuard>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <AdminPostForm />
      </div>
    </WithAdminGuard>
  );
}
