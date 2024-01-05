// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ful-stack-real-estate.firebaseapp.com",
  projectId: "ful-stack-real-estate",
  storageBucket: "ful-stack-real-estate.appspot.com",
  messagingSenderId: "869107922764",
  appId: "1:869107922764:web:a12954db3f2029fabc81e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);