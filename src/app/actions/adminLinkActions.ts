"use server";

import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getUserIfAdmin } from "../../../lib/auth";
import { adminDb } from "../../../lib/firebase-admin";
import { SAFE_URL_SCHEMES } from "../../../lib/safeUrl";

const LinkSchema = z.object({
    title: z.string().trim().min(1, "Title is required.").max(300),
    url: z
        .string()
        .trim()
        .min(1, "URL is required.")
        .max(2000)
        .refine((raw) => {
            try {
                const u = new URL(raw);
                return SAFE_URL_SCHEMES.includes(u.protocol);
            } catch {
                return false;
            }
        }, "URL must use http, https, or mailto."),
    description: z.string().trim().max(2000).optional().default(""),
    source: z.string().trim().max(200).optional().default(""),
    datePublished: z.string().trim().max(40).optional().default(""),
});

type LinkInput = z.infer<typeof LinkSchema>;

export type ActionResult<T = undefined> = {
    success: boolean;
    message?: string;
    data?: T;
    fieldErrors?: Record<string, string[]>;
};

export async function createLinkAction(input: LinkInput): Promise<ActionResult> {
    const user = await getUserIfAdmin();
    if (!user) return { success: false, message: "Unauthorized." };

    const parsed = LinkSchema.safeParse(input);
    if (!parsed.success) {
        return {
            success: false,
            message: "Invalid input.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        await adminDb.collection("external_links").add({
            ...parsed.data,
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (err) {
        console.error("Failed to create external link:", err);
        return { success: false, message: "Failed to save link." };
    }
}

export async function deleteLinkAction(id: string): Promise<ActionResult> {
    const user = await getUserIfAdmin();
    if (!user) return { success: false, message: "Unauthorized." };

    const idParse = z.string().trim().min(1).max(120).safeParse(id);
    if (!idParse.success) {
        return { success: false, message: "Invalid link id." };
    }

    try {
        await adminDb.collection("external_links").doc(idParse.data).delete();
        return { success: true };
    } catch (err) {
        console.error("Failed to delete external link:", err);
        return { success: false, message: "Failed to delete link." };
    }
}
