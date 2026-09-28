/* =========================================
   KHAN STORE - ADMIN LOGIN JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("adminLoginForm");

    const emailInput = document.getElementById("adminEmail");

    const passwordInput = document.getElementById("adminPassword");

    const togglePassword =
        document.getElementById("togglePassword");

    const loginButton =
        document.getElementById("loginButton");

    const loginError =
        document.getElementById("loginError");

    const errorText =
        document.getElementById("errorText");

    const loginSuccess =
        document.getElementById("loginSuccess");

    const rememberAdmin =
        document.getElementById("rememberAdmin");

    const forgotAdmin =
        document.getElementById("forgotAdmin");


    /* =========================================
       DEMO ADMIN CREDENTIALS
    ========================================= */

    const ADMIN_EMAIL = "admin@khanstore.com";

    const ADMIN_PASSWORD = "KHAN@1234";


    /* =========================================
       CHECK ALREADY LOGGED IN
    ========================================= */

    const alreadyLoggedIn =
        localStorage.getItem("khanAdminLoggedIn");

    if (alreadyLoggedIn === "true") {

        window.location.href = "admin-dashboard.html";

        return;
    }


    /* =========================================
       LOAD REMEMBERED EMAIL
    ========================================= */

    const savedEmail =
        localStorage.getItem("khanAdminRememberEmail");

    if (savedEmail) {

        emailInput.value = savedEmail;

        rememberAdmin.checked = true;
    }


    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================= */

    togglePassword.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";


        togglePassword.innerHTML =
            isPassword
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';


        togglePassword.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );
    });


    /* =========================================
       HIDE ERROR
    ========================================= */

    function hideMessages() {

        loginError.style.display = "none";

        loginSuccess.style.display = "none";
    }


    /* =========================================
       SHOW ERROR
    ========================================= */

    function showError(message) {

        loginSuccess.style.display = "none";

        errorText.textContent = message;

        loginError.style.display = "flex";
    }


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    forgotAdmin.addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Demo admin password reset is not connected yet.\n\n" +
            "For this demo use:\n" +
            "Email: admin@khanstore.com\n" +
            "Password: KHAN@1234"
        );
    });


    /* =========================================
       LOGIN
    ========================================= */

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        hideMessages();


        const email =
            emailInput.value.trim().toLowerCase();

        const password =
            passwordInput.value;


        /* VALIDATION */

        if (!email) {

            showError("Please enter admin email.");

            emailInput.focus();

            return;
        }


        if (!email.includes("@")) {

            showError("Please enter a valid email address.");

            emailInput.focus();

            return;
        }


        if (!password) {

            showError("Please enter your password.");

            passwordInput.focus();

            return;
        }


        /* LOADING */

        loginButton.disabled = true;

        loginButton.querySelector(".button-text")
            .style.display = "none";

        loginButton.querySelector(".button-loading")
            .style.display = "inline-flex";


        /* DEMO LOGIN CHECK */

        setTimeout(() => {

            if (
                email !== ADMIN_EMAIL ||
                password !== ADMIN_PASSWORD
            ) {

                loginButton.disabled = false;

                loginButton.querySelector(".button-text")
                    .style.display = "inline-flex";

                loginButton.querySelector(".button-loading")
                    .style.display = "none";


                showError(
                    "Invalid admin email or password."
                );

                passwordInput.value = "";

                passwordInput.focus();

                return;
            }


            /* REMEMBER EMAIL */

            if (rememberAdmin.checked) {

                localStorage.setItem(
                    "khanAdminRememberEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "khanAdminRememberEmail"
                );
            }


            /* ADMIN LOGIN STATE */

            localStorage.setItem(
                "khanAdminLoggedIn",
                "true"
            );


            localStorage.setItem(
                "khanAdmin",
                JSON.stringify({
                    email: email,
                    name: "KHAN Store Admin",
                    loginTime: new Date().toISOString()
                })
            );


            /* SUCCESS */

            loginError.style.display = "none";

            loginSuccess.style.display = "flex";


            /* REDIRECT */

            setTimeout(() => {

                window.location.href =
                    "admin-dashboard.html";

            }, 1000);


        }, 800);

    });

});