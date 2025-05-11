// src/app/actions/postActions.ts
"use server";

import { getAuth } from "firebase-admin/auth";
import { revalidatePath } from "next/cache";
import { adminDb } from "../../../lib/firebase-admin";

export async function createPostAction(formData: FormData) {
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();

  if (!title || !content) {
    return { success: false, message: "Missing title or content." };
  }

  try {
    await adminDb.collection("posts").add({
      title,
      content,
      timestamp: new Date(),
      imageUrl: "", // You can expand this later
      author: "admin", // Can swap in server-side auth
    });

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error creating post:", err);
    return { success: false, message: "Error creating post." };
  }
}

export async function deletePostAction(postId: string) {
  if (!postId) return { success: false, message: "Missing post ID" };

  try {
    await adminDb.collection("posts").doc(postId).delete();
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error deleting post:", err);
    return { success: false, message: "Error deleting post" };
  }
}

export async function editPostAction(
  postId: string,
  newTitle: string,
  newContent: string
) {
  if (!postId || !newTitle || !newContent) {
    return { success: false, message: "Missing data to edit post" };
  }

  try {
    await adminDb.collection("posts").doc(postId).update({
      title: newTitle,
      content: newContent,
    });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error editing post:", err);
    return { success: false, message: "Error editing post" };
  }
}
