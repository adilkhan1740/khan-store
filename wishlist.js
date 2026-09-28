/* =========================================================
   KHAN STORE — WISHLIST PAGE
   wishlist.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const wishlistGrid = document.getElementById("wishlistGrid");
    const wishlistEmpty = document.getElementById("wishlistEmpty");
    const wishlistNoResults = document.getElementById("wishlistNoResults");

    const wishlistCount = document.getElementById("wishlistCount");
    const wishlistNavCount = document.getElementById("wishlistNavCount");
    const mobileWishlistCount = document.getElementById("mobileWishlistCount");

    const cartCount = document.getElementById("cartCount");
    const mobileCartCount = document.getElementById("mobileCartCount");

    const wishlistSearch = document.getElementById("wishlistSearch");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const clearWishlistSearch = document.getElementById("clearWishlistSearch");

    const wishlistSort = document.getElementById("wishlistSort");
    const clearWishlistBtn = document.getElementById("clearWishlistBtn");

    const wishlistResultText =
        document.getElementById("wishlistResultText");

    const currentYear =
        document.getElementById("currentYear");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    const toast =
        document.getElementById("wishlistToast");

    const toastTitle =
        document.getElementById("wishlistToastTitle");

    const toastMessage =
        document.getElementById("wishlistToastMessage");

    const toastClose =
        document.getElementById("wishlistToastClose");


    /* =====================================================
       STORAGE KEYS
    ====================================================== */

    const WISHLIST_KEY = "khanWishlist";
    const CART_KEY = "khanCart";


    /* =====================================================
       STATE
    ====================================================== */

    let wishlist = [];
    let cart = [];

    let currentSearch = "";
    let currentSort = "default";

    let toastTimer = null;


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       SAFE JSON PARSER
    ====================================================== */

    function readStorage(key, fallback = []) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);

            return Array.isArray(parsed) ? parsed : fallback;

        } catch (error) {
            console.warn(`Unable to read ${key}:`, error);
            return fallback;
        }
    }


    /* =====================================================
       LOAD STORAGE
    ====================================================== */

    function loadStorage() {
        wishlist = readStorage(WISHLIST_KEY, []);
        cart = readStorage(CART_KEY, []);

        normalizeWishlist();
        normalizeCart();
    }


    /* =====================================================
       NORMALIZE WISHLIST
    ====================================================== */

    function normalizeWishlist() {
        wishlist = wishlist
            .filter(item => item && typeof item === "object")
            .map((item, index) => {

                const id =
                    item.id ??
                    item.productId ??
                    item._id ??
                    item.sku ??
                    `wishlist-${index}-${Date.now()}`;

                const title =
                    item.title ??
                    item.name ??
                    item.productName ??
                    "Product";

                const price =
                    Number(
                        item.price ??
                        item.currentPrice ??
                        0
                    ) || 0;

                const oldPrice =
                    Number(
                        item.oldPrice ??
                        item.originalPrice ??
                        0
                    ) || 0;

                const rating =
                    Number(item.rating ?? 0) || 0;

                const reviews =
                    Number(
                        item.reviews ??
                        item.reviewCount ??
                        0
                    ) || 0;

                const image =
                    item.image ??
                    item.imageUrl ??
                    item.thumbnail ??
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

                return {
                    ...item,
                    id: String(id),
                    title: String(title),
                    name: String(title),
                    price,
                    oldPrice,
                    rating,
                    reviews,
                    image,
                    category:
                        item.category ??
                        item.type ??
                        "Electronics",
                    discount:
                        Number(item.discount ?? 0) || calculateDiscount(
                            price,
                            oldPrice
                        ),
                    addedAt:
                        Number(item.addedAt ?? item.createdAt ?? 0) ||
                        Date.now() - index
                };
            });
    }


    /* =====================================================
       NORMALIZE CART
    ====================================================== */

    function normalizeCart() {
        cart = cart
            .filter(item => item && typeof item === "object")
            .map((item, index) => {

                const id =
                    item.id ??
                    item.productId ??
                    item._id ??
                    item.sku ??
                    `cart-${index}`;

                const price =
                    Number(
                        item.price ??
                        item.currentPrice ??
                        0
                    ) || 0;

                const quantity =
                    Math.max(
                        1,
                        Number(item.quantity ?? 1) || 1
                    );

                return {
                    ...item,
                    id: String(id),
                    price,
                    quantity
                };
            });
    }


    /* =====================================================
       CALCULATE DISCOUNT
    ====================================================== */

    function calculateDiscount(price, oldPrice) {

        if (
            !oldPrice ||
            oldPrice <= price ||
            price <= 0
        ) {
            return 0;
        }

        return Math.round(
            ((oldPrice - price) / oldPrice) * 100
        );
    }


    /* =====================================================
       SAVE WISHLIST
    ====================================================== */

    function saveWishlist() {
        try {
            localStorage.setItem(
                WISHLIST_KEY,
                JSON.stringify(wishlist)
            );

        } catch (error) {
            console.warn("Unable to save wishlist:", error);
        }
    }


    /* =====================================================
       SAVE CART
    ====================================================== */

    function saveCart() {
        try {
            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {
            console.warn("Unable to save cart:", error);
        }
    }


    /* =====================================================
       CART COUNT
    ====================================================== */

    function updateCartCount() {

        const totalItems = cart.reduce(
            (total, item) => {
                return total + (
                    Number(item.quantity) || 1
                );
            },
            0
        );

        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        if (mobileCartCount) {
            mobileCartCount.textContent = totalItems;
        }
    }


    /* =====================================================
       WISHLIST COUNT
    ====================================================== */

    function updateWishlistCount() {

        const total = wishlist.length;

        if (wishlistCount) {
            wishlistCount.textContent = total;
        }

        if (wishlistNavCount) {
            wishlistNavCount.textContent = total;
        }

        if (mobileWishlistCount) {
            mobileWishlistCount.textContent = total;
        }
    }


    /* =====================================================
       ESCAPE HTML
    ====================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       FORMAT PRICE
    ====================================================== */

    function formatPrice(price) {

        const number = Number(price) || 0;

        return "₹" + number.toLocaleString("en-IN");
    }


    /* =====================================================
       RATING STARS
    ====================================================== */

    function renderStars(rating) {

        const value = Math.max(
            0,
            Math.min(5, Number(rating) || 0)
        );

        const rounded = Math.round(value);

        let stars = "";

        for (let i = 1; i <= 5; i++) {

            if (i <= rounded) {
                stars += `
                    <i class="fa-solid fa-star"></i>
                `;
            } else {
                stars += `
                    <i class="fa-regular fa-star"></i>
                `;
            }
        }

        return stars;
    }


    /* =====================================================
       GET FILTERED PRODUCTS
    ====================================================== */

    function getVisibleWishlist() {

        let products = [...wishlist];

        const search =
            currentSearch.trim().toLowerCase();

        if (search) {

            products = products.filter(product => {

                const searchableText = [
                    product.title,
                    product.name,
                    product.category,
                    product.brand,
                    product.description
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(search);
            });
        }


        /* Sorting */

        switch (currentSort) {

            case "price-low":

                products.sort(
                    (a, b) =>
                        Number(a.price) - Number(b.price)
                );

                break;


            case "price-high":

                products.sort(
                    (a, b) =>
                        Number(b.price) - Number(a.price)
                );

                break;


            case "rating":

                products.sort(
                    (a, b) =>
                        Number(b.rating) - Number(a.rating)
                );

                break;


            case "name":

                products.sort(
                    (a, b) =>
                        String(a.title).localeCompare(
                            String(b.title)
                        )
                );

                break;


            case "default":

            default:

                products.sort(
                    (a, b) =>
                        Number(b.addedAt || 0) -
                        Number(a.addedAt || 0)
                );

                break;
        }

        return products;
    }


    /* =====================================================
       RENDER WISHLIST
    ====================================================== */

    function renderWishlist() {

        if (!wishlistGrid) {
            return;
        }

        const visibleProducts =
            getVisibleWishlist();


        /* Update counters */

        updateWishlistCount();
        updateCartCount();


        /* Completely empty wishlist */

        if (wishlist.length === 0) {

            wishlistGrid.innerHTML = "";

            wishlistGrid.hidden = true;

            if (wishlistNoResults) {
                wishlistNoResults.hidden = true;
            }

            if (wishlistEmpty) {
                wishlistEmpty.hidden = false;
            }

            if (wishlistResultText) {
                wishlistResultText.textContent =
                    "Your wishlist is empty";
            }

            return;
        }


        /* Wishlist has products */

        if (wishlistEmpty) {
            wishlistEmpty.hidden = true;
        }


        /* Search found nothing */

        if (visibleProducts.length === 0) {

            wishlistGrid.innerHTML = "";

            wishlistGrid.hidden = true;

            if (wishlistNoResults) {
                wishlistNoResults.hidden = false;
            }

            if (wishlistResultText) {
                wishlistResultText.textContent =
                    `No products found for "${currentSearch}"`;
            }

            return;
        }


        /* Products found */

        if (wishlistNoResults) {
            wishlistNoResults.hidden = true;
        }

        wishlistGrid.hidden = false;


        wishlistGrid.innerHTML =
            visibleProducts
                .map(product => createProductCard(product))
                .join("");


        if (wishlistResultText) {

            if (currentSearch) {

                wishlistResultText.textContent =
                    `Showing ${visibleProducts.length} matching product${
                        visibleProducts.length === 1 ? "" : "s"
                    }`;

            } else {

                wishlistResultText.textContent =
                    `Showing ${visibleProducts.length} saved product${
                        visibleProducts.length === 1 ? "" : "s"
                    }`;
            }
        }
    }


    /* =====================================================
       CREATE PRODUCT CARD
    ====================================================== */

    function createProductCard(product) {

        const id =
            escapeHTML(product.id);

        const title =
            escapeHTML(product.title);

        const category =
            escapeHTML(product.category || "Electronics");

        const image =
            escapeHTML(product.image);

        const price =
            Number(product.price) || 0;

        const oldPrice =
            Number(product.oldPrice) || 0;

        const rating =
            Number(product.rating) || 0;

        const reviews =
            Number(product.reviews) || 0;

        const discount =
            Number(product.discount) ||
            calculateDiscount(price, oldPrice);


        const oldPriceHTML =
            oldPrice > price
                ? `
                    <span class="wishlist-old-price">
                        ${formatPrice(oldPrice)}
                    </span>
                `
                : "";


        const discountHTML =
            discount > 0
                ? `
                    <span class="wishlist-discount">
                        ${discount}% OFF
                    </span>
                `
                : "";


        return `
            <article
                class="wishlist-product-card"
                data-product-id="${id}"
            >

                <div class="wishlist-product-image">

                    ${
                        discount > 0
                            ? `
                                <span class="wishlist-product-badge">
                                    ${discount}% OFF
                                </span>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="wishlist-remove-btn"
                        data-action="remove"
                        data-id="${id}"
                        aria-label="Remove ${title} from wishlist"
                        title="Remove from wishlist"
                    >
                        <i class="fa-solid fa-heart"></i>
                    </button>

                    <img
                        src="${image}"
                        alt="${title}"
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'"
                    >

                </div>


                <div class="wishlist-product-content">

                    <div class="wishlist-product-category">
                        ${category}
                    </div>

                    <h2 class="wishlist-product-title">
                        ${title}
                    </h2>


                    <div class="wishlist-product-rating">

                        <span class="wishlist-stars">
                            ${renderStars(rating)}
                        </span>

                        <span class="wishlist-rating-value">
                            ${rating.toFixed(1)}
                            ${
                                reviews > 0
                                    ? `(${reviews})`
                                    : ""
                            }
                        </span>

                    </div>


                    <div class="wishlist-product-price">

                        <span class="wishlist-current-price">
                            ${formatPrice(price)}
                        </span>

                        ${oldPriceHTML}

                        ${discountHTML}

                    </div>


                    <div class="wishlist-product-actions">

                        <button
                            type="button"
                            class="wishlist-add-cart-btn"
                            data-action="cart"
                            data-id="${id}"
                        >
                            <i class="fa-solid fa-cart-plus"></i>
                            Add to Cart
                        </button>


                        <button
                            type="button"
                            class="wishlist-view-btn"
                            data-action="view"
                            data-id="${id}"
                            title="View product"
                            aria-label="View ${title}"
                        >
                            <i class="fa-solid fa-eye"></i>
                        </button>

                    </div>

                </div>

            </article>
        `;
    }


    /* =====================================================
       FIND WISHLIST PRODUCT
    ====================================================== */

    function findWishlistProduct(id) {

        return wishlist.find(
            product => String(product.id) === String(id)
        );
    }


    /* =====================================================
       REMOVE PRODUCT
    ====================================================== */

    function removeFromWishlist(id) {

        const product =
            findWishlistProduct(id);

        if (!product) {
            return;
        }

        wishlist =
            wishlist.filter(
                item =>
                    String(item.id) !== String(id)
            );

        saveWishlist();

        renderWishlist();

        showToast(
            "Removed",
            `${product.title} was removed from your wishlist.`
        );
    }


    /* =====================================================
       ADD TO CART
    ====================================================== */

    function addToCart(id) {

        const product =
            findWishlistProduct(id);

        if (!product) {
            return;
        }


        const existingIndex =
            cart.findIndex(
                item =>
                    String(
                        item.id ??
                        item.productId
                    ) === String(id)
            );


        if (existingIndex !== -1) {

            const currentQuantity =
                Number(
                    cart[existingIndex].quantity
                ) || 1;

            cart[existingIndex].quantity =
                Math.min(
                    currentQuantity + 1,
                    10
                );

        } else {

            cart.push({
                ...product,
                id: String(product.id),
                name: product.title,
                quantity: 1
            });
        }


        saveCart();

        updateCartCount();

        showToast(
            "Added to Cart",
            `${product.title} has been added to your cart.`
        );
    }


    /* =====================================================
       VIEW PRODUCT
    ====================================================== */

    function viewProduct(id) {

        const product =
            findWishlistProduct(id);

        if (!product) {
            return;
        }


        /*
         * Product-details page is optional in the current
         * project flow. We keep the product ID in the URL
         * so it can be used later when that page is finalized.
         */

        const productId =
            encodeURIComponent(product.id);

        window.location.href =
            `products.html?product=${productId}`;
    }


    /* =====================================================
       CLEAR WISHLIST
    ====================================================== */

    function clearWishlist() {

        if (wishlist.length === 0) {

            showToast(
                "Wishlist Empty",
                "There are no saved products to remove."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to clear your entire wishlist?"
            );


        if (!confirmed) {
            return;
        }


        wishlist = [];

        saveWishlist();

        currentSearch = "";

        if (wishlistSearch) {
            wishlistSearch.value = "";
        }

        if (clearSearchBtn) {
            clearSearchBtn.style.display = "none";
        }

        renderWishlist();

        showToast(
            "Wishlist Cleared",
            "All saved products have been removed."
        );
    }


    /* =====================================================
       SEARCH
    ====================================================== */

    function handleSearch() {

        currentSearch =
            wishlistSearch
                ? wishlistSearch.value.trim()
                : "";


        if (clearSearchBtn) {

            clearSearchBtn.style.display =
                currentSearch
                    ? "flex"
                    : "none";
        }


        renderWishlist();
    }


    /* =====================================================
       CLEAR SEARCH
    ====================================================== */

    function clearSearch() {

        currentSearch = "";

        if (wishlistSearch) {
            wishlistSearch.value = "";
            wishlistSearch.focus();
        }

        if (clearSearchBtn) {
            clearSearchBtn.style.display = "none";
        }

        renderWishlist();
    }


    /* =====================================================
       SORT
    ====================================================== */

    function handleSort() {

        currentSort =
            wishlistSort
                ? wishlistSort.value
                : "default";

        renderWishlist();
    }


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(title, message) {

        if (!toast) {
            return;
        }


        if (toastTimer) {
            clearTimeout(toastTimer);
        }


        if (toastTitle) {
            toastTitle.textContent =
                title || "Success";
        }


        if (toastMessage) {
            toastMessage.textContent =
                message || "";
        }


        toast.classList.add("show");


        toastTimer =
            setTimeout(() => {
                hideToast();
            }, 3500);
    }


    function hideToast() {

        if (!toast) {
            return;
        }

        toast.classList.remove("show");

        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
    }


    /* =====================================================
       MOBILE MENU
    ====================================================== */

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
            "Close menu"
        );

        mobileMenuBtn.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';
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
            "Open menu"
        );

        mobileMenuBtn.innerHTML =
            '<i class="fa-solid fa-bars"></i>';
    }


    function toggleMobileMenu() {

        if (!mobileNav) {
            return;
        }

        if (mobileNav.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }


    /* =====================================================
       EVENT — MOBILE MENU
    ====================================================== */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            toggleMobileMenu
        );
    }


    /* =====================================================
       CLOSE MOBILE MENU AFTER LINK CLICK
    ====================================================== */

    if (mobileNav) {

        mobileNav
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );
            });
    }


    /* =====================================================
       EVENT — PRODUCT ACTIONS
    ====================================================== */

    if (wishlistGrid) {

        wishlistGrid.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;

                const id =
                    button.dataset.id;


                if (!id) {
                    return;
                }


                if (action === "remove") {

                    removeFromWishlist(id);

                    return;
                }


                if (action === "cart") {

                    addToCart(id);

                    return;
                }


                if (action === "view") {

                    viewProduct(id);

                    return;
                }
            }
        );
    }


    /* =====================================================
       EVENT — SEARCH
    ====================================================== */

    if (wishlistSearch) {

        wishlistSearch.addEventListener(
            "input",
            handleSearch
        );
    }


    if (clearSearchBtn) {

        clearSearchBtn.addEventListener(
            "click",
            clearSearch
        );
    }


    if (clearWishlistSearch) {

        clearWishlistSearch.addEventListener(
            "click",
            clearSearch
        );
    }


    /* =====================================================
       EVENT — SORT
    ====================================================== */

    if (wishlistSort) {

        wishlistSort.addEventListener(
            "change",
            handleSort
        );
    }


    /* =====================================================
       EVENT — CLEAR WISHLIST
    ====================================================== */

    if (clearWishlistBtn) {

        clearWishlistBtn.addEventListener(
            "click",
            clearWishlist
        );
    }


    /* =====================================================
       EVENT — TOAST CLOSE
    ====================================================== */

    if (toastClose) {

        toastClose.addEventListener(
            "click",
            hideToast
        );
    }


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                hideToast();
                closeMobileMenu();

            }
        }
    );


    /* =====================================================
       CLICK OUTSIDE MOBILE NAV
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !mobileNav ||
                !mobileMenuBtn
            ) {
                return;
            }


            if (
                mobileNav.classList.contains("active") &&
                !mobileNav.contains(event.target) &&
                !mobileMenuBtn.contains(event.target)
            ) {
                closeMobileMenu();
            }
        }
    );


    /* =====================================================
       STORAGE EVENT
       Sync wishlist/cart between browser tabs.
    ====================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === WISHLIST_KEY ||
                event.key === CART_KEY
            ) {

                loadStorage();
                renderWishlist();
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
                window.innerWidth > 900
            ) {
                closeMobileMenu();
            }
        }
    );


    /* =====================================================
       INITIALIZE
    ====================================================== */

    loadStorage();

    renderWishlist();


    /* =====================================================
       READY
    ====================================================== */

    console.log(
        "KHAN Store Wishlist initialized successfully."
    );

});