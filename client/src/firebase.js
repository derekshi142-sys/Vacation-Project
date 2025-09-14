// Firebase configuration for React client
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYPivjLCBP0Z0b5xKt79spvMGQB9rdkr0",
  authDomain: "vacation-project-edec5.firebaseapp.com",
  projectId: "vacation-project-edec5",
  storageBucket: "vacation-project-edec5.firebasestorage.app",
  messagingSenderId: "34435716956",
  appId: "1:34435716956:web:8d85bd50a756de49769399"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
