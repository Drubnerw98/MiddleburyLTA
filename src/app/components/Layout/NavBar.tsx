"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { app } from "../../../../lib/firebase";

const auth = getAuth(app);

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();

      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      setEmail("");
      setPassword("");
      setError(null);
      setShowLoginForm(false);
    } catch (err) {
      setError("Login failed.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    router.push("/");
  };

  const isAdmin = user?.email === "drubnation@gmail.com";

  return (
      <nav className="w-full border-b border-yellow-400/20 backdrop-blur-md bg-[#1e2633]/80 z-50 relative shadow-md transition-all duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
          {/* Left Side: Logo + Links */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-all">
              <Image
                  src="/logo.png"
                  alt="Middlebury Taxpayers logo"
                  width={32}
                  height={32}
                  className="rounded-sm"
              />
              <span className="font-serif font-bold text-lg tracking-tight text-yellow-300 hover:text-yellow-200 transition-all">
              Middlebury Taxpayers
            </span>
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0">
              <Link
                  href="/about"
                  className="text-gray-300 hover:text-yellow-300 text-sm transition-all duration-150"
              >
                About
              </Link>

              <Link
                  href="/tax-impact"
                  className="text-gray-300 hover:text-yellow-300 text-sm transition-all duration-150"
              >
                Tax Impact
              </Link>

              {isAdmin && (
                  <Link
                      href="/admin"
                      className="text-gray-300 hover:text-yellow-300 text-sm transition-all duration-150"
                  >
                    Admin
                  </Link>
              )}
            </div>
          </div>

          {/* Right Side: Auth */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {user ? (
                <>
              <span className="text-gray-300 text-sm truncate max-w-[200px] sm:max-w-none">
                Logged in{user.email ? ` as ${user.email}` : ""}
              </span>
                  <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 underline transition text-sm whitespace-nowrap"
                  >
                    Log out
                  </button>
                </>
            ) : (
                <>
                  <div className="flex space-x-4">
                    <Link
                        href="/register"
                        className="text-yellow-300 hover:text-yellow-200 underline text-sm transition-all"
                    >
                      Register
                    </Link>
                    <button
                        onClick={() => setShowLoginForm(!showLoginForm)}
                        className="text-yellow-300 hover:text-yellow-200 underline text-sm transition-all"
                    >
                      Login
                    </button>
                  </div>

                  {showLoginForm && (
                      <div className="w-full sm:w-64 bg-[#1e2633] border border-yellow-400/30 p-4 rounded shadow-md z-[999] backdrop-blur-sm">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-2 p-2 rounded bg-[#121821] text-white placeholder-gray-400 border border-gray-600"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-2 p-2 rounded bg-[#121821] text-white placeholder-gray-400 border border-gray-600"
                        />
                        {error && (
                            <p className="text-red-400 text-sm mb-2">{error}</p>
                        )}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded font-semibold transition-all"
                        >
                          Sign In
                        </button>
                      </div>
                  )}
                </>
            )}
          </div>
        </div>
      </nav>
  );
}
