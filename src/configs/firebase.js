// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg6OKfll7u3kUW3dCWhRHAnPqB6pEfJnE",
  authDomain: "e-library-himpelmanawaka.firebaseapp.com",
  projectId: "e-library-himpelmanawaka",
  storageBucket: "e-library-himpelmanawaka.firebasestorage.app",
  messagingSenderId: "72451776465",
  appId: "1:72451776465:web:f4e20d98c72bf6ccbccaf0",
  measurementId: "G-WSLEFDYKH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);