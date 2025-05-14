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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between">
        {/* Logo and nav links */}
        <div className="flex items-center space-x-5">
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

          <Link
            href="/about"
            className="hover:text-blue-400 text-sm transition"
          >
            About
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

        {/* Auth controls (right side) */}
        <div className="flex items-center space-x-4 text-sm relative">
          {user ? (
            <>
              <span className="text-gray-300 hidden sm:inline">
                Logged in as <strong>{user.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 underline transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Register
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowLoginForm(!showLoginForm)}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Login
                </button>

                {showLoginForm && (
                  <div className="absolute right-0 mt-2 bg-[#2d3748] border border-gray-600 p-4 rounded shadow-md w-64 z-50">
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
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
