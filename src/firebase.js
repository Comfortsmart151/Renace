// firebase.js – configuración central de Firebase para Renace
import { initializeApp } from "firebase/app";

// ================= FIRESTORE =================
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";

// ================= AUTH =================
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// ================= STORAGE =================
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ================= MESSAGING (FCM) =================
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ---------------------------------------------------
// CONFIG FIREBASE
// ---------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCzBf2Q8GbzuLyRllsO3XVCywJzVU2mxoU",
  authDomain: "renace-e68b4.firebaseapp.com",
  projectId: "renace-e68b4",
  storageBucket: "renace-e68b4.firebasestorage.app",
  messagingSenderId: "111027290128",
  appId: "1:111027290128:web:22b098e9788ebe0af7ca95",
};

// Inicializar App
const app = initializeApp(firebaseConfig);

// ---------------------------------------------------
// FIRESTORE
// ---------------------------------------------------
const db = getFirestore(app);

// ---------------------------------------------------
// AUTH
// ---------------------------------------------------
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logoutUser = () => signOut(auth);
export const subscribeToAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback);

// ---------------------------------------------------
// GOOGLE CALENDAR — CLIENT ID
// ---------------------------------------------------
export const GOOGLE_CLIENT_ID =
  "111027290128-fqttoevkhq65qtl8km6jn7vlbffmq778.apps.googleusercontent.com";

// ---------------------------------------------------
// STORAGE
// ---------------------------------------------------
const storage = getStorage(app);

// ---------------------------------------------------
// 🔔 MESSAGING (FCM)
// ---------------------------------------------------
const VAPID_PUBLIC_KEY = "Nbu27FmRatdybiw5wQhRVlibz52YTU8eVODUKPLXmEo";

let messaging = null;

const canUseFCM =
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "Notification" in window &&
  window.location.protocol === "https:";

if (canUseFCM) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn("FCM no disponible:", err);
  }
}

/* ---------------------------------------------------
   PEDIR TOKEN FCM (USA SERVICE WORKER)
--------------------------------------------------- */
export async function requestUserNotificationToken() {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (error) {
    console.error("Error obteniendo token FCM:", error);
    return null;
  }
}

/* ---------------------------------------------------
   FOREGROUND PUSH
--------------------------------------------------- */
export function listenToForegroundMessages(callback) {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    callback?.(payload);
  });
}

// ---------------------------------------------------
// EXPORTS GLOBALES
// ---------------------------------------------------
export {
  db,
  auth,
  storage,

  // Firestore
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,

  // Storage
  ref,
  uploadBytes,
  getDownloadURL,
};
