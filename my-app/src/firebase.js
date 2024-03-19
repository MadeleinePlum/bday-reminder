import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0A6zJ9kfGKq5946HAcS5QPTypOeXpfnY",
  authDomain: "birthday-reminder-2024.firebaseapp.com",
  databaseURL: "https://birthday-reminder-2024-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "birthday-reminder-2024",
  storageBucket: "birthday-reminder-2024.appspot.com",
  messagingSenderId: "212172611453",
  appId: "1:212172611453:web:33dde763e4c2a6d6e03614"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
