// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAuth } from "firebase/auth"; // Authentication
import { getStorage } from "firebase/storage"; // Firebase Storage

// Configuración de aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBT-MhKS7hhMQ9iQn-xf8BTC5wmAT5_g0c",
  authDomain: "fabo-social.firebaseapp.com",
  projectId: "fabo-social",
  storageBucket: "fabo-social.appspot.com",
  messagingSenderId: "18759853445",
  appId: "1:18759853445:web:b1170a89f3f082401e90ec"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Firebase Auth
const auth = getAuth(app);

// Inicializa Firebase Storage
const storage = getStorage(app);

// Exporta la aplicación y los servicios de Firestore, Auth y Storage para usarlos en otros archivos
export { db, auth, storage };
