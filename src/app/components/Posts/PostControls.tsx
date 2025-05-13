// src/app/components/Posts/PostControls.ts
"use server";

import { v4 as uuidv4 } from "uuid";
import { getUserIfAdmin } from "../../../../lib/auth";
import { adminDb, adminStorage } from "../../../../lib/firebase-admin";

/**
 * Uploads an image to Firebase Storage and returns its public URL.
 */
async function uploadImageToStorage(image: File): Promise<string> {
  const fileId = uuidv4();
  const bucket = adminStorage.bucket();
  const filename = `post-images/${fileId}-${image.name}`;
  const file = bucket.file(filename);
  const buffer = Buffer.from(await image.arrayBuffer());

  await file.save(buffer, {
    metadata: {
      contentType: image.type || "application/octet-stream",
      cacheControl: "public, max-age=3600",
    },
    public: true,
  });

  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

/**
 * Handles post creation.
 */
export async function createPostAction(formData: FormData) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const rawTags = formData.get("tags")?.toString() || "";
  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const image = formData.get("image") as File | null;

  if (!title || !content) {
    return { success: false, message: "Missing title or content" };
  }

  let imageUrl = "";
  if (image && image.size > 0) {
    imageUrl = await uploadImageToStorage(image);
  }

  await adminDb.collection("posts").add({
    title,
    content,
    imageUrl,
    tags,
    createdAt: Date.now(),
  });

  return { success: true };
}

/**
 * Handles post editing.
 */
export async function editPostAction(formData: FormData) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const rawTags = formData.get("tags")?.toString() || "";
  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const image = formData.get("image") as File | null;

  if (!id || !title || !content) {
    return { success: false, message: "Missing required fields" };
  }

  const updateData: Record<string, any> = {
    title,
    content,
    tags,
  };

  if (image && image.size > 0) {
    updateData.imageUrl = await uploadImageToStorage(image);
  }

  await adminDb.collection("posts").doc(id).update(updateData);

  return {
    success: true,
    ...(updateData.imageUrl && { imageUrl: updateData.imageUrl }),
  };
}

/**
 * Handles post deletion.
 */
export async function deletePostAction(id: string) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  if (!id) return { success: false, message: "Missing post ID" };

  try {
    await adminDb.collection("posts").doc(id).delete();
    return { success: true };
  } catch (err) {
    console.error("Error deleting post:", err);
    return { success: false, message: "Error deleting post." };
  }
}
