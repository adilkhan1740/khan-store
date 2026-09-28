/* =========================================================
   KHAN STORE - MAIN.JS
   PART 1
   SECTIONS 1 - 23
========================================================= */


/* =========================================================
   1. LOCAL STORAGE
========================================================= */

const CART_KEY = "khanCart";
const WISHLIST_KEY = "khanWishlist";
const THEME_KEY = "khanTheme";
const PRODUCTS_KEY = "khanProducts";


function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        console.error("Cart read error:", error);
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (error) {
        console.error("Wishlist read error:", error);
        return [];
    }
}


function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}


function getProducts() {
    try {
        return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    } catch (error) {
        console.error("Products read error:", error);
        return [];
    }
}


function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}


/* =========================================================
   2. COMMON HELPERS
========================================================= */

function formatPrice(price) {
    const number = Number(price) || 0;

    return "₹" + number.toLocaleString("en-IN");
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showToast(message, type = "success") {
    let toastContainer = document.querySelector(".toast-container");

    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <div class="toast-icon">
            ${
                type === "error"
                    ? '<i class="fa-solid fa-circle-xmark"></i>'
                    : type === "warning"
                    ? '<i class="fa-solid fa-triangle-exclamation"></i>'
                    : '<i class="fa-solid fa-circle-check"></i>'
            }
        </div>

        <div class="toast-message">
            ${escapeHTML(message)}
        </div>

        <button class="toast-close" type="button">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    const closeButton = toast.querySelector(".toast-close");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            toast.remove();
        });
    }

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}


function getProductId(product) {
    return String(
        product?.productId ??
        product?.id ??
        product?._id ??
        ""
    );
}


function getProductName(product) {
    return product?.name || product?.title || "Product";
}


function getProductPrice(product) {
    return Number(product?.price) || 0;
}


/* =========================================================
   3. CART COUNT
========================================================= */

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((total, item) => {
        return total + (Number(item.quantity) || 1);
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });
}


/* =========================================================
   4. WISHLIST COUNT
========================================================= */

function updateWishlistCount() {
    const wishlist = getWishlist();

    document.querySelectorAll(".wishlist-count").forEach(element => {
        element.textContent = wishlist.length;
    });
}


function updateAllCounters() {
    updateCartCount();
    updateWishlistCount();
}


/* =========================================================
   5. GET PRODUCT FROM CARD
========================================================= */

function getProductFromCard(card) {
    if (!card) {
        return null;
    }

    const productId =
        card.dataset.id ||
        card.dataset.productId ||
        card.getAttribute("data-product-id") ||
        "";

    const nameElement =
        card.querySelector(".product-name") ||
        card.querySelector("[data-product-name]");

    const priceElement =
        card.querySelector(".product-price") ||
        card.querySelector("[data-product-price]");

    const oldPriceElement =
        card.querySelector(".old-price");

    const imageElement =
        card.querySelector(".product-image img");

    const categoryElement =
        card.querySelector(".product-category");

    const ratingElement =
        card.querySelector(".product-rating");

    const stockElement =
        card.querySelector(".product-stock");

    const product = {
        id: productId,
        productId: productId,
        name:
            card.dataset.name ||
            nameElement?.textContent.trim() ||
            "Product",

        price:
            Number(
                card.dataset.price ||
                priceElement?.dataset?.price ||
                (priceElement?.textContent || "").replace(/[^\d.]/g, "")
            ) || 0,

        oldPrice:
            Number(
                card.dataset.oldPrice ||
                oldPriceElement?.dataset?.price ||
                (oldPriceElement?.textContent || "").replace(/[^\d.]/g, "")
            ) || 0,

        category:
            card.dataset.category ||
            categoryElement?.textContent.trim() ||
            "",

        rating:
            Number(card.dataset.rating) ||
            Number(
                (ratingElement?.textContent || "")
                    .match(/[\d.]+/)?.[0]
            ) ||
            0,

        reviews:
            Number(card.dataset.reviews) || 0,

        image:
            card.dataset.image ||
            imageElement?.getAttribute("src") ||
            "",

        stock:
            Number(card.dataset.stock) ||
            Number(
                stockElement?.textContent.replace(/[^\d]/g, "")
            ) ||
            0
    };

    return product;
}


/* =========================================================
   6. ADD TO CART
========================================================= */

function addToCart(product) {
    if (!product) {
        return;
    }

    const cart = getCart();

    const productId = getProductId(product);

    if (!productId) {
        showToast("Product ID missing", "error");
        return;
    }

    const existingItem = cart.find(
        item => getProductId(item) === productId
    );

    if (existingItem) {
        existingItem.quantity =
            (Number(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({
            id: productId,
            productId: productId,
            name: getProductName(product),
            price: getProductPrice(product),
            oldPrice: Number(product.oldPrice) || 0,
            image: product.image || "",
            category: product.category || "",
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    showToast(`${getProductName(product)} added to cart`);

    animateCartIcon();
}


/* =========================================================
   7. CART ICON ANIMATION
========================================================= */

function animateCartIcon() {
    const cartIcons = document.querySelectorAll(
        ".cart-icon, .cart-link, .cart-btn, .cart-count"
    );

    cartIcons.forEach(element => {
        element.classList.remove("cart-bounce");

        void element.offsetWidth;

        element.classList.add("cart-bounce");

        setTimeout(() => {
            element.classList.remove("cart-bounce");
        }, 600);
    });
}


/* =========================================================
   8. ADD TO CART BUTTONS
========================================================= */

function initializeAddToCartButtons() {
    document.addEventListener("click", function(event) {
        const button = event.target.closest(
            ".add-to-cart, .add-cart-btn, [data-add-cart]"
        );

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const card = button.closest(".product-card");

        if (!card) {
            return;
        }

        const product = getProductFromCard(card);

        if (!product) {
            showToast("Unable to add product", "error");
            return;
        }

        const stock = Number(product.stock);

        if (stock === 0 && card.dataset.stock !== undefined) {
            showToast("Product is out of stock", "warning");
            return;
        }

        addToCart(product);

        button.classList.add("added");

        const originalHTML = button.innerHTML;

        button.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Added
        `;

        setTimeout(() => {
            button.classList.remove("added");
            button.innerHTML = originalHTML;
        }, 1200);
    });
}


/* =========================================================
   9. WISHLIST
========================================================= */

function toggleWishlist(product) {
    if (!product) {
        return;
    }

    const wishlist = getWishlist();

    const productId = getProductId(product);

    if (!productId) {
        showToast("Product ID missing", "error");
        return;
    }

    const existingIndex = wishlist.findIndex(
        item => getProductId(item) === productId
    );

    if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);

        showToast(
            `${getProductName(product)} removed from wishlist`
        );
    } else {
        wishlist.push({
            id: productId,
            productId: productId,
            name: getProductName(product),
            price: getProductPrice(product),
            oldPrice: Number(product.oldPrice) || 0,
            image: product.image || "",
            category: product.category || "",
            rating: Number(product.rating) || 0,
            reviews: Number(product.reviews) || 0
        });

        showToast(
            `${getProductName(product)} added to wishlist`
        );
    }

    saveWishlist(wishlist);

    updateWishlistCount();
    updateWishlistHearts();
}


/* =========================================================
   10. WISHLIST BUTTONS
========================================================= */

function initializeWishlistButtons() {
    document.addEventListener("click", function(event) {
        const button = event.target.closest(
            ".wishlist-btn, .wishlist-button, [data-wishlist]"
        );

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const card = button.closest(".product-card");

        if (!card) {
            return;
        }

        const product = getProductFromCard(card);

        toggleWishlist(product);
    });
}


/* =========================================================
   11. UPDATE WISHLIST HEARTS
========================================================= */

function updateWishlistHearts() {
    const wishlist = getWishlist();

    document.querySelectorAll(
        ".product-card .wishlist-btn, .product-card .wishlist-button"
    ).forEach(button => {
        const card = button.closest(".product-card");

        if (!card) {
            return;
        }

        const productId =
            card.dataset.id ||
            card.dataset.productId ||
            card.getAttribute("data-product-id") ||
            "";

        const exists = wishlist.some(
            item => getProductId(item) === String(productId)
        );

        button.classList.toggle("active", exists);

        const icon = button.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-solid", exists);
            icon.classList.toggle("fa-regular", !exists);
        }
    });
}


/* =========================================================
   12. SEARCH
========================================================= */

function initializeSearch() {
    const searchForm = document.querySelector("#searchForm");
    const searchInput = document.querySelector("#searchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", function() {
        const query = this.value.trim().toLowerCase();

        const cards = document.querySelectorAll(
            ".product-card"
        );

        if (!cards.length) {
            return;
        }

        cards.forEach(card => {
            const name =
                card.querySelector(".product-name")
                    ?.textContent
                    .toLowerCase() || "";

            const category =
                card.querySelector(".product-category")
                    ?.textContent
                    .toLowerCase() || "";

            const matches =
                !query ||
                name.includes(query) ||
                category.includes(query);

            card.style.display = matches ? "" : "none";
        });
    });

    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const query = searchInput.value.trim();

            if (!query) {
                showToast("Please enter a product name", "warning");
                return;
            }

            const productsSection =
                document.querySelector("#electronics") ||
                document.querySelector(".products-section") ||
                document.querySelector(".products-grid");

            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }
}


/* =========================================================
   13. DARK MODE
========================================================= */

function initializeDarkMode() {
    const themeButton = document.querySelector(
        "#theme-btn, .theme-btn"
    );

    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    if (!themeButton) {
        return;
    }

    updateThemeIcon(themeButton);

    themeButton.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            THEME_KEY,
            isDark ? "dark" : "light"
        );

        updateThemeIcon(themeButton);
    });
}


function updateThemeIcon(button) {
    if (!button) {
        return;
    }

    const icon = button.querySelector("i");

    if (!icon) {
        return;
    }

    const isDark =
        document.body.classList.contains("dark-mode");

    if (isDark) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}


/* =========================================================
   14. MOBILE MENU
========================================================= */

function initializeMobileMenu() {
    const menuButton =
        document.querySelector(
            ".mobile-menu-btn, #mobileMenuBtn, .menu-btn"
        );

    const nav =
        document.querySelector(
            ".main-nav, .nav-menu, .nav-links"
        );

    if (!menuButton || !nav) {
        return;
    }

    menuButton.addEventListener("click", function() {
        nav.classList.toggle("active");
        menuButton.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function() {
            nav.classList.remove("active");
            menuButton.classList.remove("active");
        });
    });
}


/* =========================================================
   15. FLASH DEAL COUNTDOWN
========================================================= */

function initializeFlashCountdown() {
    const hoursElement =
        document.querySelector("#hours");

    const minutesElement =
        document.querySelector("#minutes");

    const secondsElement =
        document.querySelector("#seconds");

    if (
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }

    let hours = Number(hoursElement.textContent) || 8;
    let minutes = Number(minutesElement.textContent) || 43;
    let seconds = Number(secondsElement.textContent) || 37;

    const updateCountdown = () => {
        seconds--;

        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }

        if (minutes < 0) {
            minutes = 59;
            hours--;
        }

        if (hours < 0) {
            hours = 23;
        }

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");
    };

    setInterval(updateCountdown, 1000);
}


/* =========================================================
   16. NEWSLETTER
========================================================= */

function initializeNewsletter() {
    const newsletterForm =
        document.querySelector(
            "#newsletterForm, .newsletter-form"
        );

    if (!newsletterForm) {
        return;
    }

    newsletterForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const input =
            newsletterForm.querySelector(
                'input[type="email"]'
            );

        if (!input) {
            return;
        }

        const email = input.value.trim();

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(email)) {
            showToast(
                "Please enter a valid email address",
                "warning"
            );
            return;
        }

        const subscribers =
            JSON.parse(
                localStorage.getItem(
                    "khanNewsletterSubscribers"
                )
            ) || [];

        if (!subscribers.includes(email)) {
            subscribers.push(email);

            localStorage.setItem(
                "khanNewsletterSubscribers",
                JSON.stringify(subscribers)
            );
        }

        input.value = "";

        showToast(
            "Thank you for subscribing!"
        );
    });
}


/* =========================================================
   17. NAVIGATION
========================================================= */

function initializeNavigation() {
    document.addEventListener("click", function(event) {
        const link = event.target.closest(
            'a[href="#"], a[href="javascript:void(0)"]'
        );

        if (!link) {
            return;
        }

        event.preventDefault();
    });
}


/* =========================================================
   18. QUICK VIEW
========================================================= */

function initializeQuickView() {
    document.addEventListener("click", function(event) {
        const button = event.target.closest(
            ".quick-view-btn, .quick-view-button, [data-quick-view]"
        );

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const card =
            button.closest(".product-card");

        if (!card) {
            return;
        }

        const product =
            getProductFromCard(card);

        if (!product) {
            return;
        }

        openQuickView(product);
    });
}


function openQuickView(product) {
    let modal =
        document.querySelector("#quickViewModal");

    if (!modal) {
        modal = document.createElement("div");

        modal.id = "quickViewModal";
        modal.className = "quick-view-modal";

        document.body.appendChild(modal);
    }

    const rating =
        Number(product.rating) || 0;

    const reviews =
        Number(product.reviews) || 0;

    modal.innerHTML = `
        <div class="quick-view-overlay"></div>

        <div class="quick-view-content">

            <button
                class="quick-view-close"
                type="button"
                aria-label="Close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="quick-view-image">
                ${
                    product.image
                        ? `
                            <img
                                src="${escapeHTML(product.image)}"
                                alt="${escapeHTML(
                                    getProductName(product)
                                )}"
                            >
                        `
                        : `
                            <div class="product-image-fallback">
                                <i class="fa-solid fa-image"></i>
                            </div>
                        `
                }
            </div>

            <div class="quick-view-details">

                <div class="product-category">
                    ${escapeHTML(product.category || "Electronics")}
                </div>

                <h2>
                    ${escapeHTML(getProductName(product))}
                </h2>

                <div class="product-rating">
                    <span>
                        ${"★".repeat(Math.round(rating))}
                    </span>

                    <small>
                        ${rating.toFixed(1)}
                        (${reviews} reviews)
                    </small>
                </div>

                <div class="quick-view-price">
                    ${formatPrice(product.price)}

                    ${
                        product.oldPrice
                            ? `
                                <span class="old-price">
                                    ${formatPrice(product.oldPrice)}
                                </span>
                            `
                            : ""
                    }
                </div>

                <p class="quick-view-description">
                    ${escapeHTML(
                        product.description ||
                        "Premium quality product from KHAN Store."
                    )}
                </p>

                <button
                    class="quick-view-add-cart"
                    type="button"
                >
                    <i class="fa-solid fa-cart-shopping"></i>
                    Add to Cart
                </button>

            </div>
        </div>
    `;

    modal.classList.add("active");

    const closeModal = () => {
        modal.classList.remove("active");
    };

    modal
        .querySelector(".quick-view-overlay")
        ?.addEventListener(
            "click",
            closeModal
        );

    modal
        .querySelector(".quick-view-close")
        ?.addEventListener(
            "click",
            closeModal
        );

    modal
        .querySelector(".quick-view-add-cart")
        ?.addEventListener(
            "click",
            function() {
                addToCart(product);
            }
        );
}


/* =========================================================
   19. SMOOTH SCROLL
========================================================= */

function initializeSmoothScroll() {
    document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    ).forEach(link => {
        link.addEventListener("click", function(event) {
            const targetId =
                this.getAttribute("href");

            if (!targetId) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* =========================================================
   20. HEADER SCROLL
========================================================= */

function initializeHeaderScroll() {
    const header =
        document.querySelector(
            "header, .site-header, .main-header"
        );

    if (!header) {
        return;
    }

    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();
}


/* =========================================================
   21. LAZY IMAGES
========================================================= */

function initializeLazyImages() {
    const images =
        document.querySelectorAll(
            "img[data-src]"
        );

    if (!images.length) {
        return;
    }

    if ("IntersectionObserver" in window) {
        const observer =
            new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        const image =
                            entry.target;

                        const src =
                            image.dataset.src;

                        if (src) {
                            image.src = src;
                        }

                        image.removeAttribute(
                            "data-src"
                        );

                        obs.unobserve(image);
                    });
                },
                {
                    rootMargin: "100px"
                }
            );

        images.forEach(image => {
            observer.observe(image);
        });
    } else {
        images.forEach(image => {
            image.src =
                image.dataset.src || "";
        });
    }
}


/* =========================================================
   22. PRODUCT HOVER
========================================================= */

function initializeProductHover() {
    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            card.addEventListener(
                "mouseenter",
                function() {
                    this.classList.add("hovered");
                }
            );

            card.addEventListener(
                "mouseleave",
                function() {
                    this.classList.remove("hovered");
                }
            );

        });
}


/* =========================================================
   23. ESCAPE KEY
========================================================= */

function initializeEscapeKey() {
    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Escape") {
                return;
            }

            const modal =
                document.querySelector(
                    "#quickViewModal"
                );

            if (modal) {
                modal.classList.remove(
                    "active"
                );
            }

            document
                .querySelectorAll(
                    ".mobile-menu-btn.active, .menu-btn.active"
                )
                .forEach(button => {
                    button.classList.remove(
                        "active"
                    );
                });

            document
                .querySelectorAll(
                    ".main-nav.active, .nav-menu.active, .nav-links.active"
                )
                .forEach(nav => {
                    nav.classList.remove(
                        "active"
                    );
                });
        }
    );
}


/* =========================================================
   PART 1 END
   SECTIONS 1 - 23 COMPLETE
========================================================= */
/* =========================================================
   24. MONGODB PRODUCT INTEGRATION
========================================================= */

const PRODUCT_API_URL = "http://localhost:5000";


/* ---------------------------------------------------------
   GET PRODUCTS FROM LOCAL STORAGE
   Backup / fallback ke liye
--------------------------------------------------------- */

function getAdminProducts() {
    try {
        const products =
            JSON.parse(
                localStorage.getItem(PRODUCTS_KEY)
            ) || [];

        return Array.isArray(products)
            ? products
            : [];
    } catch (error) {
        console.error(
            "Local products read error:",
            error
        );

        return [];
    }
}


/* ---------------------------------------------------------
   SAVE PRODUCTS TO LOCAL STORAGE
   MongoDB ka backup browser me bhi rahega
--------------------------------------------------------- */

function saveAdminProducts(products) {
    if (!Array.isArray(products)) {
        return;
    }

    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
    );
}


/* ---------------------------------------------------------
   NORMALIZE PRODUCT
   MongoDB aur old localStorage dono formats support
--------------------------------------------------------- */

function normalizeStoreProduct(product) {
    if (!product) {
        return null;
    }

    const productId =
        product.productId ||
        product.id ||
        product._id ||
        "";

    return {
        ...product,

        id: String(productId),

        productId: String(productId),

        name:
            product.name ||
            product.title ||
            "Product",

        category:
            product.category ||
            "Electronics",

        price:
            Number(product.price) || 0,

        oldPrice:
            Number(product.oldPrice) || 0,

        discount:
            Number(product.discount) || 0,

        rating:
            Number(product.rating) || 0,

        reviews:
            Number(product.reviews) || 0,

        stock:
            Number(product.stock) || 0,

        image:
            product.image || "",

        description:
            product.description || "",

        status:
            product.status || "Active"
    };
}


/* ---------------------------------------------------------
   NORMALIZE PRODUCT IMAGE
--------------------------------------------------------- */

function normalizeProductImage(image) {
    if (!image) {
        return "";
    }

    const value =
        String(image).trim();

    if (!value) {
        return "";
    }

    /* Data URL */
    if (
        value.startsWith("data:image/")
    ) {
        return value;
    }

    /* Online URL */
    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    /* Absolute / relative frontend path */
    if (
        value.startsWith("./") ||
        value.startsWith("../") ||
        value.startsWith("/")
    ) {
        return value;
    }

    /*
       Windows path ko browser image source
       ki tarah use nahi karenge.
    */
    if (
        value.includes("\\") ||
        /^[A-Za-z]:/.test(value)
    ) {
        return "";
    }

    /*
       Agar sirf filename save hai:
       example:
       phone.jpg

       to images folder assume karenge.
    */
    return `images/${value}`;
}


/* ---------------------------------------------------------
   PRODUCT DISCOUNT
--------------------------------------------------------- */

function getProductDiscount(product) {
    if (!product) {
        return 0;
    }

    if (
        Number(product.discount) > 0
    ) {
        return Math.round(
            Number(product.discount)
        );
    }

    const price =
        Number(product.price) || 0;

    const oldPrice =
        Number(product.oldPrice) || 0;

    if (
        oldPrice > price &&
        price > 0
    ) {
        return Math.round(
            ((oldPrice - price) /
                oldPrice) *
            100
        );
    }

    return 0;
}


/* =========================================================
   LOAD PRODUCTS FROM MONGODB
========================================================= */

async function loadProductsFromMongoDB() {

    try {

        const response =
            await fetch(
                `${PRODUCT_API_URL}/api/products`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                `Products API error: ${response.status}`
            );
        }

        const data =
            await response.json();

        /*
           Backend normally returns:
           { products: [...] }

           Lekin direct array bhi support
           kar rahe hain.
        */
        let products = [];

        if (Array.isArray(data)) {
            products = data;
        } else if (
            Array.isArray(data.products)
        ) {
            products = data.products;
        } else if (
            Array.isArray(data.data)
        ) {
            products = data.data;
        }

        products =
            products
                .map(normalizeStoreProduct)
                .filter(Boolean)
                .filter(
                    product =>
                        product.status !==
                        "Inactive"
                );

        /*
           MongoDB products ka backup
           localStorage me rakhenge.
        */
        saveAdminProducts(products);

        console.log(
            "MongoDB products loaded:",
            products
        );

        return products;

    } catch (error) {

        console.error(
            "MongoDB product loading failed:",
            error
        );

        /*
           Backend unavailable hone par
           localStorage fallback.
        */
        const localProducts =
            getAdminProducts()
                .map(normalizeStoreProduct)
                .filter(Boolean)
                .filter(
                    product =>
                        product.status !==
                        "Inactive"
                );

        if (localProducts.length) {
            console.log(
                "Using localStorage product backup."
            );
        }

        return localProducts;
    }
}


/* =========================================================
   25. RENDER MONGODB PRODUCTS ON STORE
========================================================= */

async function renderAdminProductsOnStore() {

    const grid =
        document.querySelector(
            ".products-grid"
        );

    /*
       Agar current page par products grid nahi hai,
       function quietly stop ho jayega.
    */
    if (!grid) {
        return;
    }

    /*
       Loading state
    */
    grid.innerHTML = `
        <div class="products-loading">
            <div class="loading-spinner"></div>

            <p>
                Loading products...
            </p>
        </div>
    `;

    const products =
        await loadProductsFromMongoDB();

    /*
       No products
    */
    if (!products.length) {

        grid.innerHTML = `
            <div class="products-empty">

                <div class="products-empty-icon">
                    <i class="fa-solid fa-box-open"></i>
                </div>

                <h3>
                    No Products Available
                </h3>

                <p>
                    Products will appear here
                    when they are added from
                    the admin panel.
                </p>

            </div>
        `;

        return;
    }


    /*
       Render products
    */
    grid.innerHTML =
        products
            .map(product => {

                const id =
                    escapeHTML(
                        getProductId(product)
                    );

                const name =
                    escapeHTML(
                        getProductName(product)
                    );

                const category =
                    escapeHTML(
                        product.category ||
                        "Electronics"
                    );

                const image =
                    normalizeProductImage(
                        product.image
                    );

                const price =
                    Number(product.price) || 0;

                const oldPrice =
                    Number(product.oldPrice) || 0;

                const rating =
                    Number(product.rating) || 0;

                const reviews =
                    Number(product.reviews) || 0;

                const stock =
                    Number(product.stock) || 0;

                const discount =
                    getProductDiscount(
                        product
                    );

                const description =
                    escapeHTML(
                        product.description ||
                        ""
                    );

                const safeImage =
                    escapeHTML(image);

                const stockText =
                    stock > 0
                        ? `${stock} in stock`
                        : "Out of stock";

                const stockClass =
                    stock > 0
                        ? "in-stock"
                        : "out-stock";

                const stars =
                    Math.round(
                        Math.max(
                            0,
                            Math.min(
                                5,
                                rating
                            )
                        )
                    );

                return `
                    <article
                        class="product-card"
                        data-id="${id}"
                        data-product-id="${id}"
                        data-name="${name}"
                        data-price="${price}"
                        data-old-price="${oldPrice}"
                        data-category="${category}"
                        data-rating="${rating}"
                        data-reviews="${reviews}"
                        data-stock="${stock}"
                        data-image="${safeImage}"
                        data-description="${description}"
                    >

                        <div class="product-image">

                            ${
                                discount > 0
                                    ? `
                                        <span class="discount-badge">
                                            ${discount}% OFF
                                        </span>
                                    `
                                    : ""
                            }

                            <button
                                class="wishlist-btn"
                                type="button"
                                aria-label="Add to wishlist"
                            >
                                <i class="fa-regular fa-heart"></i>
                            </button>

                            <button
                                class="quick-view-btn"
                                type="button"
                                aria-label="Quick view"
                            >
                                <i class="fa-solid fa-eye"></i>
                            </button>

                            ${
                                image
                                    ? `
                                        <img
                                            src="${safeImage}"
                                            alt="${name}"
                                            loading="lazy"
                                            onerror="
                                                this.style.display='none';
                                                this.parentElement
                                                    .querySelector(
                                                        '.product-image-fallback'
                                                    )
                                                    ?.classList
                                                    .remove('hidden');
                                            "
                                        >
                                    `
                                    : ""
                            }

                            <div
                                class="
                                    product-image-fallback
                                    ${image ? "hidden" : ""}
                                "
                            >
                                <i class="fa-solid fa-image"></i>
                            </div>

                        </div>


                        <div class="product-info">

                            <div class="product-category">
                                ${category}
                            </div>

                            <h3 class="product-name">
                                ${name}
                            </h3>


                            <div class="product-rating">

                                <span class="stars">
                                    ${
                                        "★".repeat(stars)
                                    }${
                                        "☆".repeat(
                                            5 - stars
                                        )
                                    }
                                </span>

                                <span class="rating-number">
                                    ${rating.toFixed(1)}
                                </span>

                                ${
                                    reviews > 0
                                        ? `
                                            <span class="review-count">
                                                (${reviews})
                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <div class="product-price-row">

                                <span
                                    class="product-price"
                                    data-price="${price}"
                                >
                                    ${formatPrice(price)}
                                </span>

                                ${
                                    oldPrice > price
                                        ? `
                                            <span
                                                class="old-price"
                                                data-price="${oldPrice}"
                                            >
                                                ${formatPrice(
                                                    oldPrice
                                                )}
                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <div
                                class="
                                    product-stock
                                    ${stockClass}
                                "
                            >
                                ${
                                    stock > 0
                                        ? `
                                            <i class="fa-solid fa-circle-check"></i>
                                            ${stockText}
                                        `
                                        : `
                                            <i class="fa-solid fa-circle-xmark"></i>
                                            ${stockText}
                                        `
                                }
                            </div>


                            <button
                                class="add-cart-btn"
                                type="button"
                                ${
                                    stock <= 0
                                        ? "disabled"
                                        : ""
                                }
                            >

                                <i class="fa-solid fa-cart-shopping"></i>

                                ${
                                    stock > 0
                                        ? "Add to Cart"
                                        : "Out of Stock"
                                }

                            </button>

                        </div>

                    </article>
                `;
            })
            .join("");


    /*
       Wishlist hearts ko newly-rendered
       cards ke according update karna.
    */
    updateWishlistHearts();

    /*
       Lazy image observer dobara initialize.
    */
    initializeLazyImages();

    /*
       Hover events newly created cards par.
    */
    initializeProductHover();

    console.log(
        `${products.length} products rendered on store.`
    );
}


/* =========================================================
   26. REFRESH STORE PRODUCTS
========================================================= */

async function refreshStoreProducts() {

    try {

        await renderAdminProductsOnStore();

        updateAllCounters();

    } catch (error) {

        console.error(
            "Store product refresh error:",
            error
        );

    }
}


/* =========================================================
   27. GLOBAL KHAN STORE PRODUCT API
========================================================= */

window.KHANStoreProducts = {

    refresh: async function() {
        return await refreshStoreProducts();
    },

    load: async function() {
        return await loadProductsFromMongoDB();
    },

    getLocal: function() {
        return getAdminProducts();
    }

};


/* =========================================================
   28. INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "KHAN Store Main JS initialized."
        );


        /*
           MongoDB products ko store par load karo.
        */
        await renderAdminProductsOnStore();


        /*
           Counters
        */
        updateAllCounters();


        /*
           Buttons
        */
        initializeAddToCartButtons();

        initializeWishlistButtons();


        /*
           Search
        */
        initializeSearch();


        /*
           Theme
        */
        initializeDarkMode();


        /*
           Mobile menu
        */
        initializeMobileMenu();


        /*
           Flash deal countdown
        */
        initializeFlashCountdown();


        /*
           Newsletter
        */
        initializeNewsletter();


        /*
           Navigation
        */
        initializeNavigation();


        /*
           Quick view
        */
        initializeQuickView();


        /*
           Smooth scrolling
        */
        initializeSmoothScroll();


        /*
           Header scroll
        */
        initializeHeaderScroll();


        /*
           Lazy images
        */
        initializeLazyImages();


        /*
           Product hover
        */
        initializeProductHover();


        /*
           Escape key
        */
        initializeEscapeKey();


        /*
           Wishlist state
        */
        updateWishlistHearts();


        console.log(
            "KHAN Store ready."
        );

    }
);


/* =========================================================
   MAIN.JS COMPLETE
========================================================= */





/* =========================================================
   DYNAMIC PRODUCT QUICK VIEW FIX
========================================================= */

document.addEventListener("click", function (event) {

    const quickViewButton =
        event.target.closest(".quick-view-btn");

    if (!quickViewButton) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const card =
        quickViewButton.closest(".product-card");

    if (!card) {
        console.error("Product card not found.");
        return;
    }

    const product = {
        id:
            card.dataset.productId ||
            card.dataset.id ||
            "",

        name:
            card.dataset.name ||
            "Product",

        price:
            Number(card.dataset.price) || 0,

        oldPrice:
            Number(card.dataset.oldPrice) || 0,

        category:
            card.dataset.category ||
            "Electronics",

        rating:
            Number(card.dataset.rating) || 0,

        reviews:
            Number(card.dataset.reviews) || 0,

        stock:
            Number(card.dataset.stock) || 0,

        image:
            card.dataset.image ||
            "",

        description:
            card.dataset.description ||
            "Premium quality product from KHAN Store."
    };


    /* Remove existing modal */

    const oldModal =
        document.getElementById(
            "khanProductQuickView"
        );

    if (oldModal) {
        oldModal.remove();
    }


    /* Stars */

    const roundedRating =
        Math.round(
            Math.max(
                0,
                Math.min(
                    5,
                    product.rating
                )
            )
        );

    const stars =
        "★".repeat(roundedRating) +
        "☆".repeat(5 - roundedRating);


    /* Price */

    const price =
        typeof formatPrice === "function"
            ? formatPrice(product.price)
            : `₹${product.price.toLocaleString("en-IN")}`;

    const oldPrice =
        product.oldPrice > product.price
            ? (
                typeof formatPrice === "function"
                    ? formatPrice(product.oldPrice)
                    : `₹${product.oldPrice.toLocaleString("en-IN")}`
            )
            : "";


    /* Modal */

    const modal =
        document.createElement("div");

    modal.id =
        "khanProductQuickView";

    modal.innerHTML = `

        <div class="khan-qv-overlay">

            <div class="khan-qv-modal">

                <button
                    type="button"
                    class="khan-qv-close"
                    aria-label="Close"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>


                <div class="khan-qv-image">

                    ${
                        product.image
                            ? `
                                <img
                                    src="${product.image}"
                                    alt="${product.name}"
                                >
                              `
                            : `
                                <div class="khan-qv-no-image">
                                    <i class="fa-solid fa-image"></i>
                                </div>
                              `
                    }

                </div>


                <div class="khan-qv-content">

                    <span class="khan-qv-category">
                        ${product.category}
                    </span>

                    <h2>
                        ${product.name}
                    </h2>


                    <div class="khan-qv-rating">

                        <span class="khan-qv-stars">
                            ${stars}
                        </span>

                        <span>
                            ${product.rating.toFixed(1)}
                        </span>

                        <span>
                            (${product.reviews} reviews)
                        </span>

                    </div>


                    <div class="khan-qv-price">

                        <strong>
                            ${price}
                        </strong>

                        ${
                            oldPrice
                                ? `
                                    <del>
                                        ${oldPrice}
                                    </del>
                                  `
                                : ""
                        }

                    </div>


                    <p class="khan-qv-description">
                        ${
                            product.description ||
                            "Premium quality product from KHAN Store."
                        }
                    </p>


                    <div class="khan-qv-stock">

                        ${
                            product.stock > 0
                                ? `
                                    <i class="fa-solid fa-circle-check"></i>
                                    ${product.stock} in stock
                                  `
                                : `
                                    <i class="fa-solid fa-circle-xmark"></i>
                                    Out of stock
                                  `
                        }

                    </div>


                    <button
                        type="button"
                        class="khan-qv-cart"
                        ${
                            product.stock <= 0
                                ? "disabled"
                                : ""
                        }
                    >

                        <i class="fa-solid fa-cart-shopping"></i>

                        ${
                            product.stock > 0
                                ? "Add to Cart"
                                : "Out of Stock"
                        }

                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    /* Open animation */

    requestAnimationFrame(() => {
        modal.classList.add("show");
    });


    /* Close */

    function closeQuickView() {

        modal.classList.remove("show");

        setTimeout(() => {
            modal.remove();
        }, 250);
    }


    const closeButton =
        modal.querySelector(
            ".khan-qv-close"
        );

    closeButton.addEventListener(
        "click",
        closeQuickView
    );


    const overlay =
        modal.querySelector(
            ".khan-qv-overlay"
        );

    overlay.addEventListener(
        "click",
        function (e) {

            if (
                e.target === overlay
            ) {
                closeQuickView();
            }

        }
    );


    /* ESC */

    function escapeHandler(e) {

        if (e.key === "Escape") {

            closeQuickView();

            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }

    }

    document.addEventListener(
        "keydown",
        escapeHandler
    );


    /* Add To Cart from Quick View */

    const cartButton =
        modal.querySelector(
            ".khan-qv-cart"
        );

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            function () {

                if (
                    product.stock <= 0
                ) {
                    return;
                }


                /*
                   Existing KHAN Store
                   Add To Cart function
                */

                if (
                    typeof addToCart === "function"
                ) {

                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        oldPrice: product.oldPrice,
                        category: product.category,
                        image: product.image,
                        quantity: 1
                    });

                } else {

                    /*
                       Fallback localStorage
                    */

                    let cart =
                        JSON.parse(
                            localStorage.getItem(
                                "khanCart"
                            )
                        ) || [];


                    const existing =
                        cart.find(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    product.id
                                )
                        );


                    if (existing) {

                        existing.quantity += 1;

                    } else {

                        cart.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            oldPrice: product.oldPrice,
                            category: product.category,
                            image: product.image,
                            quantity: 1
                        });

                    }


                    localStorage.setItem(
                        "khanCart",
                        JSON.stringify(cart)
                    );


                    if (
                        typeof updateAllCounters ===
                        "function"
                    ) {
                        updateAllCounters();
                    }

                }


                cartButton.innerHTML =
                    `
                        <i class="fa-solid fa-check"></i>
                        Added to Cart
                    `;


                setTimeout(() => {

                    closeQuickView();

                }, 700);

            }
        );

    }

});