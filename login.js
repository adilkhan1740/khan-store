/* =====================================================
   KHAN STORE - REAL LOGIN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");

    const loginBtn = document.getElementById("loginBtn");
    const loginBtnText = document.getElementById("loginBtnText");
    const loginBtnIcon = document.getElementById("loginBtnIcon");

    const rememberMe = document.getElementById("rememberMe");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = document.getElementById("toastIcon");


    /* =====================================================
       CHECK ELEMENTS
    ===================================================== */

    if (!loginForm) {
        console.error("Login form not found.");
        return;
    }


    /* =====================================================
       LOAD SAVED EMAIL
    ===================================================== */

    const savedEmail = localStorage.getItem("khanRememberEmail");

    if (savedEmail && emailInput && rememberMe) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.innerHTML =
                    '<i class="fa-regular fa-eye-slash"></i>';

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        });

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, type = "success") {

        if (!toast || !toastMessage || !toastIcon) {
            alert(message);
            return;
        }

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


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* =================================================
           GET VALUES
        ================================================= */

        const email =
            emailInput.value.trim().toLowerCase();

        const password =
            passwordInput.value;


        /* =================================================
           VALIDATION
        ================================================= */

        if (!email) {

            showToast(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        if (!email.includes("@")) {

            showToast(
                "Please enter a valid email.",
                "error"
            );

            emailInput.focus();

            return;
        }


        if (!password) {

            showToast(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        if (password.length < 4) {

            showToast(
                "Password must contain at least 4 characters.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        /* =================================================
           REMEMBER EMAIL
        ================================================= */

        if (rememberMe && rememberMe.checked) {

            localStorage.setItem(
                "khanRememberEmail",
                email
            );

        } else {

            localStorage.removeItem(
                "khanRememberEmail"
            );

        }


        /* =================================================
           BUTTON LOADING
        ================================================= */

        loginBtn.disabled = true;

        loginBtn.classList.add("loading");

        loginBtnText.textContent =
            "Logging in...";

        loginBtnIcon.className =
            "fa-solid fa-spinner fa-spin";


        /* =================================================
           BACKEND LOGIN
        ================================================= */

        try {

            const response = await fetch(
                "http://https://khan-store.onrender.com/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            /* =================================================
               READ RESPONSE AS TEXT FIRST
            ================================================= */

            const responseText =
                await response.text();

            console.log(
                "Login API Status:",
                response.status
            );

            console.log(
                "Login API Response:",
                responseText
            );


            /* =================================================
               PARSE JSON SAFELY
            ================================================= */

            let data = null;

            try {

                data = JSON.parse(responseText);

            } catch (parseError) {

                console.error(
                    "JSON Parse Error:",
                    parseError
                );

                throw new Error(
                    "Server returned an invalid response. Check backend server.js."
                );
            }


            /* =================================================
               LOGIN FAILED
            ================================================= */

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Invalid email or password."
                );
            }


            /* =================================================
               USER DATA
            ================================================= */

            if (!data.user) {

                throw new Error(
                    "Login successful, but user data was not returned."
                );
            }


            const user = {

                id: data.user.id,

                name: data.user.name,

                email: data.user.email,

                phone: data.user.phone,

                loginTime:
                    new Date().toISOString()
            };


            /* =================================================
               SAVE LOGIN
            ================================================= */

            localStorage.setItem(
                "khanLoggedIn",
                "true"
            );

            localStorage.setItem(
                "khanUser",
                JSON.stringify(user)
            );


            /* =================================================
               SUCCESS BUTTON
            ================================================= */

            loginBtnText.textContent =
                "Login Successful";

            loginBtnIcon.className =
                "fa-solid fa-check";


            showToast(
                "Login successful! Welcome to KHAN Store.",
                "success"
            );


            /* =================================================
               REDIRECT
            ================================================= */

            setTimeout(() => {

                const redirect =
                    sessionStorage.getItem(
                        "khanRedirectAfterLogin"
                    );

                sessionStorage.removeItem(
                    "khanRedirectAfterLogin"
                );

                window.location.href =
                    redirect || "index.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            /* =================================================
               RESET BUTTON
            ================================================= */

            loginBtn.disabled = false;

            loginBtn.classList.remove("loading");

            loginBtnText.textContent =
                "Login";

            loginBtnIcon.className =
                "fa-solid fa-arrow-right";


            /* =================================================
               ERROR MESSAGE
            ================================================= */

            if (
                error instanceof TypeError ||
                error.message === "Failed to fetch"
            ) {

                showToast(
                    "Unable to connect to server. Make sure backend is running.",
                    "error"
                );

            } else {

                showToast(
                    error.message ||
                    "Unable to login.",
                    "error"
                );

            }

        }

    });


    /* =====================================================
       GOOGLE LOGIN
    ===================================================== */

    const googleBtn =
        document.querySelector(".social-btn");

    if (googleBtn) {

        googleBtn.addEventListener("click", () => {

            showToast(
                "Google login needs OAuth setup.",
                "error"
            );

        });

    }

});