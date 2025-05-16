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
    <nav className="w-full border-b border-white/10 backdrop-blur bg-[#1e2633]/70 z-50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
        {/* Left side: Logo + Nav Links */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition"
          >
            <Image
              src="/logo.png"
              alt="Middlebury Info Hub logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="font-bold text-lg tracking-tight">
              Middlebury Lower Tax Alliance
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0">
            <Link
              href="/about"
              className="hover:text-blue-400 text-sm transition"
            >
              About
            </Link>

            <Link
              href="/tax-impact"
              className="hover:text-yellow-300 text-sm transition"
            >
              Tax Impact
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hover:text-emerald-400 text-sm transition"
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right side: Auth controls */}
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
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  Register
                </Link>
                <button
                  onClick={() => setShowLoginForm(!showLoginForm)}
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  Login
                </button>
              </div>

              {showLoginForm && (
                <div className="w-full sm:w-64 bg-[#2d3748] border border-gray-600 p-4 rounded shadow-md z-[999]">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 p-2 rounded bg-[#1e2633] text-white placeholder-gray-400 border border-gray-600"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-2 rounded bg-[#1e2633] text-white placeholder-gray-400 border border-gray-600"
                  />
                  {error && (
                    <p className="text-red-400 text-sm mb-2">{error}</p>
                  )}
                  <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
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
