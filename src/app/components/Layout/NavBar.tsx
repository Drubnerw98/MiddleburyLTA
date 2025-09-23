// components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { app } from '../../../../lib/firebase';
import Logo from '../Logo/logo';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';

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
    router.push('/');
  };

  const isAdmin = user?.email === 'drubnation@gmail.com';
  const username = user?.email?.split('@')[0];

  const [navLinkClass, setNavLinkClass] = useState('text-sm text-[#2E3D52] hover:underline transition cursor-pointer');

  useEffect(() => {
    setNavLinkClass('text-sm text-[#2E3D52] hover:text-[#516684] hover:underline transition cursor-pointer');
  }, []);

  return (
      <nav className="w-full bg-white z-50 relative">
        <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between max-w-[2440px] mx-auto">
          {/* Left Section */}
          <div className="flex items-center gap-x-6">
            <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-90 transition"
            >
              <Logo className="w-8 h-8 text-[#2E3D52]" />
              <span className="text-[#2E3D52] font-bold text-lg tracking-tight">
              Middlebury Taxpayers
            </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-x-6">
              <Link href="/tax-impact" className={navLinkClass}>
                Tax Impact
              </Link>
              <Link href="/articles" className={navLinkClass}>
                Articles & Links
              </Link>
              {/* NEW: Who We Are */}
              <Link href="/who-we-are" className={navLinkClass}>
                Who We Are
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex items-center gap-x-6">
            {isAdmin && (
                <Link href="/admin" className={navLinkClass}>
                  Admin
                </Link>
            )}
            {user ? (
                <>
              <span className={navLinkClass} title={user.email ?? ''}>
                Signed in as <span className="font-medium">{username}</span>
              </span>
                  <button onClick={handleLogout} className={navLinkClass}>
                    Log out
                  </button>
                </>
            ) : (
                <>
                  <button
                      onClick={() => setShowRegisterModal(true)}
                      className={navLinkClass}
                  >
                    Register
                  </button>
                  <button
                      onClick={() => setShowLoginModal(true)}
                      className={navLinkClass}
                  >
                    Login
                  </button>
                </>
            )}
          </div>

          {/* Hamburger Button */}
          <button
              className="sm:hidden text-[#2E3D52] focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
          >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
              {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
            <div className="sm:hidden px-4 pb-4 space-y-3">
              <Link
                  href="/tax-impact"
                  className={`${navLinkClass} block`}
                  onClick={() => setMenuOpen(false)}
              >
                Tax Impact
              </Link>
              <Link
                  href="/articles"
                  className={`${navLinkClass} block`}
                  onClick={() => setMenuOpen(false)}
              >
                Articles & Links
              </Link>
              {/* NEW: Who We Are (mobile) */}
              <Link
                  href="/who-we-are"
                  className={`${navLinkClass} block`}
                  onClick={() => setMenuOpen(false)}
              >
                Who We Are
              </Link>

              {isAdmin && (
                  <Link
                      href="/admin"
                      className={`${navLinkClass} block`}
                      onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
              )}

              {user ? (
                  <>
              <span className={`${navLinkClass} block`} title={user.email ?? ''}>
                Signed in as <span className="font-medium">{username}</span>
              </span>
                    <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className={`${navLinkClass} text-left w-full block`}
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
                        className={`${navLinkClass} text-left w-full block`}
                    >
                      Register
                    </button>
                    <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setMenuOpen(false);
                        }}
                        className={`${navLinkClass} text-left w-full block`}
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
            onCloseAction={() => setShowLoginModal(false)}
        />
        <RegisterModal
            isOpen={showRegisterModal}
            onCloseAction={() => setShowRegisterModal(false)}
        />
      </nav>
  );
}
