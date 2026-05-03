"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";

export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const [user, authLoading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [claimsLoading, setClaimsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setClaimsLoading(false);
      return;
    }
    setClaimsLoading(true);
    user
      .getIdTokenResult()
      .then((result) => {
        if (!cancelled) setIsAdmin(result.claims.admin === true);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      })
      .finally(() => {
        if (!cancelled) setClaimsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || claimsLoading };
}
