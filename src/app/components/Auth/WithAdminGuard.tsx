"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";

export default function WithAdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const allowedAdmins = ["drubnation@gmail.com"]; // 👈 Add more admin emails here if needed

  useEffect(() => {
    if (!loading && (!user || !allowedAdmins.includes(user.email ?? ""))) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
        Checking admin access...
      </div>
    );
  }

  return <>{children}</>;
}
