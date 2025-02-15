import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyC7eiz_YnYY6mKRcql-xaWF9r_UITEPkIU",
    authDomain: "kisanapp-b2bce.firebaseapp.com",
    projectId: "kisanapp-b2bce",
    storageBucket: "kisanapp-b2bce.firebasestorage.app",
    messagingSenderId: "897886669760",
    appId: "1:897886669760:web:201171a81e6ed54ce29625",
    measurementId: "G-GESF0LPME9"
  };
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Set up Auth with persistence
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { firebaseApp, auth };
