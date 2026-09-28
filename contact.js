document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================
       ELEMENTS
    ========================== */

    const cartCount = document.getElementById("cartCount");
    const mobileCartCount = document.getElementById("mobileCartCount");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNav = document.getElementById("mobileNav");

    const currentYear = document.getElementById("currentYear");

    const contactForm = document.getElementById("contactForm");

    const contactName = document.getElementById("contactName");
    const contactEmail = document.getElementById("contactEmail");
    const contactPhone = document.getElementById("contactPhone");
    const contactSubject = document.getElementById("contactSubject");
    const contactMessage = document.getElementById("contactMessage");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    const messageCount = document.getElementById("messageCount");

    const contactSubmitBtn =
        document.getElementById("contactSubmitBtn");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const toastClose = document.getElementById("toastClose");


    /* =========================
       CURRENT YEAR
    ========================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================
       CART COUNT
    ========================== */

    function updateCartCount() {
        try {
            const cart = JSON.parse(
                localStorage.getItem("khanCart") || "[]"
            );

            const count = cart.reduce((total, item) => {
                return total + Number(item.quantity || 1);
            }, 0);

            if (cartCount) {
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? "flex" : "none";
            }

            if (mobileCartCount) {
                mobileCartCount.textContent = count;
                mobileCartCount.style.display =
                    count > 0 ? "flex" : "none";
            }

        } catch (error) {
            console.error("Cart count error:", error);

            if (cartCount) {
                cartCount.textContent = "0";
            }

            if (mobileCartCount) {
                mobileCartCount.textContent = "0";
            }
        }
    }

    updateCartCount();


    /* =========================
       MOBILE MENU
    ========================== */

    function openMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) return;

        mobileNav.classList.add("active");
        mobileMenuBtn.classList.add("active");

        mobileMenuBtn.setAttribute("aria-expanded", "true");

        const icon = mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        }
    }

    function closeMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) return;

        mobileNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");

        mobileMenuBtn.setAttribute("aria-expanded", "false");

        const icon = mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }

    function toggleMobileMenu() {
        if (!mobileNav) return;

        if (mobileNav.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener(
            "click",
            toggleMobileMenu
        );
    }

    if (mobileNav) {
        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });
    }


    /* =========================
       ESCAPE KEY
    ========================== */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMobileMenu();
            hideToast();
        }
    });


    /* =========================
       TOAST
    ========================== */

    let toastTimer;

    function showToast(message, type = "success") {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        toast.classList.remove(
            "success",
            "error",
            "warning",
            "show"
        );

        toast.classList.add(type);

        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            hideToast();
        }, 3500);
    }

    function hideToast() {
        if (!toast) return;

        toast.classList.remove("show");
    }

    if (toastClose) {
        toastClose.addEventListener(
            "click",
            hideToast
        );
    }


    /* =========================
       ERROR HELPERS
    ========================== */

    function setError(input, errorElement, message) {
        if (!input || !errorElement) return;

        input.classList.add("error");

        errorElement.textContent = message;
        errorElement.classList.add("show");
    }

    function clearError(input, errorElement) {
        if (!input || !errorElement) return;

        input.classList.remove("error");

        errorElement.textContent = "";
        errorElement.classList.remove("show");
    }

    function clearAllErrors() {
        clearError(contactName, nameError);
        clearError(contactEmail, emailError);
        clearError(contactPhone, phoneError);
        clearError(contactSubject, subjectError);
        clearError(contactMessage, messageError);
    }


    /* =========================
       VALIDATION
    ========================== */

    function validateName() {
        const value = contactName.value.trim();

        if (!value) {
            setError(
                contactName,
                nameError,
                "Please enter your name."
            );
            return false;
        }

        if (value.length < 2) {
            setError(
                contactName,
                nameError,
                "Name must contain at least 2 characters."
            );
            return false;
        }

        clearError(contactName, nameError);
        return true;
    }


    function validateEmail() {
        const value = contactEmail.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            setError(
                contactEmail,
                emailError,
                "Please enter your email address."
            );
            return false;
        }

        if (!emailPattern.test(value)) {
            setError(
                contactEmail,
                emailError,
                "Please enter a valid email address."
            );
            return false;
        }

        clearError(contactEmail, emailError);
        return true;
    }


    function validatePhone() {
        const value = contactPhone.value.trim();

        if (!value) {
            setError(
                contactPhone,
                phoneError,
                "Please enter your phone number."
            );
            return false;
        }

        const digits = value.replace(/\D/g, "");

        if (digits.length !== 10) {
            setError(
                contactPhone,
                phoneError,
                "Please enter a valid 10-digit phone number."
            );
            return false;
        }

        clearError(contactPhone, phoneError);
        return true;
    }


    function validateSubject() {
        const value = contactSubject.value.trim();

        if (!value) {
            setError(
                contactSubject,
                subjectError,
                "Please enter a subject."
            );
            return false;
        }

        if (value.length < 3) {
            setError(
                contactSubject,
                subjectError,
                "Subject must contain at least 3 characters."
            );
            return false;
        }

        clearError(contactSubject, subjectError);
        return true;
    }


    function validateMessage() {
        const value = contactMessage.value.trim();

        if (!value) {
            setError(
                contactMessage,
                messageError,
                "Please enter your message."
            );
            return false;
        }

        if (value.length < 10) {
            setError(
                contactMessage,
                messageError,
                "Message must contain at least 10 characters."
            );
            return false;
        }

        if (value.length > 1000) {
            setError(
                contactMessage,
                messageError,
                "Message cannot exceed 1000 characters."
            );
            return false;
        }

        clearError(contactMessage, messageError);
        return true;
    }


    function validateForm() {
        const nameValid = validateName();
        const emailValid = validateEmail();
        const phoneValid = validatePhone();
        const subjectValid = validateSubject();
        const messageValid = validateMessage();

        return (
            nameValid &&
            emailValid &&
            phoneValid &&
            subjectValid &&
            messageValid
        );
    }


    /* =========================
       MESSAGE COUNTER
    ========================== */

    function updateMessageCount() {
        if (!contactMessage || !messageCount) return;

        const length = contactMessage.value.length;

        messageCount.textContent = `${length}/1000`;

        if (length >= 900) {
            messageCount.classList.add("warning");
        } else {
            messageCount.classList.remove("warning");
        }

        if (length > 1000) {
            messageCount.classList.add("danger");
        } else {
            messageCount.classList.remove("danger");
        }
    }

    if (contactMessage) {
        contactMessage.addEventListener(
            "input",
            updateMessageCount
        );

        updateMessageCount();
    }


    /* =========================
       LIVE VALIDATION
    ========================== */

    if (contactName) {
        contactName.addEventListener(
            "blur",
            validateName
        );

        contactName.addEventListener(
            "input",
            () => clearError(contactName, nameError)
        );
    }

    if (contactEmail) {
        contactEmail.addEventListener(
            "blur",
            validateEmail
        );

        contactEmail.addEventListener(
            "input",
            () => clearError(contactEmail, emailError)
        );
    }

    if (contactPhone) {
        contactPhone.addEventListener(
            "blur",
            validatePhone
        );

        contactPhone.addEventListener(
            "input",
            () => {
                clearError(contactPhone, phoneError);

                contactPhone.value =
                    contactPhone.value.replace(/[^\d+\-\s()]/g, "");
            }
        );
    }

    if (contactSubject) {
        contactSubject.addEventListener(
            "blur",
            validateSubject
        );

        contactSubject.addEventListener(
            "input",
            () => clearError(contactSubject, subjectError)
        );
    }

    if (contactMessage) {
        contactMessage.addEventListener(
            "blur",
            validateMessage
        );

        contactMessage.addEventListener(
            "input",
            () => clearError(contactMessage, messageError)
        );
    }


    /* =========================
       SAVE CONTACT MESSAGE
    ========================== */

    function saveContactMessage(data) {
        try {
            const existingMessages = JSON.parse(
                localStorage.getItem(
                    "khanContactMessages"
                ) || "[]"
            );

            const messageId =
                "MSG-" +
                Date.now().toString(36).toUpperCase();

            const newMessage = {
                id: messageId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                status: "New",
                createdAt: new Date().toISOString()
            };

            existingMessages.unshift(newMessage);

            localStorage.setItem(
                "khanContactMessages",
                JSON.stringify(existingMessages)
            );

            return newMessage;

        } catch (error) {
            console.error(
                "Contact message save error:",
                error
            );

            return null;
        }
    }


    /* =========================
       FORM SUBMIT
    ========================== */

    if (contactForm) {
        contactForm.addEventListener(
            "submit",
            event => {
                event.preventDefault();

                clearAllErrors();

                if (!validateForm()) {
                    showToast(
                        "Please correct the highlighted fields.",
                        "error"
                    );
                    return;
                }

                const originalButtonHTML =
                    contactSubmitBtn
                        ? contactSubmitBtn.innerHTML
                        : "";

                if (contactSubmitBtn) {
                    contactSubmitBtn.disabled = true;

                    contactSubmitBtn.innerHTML = `
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Submitting...</span>
                    `;
                }

                const formData = {
                    name: contactName.value.trim(),
                    email: contactEmail.value.trim(),
                    phone: contactPhone.value.trim(),
                    subject: contactSubject.value.trim(),
                    message: contactMessage.value.trim()
                };

                const savedMessage =
                    saveContactMessage(formData);

                setTimeout(() => {

                    if (!savedMessage) {

                        if (contactSubmitBtn) {
                            contactSubmitBtn.disabled = false;
                            contactSubmitBtn.innerHTML =
                                originalButtonHTML;
                        }

                        showToast(
                            "Something went wrong. Please try again.",
                            "error"
                        );

                        return;
                    }

                    if (contactSubmitBtn) {
                        contactSubmitBtn.innerHTML = `
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Submitted Successfully</span>
                        `;
                    }

                    showToast(
                        "Thanks! Your message has been submitted successfully.",
                        "success"
                    );

                    contactForm.reset();

                    updateMessageCount();

                    clearAllErrors();

                    setTimeout(() => {
                        if (contactSubmitBtn) {
                            contactSubmitBtn.disabled = false;
                            contactSubmitBtn.innerHTML =
                                originalButtonHTML;
                        }
                    }, 1800);

                }, 600);
            }
        );
    }


    /* =========================
       CART STORAGE UPDATE
    ========================== */

    window.addEventListener(
        "storage",
        event => {
            if (event.key === "khanCart") {
                updateCartCount();
            }
        }
    );


    /* =========================
       WINDOW RESIZE
    ========================== */

    window.addEventListener(
        "resize",
        () => {
            if (
                window.innerWidth > 900 &&
                mobileNav &&
                mobileNav.classList.contains("active")
            ) {
                closeMobileMenu();
            }
        }
    );


    /* =========================
       INITIAL ACCESSIBILITY
    ========================== */

    if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }


    /* =========================
       READY
    ========================== */

    console.log(
        "KHAN Store Contact Page loaded successfully."
    );
});