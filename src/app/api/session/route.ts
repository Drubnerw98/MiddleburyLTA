// src/app/api/session/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../../../../lib/firebase-admin";

const auth = getAuth(adminApp);

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const decoded = await auth.verifyIdToken(token);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const res = NextResponse.json({ success: true });
    res.cookies.set("__session", token, {
      httpOnly: true,
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
