// src/app/components/Layout/NavBar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "../../../../lib/firebase";
import Logo from "../Logo/logo";
import LoginModal from "../Auth/LoginModal";
import RegisterModal from "../Auth/RegisterModal";

const auth = getAuth(app);

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    router.push("/");
  };

  const isAdmin = user?.email === "drubnation@gmail.com";

  return (
      <nav className="w-full border-b border-[#D9D9D9] bg-white z-50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Logo & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 w-full">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition">
              <Logo className="w-8 h-8 text-[#2E3D52]" />
              <span className="text-[#2E3D52] font-bold text-lg tracking-tight">
              Middlebury Taxpayers
            </span>
            </Link>

            <div className="flex items-center gap-x-6 mt-2 sm:mt-0">
              <Link href="/tax-impact" className="text-sm text-[#2E3D52] hover:text-[#516684] transition">
                Tax Impact
              </Link>
              <Link href="/articles" className="text-sm text-[#2E3D52] hover:text-[#516684] transition">
                Articles & Links
              </Link>
              {isAdmin && (
                  <Link href="/admin" className="text-sm text-[#2E3D52] hover:text-[#516684] transition">
                    Admin
                  </Link>
              )}
            </div>
          </div>

          {/* Auth Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
            {user ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 whitespace-nowrap">
              <span className="text-sm text-[#2E3D52] truncate max-w-[200px] sm:max-w-none">
                Logged in as <span className="font-medium">{user.email}</span>
              </span>
                  <button
                      onClick={handleLogout}
                      className="text-sm text-[#2E3D52] hover:text-[#516684] transition whitespace-nowrap"
                  >
                    Log out
                  </button>
                </div>
            ) : (
                <div className="flex space-x-4">
                  <button
                      onClick={() => setShowRegisterModal(true)}
                      className="text-sm text-[#2E3D52] hover:text-[#516684] underline transition"
                  >
                    Register
                  </button>
                  <button
                      onClick={() => setShowLoginModal(true)}
                      className="text-sm text-[#2E3D52] hover:text-[#516684] underline transition"
                  >
                    Login
                  </button>
                </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      </nav>
  );
}
