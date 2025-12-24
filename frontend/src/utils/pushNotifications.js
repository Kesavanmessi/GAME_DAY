// frontend/src/utils/pushNotifications.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import API from "../api/api";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


let messaging;

export function initFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return messaging;
  } catch (err) {
    console.error("Firebase init error", err);
  }
}

export async function requestPermissionAndRegister() {
  try {
    if (!messaging) initFirebase();
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission not granted");
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    // Validate VAPID key format (basic check)
    if (!vapidKey ||
      vapidKey === "YOUR_VAPID_KEY" ||
      vapidKey.includes("REPLACE") ||
      // Check if it looks roughly like a base64 string and has sufficient length
      !/^[A-Za-z0-9\-_]{50,}$/.test(vapidKey)
    ) {
      console.warn("Push notifications skipped: Invalid or missing VAPID key. Check VITE_FIREBASE_VAPID_KEY in .env");
      return null;
    }

    let currentToken;
    try {
      currentToken = await getToken(messaging, { vapidKey });
    } catch (tokenError) {
      // Catch specific errors like the "atob" error (InvalidCharacterError) which happens if the key is malformed
      console.error("Error generating push token (likely invalid VAPID key):", tokenError.message);
      return null;
    }

    if (currentToken) {
      // send token to backend to register
      await API.post("/device/register", { token: currentToken, platform: "web" });
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("Push register error:", err);
    throw err;
  }
}

export function onMessageListener(callback) {
  if (!messaging) initFirebase();
  onMessage(messaging, (payload) => {
    callback(payload);
  });
}
