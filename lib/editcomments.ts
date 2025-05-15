"use server";

import { getCurrentUser } from "./auth";
import { adminDb } from "./firebase-admin";

/**
 * Edits a comment if the current user is its owner or admin.
 */
export async function editCommentContent(
  postId: string,
  commentId: string,
  newContent: string
) {
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
  if (!comment) throw new Error("Comment data missing");

  const isAdmin = user.email === "drubnation@gmail.com";
  const isOwner = comment.uid === user.uid;

  if (!isAdmin && !isOwner) throw new Error("Unauthorized");

  await docRef.update({
    content: newContent,
    edited: true,
  });
}
