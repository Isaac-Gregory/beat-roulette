// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA02aFR3zCRNJP3s--BxLXm3WobK0kWQb8",
    authDomain: "beat-roulette.firebaseapp.com",
    projectId: "beat-roulette",
    storageBucket: "beat-roulette.firebasestorage.app",
    messagingSenderId: "973708648462",
    appId: "1:973708648462:web:81ae0f461787843b661c5f",
    measurementId: "G-X3SWND29VF"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// try {
//     const docRef = await addDoc(collection(db, "users"), {
//     first: "Alan",
//     middle: "Mathison",
//     last: "Turing",
//     born: 1912
//     });

//     console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//     console.error("Error adding document: ", e);
// }