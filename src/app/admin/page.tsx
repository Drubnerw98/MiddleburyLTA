"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import AdminPostForm from "../components/AdminPostForm";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User signed in:", currentUser.uid);
        setUser(currentUser);

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log("Fetched user data:", data);

          const isAdminVal = data.isAdmin === true;
          console.log("isAdmin check:", isAdminVal);
          setIsAdmin(isAdminVal);
        } else {
          console.warn("User document does not exist in Firestore!");
          setIsAdmin(false);
        }
      } else {
        console.warn("No user logged in");
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <p>Welcome, {user?.email}</p>
      {isAdmin ? (
        <>
          <h1>Admin Panel</h1>
          <AdminPostForm />
        </>
      ) : (
        <p>Access denied. Admins only.</p>
      )}
    </div>
  );
}
