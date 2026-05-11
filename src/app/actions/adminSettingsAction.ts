"use server";

import { z } from "zod";
import { getUserIfAdmin } from "../../../lib/auth";
import { adminDb } from "../../../lib/firebase-admin";
import type { ActionResult } from "./adminLinkActions";

const SettingsSchema = z.object({
    emailNotifications: z.boolean(),
});

type SettingsInput = z.infer<typeof SettingsSchema>;

export async function saveSettingsAction(
    input: SettingsInput,
): Promise<ActionResult> {
    const user = await getUserIfAdmin();
    if (!user) return { success: false, message: "Unauthorized." };

    const parsed = SettingsSchema.safeParse(input);
    if (!parsed.success) {
        return {
            success: false,
            message: "Invalid settings.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        await adminDb
            .collection("admin")
            .doc("settings")
            .set(parsed.data, { merge: true });
        return { success: true };
    } catch (err) {
        console.error("Failed to save settings:", err);
        return { success: false, message: "Failed to save settings." };
    }
}
