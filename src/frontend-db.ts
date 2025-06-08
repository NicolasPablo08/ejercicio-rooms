import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
//import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "rLnpaxAfuKe7ZPMFtiuNllAevzlv6qd04ozuBUqC",
  authDomain: "ejercicio-backend.firebaseapp.com",
  projectId: "ejercicio-backend",
  databaseURL: "https://ejercicio-backend-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const fsdb = getFirestore(app);
const rtdb = getDatabase(app);

export { fsdb, rtdb };
//const auth = getAuth(app);
