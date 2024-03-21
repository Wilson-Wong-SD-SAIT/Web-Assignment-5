// Importing necessary functions from Firebase SDK
// 'initializeApp' is used to initialize the Firebase app with a given configuration.
import { initializeApp } from "firebase/app";
// Import 'getAuth' function for Firebase authentication.
// This is used to initialize the authentication service.
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Firebase configuration object containing keys and identifiers for your app.
// This includes API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID.
// These values are stored in environment variables to keep them secure and not hard-coded into the source code.
// process.env is used to access these environment variables.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // API key for accessing Firebase services
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // Domain for Firebase authentication
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // ID of the Firebase project
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // Storage bucket for Firebase storage service
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, // Sender ID for Firebase messaging
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID, // App ID for the Firebase application
};

// Initializing the Firebase application with the configuration object.
// The 'app' object represents your Firebase application and is used in subsequent Firebase service initializations.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initializing Firebase authentication service and exporting it.
// 'auth' is an instance of Firebase Auth service, used for handling user authentication.
export { db };
export const auth = getAuth(app);
