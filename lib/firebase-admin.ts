// lib/firebase-admin.ts

import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Prevent execution on the client
if (typeof window !== "undefined") {
    throw new Error("firebase-admin should never be imported on the client");
}

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in the environment.");
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(raw);

    if (typeof serviceAccount.private_key === "string") {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    } else {
        throw new Error("Missing private_key in FIREBASE_SERVICE_ACCOUNT_KEY");
    }
} catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", err);
    throw err;
}

const adminApp =
    getApps().length === 0
        ? initializeApp({
            credential: cert(serviceAccount),
            storageBucket: "middlebury-low-tax.firebasestorage.app",
        })
        : getApp();

export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export { adminApp };
