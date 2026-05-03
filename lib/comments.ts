"use server";

import { getCurrentUser } from "./auth";
import { adminDb } from "./firebase-admin";

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

  if (!user.admin && comment.uid !== user.uid) throw new Error("Unauthorized");

  await docRef.update({
    deleted: true,
    content: "",
    edited: false,
  });
}
