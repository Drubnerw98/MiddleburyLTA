"use server";

import { getCurrentUser } from "./auth";
import { adminDb } from "./firebase-admin";

/**
 * Soft-deletes a comment by setting `deleted: true` and wiping content.
 */
export async function softDeleteComment(postId: string, commentId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const docRef = adminDb
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .doc(commentId);

  const docSnap = await docRef.get();
  if (!docSnap.exists) throw new Error("Comment not found");

  const comment = docSnap.data();
  if (!comment) throw new Error("Comment data is missing");

  const isAdmin = user.email === "drubnation@gmail.com";
  const isOwner = comment.uid === user.uid;

  if (!isAdmin && !isOwner) throw new Error("Unauthorized");

  await docRef.update({
    deleted: true,
    content: "", // wipe the content
    edited: false,
  });
}
