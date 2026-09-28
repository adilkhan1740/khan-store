/* =========================================================
   KHAN STORE — HELP CENTER
   help.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const cartCount = document.getElementById("cartCount");
    const mobileCartCount =
        document.getElementById("mobileCartCount");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    const footerYear =
        document.getElementById("footerYear");

    const helpSearchForm =
        document.getElementById("helpSearchForm");

    const helpSearchInput =
        document.getElementById("helpSearchInput");

    const searchSuggestions =
        document.getElementById("searchSuggestions");

    const categoryCards =
        document.querySelectorAll(".help-category-card");

    const faqItems =
        document.querySelectorAll(".faq-item");

    const faqQuestions =
        document.querySelectorAll(".faq-question");

    const noResults =
        document.getElementById("noResults");

    const clearSearchBtn =
        document.getElementById("clearSearchBtn");

    const helpToast =
        document.getElementById("helpToast");

    const helpToastMessage =
        document.getElementById("helpToastMessage");

    const helpToastClose =
        document.getElementById("helpToastClose");


    /* =====================================================
       FOOTER YEAR
    ====================================================== */

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       CART COUNT
    ====================================================== */

    function updateCartCount() {
        try {
            const cart = JSON.parse(
                localStorage.getItem("khanCart") || "[]"
            );

            const count = cart.reduce(
                (total, item) => {
                    return total + Number(item.quantity || 1);
                },
                0
            );

            if (cartCount) {
                cartCount.textContent = count;

                cartCount.style.display =
                    count > 0 ? "inline-flex" : "none";
            }

            if (mobileCartCount) {
                mobileCartCount.textContent = count;

                mobileCartCount.style.display =
                    count > 0 ? "inline-flex" : "none";
            }

        } catch (error) {
            console.error(
                "KHAN Store cart count error:",
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


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    function openMobileMenu() {
        if (!mobileNav || !mobileMenuBtn) {
            return;
        }

        mobileNav.classList.add("active");

        mobileMenuBtn.classList.add("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            "Close navigation menu"
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

        mobileMenuBtn.classList.remove("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        const icon =
            mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }


    function toggleMobileMenu() {
        if (
            mobileNav &&
            mobileNav.classList.contains("active")
        ) {
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
        const mobileLinks =
            mobileNav.querySelectorAll("a");

        mobileLinks.forEach(link => {
            link.addEventListener(
                "click",
                closeMobileMenu
            );
        });
    }


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMobileMenu();

                closeSearchSuggestions();

                closeToast();

            }

        }
    );


    /* =====================================================
       FAQ ACCORDION
    ====================================================== */

    function closeAllFaqs(exceptItem = null) {

        faqItems.forEach(item => {

            if (item !== exceptItem) {

                item.classList.remove("active");

                const button =
                    item.querySelector(".faq-question");

                if (button) {
                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            }

        });

    }


    faqQuestions.forEach(question => {

        question.addEventListener(
            "click",
            () => {

                const item =
                    question.closest(".faq-item");

                if (!item) {
                    return;
                }

                const isActive =
                    item.classList.contains("active");


                closeAllFaqs(item);


                if (isActive) {

                    item.classList.remove("active");

                    question.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                } else {

                    item.classList.add("active");

                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    });


    /* =====================================================
       FAQ DATA
    ====================================================== */

    const faqData = [
        {
            keywords: [
                "order",
                "orders",
                "status",
                "cancel",
                "cancellation"
            ],
            category: "orders",
            title: "Orders"
        },

        {
            keywords: [
                "delivery",
                "shipping",
                "ship",
                "track",
                "tracking"
            ],
            category: "delivery",
            title: "Delivery"
        },

        {
            keywords: [
                "payment",
                "payments",
                "cod",
                "cash",
                "online"
            ],
            category: "payments",
            title: "Payments"
        },

        {
            keywords: [
                "return",
                "returns",
                "refund",
                "replacement"
            ],
            category: "returns",
            title: "Returns & Refunds"
        },

        {
            keywords: [
                "account",
                "login",
                "signin",
                "signup",
                "password"
            ],
            category: "account",
            title: "Account"
        },

        {
            keywords: [
                "product",
                "products",
                "mobile",
                "laptop",
                "availability",
                "warranty"
            ],
            category: "products",
            title: "Products"
        }
    ];


    /* =====================================================
       SEARCH SUGGESTIONS
    ====================================================== */

    function closeSearchSuggestions() {

        if (!searchSuggestions) {
            return;
        }

        searchSuggestions.classList.remove("show");

        searchSuggestions.innerHTML = "";
    }


    function showSearchSuggestions(query) {

        if (!searchSuggestions) {
            return;
        }

        const cleanQuery =
            query.trim().toLowerCase();

        if (!cleanQuery) {

            closeSearchSuggestions();

            return;
        }


        const matches =
            faqData.filter(item => {

                return (
                    item.title
                        .toLowerCase()
                        .includes(cleanQuery)
                    ||
                    item.keywords.some(keyword =>
                        keyword.includes(cleanQuery)
                        ||
                        cleanQuery.includes(keyword)
                    )
                );

            });


        if (!matches.length) {

            closeSearchSuggestions();

            return;
        }


        searchSuggestions.innerHTML =
            matches
                .slice(0, 5)
                .map(item => {

                    return `
                        <button
                            type="button"
                            class="search-suggestion"
                            data-category="${item.category}"
                        >
                            <i class="fa-solid fa-magnifying-glass"></i>

                            <span>
                                ${item.title}
                            </span>
                        </button>
                    `;

                })
                .join("");


        searchSuggestions.classList.add("show");


        searchSuggestions
            .querySelectorAll(".search-suggestion")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const category =
                            button.dataset.category;

                        filterByCategory(category);

                        closeSearchSuggestions();

                    }
                );

            });

    }


    if (helpSearchInput) {

        helpSearchInput.addEventListener(
            "input",
            () => {

                showSearchSuggestions(
                    helpSearchInput.value
                );

            }
        );

    }


    /* =====================================================
       SEARCH FAQS
    ====================================================== */

    function searchFaqs(query) {

        const cleanQuery =
            query.trim().toLowerCase();


        let visibleCount = 0;


        faqItems.forEach(item => {

            const category =
                item.dataset.category || "";

            const question =
                item.querySelector(".faq-question");

            const answer =
                item.querySelector(".faq-answer");


            const questionText =
                question
                    ? question.textContent.toLowerCase()
                    : "";

            const answerText =
                answer
                    ? answer.textContent.toLowerCase()
                    : "";


            const categoryText =
                category.toLowerCase();


            const searchableText =
                `${questionText}
                 ${answerText}
                 ${categoryText}`;


            const matches =
                !cleanQuery ||
                searchableText.includes(cleanQuery);


            if (matches) {

                item.style.display = "";

                visibleCount++;

            } else {

                item.style.display = "none";

                item.classList.remove("active");

                if (question) {
                    question.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            }

        });


        if (noResults) {

            noResults.classList.toggle(
                "show",
                visibleCount === 0
            );

        }

    }


    /* =====================================================
       SEARCH FORM
    ====================================================== */

    if (helpSearchForm) {

        helpSearchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const query =
                    helpSearchInput
                        ? helpSearchInput.value.trim()
                        : "";


                closeSearchSuggestions();

                searchFaqs(query);


                const faqSection =
                    document.getElementById("faq");


                if (faqSection) {

                    faqSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }


                if (query) {

                    const visibleFaqs =
                        [...faqItems].filter(
                            item =>
                                item.style.display !== "none"
                        );


                    if (visibleFaqs.length) {

                        showToast(
                            `${visibleFaqs.length} help result${visibleFaqs.length > 1 ? "s" : ""} found.`,
                            "success"
                        );

                    } else {

                        showToast(
                            "No help results found.",
                            "warning"
                        );

                    }

                }

            }
        );

    }


    /* =====================================================
       CATEGORY FILTER
    ====================================================== */

    function filterByCategory(category) {

        if (!category) {
            return;
        }


        let visibleCount = 0;


        faqItems.forEach(item => {

            const itemCategory =
                item.dataset.category;


            if (itemCategory === category) {

                item.style.display = "";

                visibleCount++;

            } else {

                item.style.display = "";

            }

        });


        /*
           Scroll to FAQ section
        */

        const faqSection =
            document.getElementById("faq");


        if (faqSection) {

            faqSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        /*
           Highlight selected category FAQs
        */

        faqItems.forEach(item => {

            if (
                item.dataset.category === category
            ) {

                item.classList.add("category-highlight");

            } else {

                item.classList.remove(
                    "category-highlight"
                );

            }

        });


        /*
           Open first matching FAQ
        */

        const firstMatch =
            [...faqItems].find(
                item =>
                    item.dataset.category === category
            );


        if (firstMatch) {

            closeAllFaqs();

            firstMatch.classList.add("active");

            const button =
                firstMatch.querySelector(
                    ".faq-question"
                );

            if (button) {

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }


        showToast(
            `${visibleCount} help topic${visibleCount > 1 ? "s" : ""} available.`,
            "success"
        );

    }


    categoryCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const category =
                    card.dataset.category;

                if (!category) {
                    return;
                }

                /*
                   Clear text search
                */

                if (helpSearchInput) {
                    helpSearchInput.value = "";
                }

                /*
                   Reset hidden FAQs
                */

                faqItems.forEach(item => {
                    item.style.display = "";
                });

                if (noResults) {
                    noResults.classList.remove("show");
                }

                filterByCategory(category);

            }
        );

    });


    /* =====================================================
       CLEAR SEARCH
    ====================================================== */

    if (clearSearchBtn) {

        clearSearchBtn.addEventListener(
            "click",
            () => {

                if (helpSearchInput) {
                    helpSearchInput.value = "";
                }

                faqItems.forEach(item => {

                    item.style.display = "";

                    item.classList.remove(
                        "category-highlight"
                    );

                });


                if (noResults) {
                    noResults.classList.remove("show");
                }


                closeAllFaqs();


                showToast(
                    "Search cleared.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       CLOSE SEARCH SUGGESTIONS
       WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                searchSuggestions &&
                helpSearchForm &&
                !helpSearchForm.contains(event.target)
            ) {

                closeSearchSuggestions();

            }

        }
    );


    /* =====================================================
       TOAST
    ====================================================== */

    let toastTimer = null;


    function showToast(
        message,
        type = "success"
    ) {

        if (
            !helpToast ||
            !helpToastMessage
        ) {
            return;
        }


        helpToastMessage.textContent =
            message;


        helpToast.classList.remove(
            "success",
            "warning",
            "error"
        );


        helpToast.classList.add(type);


        helpToast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(
            () => {
                closeToast();
            },
            3200
        );

    }


    function closeToast() {

        if (!helpToast) {
            return;
        }

        helpToast.classList.remove("show");

    }


    if (helpToastClose) {

        helpToastClose.addEventListener(
            "click",
            closeToast
        );

    }


    /* =====================================================
       STORAGE EVENT
    ====================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (event.key === "khanCart") {

                updateCartCount();

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 800
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ====================================================== */

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


    /*
       Initially hide no-results
    */

    if (noResults) {
        noResults.classList.remove("show");
    }


    /*
       Remove temporary category highlighting
    */

    faqItems.forEach(item => {

        item.classList.remove(
            "category-highlight"
        );

    });


    console.log(
        "KHAN Store Help Center loaded successfully."
    );

});