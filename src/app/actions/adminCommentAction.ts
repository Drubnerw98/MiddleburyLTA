"use server";

import { z } from "zod";
import { getUserIfAdmin } from "../../../lib/auth";
import { adminDb } from "../../../lib/firebase-admin";
import type { ActionResult } from "./adminLinkActions";

// Hard-delete a comment from the admin moderation dashboard. Distinct
// from lib/comments.ts (softDeleteComment), which preserves the doc
// for the author's own delete flow.

const DeleteCommentSchema = z.object({
    postId: z.string().trim().min(1).max(120),
    commentId: z.string().trim().min(1).max(120),
});

export async function deleteCommentAsAdminAction(
    postId: string,
    commentId: string,
): Promise<ActionResult> {
    const user = await getUserIfAdmin();
    if (!user) return { success: false, message: "Unauthorized." };

    const parsed = DeleteCommentSchema.safeParse({ postId, commentId });
    if (!parsed.success) {
        return { success: false, message: "Invalid identifiers." };
    }

    try {
        await adminDb
            .collection("posts")
            .doc(parsed.data.postId)
            .collection("comments")
            .doc(parsed.data.commentId)
            .delete();
        return { success: true };
    } catch (err) {
        console.error("Failed to delete comment:", err);
        return { success: false, message: "Failed to delete comment." };
    }
}
