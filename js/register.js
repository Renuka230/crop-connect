
import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const role = document.getElementById("registerRole").value.toLowerCase();

    const password = document.getElementById("registerPassword").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const state = document.getElementById("registerState").value.trim();
    const district =
        document.getElementById("registerDistrict").value.trim();
    const village =
        document.getElementById("registerVillage").value.trim();

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        return;
    }

    if (role !== "farmer" && role !== "customer") {
        message.textContent = "Please select Farmer or Customer.";
        return;
    }

    try {
        message.textContent = "Creating your account...";

        // Create account using Firebase Authentication
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Save the user's name
        await updateProfile(result.user, {
            displayName: fullName
        });

        // Save user details in Firestore
        await setDoc(doc(db, "users", result.user.uid), {
            fullName: fullName,
            email: email,
            phone: phone,
            role: role,
            isFarmer: role === "farmer",
            address: {
                state: state,
                district: district,
                village: village
            },
            createdAt: serverTimestamp()
        });

        message.textContent = "Registration successful!";

        // Redirect after registration
        setTimeout(function () {
            if (role === "farmer") {
                window.location.href = "farmer/dashboard.html";
            } else {
                window.location.href = "customer/dashboard.html";
            }
        }, 1500);

    } catch (error) {
        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            message.textContent = "Email already registered. Please log in.";
        } else if (error.code === "auth/weak-password") {
            message.textContent = "Please choose a stronger password.";
        } else {
            message.textContent = "Registration failed: " + error.message;
        }
    }
});
