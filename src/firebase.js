// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjuTg5QKmh_YGhvQpBC7PliI1AZ0DZSjQ",
  authDomain: "realtor-clone-react-ff2e8.firebaseapp.com",
  projectId: "realtor-clone-react-ff2e8",
  storageBucket: "realtor-clone-react-ff2e8.appspot.com",
  messagingSenderId: "989348683828",
  appId: "1:989348683828:web:af7313c61ff2bf900eea61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore() 
