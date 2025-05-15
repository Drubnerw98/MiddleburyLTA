"use server";

import { headers } from "next/headers";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../../../lib/firebase-admin";
import { commentRatelimit } from "../../../lib/commentRateLimiter";
import { getCurrentUser } from "../../../lib/auth"; // ✅ Make sure this path is correct

export async function createCommentAction(
  postId: string,
  content: string,
  author: string
) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success: allowed } = await commentRatelimit.limit(ip);

  if (!allowed) {
    return {
      success: false,
      message: "You're commenting too fast. Try again in a few seconds.",
    };
  }

  if (!postId || !content || !author) {
    return {
      success: false,
      message: "Missing required fields.",
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
    };
  }

  try {
    await adminDb.collection("posts").doc(postId).collection("comments").add({
      content,
      author,
      uid: user.uid, // ✅ this is what allows edit/delete access later
      edited: false,
      deleted: false,
      timestamp: Timestamp.now(),
    });

    return { success: true };
  } catch (err) {
    console.error("Error posting comment:", err);
    return {
      success: false,
      message: "Failed to post comment. Please try again.",
    };
  }
}
