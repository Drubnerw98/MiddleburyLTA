// src/lib/auth.ts
import { auth } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;

  if (!token) return null;

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return null;
  }
}

export async function getUserIfAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;

  // ✅ Secure hardcoded check
  if (user.email?.toLowerCase() !== "drubnation@gmail.com") return null;

  return { uid: user.uid, email: user.email };
}
