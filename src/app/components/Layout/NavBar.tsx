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

  return (
    <nav className="w-full bg-[#1a202c] text-white px-6 py-3 flex justify-between items-center border-b border-gray-700 shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Middlebury Info Hub logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="font-bold text-lg">
            Middlebury Lower Tax Alliance
          </span>
        </Link>

        <Link
          href="/about"
          className="hover:underline text-sm text-gray-300 hover:text-white"
        >
          About
        </Link>
        {user && (
          <Link
            href="/admin"
            className="hover:underline text-sm text-gray-300 hover:text-white"
          >
            Admin
          </Link>
        )}
      </div>

      <div className="text-sm flex items-center space-x-3">
        {user ? (
          <>
            <span className="text-gray-300">
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
            <button
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Login
            </button>
            {showLoginForm && (
              <div className="absolute top-16 right-6 bg-[#2d3748] p-4 rounded shadow-md w-64 z-50">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 p-2 rounded bg-[#1e2633] text-white placeholder-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-2 p-2 rounded bg-[#1e2633] text-white placeholder-gray-400"
                />
                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
                >
                  Sign In
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
