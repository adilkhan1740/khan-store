/* =====================================================
   KHAN STORE - ABOUT PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
    ================================================= */

    const cartCount =
        document.getElementById("cartCount");

    const mobileCartCount =
        document.getElementById("mobileCartCount");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    const currentYear =
        document.getElementById("currentYear");

    const counters =
        document.querySelectorAll(".counter");

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    /* =================================================
       CURRENT YEAR
    ================================================= */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =================================================
       CART COUNT
    ================================================= */

    function updateCartCount() {

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem("khanCart") || "[]"
                );

            if (!Array.isArray(cart)) {

                if (cartCount) {
                    cartCount.textContent = "0";
                }

                if (mobileCartCount) {
                    mobileCartCount.textContent = "0";
                }

                return;
            }

            const totalItems =
                cart.reduce((total, item) => {

                    const quantity =
                        Number(item.quantity) || 1;

                    return total + quantity;

                }, 0);

            if (cartCount) {
                cartCount.textContent = totalItems;
            }

            if (mobileCartCount) {
                mobileCartCount.textContent = totalItems;
            }

        } catch (error) {

            console.error(
                "Cart count error:",
                error
            );

            if (cartCount) {
                cartCount.textContent = "0";
            }

            if (mobileCartCount) {
                mobileCartCount.textContent = "0";
            }
        }
    }

    updateCartCount();


    /* =================================================
       MOBILE MENU
    ================================================= */

    function closeMobileMenu() {

        if (!mobileNav) return;

        mobileNav.classList.remove("active");

        const icon =
            mobileMenuBtn?.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );
        }
    }


    function openMobileMenu() {

        if (!mobileNav) return;

        mobileNav.classList.add("active");

        const icon =
            mobileMenuBtn?.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );
        }
    }


    if (mobileMenuBtn && mobileNav) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileNav.classList.contains(
                        "active"
                    );

                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }
            }
        );
    }


    /* =================================================
       CLOSE MOBILE MENU AFTER CLICK
    ================================================= */

    if (mobileNav) {

        const mobileLinks =
            mobileNav.querySelectorAll("a");

        mobileLinks.forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    closeMobileMenu();

                }
            );

        });
    }


    /* =================================================
       COUNTER ANIMATION
    ================================================= */

    function animateCounter(counter) {

        const target =
            Number(
                counter.dataset.target
            );

        if (
            Number.isNaN(target) ||
            target <= 0
        ) {
            return;
        }

        let current = 0;

        const duration = 1500;

        const startTime =
            performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease-out effect
             */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            current =
                Math.floor(
                    eased * target
                );


            counter.textContent =
                current.toLocaleString();


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.textContent =
                    target.toLocaleString();

            }
        }


        requestAnimationFrame(
            updateCounter
        );
    }


    /* =================================================
       INTERSECTION OBSERVER
    ================================================= */

    if (counters.length > 0) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            animateCounter(
                                entry.target
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach((counter) => {

            counterObserver.observe(
                counter
            );

        });
    }


    /* =================================================
       TOAST
    ================================================= */

    let toastTimer;

    function showToast(message) {

        if (
            !toast ||
            !toastMessage
        ) {
            return;
        }

        toastMessage.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3000);
    }


    /* =================================================
       NAVIGATION FEEDBACK
    ================================================= */

    const internalLinks =
        document.querySelectorAll(
            'a[href="index.html#products"], a[href="products.html"]'
        );

    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                showToast(
                    "Opening KHAN Store products..."
                );

            }
        );

    });


    /* =================================================
       KEYBOARD - ESCAPE
    ================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                mobileNav
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =================================================
       UPDATE CART IF STORAGE CHANGES
    ================================================= */

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


    /* =================================================
       UPDATE CART WHEN PAGE BECOMES ACTIVE
    ================================================= */

    window.addEventListener(
        "focus",
        () => {

            updateCartCount();

        }
    );


    /* =================================================
       SMOOTH INTERNAL SCROLL
    ================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =================================================
       PAGE READY
    ================================================= */

    console.log(
        "KHAN Store About page loaded successfully."
    );

});