// components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../lib/firebase';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';
import { useIsAdmin } from '../Auth/useIsAdmin';
import { useAuthState } from 'react-firebase-hooks/auth';

const navLinkClass =
    'font-sans text-sm text-ink-soft hover:text-oxblood transition-colors';

export default function NavBar() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { isAdmin } = useIsAdmin();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    await fetch('/api/session', { method: 'DELETE' });
    router.push('/');
  };

  const username = user?.email?.split('@')[0];

  return (
      <nav className="w-full bg-paper border-b border-rule z-50 relative">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-x-8">
            <Link
                href="/"
                className="font-serif text-lg sm:text-xl font-semibold text-ink tracking-tight hover:text-oxblood transition-colors"
            >
              Middlebury Taxpayers
            </Link>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-x-6">
              <Link href="/tax-impact" className={navLinkClass}>
                Tax Impact
              </Link>
              <Link href="/articles" className={navLinkClass}>
                Articles
              </Link>
              <Link href="/who-we-are" className={navLinkClass}>
                Who We Are
              </Link>
              <Link href="/updates" className={navLinkClass}>
                Updates
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex items-center gap-x-5">
            {isAdmin && (
                <Link href="/admin" className={navLinkClass}>
                  Admin
                </Link>
            )}
            {user ? (
                <>
                  <span className="font-sans text-sm text-muted" title={user.email ?? ''}>
                    {username}
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
              className="sm:hidden text-ink focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
          >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
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
            <div className="sm:hidden px-5 pb-5 space-y-3 border-t border-rule pt-3">
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
                Articles
              </Link>
              <Link
                  href="/who-we-are"
                  className={`${navLinkClass} block`}
                  onClick={() => setMenuOpen(false)}
              >
                Who We Are
              </Link>
              <Link
                  href="/updates"
                  className={`${navLinkClass} block`}
                  onClick={() => setMenuOpen(false)}
              >
                Updates
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
                    <span className="font-sans text-sm text-muted block" title={user.email ?? ''}>
                      Signed in as <span className="font-medium text-ink">{username}</span>
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
