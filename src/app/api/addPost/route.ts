import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { adminApp } from "../../../../lib/firebase-admin"; // or the relative path to your file
import { getFirestore } from "firebase-admin/firestore";
import { ratelimit } from "../../../../lib/rateLimiter";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }
  try {
    const { title } = await req.json();

    const docRef = await addDoc(collection(db, "testPosts"), {
      title,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Post added!", id: docRef.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("Firestore error:", err);
    return NextResponse.json(
      { message: "Failed to add post" },
      { status: 500 }
    );
  }
}
