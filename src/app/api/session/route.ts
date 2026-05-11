import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../../../../lib/firebase-admin";
import { SESSION_COOKIE_MAX_AGE_MS, SESSION_COOKIE_NAME } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ success: false, message: "Missing token" }, { status: 401 });
  }

  try {
    // verifyIdToken first so we fail fast on a forged token before minting a session
    await getAuth(adminApp).verifyIdToken(token);
    const sessionCookie = await getAuth(adminApp).createSessionCookie(token, {
      expiresIn: SESSION_COOKIE_MAX_AGE_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(SESSION_COOKIE_MAX_AGE_MS / 1000),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to create session cookie:", err);
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // Revoke refresh tokens server-side so the cookie is treated as revoked
  // by verifySessionCookie(..., checkRevoked: true) on every subsequent
  // request. Without this, a stolen cookie remains valid for the full
  // 5-day window even after the user clicks Log Out.
  if (sessionCookie) {
    try {
      const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
      await getAuth(adminApp).revokeRefreshTokens(decoded.sub);
    } catch (err) {
      // An expired or already-revoked cookie throws — that's fine for
      // logout. We log so this isn't silently failing in dev, but we
      // never fail the user's logout because the server couldn't revoke.
      console.warn("Logout: could not revoke refresh tokens:", err);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
