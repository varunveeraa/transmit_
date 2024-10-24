import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcULlc8SboYsxNpKl6dt6SupUpbZfjSvM",
  authDomain: "transmit-11031.firebaseapp.com",
  projectId: "transmit-11031",
  storageBucket: "transmit-11031.appspot.com",
  messagingSenderId: "497681351854",
  appId: "1:497681351854:web:f7cf4f63a958f7ffb7993f"
};

const app = initializeApp(firebaseConfig, 
    {  
        experimentalForceLongPolling: true
});

const db = getFirestore(app); // Initialize Firestore

export { db };
