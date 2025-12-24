// backend/src/utils/firebaseAdmin.js
const adminLib = require("firebase-admin");
const path = require("path");
let admin = adminLib;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  console.warn("FIREBASE_SERVICE_ACCOUNT_PATH not set in .env — Firebase Admin will not be initialized.");
} else {
  try {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
      });
      console.log("Firebase Admin initialized.");
    }
  } catch (err) {
    console.warn("Could not load Firebase service account, Firebase Admin not initialized:", err.message);
    // Provide a minimal stub so requiring this module doesn't crash the app.
    admin = {
      apps: [],
      initializeApp: () => {},
      credential: { cert: () => null },
      messaging: () => ({
        sendMulticast: async () => { throw new Error('Firebase Admin not configured'); }
      }),
    };
  }
}

module.exports = admin;
