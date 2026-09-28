document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    const signupBtn = document.getElementById("signupBtn");
    const signupBtnText = document.getElementById("signupBtnText");
    const signupBtnIcon = document.getElementById("signupBtnIcon");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = document.getElementById("toastIcon");


    // =========================================
    // TOAST
    // =========================================

    function showToast(message, type = "success") {

        toastMessage.textContent = message;

        if (type === "error") {

            toastIcon.className =
                "fa-solid fa-circle-exclamation";

            toastIcon.style.color = "#ef4444";

        } else {

            toastIcon.className =
                "fa-solid fa-circle-check";

            toastIcon.style.color = "#4ade80";
        }

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    // =========================================
    // PASSWORD TOGGLE
    // =========================================

    function setupPasswordToggle(button, input) {

        button.addEventListener("click", () => {

            const hidden = input.type === "password";

            input.type = hidden ? "text" : "password";

            button.innerHTML = hidden
                ? '<i class="fa-regular fa-eye-slash"></i>'
                : '<i class="fa-regular fa-eye"></i>';
        });
    }

    setupPasswordToggle(
        togglePassword,
        password
    );

    setupPasswordToggle(
        toggleConfirmPassword,
        confirmPassword
    );


    // =========================================
    // PHONE - ONLY NUMBERS
    // =========================================

    phone.addEventListener("input", () => {

        phone.value = phone.value
            .replace(/\D/g, "")
            .slice(0, 10);

    });


    // =========================================
    // SIGNUP
    // =========================================

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const nameValue = fullName.value.trim();

        const emailValue =
            email.value.trim().toLowerCase();

        const phoneValue =
            phone.value.trim();

        const passwordValue =
            password.value;

        const confirmValue =
            confirmPassword.value;


        // =====================================
        // NAME
        // =====================================

        if (nameValue.length < 2) {

            showToast(
                "Please enter your full name.",
                "error"
            );

            fullName.focus();

            return;
        }


        // =====================================
        // EMAIL
        // =====================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {

            showToast(
                "Please enter a valid email address.",
                "error"
            );

            email.focus();

            return;
        }


        // =====================================
        // PHONE
        // =====================================

        if (phoneValue.length !== 10) {

            showToast(
                "Please enter a valid 10-digit mobile number.",
                "error"
            );

            phone.focus();

            return;
        }


        // =====================================
        // PASSWORD
        // =====================================

        if (passwordValue.length < 4) {

            showToast(
                "Password must contain at least 4 characters.",
                "error"
            );

            password.focus();

            return;
        }


        // =====================================
        // CONFIRM PASSWORD
        // =====================================

        if (passwordValue !== confirmValue) {

            showToast(
                "Passwords do not match.",
                "error"
            );

            confirmPassword.focus();

            return;
        }


        // =====================================
        // TERMS
        // =====================================

        if (!terms.checked) {

            showToast(
                "Please accept the Terms & Conditions.",
                "error"
            );

            return;
        }


        // =====================================
        // BUTTON LOADING
        // =====================================

        signupBtn.disabled = true;

        signupBtnText.textContent =
            "Creating Account...";

        signupBtnIcon.className =
            "fa-solid fa-spinner fa-spin";


        try {

            // =====================================
            // SEND DATA TO BACKEND
            const response = await fetch(
    "https://khan-store.onrender.com/api/signup",
    {
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
                }
            );


            const data = await response.json();


            // =====================================
            // BACKEND ERROR
            // =====================================

            if (!response.ok) {

                showToast(
                    data.message || "Signup failed.",
                    "error"
                );

                signupBtn.disabled = false;

                signupBtnText.textContent =
                    "Create Account";

                signupBtnIcon.className =
                    "fa-solid fa-arrow-right";

                return;
            }


            // =====================================
            // SUCCESS
            // =====================================

            signupBtnText.textContent =
                "Account Created";

            signupBtnIcon.className =
                "fa-solid fa-check";


            // Save basic account information only
            // Password is NOT saved in localStorage.

            const account = {

                name: data.user.name,

                email: data.user.email,

                phone: data.user.phone,

                createdAt:
                    new Date().toISOString()
            };


            localStorage.setItem(
                "khanAccount",
                JSON.stringify(account)
            );


            showToast(
                "Account created successfully!"
            );


            // =====================================
            // REDIRECT TO LOGIN
            // =====================================

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1200);


        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );


            showToast(
                "Unable to connect to server. Make sure backend is running.",
                "error"
            );


            signupBtn.disabled = false;

            signupBtnText.textContent =
                "Create Account";

            signupBtnIcon.className =
                "fa-solid fa-arrow-right";
        }

    });

});