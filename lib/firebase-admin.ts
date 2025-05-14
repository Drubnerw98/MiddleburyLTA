import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import path from "path";
import { readFileSync } from "fs";

// Read the service account file directly
const serviceAccount = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "serviceAccountKey.json"), "utf8")
);

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
