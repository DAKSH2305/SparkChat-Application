// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzCAzzSGtpCVz-CF4oB7fq0pwBCwVgxIs",
  authDomain: "sparkchat-b37eb.firebaseapp.com",
  projectId: "sparkchat-b37eb",
  storageBucket: "sparkchat-b37eb.firebasestorage.app",
  messagingSenderId: "43794530712",
  appId: "1:43794530712:web:6ef8111c909183b3742bed",
  measurementId: "G-JPN4HM9GHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);