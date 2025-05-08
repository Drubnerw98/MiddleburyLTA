// src/app/ClientLayout.tsx
"use client";

import Link from "next/link";
import LoginButton from "../login/LoginButton";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);
  return (
    <body>
      <header
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          {user ? (
            <span>Welcome, {user.email}</span>
          ) : (
            <Link href="/register">Register</Link>
          )}
        </div>
        <LoginButton />
      </header>
      <main>{children}</main>
    </body>
  );
}
