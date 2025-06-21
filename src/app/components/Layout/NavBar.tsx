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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    router.push("/");
  };

  const isAdmin = user?.email === "drubnation@gmail.com";

  const username = user?.email?.split("@")[0];

  return (
      <nav className="w-full bg-white z-50 relative border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-90 transition"
          >
            <Logo className="w-8 h-8 text-[#2E3D52]" />
            <span className="text-[#2E3D52] font-bold text-lg tracking-tight">
            Middlebury Taxpayers
          </span>
          </Link>

          {/* Hamburger Button */}
          <button
              className="sm:hidden text-[#2E3D52] focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
              {menuOpen ? (
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                  />
              ) : (
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                  />
              )}
            </svg>
          </button>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-x-6">
            <Link
                href="/tax-impact"
                className="text-sm text-[#2E3D52] hover:text-[#516684] transition"
            >
              Tax Impact
            </Link>
            <Link
                href="/articles"
                className="text-sm text-[#2E3D52] hover:text-[#516684] transition"
            >
              Articles & Links
            </Link>
            {isAdmin && (
                <Link
                    href="/admin"
                    className="text-sm text-[#2E3D52] hover:text-[#516684] transition"
                >
                  Admin
                </Link>
            )}
            {user ? (
                <>
              <span
                  className="text-sm text-[#2E3D52]"
                  title={user.email ?? ""}
              >
                Signed in as <span className="font-medium">{username}</span>
              </span>
                  <button
                      onClick={handleLogout}
                      className="text-sm text-[#2E3D52] hover:text-[#516684] transition"
                  >
                    Log out
                  </button>
                </>
            ) : (
                <>
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
                </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
            <div className="sm:hidden px-4 pb-4 space-y-3">
              <Link
                  href="/tax-impact"
                  className="block text-sm text-[#2E3D52] hover:text-[#516684] transition"
                  onClick={() => setMenuOpen(false)}
              >
                Tax Impact
              </Link>
              <Link
                  href="/articles"
                  className="block text-sm text-[#2E3D52] hover:text-[#516684] transition"
                  onClick={() => setMenuOpen(false)}
              >
                Articles & Links
              </Link>
              {isAdmin && (
                  <Link
                      href="/admin"
                      className="block text-sm text-[#2E3D52] hover:text-[#516684] transition"
                      onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
              )}
              {user ? (
                  <>
              <span
                  className="block text-sm text-[#2E3D52]"
                  title={user.email ?? ""}
              >
                Signed in as <span className="font-medium">{username}</span>
              </span>
                    <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="block text-sm text-left text-[#2E3D52] hover:text-[#516684] transition"
                    >
                      Log out
                    </button>
                  </>
              ) : (
                  <>
                    <button
                        onClick={() => {
                          setShowRegisterModal(true);
                          setMenuOpen(false);
                        }}
                        className="block text-sm text-left text-[#2E3D52] hover:text-[#516684] underline transition"
                    >
                      Register
                    </button>
                    <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setMenuOpen(false);
                        }}
                        className="block text-sm text-left text-[#2E3D52] hover:text-[#516684] underline transition"
                    >
                      Login
                    </button>
                  </>
              )}
            </div>
        )}

        {/* Modals */}
        <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
        />
        <RegisterModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
        />
      </nav>
  );
}
