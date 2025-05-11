// src/app/components/Auth/withAuth.tsx
"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

interface WithAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function withAuth({
  children,
  requireAdmin = false,
  redirectTo = "/",
}: WithAuthProps) {
  const [user, loading] = useAuthState(auth);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAllowed(false);
        return;
      }
      if (requireAdmin) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const isAdmin = docSnap.exists() && docSnap.data()?.isAdmin;
        setIsAllowed(!!isAdmin);
      } else {
        setIsAllowed(true);
      }
    }

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading, requireAdmin]);

  useEffect(() => {
    if (isAllowed === false) {
      router.push(redirectTo);
    }
  }, [isAllowed, redirectTo, router]);

  if (loading || isAllowed === null) return <p>Loading...</p>;
  if (!isAllowed) return null;

  return <>{children}</>;
}
