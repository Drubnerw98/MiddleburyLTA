"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";

export default function NavBar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  return (
    <nav className="w-full bg-black text-white px-6 py-3 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Middlebury Info Hub logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="font-bold text-lg hover:underline">
            Middlebury Info Hub
          </span>
        </Link>

        <Link href="/about" className="hover:underline">
          About
        </Link>
        {user && (
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span className="text-sm mr-3">
              Logged in as <strong>{user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:underline"
            >
              Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:underline">
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}
