// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Replace the config with your Firebase project's config -- only the messagingSenderId is critical here
// `import.meta.env` is not available in service worker static files under `public/`.
// Provide config by setting `self.FIREBASE_CONFIG` at runtime or replace the
// placeholders below with your project values during deployment/build.
const firebaseConfig = (typeof self !== 'undefined' && self.FIREBASE_CONFIG) ? self.FIREBASE_CONFIG : {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // Customize notification here
  const title = payload.notification?.title || "GameDay";
  const options = {
    body: payload.notification?.body || "",
    data: payload.data || {},
    // optionally add icon:
    // icon: '/logo192.png'
  };
  self.registration.showNotification(title, options);
});
