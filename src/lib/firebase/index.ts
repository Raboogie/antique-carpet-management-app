import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"
import { serverTimestamp, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const fireStoreApp = initializeApp(firebaseConfig);
const authProvider = new GoogleAuthProvider();
const authentication = getAuth(fireStoreApp);
const fireBaseStorage = getStorage(fireStoreApp);
const fireBaseDataBase = getDatabase(fireStoreApp);
const fireBaseTimeStamp = serverTimestamp();
const db = getFirestore(fireStoreApp,"carpet-management-app");


export  { authProvider, authentication, fireBaseStorage, fireBaseDataBase, fireBaseTimeStamp, db};