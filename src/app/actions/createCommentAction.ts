"use server";

import { headers } from "next/headers";
import { adminDb } from "../../../lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { commentRatelimit } from "../../../lib/commentRateLimiter";

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

  try {
    await adminDb.collection("posts").doc(postId).collection("comments").add({
      content,
      author,
      timestamp: Timestamp.now(), // ✅ Correct Firestore format
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
