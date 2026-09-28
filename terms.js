document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       ELEMENTS
    ========================= */

    const currentYear = document.getElementById("currentYear");

    const cartCount = document.getElementById("cartCount");
    const mobileCartCount = document.getElementById("mobileCartCount");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNav = document.getElementById("mobileNav");

    const toast = document.getElementById("termsToast");
    const toastMessage = document.getElementById("toastMessage");

    const sidebarLinks = document.querySelectorAll(
        ".terms-sidebar-nav a"
    );

    const sections = document.querySelectorAll(
        ".terms-section"
    );


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
            const cart = JSON.parse(
                localStorage.getItem("khanCart") || "[]"
            );

            if (Array.isArray(cart)) {
                totalItems = cart.reduce((total, item) => {
                    const quantity = Number(item.quantity) || 0;
                    return total + quantity;
                }, 0);
            }
        } catch (error) {
            console.error("Unable to read cart:", error);
            totalItems = 0;
        }

        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display =
                totalItems > 0 ? "inline-flex" : "none";
        }

        if (mobileCartCount) {
            mobileCartCount.textContent = totalItems;
            mobileCartCount.style.display =
                totalItems > 0 ? "inline-flex" : "none";
        }
    }

    updateCartCount();


    /* =========================
       MOBILE MENU
    ========================= */

    function openMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) return;

        mobileNav.classList.add("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "true"
        );

        const icon = mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        }
    }


    function closeMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) return;

        mobileNav.classList.remove("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

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


    /* =========================
       CLOSE MOBILE MENU
       AFTER LINK CLICK
    ========================= */

    if (mobileNav) {
        const mobileLinks =
            mobileNav.querySelectorAll("a");

        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });
    }


    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });


    /* =========================
       CLICK OUTSIDE MOBILE MENU
    ========================= */

    document.addEventListener("click", (event) => {
        if (!mobileNav || !mobileMenuBtn) return;

        const clickedInsideMenu =
            mobileNav.contains(event.target);

        const clickedButton =
            mobileMenuBtn.contains(event.target);

        if (
            mobileNav.classList.contains("active") &&
            !clickedInsideMenu &&
            !clickedButton
        ) {
            closeMobileMenu();
        }
    });


    /* =========================
       TOAST
    ========================= */

    let toastTimer = null;

    function showToast(message) {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =========================
       SIDEBAR NAVIGATION
    ========================= */

    function setActiveSidebarLink(id) {
        sidebarLinks.forEach((link) => {
            const href = link.getAttribute("href");

            if (href === `#${id}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }


    sidebarLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) {
                return;
            }

            const targetId = href.substring(1);
            const target = document.getElementById(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            setActiveSidebarLink(targetId);

            const headerOffset = 100;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            history.replaceState(
                null,
                "",
                `#${targetId}`
            );
        });
    });


    /* =========================
       ACTIVE SECTION ON SCROLL
    ========================= */

    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
        };

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSidebarLink(
                                entry.target.id
                            );
                        }
                    });
                },
                observerOptions
            );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =========================
       HASH URL SUPPORT
    ========================= */

    function handleHashNavigation() {
        const hash =
            window.location.hash.replace("#", "");

        if (!hash) return;

        const target =
            document.getElementById(hash);

        if (!target) return;

        setTimeout(() => {
            const headerOffset = 100;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            setActiveSidebarLink(hash);
        }, 150);
    }

    handleHashNavigation();


    window.addEventListener(
        "hashchange",
        handleHashNavigation
    );


    /* =========================
       STORAGE SYNC
    ========================= */

    window.addEventListener(
        "storage",
        (event) => {
            if (event.key === "khanCart") {
                updateCartCount();
            }
        }
    );


    /* =========================
       RESIZE HANDLER
    ========================= */

    let resizeTimer;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            if (
                window.innerWidth > 900 &&
                mobileNav &&
                mobileNav.classList.contains("active")
            ) {
                closeMobileMenu();
            }

            updateCartCount();
        }, 150);
    });


    /* =========================
       INITIAL ACCESSIBILITY
    ========================= */

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
       PAGE READY
    ========================= */

    console.log(
        "KHAN Store Terms & Conditions loaded successfully."
    );
});