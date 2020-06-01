// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
// We only want to use Firebase Auth here
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkBnSwhsCjKT2YsL_FZ2a99QiI53CMKsU",
  authDomain: "tapabocas-9cf8c.firebaseapp.com",
  databaseURL: "https://tapabocas-9cf8c.firebaseio.com",
  projectId: "tapabocas-9cf8c",
  storageBucket: "tapabocas-9cf8c.appspot.com",
  messagingSenderId: "337151078752",
  appId: "1:337151078752:web:4af8d7eabe74f750a52e05",
  measurementId: "G-8X8R788CLN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Finally, export it to use it throughout your app
export default firebase;