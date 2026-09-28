/* =========================================================
   KHAN STORE — SELL WITH US
   Seller Application JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================
       ELEMENTS
       ========================= */

    const sellerForm = document.getElementById("sellerForm");

    const sellerName = document.getElementById("sellerName");
    const businessName = document.getElementById("businessName");
    const sellerEmail = document.getElementById("sellerEmail");
    const sellerPhone = document.getElementById("sellerPhone");
    const sellerCategory = document.getElementById("sellerCategory");
    const productCount = document.getElementById("productCount");
    const sellerCity = document.getElementById("sellerCity");
    const sellerPincode = document.getElementById("sellerPincode");
    const sellerWebsite = document.getElementById("sellerWebsite");
    const sellerMessage = document.getElementById("sellerMessage");
    const sellerConsent = document.getElementById("sellerConsent");

    const sellerSubmitBtn =
        document.getElementById("sellerSubmitBtn");

    const sellerMessageCount =
        document.getElementById("sellerMessageCount");

    const currentYear =
        document.getElementById("currentYear");

    const cartCount =
        document.getElementById("cartCount");

    const mobileCartCount =
        document.getElementById("mobileCartCount");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    const sellToast =
        document.getElementById("sellToast");

    const sellToastTitle =
        document.getElementById("sellToastTitle");

    const sellToastMessage =
        document.getElementById("sellToastMessage");

    const sellToastClose =
        document.getElementById("sellToastClose");


    /* =========================
       CURRENT YEAR
       ========================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================
       CART COUNT
       ========================= */

    function updateCartCount() {
        let totalItems = 0;

        try {
            const cart =
                JSON.parse(localStorage.getItem("khanCart")) || [];

            if (Array.isArray(cart)) {
                totalItems = cart.reduce((total, item) => {
                    const quantity =
                        Number(item.quantity) || 1;

                    return total + quantity;
                }, 0);
            }

        } catch (error) {
            console.warn(
                "Unable to read khanCart:",
                error
            );

            totalItems = 0;
        }

        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        if (mobileCartCount) {
            mobileCartCount.textContent = totalItems;
        }
    }

    updateCartCount();


    /* =========================
       MOBILE MENU
       ========================= */

    function openMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) {
            return;
        }

        mobileNav.classList.add("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            "Close navigation"
        );

        const icon =
            mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        }
    }


    function closeMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) {
            return;
        }

        mobileNav.classList.remove("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            "Open navigation"
        );

        const icon =
            mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }


    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener(
            "click",
            () => {
                if (
                    mobileNav &&
                    mobileNav.classList.contains("active")
                ) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            }
        );
    }


    if (mobileNav) {
        mobileNav
            .querySelectorAll("a")
            .forEach((link) => {
                link.addEventListener(
                    "click",
                    () => {
                        closeMobileMenu();
                    }
                );
            });
    }


    /* =========================
       ESCAPE KEY
       ========================= */

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
                hideToast();
            }
        }
    );


    /* =========================
       TOAST
       ========================= */

    let toastTimer = null;


    function showToast(
        title,
        message,
        type = "success"
    ) {
        if (!sellToast) {
            return;
        }

        if (sellToastTitle) {
            sellToastTitle.textContent = title;
        }

        if (sellToastMessage) {
            sellToastMessage.textContent = message;
        }

        const icon =
            sellToast.querySelector(
                ".sell-toast-icon i"
            );

        if (icon) {
            icon.className =
                type === "error"
                    ? "fa-solid fa-circle-exclamation"
                    : "fa-solid fa-check";
        }

        sellToast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            hideToast();
        }, 4500);
    }


    function hideToast() {
        if (!sellToast) {
            return;
        }

        sellToast.classList.remove("show");

        clearTimeout(toastTimer);
    }


    if (sellToastClose) {
        sellToastClose.addEventListener(
            "click",
            hideToast
        );
    }


    /* =========================
       ERROR HELPERS
       ========================= */

    function setFieldError(
        input,
        errorId,
        message
    ) {
        if (!input) {
            return false;
        }

        const group =
            input.closest(".form-group");

        const error =
            document.getElementById(errorId);

        if (message) {
            if (group) {
                group.classList.add("has-error");
                group.classList.remove("is-valid");
            }

            if (error) {
                error.textContent = message;
            }

            return false;
        }

        if (group) {
            group.classList.remove("has-error");
            group.classList.add("is-valid");
        }

        if (error) {
            error.textContent = "";
        }

        return true;
    }


    function clearFieldState(
        input,
        errorId
    ) {
        if (!input) {
            return;
        }

        const group =
            input.closest(".form-group");

        const error =
            document.getElementById(errorId);

        if (group) {
            group.classList.remove(
                "has-error",
                "is-valid"
            );
        }

        if (error) {
            error.textContent = "";
        }
    }


    /* =========================
       VALIDATION FUNCTIONS
       ========================= */

    function validateName() {
        const value =
            sellerName?.value.trim() || "";

        if (!value) {
            return setFieldError(
                sellerName,
                "sellerNameError",
                "Please enter your full name."
            );
        }

        if (value.length < 2) {
            return setFieldError(
                sellerName,
                "sellerNameError",
                "Name must contain at least 2 characters."
            );
        }

        return setFieldError(
            sellerName,
            "sellerNameError",
            ""
        );
    }


    function validateBusinessName() {
        const value =
            businessName?.value.trim() || "";

        if (!value) {
            return setFieldError(
                businessName,
                "businessNameError",
                "Please enter your business or store name."
            );
        }

        if (value.length < 2) {
            return setFieldError(
                businessName,
                "businessNameError",
                "Business name is too short."
            );
        }

        return setFieldError(
            businessName,
            "businessNameError",
            ""
        );
    }


    function validateEmail() {
        const value =
            sellerEmail?.value.trim() || "";

        if (!value) {
            return setFieldError(
                sellerEmail,
                "sellerEmailError",
                "Please enter your email address."
            );
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            return setFieldError(
                sellerEmail,
                "sellerEmailError",
                "Please enter a valid email address."
            );
        }

        return setFieldError(
            sellerEmail,
            "sellerEmailError",
            ""
        );
    }


    function validatePhone() {
        const value =
            sellerPhone?.value.trim() || "";

        if (!value) {
            return setFieldError(
                sellerPhone,
                "sellerPhoneError",
                "Please enter your phone number."
            );
        }

        if (!/^[6-9]\d{9}$/.test(value)) {
            return setFieldError(
                sellerPhone,
                "sellerPhoneError",
                "Enter a valid 10-digit mobile number."
            );
        }

        return setFieldError(
            sellerPhone,
            "sellerPhoneError",
            ""
        );
    }


    function validateCategory() {
        const value =
            sellerCategory?.value || "";

        if (!value) {
            return setFieldError(
                sellerCategory,
                "sellerCategoryError",
                "Please select a product category."
            );
        }

        return setFieldError(
            sellerCategory,
            "sellerCategoryError",
            ""
        );
    }


    function validateProductCount() {
        const value =
            productCount?.value || "";

        if (!value) {
            return setFieldError(
                productCount,
                "productCountError",
                "Please select your approximate product quantity."
            );
        }

        return setFieldError(
            productCount,
            "productCountError",
            ""
        );
    }


    function validateCity() {
        const value =
            sellerCity?.value.trim() || "";

        if (!value) {
            return setFieldError(
                sellerCity,
                "sellerCityError",
                "Please enter your city."
            );
        }

        if (value.length < 2) {
            return setFieldError(
                sellerCity,
                "sellerCityError",
                "Please enter a valid city."
            );
        }

        return setFieldError(
            sellerCity,
            "sellerCityError",
            ""
        );
    }


    function validatePincode() {
        const value =
            sellerPincode?.value.trim() || "";

        if (!value) {
            return setFieldError(
                sellerPincode,
                "sellerPincodeError",
                "Please enter your pincode."
            );
        }

        if (!/^\d{6}$/.test(value)) {
            return setFieldError(
                sellerPincode,
                "sellerPincodeError",
                "Pincode must contain 6 digits."
            );
        }

        return setFieldError(
            sellerPincode,
            "sellerPincodeError",
            ""
        );
    }


    function validateWebsite() {
        const value =
            sellerWebsite?.value.trim() || "";

        if (!value) {
            clearFieldState(
                sellerWebsite,
                "sellerWebsiteError"
            );

            return true;
        }

        try {
            const url =
                new URL(value);

            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                throw new Error("Invalid protocol");
            }

        } catch (error) {
            return setFieldError(
                sellerWebsite,
                "sellerWebsiteError",
                "Please enter a valid website URL."
            );
        }

        return setFieldError(
            sellerWebsite,
            "sellerWebsiteError",
            ""
        );
    }


    function validateMessage() {
        const value =
            sellerMessage?.value.trim() || "";

        if (!value) {
            return setFieldError(
                sellerMessage,
                "sellerMessageError",
                "Please tell us about your business."
            );
        }

        if (value.length < 15) {
            return setFieldError(
                sellerMessage,
                "sellerMessageError",
                "Please enter at least 15 characters."
            );
        }

        return setFieldError(
            sellerMessage,
            "sellerMessageError",
            ""
        );
    }


    function validateConsent() {
        const error =
            document.getElementById(
                "sellerConsentError"
            );

        if (
            sellerConsent &&
            sellerConsent.checked
        ) {
            if (error) {
                error.textContent = "";
            }

            return true;
        }

        if (error) {
            error.textContent =
                "Please confirm that the information is accurate.";
        }

        return false;
    }


    /* =========================
       MESSAGE COUNTER
       ========================= */

    function updateMessageCount() {
        if (!sellerMessage || !sellerMessageCount) {
            return;
        }

        const length =
            sellerMessage.value.length;

        sellerMessageCount.textContent =
            `${length} / 800`;
    }

    updateMessageCount();


    if (sellerMessage) {
        sellerMessage.addEventListener(
            "input",
            () => {
                updateMessageCount();

                if (
                    sellerMessage.value.trim()
                ) {
                    validateMessage();
                }
            }
        );
    }


    /* =========================
       INPUT FILTERS
       ========================= */

    if (sellerPhone) {
        sellerPhone.addEventListener(
            "input",
            () => {
                sellerPhone.value =
                    sellerPhone.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
            }
        );
    }


    if (sellerPincode) {
        sellerPincode.addEventListener(
            "input",
            () => {
                sellerPincode.value =
                    sellerPincode.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
            }
        );
    }


    /* =========================
       LIVE VALIDATION
       ========================= */

    if (sellerName) {
        sellerName.addEventListener(
            "blur",
            validateName
        );
    }

    if (businessName) {
        businessName.addEventListener(
            "blur",
            validateBusinessName
        );
    }

    if (sellerEmail) {
        sellerEmail.addEventListener(
            "blur",
            validateEmail
        );
    }

    if (sellerPhone) {
        sellerPhone.addEventListener(
            "blur",
            validatePhone
        );
    }

    if (sellerCategory) {
        sellerCategory.addEventListener(
            "change",
            validateCategory
        );
    }

    if (productCount) {
        productCount.addEventListener(
            "change",
            validateProductCount
        );
    }

    if (sellerCity) {
        sellerCity.addEventListener(
            "blur",
            validateCity
        );
    }

    if (sellerPincode) {
        sellerPincode.addEventListener(
            "blur",
            validatePincode
        );
    }

    if (sellerWebsite) {
        sellerWebsite.addEventListener(
            "blur",
            validateWebsite
        );
    }

    if (sellerConsent) {
        sellerConsent.addEventListener(
            "change",
            validateConsent
        );
    }


    /* =========================
       GET APPLICATIONS
       ========================= */

    function getSellerApplications() {
        try {
            const applications =
                JSON.parse(
                    localStorage.getItem(
                        "khanSellerApplications"
                    )
                );

            return Array.isArray(applications)
                ? applications
                : [];

        } catch (error) {
            console.warn(
                "Unable to read seller applications:",
                error
            );

            return [];
        }
    }


    /* =========================
       SAVE APPLICATION
       ========================= */

    function saveSellerApplication() {
        const applications =
            getSellerApplications();

        const now =
            new Date();

        const application = {
            id:
                "SELLER-" +
                now.getTime(),

            fullName:
                sellerName.value.trim(),

            businessName:
                businessName.value.trim(),

            email:
                sellerEmail.value.trim().toLowerCase(),

            phone:
                sellerPhone.value.trim(),

            category:
                sellerCategory.value,

            productCount:
                productCount.value,

            city:
                sellerCity.value.trim(),

            pincode:
                sellerPincode.value.trim(),

            website:
                sellerWebsite.value.trim(),

            message:
                sellerMessage.value.trim(),

            status:
                "Submitted",

            createdAt:
                now.toISOString(),

            updatedAt:
                now.toISOString()
        };

        applications.unshift(application);

        localStorage.setItem(
            "khanSellerApplications",
            JSON.stringify(applications)
        );

        return application;
    }


    /* =========================
       FORM VALIDATION
       ========================= */

    function validateForm() {
        const results = [
            validateName(),
            validateBusinessName(),
            validateEmail(),
            validatePhone(),
            validateCategory(),
            validateProductCount(),
            validateCity(),
            validatePincode(),
            validateWebsite(),
            validateMessage(),
            validateConsent()
        ];

        return results.every(
            (result) => result === true
        );
    }


    /* =========================
       BUTTON LOADING
       ========================= */

    function setLoading(isLoading) {
        if (!sellerSubmitBtn) {
            return;
        }

        sellerSubmitBtn.disabled =
            isLoading;

        sellerSubmitBtn.classList.toggle(
            "loading",
            isLoading
        );
    }


    /* =========================
       SUBMIT FORM
       ========================= */

    if (sellerForm) {
        sellerForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const isValid =
                    validateForm();

                if (!isValid) {
                    showToast(
                        "Check Your Details",
                        "Please correct the highlighted fields.",
                        "error"
                    );

                    const firstError =
                        sellerForm.querySelector(
                            ".has-error input, " +
                            ".has-error select, " +
                            ".has-error textarea"
                        );

                    if (firstError) {
                        firstError.focus();
                    }

                    return;
                }

                setLoading(true);

                /*
                 * Small delay gives the submit button
                 * a realistic loading state.
                 */
                await new Promise(
                    (resolve) =>
                        setTimeout(resolve, 700)
                );

                try {
                    const application =
                        saveSellerApplication();

                    console.log(
                        "Seller application saved:",
                        application
                    );

                    sellerForm.reset();

                    updateMessageCount();

                    document
                        .querySelectorAll(
                            ".form-group"
                        )
                        .forEach((group) => {
                            group.classList.remove(
                                "has-error",
                                "is-valid"
                            );
                        });

                    document
                        .querySelectorAll(
                            ".form-error"
                        )
                        .forEach((error) => {
                            error.textContent = "";
                        });

                    showToast(
                        "Application Submitted",
                        "Your seller application has been saved successfully."
                    );

                    sellerForm.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                } catch (error) {
                    console.error(
                        "Seller application error:",
                        error
                    );

                    showToast(
                        "Something Went Wrong",
                        "Your application could not be saved. Please try again.",
                        "error"
                    );

                } finally {
                    setLoading(false);
                }
            }
        );
    }


    /* =========================
       STORAGE EVENT
       ========================= */

    window.addEventListener(
        "storage",
        (event) => {
            if (
                event.key === "khanCart"
            ) {
                updateCartCount();
            }
        }
    );


    /* =========================
       RESIZE
       ========================= */

    window.addEventListener(
        "resize",
        () => {
            if (
                window.innerWidth > 900
            ) {
                closeMobileMenu();
            }
        }
    );


    /* =========================
       CLOSE MENU OUTSIDE
       ========================= */

    document.addEventListener(
        "click",
        (event) => {
            if (
                !mobileNav ||
                !mobileMenuBtn
            ) {
                return;
            }

            if (
                !mobileNav.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            const clickedInsideMenu =
                mobileNav.contains(
                    event.target
                );

            const clickedButton =
                mobileMenuBtn.contains(
                    event.target
                );

            if (
                !clickedInsideMenu &&
                !clickedButton
            ) {
                closeMobileMenu();
            }
        }
    );


    /* =========================
       CONSOLE
       ========================= */

    console.log(
        "KHAN Store — Sell With Us loaded successfully."
    );

});