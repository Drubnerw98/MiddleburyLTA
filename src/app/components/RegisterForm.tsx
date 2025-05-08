"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Add the user to Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        isAdmin: false, // Set to true manually later in Firestore if needed
      });

      setStatus("Account created successfully!");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setStatus("Account creation failed!");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <button onClick={handleRegister}>Create Account</button>
      <p>{status}</p>
    </div>
  );
}
