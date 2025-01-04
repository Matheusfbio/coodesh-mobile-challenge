// firebase.ts (ou firebaseConfig.js)
import firebase from "firebase/app";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdxvae369zQ2g0wFORXD2c8wm6-DXm0Qg",
  authDomain: "wordlistenglish.firebaseapp.com",
  projectId: "wordlistenglish",
  storageBucket: "wordlistenglish.firebasestorage.app",
  messagingSenderId: "7905655240",
  appId: "1:7905655240:web:1a0e2e8becbe95bf7a68fd",
  measurementId: "G-DB7DD9S70L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let firebaseApp;

const db = getFirestore(firebaseApp);

export { db, getFirestore, collection, addDoc, getDoc }; // Exporte a instância do Firestore
