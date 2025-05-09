// src/app/components/Layout/AppLayout.tsx
"use client";

import NavBar from "../Layout/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </>
  );
}
