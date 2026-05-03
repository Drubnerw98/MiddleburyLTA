"use server";

import { getCurrentUser } from "./auth";
import { adminDb } from "./firebase-admin";

const MAX_COMMENT_LENGTH = 2000;

export async function editCommentContent(
  postId: string,
  commentId: string,
  newContent: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const trimmed = newContent.trim();
  if (!trimmed) throw new Error("Comment is empty");
  if (trimmed.length > MAX_COMMENT_LENGTH) throw new Error("Comment is too long");

  const docRef = adminDb
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .doc(commentId);

  const docSnap = await docRef.get();
  if (!docSnap.exists) throw new Error("Comment not found");

  const comment = docSnap.data();
  if (!comment) throw new Error("Comment data missing");

  if (!user.admin && comment.uid !== user.uid) throw new Error("Unauthorized");

  await docRef.update({
    content: trimmed,
    edited: true,
  });
}
