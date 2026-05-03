/* eslint-disable @typescript-eslint/no-require-imports */
/*
 * One-shot helper to grant the `admin` custom claim on a Firebase user.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT_KEY=$(cat path/to/key.json) \
 *     node scripts/setAdmin.js you@example.com
 *
 *   # or pass --revoke to clear the claim
 *   FIREBASE_SERVICE_ACCOUNT_KEY=$(cat ...) node scripts/setAdmin.js you@example.com --revoke
 *
 * Reads the key from FIREBASE_SERVICE_ACCOUNT_KEY (same env var used by the
 * app) so no service-account JSON ever lives on disk in the repo.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set.");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/setAdmin.js <email> [--revoke]");
  process.exit(1);
}
const revoke = process.argv.includes("--revoke");

const serviceAccount = JSON.parse(raw);
if (typeof serviceAccount.private_key === "string") {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

(async () => {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, revoke ? null : { admin: true });
    console.log(`${revoke ? "Revoked" : "Granted"} admin claim for ${email}`);
  } catch (err) {
    console.error("Failed:", err.message ?? err);
    process.exit(1);
  }
})();
