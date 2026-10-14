
document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation menu
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.querySelector(".navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", function () {
            navbar.classList.toggle("menu-open");
        });
    }

    // Close mobile menu after selecting a link
    document.querySelectorAll(".nav-links a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (navbar) {
                navbar.classList.remove("menu-open");
            }
        });
    });

    // Select login role
    const roleButtons = document.querySelectorAll(".role-btn");
    const loginRole = document.getElementById("loginRole");

    roleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            roleButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (loginRole) {
                loginRole.value = button.dataset.role;
            }
        });
    });

    // Login form demonstration
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const message = document.getElementById("loginMessage");
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                showMessage(message, "Please enter your email and password.", false);
                return;
            }

            showMessage(
                message,
                "The form is working, but real login requires an authentication backend.",
                false
            );
        });
    }

    // Forgot password demonstration
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();

            const message = document.getElementById("loginMessage");
            showMessage(
                message,
                "Password recovery will be available after authentication is connected.",
                false
            );
        });
    }

    // Registration form demonstration
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const message = document.getElementById("registerMessage");
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                showMessage(message, "Passwords do not match. Please try again.", false);
                return;
            }

            if (!registerForm.checkValidity()) {
                registerForm.reportValidity();
                return;
            }

            showMessage(
                message,
                "Registration form completed. Connect a backend to create a real account.",
                false
            );
        });
    }

    function showMessage(element, text, success) {
        if (!element) return;

        element.textContent = text;
        element.className = "form-message " + (success ? "success" : "error");
    }
});
