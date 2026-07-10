// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "ai-agent-5cff7.firebaseapp.com",
  projectId: "ai-agent-5cff7",
  storageBucket: "ai-agent-5cff7.firebasestorage.app",
  messagingSenderId: "76526190787",
  appId: "1:76526190787:web:0e1883a7d4adbe81c1a276"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const googleProvider =
  new GoogleAuthProvider();

export const githubProvider =
  new GithubAuthProvider();