// ========================================
// KHAN Store - Signup Page
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    if (!signupForm) {
        console.error("Signup form not found.");
        return;
    }

    // ----------------------------------------
    // Form Elements
    // ----------------------------------------
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // ----------------------------------------
    // Error Elements
    // ----------------------------------------
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    // ----------------------------------------
    // Helper Functions
    // ----------------------------------------

    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = "block";
        }
    }

    function clearError(element) {
        if (element) {
            element.textContent = "";
            element.style.display = "none";
        }
    }

    function clearAllErrors() {
        clearError(nameError);
        clearError(emailError);
        clearError(phoneError);
        clearError(passwordError);
        clearError(confirmPasswordError);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[6-9]\d{9}$/.test(phone);
    }

    function showMessage(message, type = "error") {
        let messageBox = document.getElementById("signupMessage");

        if (!messageBox) {
            messageBox = document.createElement("div");
            messageBox.id = "signupMessage";
            messageBox.style.marginTop = "15px";
            messageBox.style.padding = "12px 15px";
            messageBox.style.borderRadius = "8px";
            messageBox.style.fontSize = "14px";

            signupForm.appendChild(messageBox);
        }

        messageBox.textContent = message;

        if (type === "success") {
            messageBox.style.background = "#e8f7ee";
            messageBox.style.color = "#137333";
            messageBox.style.border = "1px solid #b7e1c4";
        } else {
            messageBox.style.background = "#fdecec";
            messageBox.style.color = "#b42318";
            messageBox.style.border = "1px solid #f5b5b0";
        }
    }

    // ----------------------------------------
    // Password Show / Hide
    // ----------------------------------------

    const passwordToggle = document.querySelector(
        '[data-toggle-password="password"]'
    );

    const confirmPasswordToggle = document.querySelector(
        '[data-toggle-password="confirmPassword"]'
    );

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                passwordToggle.classList.add("active");
            } else {
                passwordInput.type = "password";
                passwordToggle.classList.remove("active");
            }
        });
    }

    if (confirmPasswordToggle && confirmPasswordInput) {
        confirmPasswordToggle.addEventListener("click", () => {
            if (confirmPasswordInput.type === "password") {
                confirmPasswordInput.type = "text";
                confirmPasswordToggle.classList.add("active");
            } else {
                confirmPasswordInput.type = "password";
                confirmPasswordToggle.classList.remove("active");
            }
        });
    }

    // ----------------------------------------
    // Signup Submit
    // ----------------------------------------

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearAllErrors();

        const nameValue = nameInput ? nameInput.value.trim() : "";
        const emailValue = emailInput
            ? emailInput.value.trim().toLowerCase()
            : "";
        const phoneValue = phoneInput ? phoneInput.value.trim() : "";
        const passwordValue = passwordInput
            ? passwordInput.value
            : "";
        const confirmPasswordValue = confirmPasswordInput
            ? confirmPasswordInput.value
            : "";

        let isValid = true;

        // ----------------------------------------
        // Name Validation
        // ----------------------------------------

        if (nameValue.length < 2) {
            showError(
                nameError,
                "Please enter your full name."
            );
            isValid = false;
        }

        // ----------------------------------------
        // Email Validation
        // ----------------------------------------

        if (!emailValue) {
            showError(
                emailError,
                "Please enter your email address."
            );
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(
                emailError,
                "Please enter a valid email address."
            );
            isValid = false;
        }

        // ----------------------------------------
        // Phone Validation
        // ----------------------------------------

        if (!phoneValue) {
            showError(
                phoneError,
                "Please enter your mobile number."
            );
            isValid = false;
        } else if (!isValidPhone(phoneValue)) {
            showError(
                phoneError,
                "Please enter a valid 10-digit Indian mobile number."
            );
            isValid = false;
        }

        // ----------------------------------------
        // Password Validation
        // ----------------------------------------

        if (!passwordValue) {
            showError(
                passwordError,
                "Please enter a password."
            );
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(
                passwordError,
                "Password must be at least 6 characters."
            );
            isValid = false;
        }

        // ----------------------------------------
        // Confirm Password Validation
        // ----------------------------------------

        if (!confirmPasswordValue) {
            showError(
                confirmPasswordError,
                "Please confirm your password."
            );
            isValid = false;
        } else if (passwordValue !== confirmPasswordValue) {
            showError(
                confirmPasswordError,
                "Passwords do not match."
            );
            isValid = false;
        }

        if (!isValid) {
            showMessage(
                "Please fix the errors above and try again.",
                "error"
            );
            return;
        }

        // ----------------------------------------
        // Disable Button While Processing
        // ----------------------------------------

        const submitButton =
            signupForm.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }

        // ----------------------------------------
        // BACKEND API
        // IMPORTANT:
        // Keep this URL exactly like this.
        // ----------------------------------------

        const API_URL =
            "https://khan-store.onrender.com/api/signup";

        try {
            console.log("Sending signup request to:", API_URL);

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: nameValue,
                    email: emailValue,
                    phone: phoneValue,
                    password: passwordValue
                })
            });

            let data = {};

            try {
                data = await response.json();
            } catch (jsonError) {
                console.warn(
                    "Server did not return JSON.",
                    jsonError
                );
            }

            console.log("Signup response:", data);

            // ----------------------------------------
            // Server Error
            // ----------------------------------------

            if (!response.ok) {
                const errorMessage =
                    data.message ||
                    data.error ||
                    "Signup failed. Please try again.";

                showMessage(errorMessage, "error");

                return;
            }

            // ----------------------------------------
            // Signup Successful
            // ----------------------------------------

            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );

            // Save basic account information locally.
            // Password is NOT stored here.
            const accountData = {
                name: nameValue,
                email: emailValue,
                phone: phoneValue
            };

            localStorage.setItem(
                "khanAccount",
                JSON.stringify(accountData)
            );

            // ----------------------------------------
            // Redirect to Login
            // ----------------------------------------

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            console.error("Signup Error:", error);

            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    originalButtonText || "Create Account";
            }
        }
    });
});