const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./firebase-service-account.json");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

async function setAdminRole(email) {
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ ${email} is now an admin`);
}

setAdminRole("drubnation@gmail.com");
