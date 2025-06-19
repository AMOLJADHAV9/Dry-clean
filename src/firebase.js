// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD36k0Vg2j8a-8lkBh85de8bT0bWG_VE3g",
  authDomain: "dry-clean-cfdcb.firebaseapp.com",
  projectId: "dry-clean-cfdcb",
  storageBucket: "dry-clean-cfdcb.firebasestorage.app",
  messagingSenderId: "297368166723",
  appId: "1:297368166723:web:ad6bfa1a37b656b40f8ff6",
  measurementId: "G-EE1Y60CGM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth }; 