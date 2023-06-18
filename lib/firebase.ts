// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0VXU5zJrqAh9d50hd2GVsPil-ai1FDrQ",
  authDomain: "rating-app-8814e.firebaseapp.com",
  projectId: "rating-app-8814e",
  storageBucket: "rating-app-8814e.appspot.com",
  messagingSenderId: "189003212061",
  appId: "1:189003212061:web:7b213ceecae78602f12df4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)