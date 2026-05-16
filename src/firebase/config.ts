import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4YIl8oXwpl_ma9r3bFajn3HihlvKrEoc",
  authDomain: "fake-store-cdd8c.firebaseapp.com",
  projectId: "fake-store-cdd8c",
  storageBucket: "fake-store-cdd8c.firebasestorage.app",
  messagingSenderId: "552034762250",
  appId: "1:552034762250:web:3c85295f8a76a3df05a9f3"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);