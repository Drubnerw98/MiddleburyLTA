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
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
