import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// ✅ Read service account from environment variable
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
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
