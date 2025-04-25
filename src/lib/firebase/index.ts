// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"
import { serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FIREBASE_API_KEY = import.meta.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = import.meta.env.FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = import.meta.env.FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = import.meta.env.FIREBASE_APP_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
};

// Initialize Firebase
//const fireStoreApp = initializeApp(firebaseConfig);
const fireStoreApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const authProvider = new GoogleAuthProvider();
const authentication = getAuth(fireStoreApp);
const fireBaseStorage = getStorage(fireStoreApp);
const fireBaseDataBase = getDatabase(fireStoreApp);
const fireBaseTimeStamp = serverTimestamp()


export  { authProvider, authentication, fireBaseStorage, fireBaseDataBase, fireBaseTimeStamp};