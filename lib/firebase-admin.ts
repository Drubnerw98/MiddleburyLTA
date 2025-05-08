import path from "path";
import fs from "fs";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

// Absolute path to the credentials file
const serviceAccountPath = path.resolve(
  process.cwd(),
  "firebase-service-account.json"
);

// Load and parse the credentials only if the file exists
const serviceAccount = fs.existsSync(serviceAccountPath)
  ? JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
  : null;

if (!getApps().length && serviceAccount) {
  initializeApp({ credential: cert(serviceAccount) });
}

export const adminApp = getFirestore();
