// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSNMrSvWPsZEzAYZwMt7wgwM1nw4rljgM",
  authDomain: "mappymap-cc92b.firebaseapp.com",
  projectId: "mappymap-cc92b",
  storageBucket: "mappymap-cc92b.appspot.com",
  messagingSenderId: "706072624912",
  appId: "1:706072624912:web:71d5d93ada8a3509246f95",
  measurementId: "G-3SHR599JJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, auth, database };
