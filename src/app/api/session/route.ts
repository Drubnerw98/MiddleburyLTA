import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../../../../lib/firebase-admin";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Missing token" },
      { status: 401 }
    );
  }

  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.headers.set(
    "Set-Cookie",
    `__session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 5}; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    } SameSite=Lax`
  );

  return response;
}
