"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { app } from "../../../lib/firebase"; //adjust path if needed

const auth = getAuth(app);

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      setError("Login Failed");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ padding: "0.5rem" }}>
      {user ? (
        <>
          <span>
            Logged in as <strong>{user.email}</strong>
          </span>
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Log out
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
      {error && (
        <div style={{ color: "red", marginTop: "0.5rem" }}>{error}</div>
      )}
    </div>
  );
}
