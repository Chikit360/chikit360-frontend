// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCl9pvQeNCxhwXqu4FLFnzHoGbTVNKSBY",
  authDomain: "medical-erp-scanner.firebaseapp.com",
  projectId: "medical-erp-scanner",
  storageBucket: "medical-erp-scanner.firebasestorage.app",
  messagingSenderId: "237601848141",
  appId: "1:237601848141:web:5ed358cef196a8256f9504"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);