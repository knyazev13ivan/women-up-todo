import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAe8cXwUkgJMqi-8UyMakKJsQJI8snCS4",
  authDomain: "women-up-test.firebaseapp.com",
  projectId: "women-up-test",
  storageBucket: "women-up-test.appspot.com",
  messagingSenderId: "169842795595",
  appId: "1:169842795595:web:011616cc3afb370157d9ce",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);
