"use server";

import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../../../lib/firebase-admin";
import { commentRatelimit } from "../../../lib/commentRateLimiter";
import { getCurrentUser } from "../../../lib/auth";

const MAX_COMMENT_LENGTH = 2000;
const MAX_AUTHOR_LENGTH = 200;

export async function createCommentAction(
  postId: string,
  content: string,
  author: string
) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "You must be logged in to comment." };
  }

  // Per-user limit avoids the trust-x-forwarded-for problem when the user is auth'd
  const { success: allowed } = await commentRatelimit.limit(`user:${user.uid}`);
  if (!allowed) {
    return {
      success: false,
      message: "You're commenting too fast. Try again in a few seconds.",
    };
  }

  const trimmedContent = content.trim();
  const trimmedAuthor = author.trim();

  if (!postId || !trimmedContent || !trimmedAuthor) {
    return { success: false, message: "Missing required fields." };
  }
  if (trimmedContent.length > MAX_COMMENT_LENGTH) {
    return { success: false, message: "Comment is too long." };
  }
  if (trimmedAuthor.length > MAX_AUTHOR_LENGTH) {
    return { success: false, message: "Display name is too long." };
  }

  try {
    await adminDb.collection("posts").doc(postId).collection("comments").add({
      content: trimmedContent,
      author: trimmedAuthor,
      uid: user.uid,
      edited: false,
      deleted: false,
      timestamp: Timestamp.now(),
    });

    return { success: true };
  } catch (err) {
    console.error("Error posting comment:", err);
    return { success: false, message: "Failed to post comment. Please try again." };
  }
}
