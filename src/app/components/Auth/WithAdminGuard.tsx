"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../lib/firebase";

export default function WithAdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setIsAdmin(false);
      const token = await user.getIdTokenResult();
      setIsAdmin(token.claims.admin === true);
    });

    return () => unsub();
  }, []);

  if (isAdmin === null) return <p className="p-4">Checking access...</p>;
  if (!isAdmin) return <p className="p-4">Access denied. Admins only.</p>;

  return <>{children}</>;
}
