"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setStatus("");
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Add user to Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        isAdmin: false,
      });

      // Automatically log the user in
      await signInWithEmailAndPassword(auth, email, password);

      setStatus("Account created successfully!");
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err: any) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#2c3545] border border-gray-700 p-6 rounded-lg shadow-md text-white space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 rounded bg-[#1e2633] text-white placeholder-gray-400 border border-gray-600"
      />

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-[#1e2633] text-white placeholder-gray-400 border border-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Must be at least 6 characters.
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {status && <p className="text-green-400 text-sm">{status}</p>}

      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        Create Account
      </button>
    </div>
  );
}
