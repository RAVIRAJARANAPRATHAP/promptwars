import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy_dummy_build_key_placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "promptwars-a6ed9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "promptwars-a6ed9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "promptwars-a6ed9.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "669224879621",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:669224879621:web:66ecff7f0a154c8536fe6c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q8PCRY5DHX",
};

let app: FirebaseApp;
let auth: Auth;
const googleProvider = new GoogleAuthProvider();

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn("[Firebase] Initializing with safe build fallback:", error);
  // Safe mock for static build phase if credentials aren't passed
  app = {} as FirebaseApp;
  auth = {} as Auth;
}

export { app, auth, googleProvider };
