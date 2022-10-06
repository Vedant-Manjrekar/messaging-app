// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFGEihW1Gm1XM292DrxC396IkSXRtYMtk",
  authDomain: "whatsapp-clone-a54b6.firebaseapp.com",
  projectId: "whatsapp-clone-a54b6",
  storageBucket: "whatsapp-clone-a54b6.appspot.com",
  messagingSenderId: "736375794466",
  appId: "1:736375794466:web:9462b3a1e41bf72c85537b",
  measurementId: "G-557DTFCBVR",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
