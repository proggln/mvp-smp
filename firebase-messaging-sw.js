/* MVP site push notifications (Firebase Cloud Messaging service worker) */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyDS3Z0joAiGinz_IRAIWZpay4sPE2rLEbU",
  authDomain: "mvp-353a6.firebaseapp.com",
  projectId: "mvp-353a6",
  storageBucket: "mvp-353a6.firebasestorage.app",
  messagingSenderId: "460112027055",
  appId: "1:460112027055:web:5dadc267f18744b01e635a"
});
firebase.messaging();   // news arrive with a ready notification; Firebase shows it and opens the link on tap
