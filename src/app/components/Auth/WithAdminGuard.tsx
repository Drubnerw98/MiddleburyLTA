"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAdmin } from "./useIsAdmin";

export default function WithAdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) router.push("/");
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
        Checking admin access...
      </div>
    );
  }

  if (!isAdmin) return null;
  return <>{children}</>;
}
