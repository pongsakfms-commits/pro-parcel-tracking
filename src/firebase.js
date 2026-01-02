import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ⚠️ STEP 1: วางโค้ดที่ก๊อปปี้มาจาก Firebase Console ตรงนี้ครับ (ทับตัวแปร firebaseConfig อันเก่าไปเลย)
// วิธีหา: กดรูปเฟือง (Settings) มุมซ้ายบน > Project settings > เลื่อนลงมาล่างสุด > เลือก Config
const firebaseConfig = {
    apiKey: "AIzaSyDidt5FhT9i7ZAcTnBG1sEEnBKg-CSJ2mE",
    authDomain: "tracking-app-71665.firebaseapp.com",
    projectId: "tracking-app-71665",
    storageBucket: "tracking-app-71665.firebasestorage.app",
    messagingSenderId: "859645642622",
    appId: "1:859645642622:web:15b800e66cb44feb61d52f",
    measurementId: "G-H96M3NQ99E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
