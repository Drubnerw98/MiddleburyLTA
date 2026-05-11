"use server";

import { z } from "zod";
import { getUserIfAdmin } from "../../../lib/auth";
import { adminDb } from "../../../lib/firebase-admin";
import type { ActionResult } from "./adminLinkActions";

// About-page markdown content. The 50k cap covers a full long-form
// page; anything longer is almost certainly a misconfigured paste.
const AboutSchema = z.object({
    content: z.string().max(50_000),
});

export async function saveAboutAction(content: string): Promise<ActionResult> {
    const user = await getUserIfAdmin();
    if (!user) return { success: false, message: "Unauthorized." };

    const parsed = AboutSchema.safeParse({ content });
    if (!parsed.success) {
        return {
            success: false,
            message: "Invalid content.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        await adminDb
            .collection("pages")
            .doc("about")
            .set({ content: parsed.data.content }, { merge: true });
        return { success: true };
    } catch (err) {
        console.error("Failed to save About page:", err);
        return { success: false, message: "Failed to save." };
    }
}
