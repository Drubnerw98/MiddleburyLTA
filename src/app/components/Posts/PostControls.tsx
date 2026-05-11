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

// Allowlist of MIME types we accept for post hero images. SVG is
// excluded intentionally — SVGs can carry inline scripts and we
// serve image URLs from a public bucket. Animated GIFs allowed for
// editorial reasons.
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Hard cap below the Next 5MB body limit so we reject before reading
// the whole body. Anything bigger should be optimized first.
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

class UploadError extends Error {}

/**
 * Uploads a validated image to Firebase Storage and returns its public URL.
 * Throws UploadError with a user-safe message if the file fails validation.
 */
async function uploadImageToStorage(image: File): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[image.type];
  if (!ext) {
    throw new UploadError(
      `Unsupported image type. Use PNG, JPEG, WebP, or GIF.`,
    );
  }
  if (image.size > MAX_IMAGE_BYTES) {
    throw new UploadError(
      `Image is too large. Max ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`,
    );
  }

  // Build the storage path from a UUID + the extension we derived from
  // the (validated) MIME. The original filename is discarded so a
  // crafted filename can't influence the storage path.
  const fileId = uuidv4();
  const filename = `post-images/${fileId}.${ext}`;
  const bucket = adminStorage.bucket();
  const file = bucket.file(filename);
  const buffer = Buffer.from(await image.arrayBuffer());

  await file.save(buffer, {
    metadata: {
      contentType: image.type,
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
  } catch {
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
    try {
      imageUrl = await uploadImageToStorage(image);
    } catch (err) {
      if (err instanceof UploadError) {
        return { success: false, message: err.message };
      }
      throw err;
    }
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
  const updateData: Record<string, unknown> = {
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
    let newUrl: string;
    try {
      newUrl = await uploadImageToStorage(image);
    } catch (err) {
      if (err instanceof UploadError) {
        return { success: false, message: err.message };
      }
      throw err;
    }
    if (existingData.imageUrl) {
      await deleteImageByUrl(existingData.imageUrl);
    }
    updateData.imageUrl = newUrl;
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
