/* =========================================================
   KHAN STORE — PRODUCTS PAGE
   products.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const defaultProducts = [
        {
            id: "galaxy-pro-max-5g",
            name: "Galaxy Pro Max 5G Smartphone",
            category: "Smartphone",
            price: 59999,
            oldPrice: 74999,
            discount: 20,
            rating: 4.8,
            reviews: 324,
            image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85",
            description:
                "Premium 5G smartphone with a powerful processor, vibrant display, advanced camera system and long-lasting battery.",
            featured: true
        },

        {
            id: "ultrabook-pro-m3",
            name: "UltraBook Pro M3 Laptop",
            category: "Laptop",
            price: 89999,
            oldPrice: 109999,
            discount: 18,
            rating: 4.9,
            reviews: 187,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
            description:
                "Slim premium laptop designed for productivity, development, entertainment and everyday professional work.",
            featured: true
        },

        {
            id: "premium-wireless-headphones",
            name: "Premium Wireless Headphones",
            category: "Headphones",
            price: 4999,
            oldPrice: 6999,
            discount: 29,
            rating: 4.7,
            reviews: 268,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
            description:
                "Immersive wireless headphones with rich sound, comfortable ear cushions and dependable battery life.",
            featured: true
        },

        {
            id: "iphone-15-pro",
            name: "iPhone 15 Pro",
            category: "Smartphone",
            price: 109999,
            oldPrice: 134999,
            discount: 19,
            rating: 4.9,
            reviews: 512,
            image: "https://images.unsplash.com/photo-1592286927505-2fd0f3f7f3f1?auto=format&fit=crop&w=900&q=85",
            description:
                "Premium smartphone featuring a high-performance chip, professional camera system and premium build.",
            featured: true
        },

        {
            id: "samsung-galaxy-s24",
            name: "Samsung Galaxy S24",
            category: "Smartphone",
            price: 69999,
            oldPrice: 84999,
            discount: 18,
            rating: 4.8,
            reviews: 396,
            image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85",
            description:
                "Modern flagship smartphone with a bright display, advanced cameras and powerful performance.",
            featured: true
        },

        {
            id: "sony-wh1000xm5",
            name: "Sony WH-1000XM5",
            category: "Headphones",
            price: 29999,
            oldPrice: 34999,
            discount: 14,
            rating: 4.9,
            reviews: 441,
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85",
            description:
                "Premium noise-cancelling headphones with detailed audio and a comfortable wireless design.",
            featured: true
        },

        {
            id: "apple-watch-series-9",
            name: "Apple Watch Series 9",
            category: "Smart Watch",
            price: 41999,
            oldPrice: 45999,
            discount: 9,
            rating: 4.8,
            reviews: 214,
            image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85",
            description:
                "Smart wearable with fitness tracking, notifications, health features and a premium display.",
            featured: false
        },

        {
            id: "macbook-air-m2",
            name: "MacBook Air M2",
            category: "Laptop",
            price: 89999,
            oldPrice: 99999,
            discount: 10,
            rating: 4.9,
            reviews: 287,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
            description:
                "Lightweight performance laptop with efficient processing, excellent battery life and a premium design.",
            featured: true
        },

        {
            id: "premium-wireless-earbuds",
            name: "Premium Wireless Earbuds",
            category: "Earbuds",
            price: 4999,
            oldPrice: 6999,
            discount: 29,
            rating: 4.6,
            reviews: 351,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85",
            description:
                "Compact wireless earbuds with clear sound, comfortable fit and convenient charging case.",
            featured: true
        },

        {
            id: "smart-watch-pro",
            name: "Smart Watch Pro",
            category: "Smart Watch",
            price: 7499,
            oldPrice: 9999,
            discount: 25,
            rating: 4.5,
            reviews: 176,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
            description:
                "Modern smartwatch with activity tracking, notifications and an everyday premium look.",
            featured: false
        },

        {
            id: "fast-charging-powerbank",
            name: "Fast Charging Power Bank",
            category: "Accessories",
            price: 2499,
            oldPrice: 3499,
            discount: 29,
            rating: 4.5,
            reviews: 143,
            image: "https://images.unsplash.com/photo-1609592424674-6c1f6b2a7b52?auto=format&fit=crop&w=900&q=85",
            description:
                "Portable high-capacity power bank designed for convenient charging while travelling or working.",
            featured: false
        },

        {
            id: "premium-usb-c-hub",
            name: "Premium USB-C Multiport Hub",
            category: "Accessories",
            price: 2999,
            oldPrice: 3999,
            discount: 25,
            rating: 4.4,
            reviews: 119,
            image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=85",
            description:
                "Compact multiport USB-C hub with multiple connectivity options for laptops and modern devices.",
            featured: false
        }
    ];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const productsGrid =
        document.getElementById("productsGrid");

    const productCountText =
        document.getElementById("productCountText");

    const resultCount =
        document.getElementById("resultCount");

    const productSearch =
        document.getElementById("productSearch");

    const clearSearchBtn =
        document.getElementById("clearSearchBtn");

    const sortProducts =
        document.getElementById("sortProducts");

    const categoryButtons =
        document.querySelectorAll(".category-filter");

    const ratingButtons =
        document.querySelectorAll(".rating-filter");

    const minPrice =
        document.getElementById("minPrice");

    const maxPrice =
        document.getElementById("maxPrice");

    const applyPriceBtn =
        document.getElementById("applyPriceBtn");

    const clearFiltersBtn =
        document.getElementById("clearFiltersBtn");

    const noResultsClearBtn =
        document.getElementById("noResultsClearBtn");

    const productsNoResults =
        document.getElementById("productsNoResults");

    const activeFilters =
        document.getElementById("activeFilters");

    const allCategoryCount =
        document.getElementById("allCategoryCount");

    const filterMobileBtn =
        document.getElementById("filterMobileBtn");

    const productsSidebar =
        document.getElementById("productsSidebar");

    const closeFilterBtn =
        document.getElementById("closeFilterBtn");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const quickViewModal =
        document.getElementById("quickViewModal");

    const quickViewContent =
        document.getElementById("quickViewContent");

    const quickViewClose =
        document.getElementById("quickViewClose");

    const quickViewOverlay =
        document.querySelector(".quick-view-overlay");

    const toast =
        document.getElementById("productsToast");

    const toastMessage =
        document.getElementById("toastMessage");

    const currentYear =
        document.getElementById("currentYear");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    const cartCount =
        document.getElementById("cartCount");

    const mobileCartCount =
        document.getElementById("mobileCartCount");

    const wishlistCount =
        document.getElementById("wishlistCount");

    const mobileWishlistCount =
        document.getElementById("mobileWishlistCount");


    /* =====================================================
       STATE
    ===================================================== */

    let products = [];
    let filteredProducts = [];

    let currentCategory = "all";
    let currentRating = 0;

    let currentMinPrice = 0;
    let currentMaxPrice = Infinity;

    let searchTerm = "";
    let currentSort = "featured";

    let toastTimer = null;


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function getStorageArray(key) {
        try {
            const value =
                JSON.parse(localStorage.getItem(key) || "[]");

            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error(
                `Unable to read ${key}:`,
                error
            );

            return [];
        }
    }


    function saveStorageArray(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (error) {
            console.error(
                `Unable to save ${key}:`,
                error
            );
        }
    }


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    function loadProducts() {

        const savedProducts =
            getStorageArray("khanProducts");

        /*
         * Admin products can override/add products.
         * If no admin products exist, use the built-in
         * KHAN Store catalogue.
         */

        if (savedProducts.length > 0) {

            const normalizedAdminProducts =
                savedProducts.map(normalizeProduct);

            const defaultMap = new Map(
                defaultProducts.map(product => [
                    product.id,
                    product
                ])
            );

            normalizedAdminProducts.forEach(product => {
                defaultMap.set(product.id, product);
            });

            products = Array.from(defaultMap.values());

        } else {

            products =
                defaultProducts.map(normalizeProduct);
        }

        filteredProducts = [...products];

        updateCategoryCounts();
        applyFilters();
    }


    /* =====================================================
       NORMALIZE PRODUCT
    ===================================================== */

    function normalizeProduct(product) {

        const price =
            Number(product.price) || 0;

        const oldPrice =
            Number(product.oldPrice || product.originalPrice) ||
            price;

        let discount =
            Number(product.discount);

        if (!discount && oldPrice > price) {
            discount =
                Math.round(
                    ((oldPrice - price) / oldPrice) * 100
                );
        }

        return {
            id:
                String(
                    product.id ||
                    product._id ||
                    `product-${Date.now()}`
                ),

            name:
                product.name ||
                product.title ||
                "KHAN Store Product",

            category:
                product.category ||
                "Accessories",

            price,

            oldPrice,

            discount,

            rating:
                Number(product.rating) || 4.5,

            reviews:
                Number(product.reviews || product.reviewCount) || 0,

            image:
                product.image ||
                product.imageUrl ||
                "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=900&q=85",

            description:
                product.description ||
                "Premium technology product from KHAN Store.",

            featured:
                Boolean(product.featured)
        };
    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(value) {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       WISHLIST
    ===================================================== */

    function getWishlist() {
        return getStorageArray("khanWishlist");
    }


    function isInWishlist(productId) {

        const wishlist = getWishlist();

        return wishlist.some(
            item => String(item.id) === String(productId)
        );
    }


    function toggleWishlist(productId) {

        const product =
            products.find(
                item =>
                    String(item.id) === String(productId)
            );

        if (!product) return;

        let wishlist = getWishlist();

        const existingIndex =
            wishlist.findIndex(
                item =>
                    String(item.id) === String(productId)
            );

        if (existingIndex !== -1) {

            wishlist.splice(existingIndex, 1);

            showToast(
                "Product removed from wishlist"
            );

        } else {

            wishlist.push({
                ...product,
                quantity: 1
            });

            showToast(
                "Product added to wishlist"
            );
        }

        saveStorageArray(
            "khanWishlist",
            wishlist
        );

        updateWishlistCount();
        renderProducts();
    }


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {
        return getStorageArray("khanCart");
    }


    function addToCart(productId) {

        const product =
            products.find(
                item =>
                    String(item.id) === String(productId)
            );

        if (!product) return;

        let cart = getCart();

        const existing =
            cart.find(
                item =>
                    String(item.id) === String(productId)
            );

        if (existing) {

            const currentQuantity =
                Number(existing.quantity) || 0;

            if (currentQuantity >= 10) {

                showToast(
                    "Maximum quantity is 10"
                );

                return;
            }

            existing.quantity =
                currentQuantity + 1;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                oldPrice: product.oldPrice,
                discount: product.discount,
                rating: product.rating,
                reviews: product.reviews,
                image: product.image,
                quantity: 1
            });
        }

        saveStorageArray(
            "khanCart",
            cart
        );

        updateCartCount();

        showToast(
            `${product.name} added to cart`
        );
    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cart = getCart();

        const total =
            cart.reduce(
                (sum, item) =>
                    sum + (Number(item.quantity) || 0),
                0
            );

        if (cartCount) {
            cartCount.textContent = total;

            cartCount.style.display =
                total > 0
                    ? "inline-flex"
                    : "none";
        }

        if (mobileCartCount) {
            mobileCartCount.textContent = total;

            mobileCartCount.style.display =
                total > 0
                    ? "inline-flex"
                    : "none";
        }
    }


    /* =====================================================
       WISHLIST COUNT
    ===================================================== */

    function updateWishlistCount() {

        const wishlist =
            getWishlist();

        const total =
            wishlist.length;

        if (wishlistCount) {

            wishlistCount.textContent =
                total;

            wishlistCount.style.display =
                total > 0
                    ? "inline-flex"
                    : "none";
        }

        if (mobileWishlistCount) {

            mobileWishlistCount.textContent =
                total;

            mobileWishlistCount.style.display =
                total > 0
                    ? "inline-flex"
                    : "none";
        }
    }


    /* =====================================================
       STAR HTML
    ===================================================== */

    function createStars(rating) {

        let html = "";

        const rounded =
            Math.round(Number(rating));

        for (let i = 1; i <= 5; i++) {

            html +=
                i <= rounded
                    ? "★"
                    : "☆";
        }

        return html;
    }


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts() {

        if (!productsGrid) return;

        if (!filteredProducts.length) {

            productsGrid.innerHTML = "";

            if (productsNoResults) {
                productsNoResults.hidden = false;
            }

            updateResultText();

            return;
        }

        if (productsNoResults) {
            productsNoResults.hidden = true;
        }

        productsGrid.innerHTML =
            filteredProducts
                .map(createProductCard)
                .join("");

        updateResultText();
    }


    /* =====================================================
       PRODUCT CARD
    ===================================================== */

    function createProductCard(product) {

        const safeId =
            escapeHTML(product.id);

        const safeName =
            escapeHTML(product.name);

        const safeCategory =
            escapeHTML(product.category);

        const safeImage =
            escapeHTML(product.image);

        const wishlistActive =
            isInWishlist(product.id);

        return `
            <article
                class="product-card"
                data-product-id="${safeId}"
            >

                <div class="product-card-image">

                    ${
                        product.discount > 0
                            ? `
                                <span class="product-discount-badge">
                                    ${product.discount}% OFF
                                </span>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="product-wishlist-btn ${
                            wishlistActive ? "active" : ""
                        }"
                        data-action="wishlist"
                        data-id="${safeId}"
                        aria-label="${
                            wishlistActive
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }"
                    >
                        <i class="${
                            wishlistActive
                                ? "fa-solid"
                                : "fa-regular"
                        } fa-heart"></i>
                    </button>


                    <img
                        src="${safeImage}"
                        alt="${safeName}"
                        loading="lazy"
                        onerror="
                            this.src='https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=900&q=85'
                        "
                    >


                    <button
                        type="button"
                        class="product-quick-view-btn"
                        data-action="quick-view"
                        data-id="${safeId}"
                    >
                        <i class="fa-solid fa-eye"></i>
                        Quick View
                    </button>

                </div>


                <div class="product-card-body">

                    <div class="product-category">
                        ${safeCategory}
                    </div>


                    <h2 class="product-card-title">
                        ${safeName}
                    </h2>


                    <div class="product-rating-row">

                        <span class="product-stars">
                            ${createStars(product.rating)}
                        </span>

                        <span class="product-rating-number">
                            ${Number(product.rating).toFixed(1)}
                        </span>

                        <span class="product-review-count">
                            (${product.reviews})
                        </span>

                    </div>


                    <div class="product-price-row">

                        <strong class="product-current-price">
                            ${formatPrice(product.price)}
                        </strong>

                        ${
                            product.oldPrice > product.price
                                ? `
                                    <del class="product-old-price">
                                        ${formatPrice(product.oldPrice)}
                                    </del>
                                `
                                : ""
                        }

                        ${
                            product.discount > 0
                                ? `
                                    <span class="product-save">
                                        Save ${product.discount}%
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="product-add-cart-btn"
                        data-action="cart"
                        data-id="${safeId}"
                    >
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart
                    </button>

                </div>

            </article>
        `;
    }


    /* =====================================================
       FILTER PRODUCTS
    ===================================================== */

    function applyFilters() {

        const normalizedSearch =
            searchTerm.trim().toLowerCase();

        filteredProducts =
            products.filter(product => {

                const matchesSearch =
                    !normalizedSearch ||
                    product.name
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    product.category
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    product.description
                        .toLowerCase()
                        .includes(normalizedSearch);

                const matchesCategory =
                    currentCategory === "all" ||
                    product.category === currentCategory;

                const matchesRating =
                    currentRating === 0 ||
                    Number(product.rating) >= currentRating;

                const matchesMinPrice =
                    Number(product.price) >=
                    currentMinPrice;

                const matchesMaxPrice =
                    Number(product.price) <=
                    currentMaxPrice;

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesRating &&
                    matchesMinPrice &&
                    matchesMaxPrice
                );
            });


        sortFilteredProducts();

        renderProducts();
        renderActiveFilters();
    }


    /* =====================================================
       SORT
    ===================================================== */

    function sortFilteredProducts() {

        filteredProducts.sort((a, b) => {

            switch (currentSort) {

                case "price-low":
                    return a.price - b.price;

                case "price-high":
                    return b.price - a.price;

                case "rating":
                    return b.rating - a.rating;

                case "discount":
                    return b.discount - a.discount;

                case "name":
                    return a.name.localeCompare(
                        b.name
                    );

                case "featured":
                default:

                    if (
                        Boolean(a.featured) !==
                        Boolean(b.featured)
                    ) {
                        return a.featured
                            ? -1
                            : 1;
                    }

                    return (
                        b.rating - a.rating
                    );
            }
        });
    }


    /* =====================================================
       RESULT TEXT
    ===================================================== */

    function updateResultText() {

        if (resultCount) {

            resultCount.textContent =
                `${filteredProducts.length} ${
                    filteredProducts.length === 1
                        ? "product"
                        : "products"
                }`;
        }

        if (productCountText) {

            if (currentCategory === "all") {

                productCountText.textContent =
                    "All Products";

            } else {

                productCountText.textContent =
                    currentCategory;
            }
        }
    }


    /* =====================================================
       CATEGORY COUNTS
    ===================================================== */

    function updateCategoryCounts() {

        if (allCategoryCount) {
            allCategoryCount.textContent =
                products.length;
        }

        document
            .querySelectorAll(
                "[data-count-category]"
            )
            .forEach(element => {

                const category =
                    element.dataset.countCategory;

                const count =
                    products.filter(
                        product =>
                            product.category === category
                    ).length;

                element.textContent = count;
            });
    }


    /* =====================================================
       ACTIVE FILTER CHIPS
    ===================================================== */

    function renderActiveFilters() {

        if (!activeFilters) return;

        const chips = [];

        if (searchTerm.trim()) {

            chips.push(`
                <div class="active-filter-chip">
                    Search: ${escapeHTML(searchTerm)}

                    <button
                        type="button"
                        data-remove-filter="search"
                        aria-label="Remove search filter"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `);
        }

        if (currentCategory !== "all") {

            chips.push(`
                <div class="active-filter-chip">
                    ${escapeHTML(currentCategory)}

                    <button
                        type="button"
                        data-remove-filter="category"
                        aria-label="Remove category filter"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `);
        }

        if (currentRating > 0) {

            chips.push(`
                <div class="active-filter-chip">
                    ${currentRating}★ & above

                    <button
                        type="button"
                        data-remove-filter="rating"
                        aria-label="Remove rating filter"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `);
        }

        if (
            currentMinPrice > 0 ||
            currentMaxPrice !== Infinity
        ) {

            const minText =
                currentMinPrice > 0
                    ? formatPrice(currentMinPrice)
                    : "₹0";

            const maxText =
                currentMaxPrice !== Infinity
                    ? formatPrice(currentMaxPrice)
                    : "Any";

            chips.push(`
                <div class="active-filter-chip">
                    ${minText} - ${maxText}

                    <button
                        type="button"
                        data-remove-filter="price"
                        aria-label="Remove price filter"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `);
        }

        activeFilters.innerHTML =
            chips.join("");
    }


    /* =====================================================
       CLEAR ALL FILTERS
    ===================================================== */

    function clearAllFilters() {

        currentCategory = "all";
        currentRating = 0;

        currentMinPrice = 0;
        currentMaxPrice = Infinity;

        searchTerm = "";

        if (productSearch) {
            productSearch.value = "";
        }

        if (minPrice) {
            minPrice.value = "";
        }

        if (maxPrice) {
            maxPrice.value = "";
        }

        if (clearSearchBtn) {
            clearSearchBtn.classList.remove("show");
        }

        if (sortProducts) {
            sortProducts.value = "featured";
        }

        currentSort = "featured";

        categoryButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === "all"
            );
        });

        ratingButtons.forEach(button => {
            button.classList.remove("active");
        });

        applyFilters();
    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    function openFilters() {

        if (productsSidebar) {
            productsSidebar.classList.add("active");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }


    function closeFilters() {

        if (productsSidebar) {
            productsSidebar.classList.remove("active");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";
    }


    /* =====================================================
       QUICK VIEW
    ===================================================== */

    function openQuickView(productId) {

        const product =
            products.find(
                item =>
                    String(item.id) ===
                    String(productId)
            );

        if (!product || !quickViewModal) return;

        quickViewContent.innerHTML = `

            <div class="quick-view-grid">

                <div class="quick-view-image">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        onerror="
                            this.src='https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=900&q=85'
                        "
                    >

                </div>


                <div class="quick-view-info">

                    <span class="quick-view-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h2>
                        ${escapeHTML(product.name)}
                    </h2>


                    <div class="quick-view-rating">

                        <span class="stars">
                            ${createStars(product.rating)}
                        </span>

                        <strong>
                            ${Number(product.rating).toFixed(1)}
                        </strong>

                        <span>
                            (${product.reviews} reviews)
                        </span>

                    </div>


                    <p class="quick-view-description">
                        ${escapeHTML(product.description)}
                    </p>


                    <div class="quick-view-price">

                        <strong>
                            ${formatPrice(product.price)}
                        </strong>

                        ${
                            product.oldPrice > product.price
                                ? `
                                    <del>
                                        ${formatPrice(product.oldPrice)}
                                    </del>
                                `
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="quick-view-add-btn"
                        data-action="quick-cart"
                        data-id="${escapeHTML(product.id)}"
                    >
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        quickViewModal.classList.add("active");

        quickViewModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeQuickView() {

        if (!quickViewModal) return;

        quickViewModal.classList.remove("active");

        quickViewModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
    }


    /* =====================================================
       EVENT DELEGATION — PRODUCT GRID
    ===================================================== */

    if (productsGrid) {

        productsGrid.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) return;

                const action =
                    button.dataset.action;

                const productId =
                    button.dataset.id;

                if (!productId) return;


                if (action === "cart") {

                    addToCart(productId);

                    button.classList.add("added");

                    const originalHTML =
                        button.innerHTML;

                    button.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Added
                    `;

                    setTimeout(() => {

                        button.classList.remove(
                            "added"
                        );

                        button.innerHTML =
                            originalHTML;

                    }, 1200);
                }


                if (action === "wishlist") {

                    toggleWishlist(productId);
                }


                if (action === "quick-view") {

                    openQuickView(productId);
                }

            }
        );
    }


    /* =====================================================
       QUICK VIEW EVENTS
    ===================================================== */

    if (quickViewClose) {
        quickViewClose.addEventListener(
            "click",
            closeQuickView
        );
    }

    if (quickViewOverlay) {
        quickViewOverlay.addEventListener(
            "click",
            closeQuickView
        );
    }


    if (quickViewContent) {

        quickViewContent.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action='quick-cart']"
                    );

                if (!button) return;

                const productId =
                    button.dataset.id;

                addToCart(productId);

                button.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Added to Cart
                `;

                setTimeout(() => {
                    closeQuickView();
                }, 700);
            }
        );
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            () => {

                searchTerm =
                    productSearch.value;

                if (clearSearchBtn) {

                    clearSearchBtn.classList.toggle(
                        "show",
                        searchTerm.length > 0
                    );
                }

                applyFilters();
            }
        );
    }


    if (clearSearchBtn) {

        clearSearchBtn.addEventListener(
            "click",
            () => {

                searchTerm = "";

                if (productSearch) {
                    productSearch.value = "";
                    productSearch.focus();
                }

                clearSearchBtn.classList.remove(
                    "show"
                );

                applyFilters();
            }
        );
    }


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category ||
                    "all";

                categoryButtons.forEach(item => {
                    item.classList.toggle(
                        "active",
                        item === button
                    );
                });

                applyFilters();

                if (
                    window.innerWidth <= 900
                ) {
                    closeFilters();
                }
            }
        );
    });


    /* =====================================================
       RATING FILTER
    ===================================================== */

    ratingButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const selected =
                    Number(
                        button.dataset.rating
                    ) || 0;

                if (
                    currentRating === selected
                ) {

                    currentRating = 0;

                    button.classList.remove(
                        "active"
                    );

                } else {

                    currentRating = selected;

                    ratingButtons.forEach(
                        item => {
                            item.classList.toggle(
                                "active",
                                item === button
                            );
                        }
                    );
                }

                applyFilters();
            }
        );
    });


    /* =====================================================
       PRICE FILTER
    ===================================================== */

    if (applyPriceBtn) {

        applyPriceBtn.addEventListener(
            "click",
            () => {

                const min =
                    Number(minPrice?.value) || 0;

                const maxValue =
                    Number(maxPrice?.value);

                currentMinPrice =
                    Math.max(0, min);

                currentMaxPrice =
                    maxValue > 0
                        ? maxValue
                        : Infinity;

                if (
                    currentMaxPrice !== Infinity &&
                    currentMaxPrice < currentMinPrice
                ) {

                    const temp =
                        currentMinPrice;

                    currentMinPrice =
                        currentMaxPrice;

                    currentMaxPrice =
                        temp;

                    if (minPrice) {
                        minPrice.value =
                            currentMinPrice;
                    }

                    if (maxPrice) {
                        maxPrice.value =
                            currentMaxPrice;
                    }
                }

                applyFilters();
            }
        );
    }


    /* =====================================================
       SORT
    ===================================================== */

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            () => {

                currentSort =
                    sortProducts.value;

                applyFilters();
            }
        );
    }


    /* =====================================================
       CLEAR FILTERS BUTTONS
    ===================================================== */

    if (clearFiltersBtn) {

        clearFiltersBtn.addEventListener(
            "click",
            () => {
                clearAllFilters();
            }
        );
    }


    if (noResultsClearBtn) {

        noResultsClearBtn.addEventListener(
            "click",
            () => {
                clearAllFilters();
            }
        );
    }


    /* =====================================================
       ACTIVE FILTER CHIP REMOVAL
    ===================================================== */

    if (activeFilters) {

        activeFilters.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-remove-filter]"
                    );

                if (!button) return;

                const type =
                    button.dataset.removeFilter;


                if (type === "search") {

                    searchTerm = "";

                    if (productSearch) {
                        productSearch.value = "";
                    }

                    if (clearSearchBtn) {
                        clearSearchBtn.classList.remove(
                            "show"
                        );
                    }
                }


                if (type === "category") {

                    currentCategory = "all";

                    categoryButtons.forEach(
                        item => {
                            item.classList.toggle(
                                "active",
                                item.dataset.category ===
                                "all"
                            );
                        }
                    );
                }


                if (type === "rating") {

                    currentRating = 0;

                    ratingButtons.forEach(
                        item => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );
                }


                if (type === "price") {

                    currentMinPrice = 0;
                    currentMaxPrice = Infinity;

                    if (minPrice) {
                        minPrice.value = "";
                    }

                    if (maxPrice) {
                        maxPrice.value = "";
                    }
                }

                applyFilters();
            }
        );
    }


    /* =====================================================
       MOBILE FILTER EVENTS
    ===================================================== */

    if (filterMobileBtn) {

        filterMobileBtn.addEventListener(
            "click",
            openFilters
        );
    }

    if (closeFilterBtn) {

        closeFilterBtn.addEventListener(
            "click",
            closeFilters
        );
    }

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeFilters
        );
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMobileMenu() {

        if (!mobileNav || !mobileMenuBtn) return;

        mobileNav.classList.add("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "true"
        );

        const icon =
            mobileMenuBtn.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );
        }
    }


    function closeMobileMenu() {

        if (!mobileNav || !mobileMenuBtn) return;

        mobileNav.classList.remove("active");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        const icon =
            mobileMenuBtn.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );
        }
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                if (
                    mobileNav.classList.contains(
                        "active"
                    )
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
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {
                        closeMobileMenu();
                    }
                );
            });
    }


    /* =====================================================
       KEYBOARD EVENTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMobileMenu();
                closeFilters();
                closeQuickView();
            }
        }
    );


    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === "khanCart" ||
                event.key === "khanWishlist" ||
                event.key === "khanProducts"
            ) {

                updateCartCount();
                updateWishlistCount();

                if (
                    event.key === "khanProducts"
                ) {
                    loadProducts();
                } else {
                    renderProducts();
                }
            }
        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(() => {

                    if (
                        window.innerWidth > 900
                    ) {
                        closeFilters();
                    }

                    if (
                        window.innerWidth > 900
                    ) {
                        closeMobileMenu();
                    }

                }, 150);
        }
    );


    /* =====================================================
       YEAR
    ===================================================== */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       INITIAL COUNTS
    ===================================================== */

    updateCartCount();
    updateWishlistCount();


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadProducts();


    console.log(
        "KHAN Store Products page loaded successfully."
    );
});