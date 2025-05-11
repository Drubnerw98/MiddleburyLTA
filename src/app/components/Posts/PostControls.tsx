"use server";

import { v4 as uuidv4 } from "uuid";
import { getUserIfAdmin } from "../../../../lib/auth";
import { adminDb, adminStorage } from "../../../../lib/firebase-admin";

export async function createPostAction(formData: FormData) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const image = formData.get("image") as File | null;

  if (!title || !content) return { success: false, message: "Missing fields" };

  let imageUrl = "";

  if (image && image.size > 0) {
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

    imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }

  await adminDb.collection("posts").add({
    title,
    content,
    imageUrl,
    createdAt: Date.now(),
  });

  return { success: true };
}

export async function editPostAction(formData: FormData) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const image = formData.get("image") as File | null;

  if (!id || !title || !content) {
    return { success: false, message: "Missing fields" };
  }

  const updateData: any = { title, content };

  if (image && image.size > 0) {
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

    updateData.imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }

  await adminDb.collection("posts").doc(id).update(updateData);
  return { success: true };
}

export async function deletePostAction(id: string) {
  const user = await getUserIfAdmin();
  if (!user) return { success: false, message: "Unauthorized" };

  if (!id) return { success: false, message: "Missing post ID" };

  await adminDb.collection("posts").doc(id).delete();
  return { success: true };
}
