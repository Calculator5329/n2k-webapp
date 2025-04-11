// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj3tQz9toKMnIreAAXR_6w-VEQWkHY8cY",
  authDomain: "n2k-site.firebaseapp.com",
  projectId: "n2k-site",
  storageBucket: "n2k-site.firebasestorage.app",
  messagingSenderId: "484860954079",
  appId: "1:484860954079:web:57abd9cad5481c0a29706a",
  measurementId: "G-VYCYKRLCCE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
