document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("forgotForm");

    const email =
        document.getElementById("email");

    const resetBtn =
        document.getElementById("resetBtn");

    const resetBtnText =
        document.getElementById("resetBtnText");

    const resetBtnIcon =
        document.getElementById("resetBtnIcon");

    const successBox =
        document.getElementById("successBox");

    const successMessage =
        document.getElementById("successMessage");

    const backLoginBtn =
        document.getElementById("backLoginBtn");

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");


    /* =========================================
       TOAST
    ========================================= */

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


    /* =========================================
       FORM
    ========================================= */

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const emailValue =
            email.value.trim().toLowerCase();


        /* VALIDATE EMAIL */

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


        /* LOADING */

        resetBtn.disabled = true;

        resetBtnText.textContent =
            "Sending...";

        resetBtnIcon.className =
            "fa-solid fa-spinner fa-spin";


        /*
           FRONTEND DEMO

           No real email is sent here.
           Real password reset requires a secure
           backend/email verification system.
        */

        setTimeout(() => {

            resetBtnText.textContent =
                "Reset Link Sent";

            resetBtnIcon.className =
                "fa-solid fa-check";


            successMessage.textContent =
                `If an account exists with ${emailValue}, ` +
                `you'll receive password reset instructions.`;


            form.style.display = "none";

            successBox.classList.add("show");


            showToast(
                "Reset instructions generated."
            );

        }, 1000);

    });


    /* =========================================
       BACK TO LOGIN
    ========================================= */

    backLoginBtn.addEventListener("click", () => {

        window.location.href =
            "login.html";

    });

});