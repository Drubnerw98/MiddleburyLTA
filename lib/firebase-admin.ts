import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "../firebase-service-account.json";

const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as any),
        storageBucket: "middlebury-low-tax.firebasestorage.app", // Updated bucket name
      })
    : getApp();

export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export { adminApp };
