"use server";

import { z } from "zod";
import { getUserIfAdmin } from "../../../lib/auth";
import { adminDb } from "../../../lib/firebase-admin";
import type { ActionResult } from "./adminLinkActions";

// Inline post-edit save used by /post/[id]'s PostEdit component.
// Parallel to PostControls.editPostAction (which takes FormData for the
// admin dashboard). The inline editor sends a plain object payload.

const POST_TITLE_MAX = 300;
const POST_CONTENT_MAX = 100_000;
const POST_TAG_MAX_LEN = 64;
const POST_TAGS_MAX_COUNT = 20;
const IMAGE_URL_MAX = 2000;

const PostUpdateSchema = z.object({
    title: z.string().trim().min(1, "Title is required.").max(POST_TITLE_MAX),
    content: z.string().max(POST_CONTENT_MAX),
    tags: z
        .array(z.string().trim().min(1).max(POST_TAG_MAX_LEN))
        .max(POST_TAGS_MAX_COUNT)
        .default([]),
    imageUrl: z
        .string()
        .trim()
        .max(IMAGE_URL_MAX)
        .optional()
        .default(""),
    commentsDisabled: z.boolean().optional().default(false),
});

type PostUpdateInput = z.infer<typeof PostUpdateSchema>;

export async function updatePostInlineAction(
    postId: string,
    input: PostUpdateInput,
): Promise<ActionResult> {
    const user = await getUserIfAdmin();
    if (!user) return { success: false, message: "Unauthorized." };

    const idParse = z.string().trim().min(1).max(120).safeParse(postId);
    if (!idParse.success) {
        return { success: false, message: "Invalid post id." };
    }

    const parsed = PostUpdateSchema.safeParse(input);
    if (!parsed.success) {
        return {
            success: false,
            message: "Invalid post fields.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const docRef = adminDb.collection("posts").doc(idParse.data);
        const snap = await docRef.get();
        if (!snap.exists) return { success: false, message: "Post not found." };

        await docRef.update(parsed.data);
        return { success: true };
    } catch (err) {
        console.error("Failed to update post:", err);
        return { success: false, message: "Failed to save post." };
    }
}
