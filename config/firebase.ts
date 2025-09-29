import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "AIzaSyD7LIIAIFbg_E1xJkBLH5df1XJ2zIwdaag",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "directory-app-635ed.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "directory-app-635ed",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "directory-app-635ed.firebasestorage.app",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "285582100649",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "1:285582100649:web:8ff98be50df904798d81b8",
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with proper error handling and fallback
let auth: any = null;

// Create a mock auth object for development
const createMockAuth = () => ({
  app,
  currentUser: null,
  onAuthStateChanged: () => () => {},
  signInWithPhoneNumber: () => Promise.reject(new Error('Development mode - use test phone numbers')),
  signOut: () => Promise.resolve(),
  // Add other auth methods as needed
});

try {
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase Auth initialization failed, using development mode');
  auth = createMockAuth();
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
