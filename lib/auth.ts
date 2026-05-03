import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { adminApp } from "./firebase-admin";

export const SESSION_COOKIE_NAME = "__session";
export const SESSION_COOKIE_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

export interface AuthedUser {
  uid: string;
  email: string | null;
  admin: boolean;
}

export async function getCurrentUser(): Promise<AuthedUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      admin: decoded.admin === true,
    };
  } catch {
    return null;
  }
}

export async function getUserIfAdmin(): Promise<AuthedUser | null> {
  const user = await getCurrentUser();
  if (!user || !user.admin) return null;
  return user;
}
