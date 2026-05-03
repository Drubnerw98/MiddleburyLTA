import { initializeApp, cert, getApps, getApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

// Defense in depth — the env var name (no NEXT_PUBLIC_ prefix) is what actually
// keeps it out of the client bundle. This throw catches accidental imports.
if (typeof window !== "undefined") {
  throw new Error("firebase-admin should never be imported on the client");
}

let cachedApp: App | undefined;

// Lazy init so `next build` doesn't blow up in CI environments that have no
// service-account credentials. The first request that touches Firestore or
// Storage will trigger initialization.
function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length) {
    cachedApp = getApp();
    return cachedApp;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in the environment.");
  }
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!storageBucket) {
    throw new Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in the environment.");
  }

  const serviceAccount = JSON.parse(raw);
  if (typeof serviceAccount.private_key !== "string") {
    throw new Error("Missing private_key in FIREBASE_SERVICE_ACCOUNT_KEY");
  }
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  cachedApp = initializeApp({ credential: cert(serviceAccount), storageBucket });
  return cachedApp;
}

// Proxy so existing `adminDb.collection(...)` callsites keep working without
// every caller needing a function call to obtain the handle.
function lazy<T extends object>(getter: () => T): T {
  return new Proxy({} as T, {
    get(_t, prop, recv) {
      const target = getter();
      const value = Reflect.get(target, prop, recv);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

export const adminApp: App = lazy(getAdminApp);
export const adminDb: Firestore = lazy(() => getFirestore(getAdminApp()));
export const adminStorage: Storage = lazy(() => getStorage(getAdminApp()));
