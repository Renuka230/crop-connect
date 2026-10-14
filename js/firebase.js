
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD3wwHrXwe2_fBjm0uDce68IjDu1j2CLaU",
    authDomain: "cropconnect-7020f.firebaseapp.com",
    projectId: "cropconnect-7020f",
    storageBucket: "cropconnect-7020f.firebasestorage.app",
    messagingSenderId: "984202779019",
    appId: "1:984202779019:web:6bce590ebc15b73a4b378e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
