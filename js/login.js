
import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const roleInput = document.getElementById("loginRole");
const roleButtons = document.querySelectorAll(".role-btn");

// Handle Farmer, Customer and Admin selection
roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        roleButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        roleInput.value = button.dataset.role;
    });
});

// Handle login
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const selectedRole = roleInput.value.toLowerCase();

    try {
        message.textContent = "Logging in...";

        // Verify email and password with Firebase
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Get the user's saved profile
        const userDoc = await getDoc(
            doc(db, "users", result.user.uid)
        );

        if (!userDoc.exists()) {
            message.textContent =
                "Your user profile was not found. Please contact support.";
            return;
        }

        const userData = userDoc.data();
        const actualRole = String(userData.role || "").toLowerCase();

        // Verify the selected role matches the registered role
        if (selectedRole !== actualRole) {
            message.textContent =
                "You selected the wrong role. Please select " +
                actualRole + " and try again.";
            return;
        }

        message.textContent = "Login successful! Redirecting...";

        // Redirect based on the role stored in Firestore
        if (actualRole === "farmer") {
            window.location.href = "farmer/farmer-dashboard.html";
        } else if (actualRole === "customer") {
            window.location.href = "customer/customer-dashboard.html";
        } else if (actualRole === "admin") {
            window.location.href = "admin/home.html";
        } else {
            message.textContent = "Your account has an invalid role.";
        }

    } catch (error) {
        console.error("Login error:", error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
        ) {
            message.textContent = "Incorrect email or password.";
        } else if (error.code === "auth/too-many-requests") {
            message.textContent =
                "Too many attempts. Please try again later.";
        } else {
            message.textContent = "Login failed: " + error.message;
        }
    }
});

// Handle Forgot Password
document.getElementById("forgotPassword").addEventListener(
    "click",
    async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();

        if (!email) {
            message.textContent =
                "Enter your email address first, then click Forgot Password.";
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            message.textContent =
                "If an account exists for this email, a password reset email will be sent.";
        } catch (error) {
            console.error("Password reset error:", error);
            message.textContent =
                "Unable to send reset email. Please check your email and Firebase settings.";
        }
    }
);
