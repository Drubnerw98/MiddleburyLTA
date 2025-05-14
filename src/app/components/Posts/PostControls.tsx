"use server";

import { v4 as uuidv4 } from "uuid";
import { getUserIfAdmin } from "../../../../lib/auth";
import { adminDb, adminStorage } from "../../../../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Helper to parse and sanitize comma-separated tags.
 */
function parseTags(raw: unknown): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

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
 * Deletes an image from Firebase Storage by its public URL.
 */
async function deleteImageByUrl(imageUrl: string) {
  const filename = decodeURIComponent(imageUrl.split("/").pop() || "");
  const file = adminStorage.bucket().file(`post-images/${filename}`);
  try {
    await file.delete();
  } catch (err) {
    console.warn("Image deletion failed (may not exist):", filename);
  }
}

/**
 * Creates a new post.
 */
export async function createPostAction(formData: FormData) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return { success: false, message: "Missing title or content" };
  }

  const tags = parseTags(formData.get("tags"));
  const image = formData.get("image") as File | null;
  const commentsDisabled = formData.get("commentsDisabled") === "true";

  let imageUrl = "";
  if (image && image.size > 0) {
    imageUrl = await uploadImageToStorage(image);
  }

  await adminDb.collection("posts").add({
    title,
    content,
    imageUrl,
    tags,
    commentsDisabled,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { success: true };
}

/**
 * Edits an existing post.
 */
export async function editPostAction(formData: FormData) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  const id = formData.get("id");
  const title = formData.get("title");
  const content = formData.get("content");

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string"
  ) {
    return { success: false, message: "Missing required fields" };
  }

  const tags = parseTags(formData.get("tags"));
  const image = formData.get("image") as File | null;
  const removeImage = formData.get("removeImage") === "true";
  const commentsDisabled = formData.get("commentsDisabled") === "true";

  const docRef = adminDb.collection("posts").doc(id);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return { success: false, message: "Post not found" };
  }

  const existingData = snapshot.data() as { imageUrl?: string };
  const updateData: Record<string, any> = {
    title,
    content,
    tags,
    commentsDisabled,
  };

  if (removeImage && existingData.imageUrl) {
    await deleteImageByUrl(existingData.imageUrl);
    updateData.imageUrl = "";
  }

  if (image && image.size > 0) {
    if (existingData.imageUrl) {
      await deleteImageByUrl(existingData.imageUrl);
    }
    updateData.imageUrl = await uploadImageToStorage(image);
  }

  await docRef.update(updateData);

  return {
    success: true,
    ...(typeof updateData.imageUrl === "string" && {
      imageUrl: updateData.imageUrl,
    }),
  };
}

/**
 * Deletes a post and its image if present.
 */
export async function deletePostAction(id: string) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    const docRef = adminDb.collection("posts").doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return { success: false, message: "Post not found" };

    const data = snapshot.data() as { imageUrl?: string };
    if (data?.imageUrl) {
      await deleteImageByUrl(data.imageUrl);
    }

    await docRef.delete();
    return { success: true };
  } catch (err) {
    console.error("Error deleting post:", err);
    return { success: false, message: "Error deleting post." };
  }
}
