/* =========================================================
   KHAN STORE — PRODUCT DETAILS
   File: product-details.js
   Complete Replacement
   ========================================================= */

"use strict";

/* =========================================================
   1. GLOBAL SETTINGS
   ========================================================= */

const CART_KEY = "khanCart";
const WISHLIST_KEY = "khanWishlist";
const PRODUCTS_KEY = "khanProducts";

let currentProduct = null;
let currentQuantity = 1;
let currentReviewRating = 0;


/* =========================================================
   2. DOM HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function query(selector, parent = document) {
    return parent.querySelector(selector);
}

function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}


/* =========================================================
   3. BASIC HELPERS
   ========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatPrice(value) {
    const number = Number(value) || 0;

    return "₹" + number.toLocaleString("en-IN", {
        maximumFractionDigits: 0
    });
}

function getStars(rating = 0) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    const rounded = Math.round(value);

    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= rounded) {
            html += '<i class="fa-solid fa-star"></i>';
        } else {
            html += '<i class="fa-regular fa-star"></i>';
        }
    }

    return html;
}

function getAverageRating(reviews = []) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
        return 0;
    }

    const total = reviews.reduce((sum, review) => {
        return sum + (Number(review.rating) || 0);
    }, 0);

    return total / reviews.length;
}

function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);

    return (
        params.get("id") ||
        params.get("product") ||
        params.get("productId")
    );
}

function generateId(prefix = "id") {
    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2, 8)
    );
}


/* =========================================================
   4. LOCAL STORAGE HELPERS
   ========================================================= */

function readStorage(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        const parsed = JSON.parse(data);

        return parsed;
    } catch (error) {
        console.error(`Storage read error: ${key}`, error);
        return fallback;
    }
}

function writeStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Storage write error: ${key}`, error);
        return false;
    }
}


/* =========================================================
   5. PRODUCT DATA
   ========================================================= */

function getAllProducts() {
    const adminProducts = readStorage(PRODUCTS_KEY, []);

    if (Array.isArray(adminProducts) && adminProducts.length > 0) {
        return adminProducts;
    }

    return getDefaultProducts();
}

function getDefaultProducts() {
    return [
        {
            id: "galaxy-pro-max-5g",
            name: "Galaxy Pro Max 5G Smartphone",
            category: "Smartphone",
            price: 59999,
            oldPrice: 74999,
            discount: 20,
            rating: 4.8,
            reviews: 324,
            image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80",
            description: "Experience powerful performance, a premium display and next-generation 5G connectivity.",
            fullDescription:
                "The Galaxy Pro Max 5G Smartphone combines powerful performance, a premium display, advanced cameras and fast 5G connectivity in a modern design."
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
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
            description: "Powerful laptop designed for work, study, creativity and everyday productivity.",
            fullDescription:
                "A premium performance laptop with a sleek design, powerful processor and excellent display for productivity and creative workflows."
        },
        {
            id: "premium-wireless-headphones",
            name: "Premium Wireless Headphones",
            category: "Headphones",
            price: 4999,
            oldPrice: 6999,
            discount: 29,
            rating: 4.7,
            reviews: 218,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
            description: "Premium wireless headphones with immersive sound and comfortable all-day listening.",
            fullDescription:
                "Enjoy immersive audio, comfortable ear cushions and reliable wireless connectivity with these premium headphones."
        },
        {
            id: "iphone-15-pro",
            name: "iPhone 15 Pro",
            category: "Smartphone",
            price: 109999,
            oldPrice: 134999,
            discount: 19,
            rating: 4.9,
            reviews: 420,
            image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=900&q=80",
            description: "Premium smartphone with powerful performance and an advanced camera system.",
            fullDescription:
                "A premium smartphone featuring powerful performance, an advanced camera system and a high-quality display."
        },
        {
            id: "samsung-galaxy-s24",
            name: "Samsung Galaxy S24",
            category: "Smartphone",
            price: 69999,
            oldPrice: 84999,
            discount: 18,
            rating: 4.8,
            reviews: 286,
            image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
            description: "Modern flagship smartphone with premium design and powerful performance.",
            fullDescription:
                "A modern flagship smartphone with a premium design, bright display and powerful everyday performance."
        },
        {
            id: "sony-wh-1000xm5",
            name: "Sony WH-1000XM5",
            category: "Headphones",
            price: 29999,
            oldPrice: 34999,
            discount: 14,
            rating: 4.9,
            reviews: 512,
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
            description: "Premium noise-cancelling wireless headphones.",
            fullDescription:
                "Premium wireless headphones designed for immersive listening with comfortable construction and advanced noise reduction."
        },
        {
            id: "apple-watch-series-9",
            name: "Apple Watch Series 9",
            category: "Smart Watch",
            price: 41999,
            oldPrice: 45999,
            discount: 9,
            rating: 4.8,
            reviews: 198,
            image: "https://images.unsplash.com/photo-1546868871-7041f2a55e5c?auto=format&fit=crop&w=900&q=80",
            description: "Smartwatch with fitness, notifications and everyday smart features.",
            fullDescription:
                "A premium smartwatch built for everyday notifications, fitness tracking and convenient smart features."
        },
        {
            id: "macbook-air-m2",
            name: "MacBook Air M2",
            category: "Laptop",
            price: 89999,
            oldPrice: 99999,
            discount: 10,
            rating: 4.9,
            reviews: 341,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
            description: "Slim and powerful laptop for work, study and creativity.",
            fullDescription:
                "A slim laptop with powerful performance, excellent portability and a premium display for everyday productivity."
        },
        {
            id: "premium-wireless-earbuds",
            name: "Premium Wireless Earbuds",
            category: "Accessories",
            price: 4999,
            oldPrice: 6999,
            discount: 29,
            rating: 4.6,
            reviews: 276,
            image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
            description: "Compact wireless earbuds with clear audio and comfortable fit.",
            fullDescription:
                "Compact wireless earbuds offering convenient connectivity, clear sound and a comfortable fit."
        },
        {
            id: "smart-watch-pro",
            name: "Smart Watch Pro",
            category: "Smart Watch",
            price: 7499,
            oldPrice: 9999,
            discount: 25,
            rating: 4.5,
            reviews: 163,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
            description: "Modern smartwatch with fitness and smart notification features.",
            fullDescription:
                "A modern smartwatch for fitness tracking, notifications and convenient everyday use."
        }
    ];
}

function normalizeProduct(product, index = 0) {
    if (!product || typeof product !== "object") {
        return null;
    }

    const id =
        product.id ??
        product._id ??
        product.productId ??
        product.slug ??
        `product-${index + 1}`;

    const price = Number(
        product.price ??
        product.currentPrice ??
        product.salePrice ??
        0
    );

    const oldPrice = Number(
        product.oldPrice ??
        product.originalPrice ??
        product.mrp ??
        price
    );

    let discount = Number(product.discount ?? 0);

    if (!discount && oldPrice > price && oldPrice > 0) {
        discount = Math.round(((oldPrice - price) / oldPrice) * 100);
    }

    return {
        ...product,

        id: String(id),

        name:
            product.name ??
            product.title ??
            "Product",

        category:
            product.category ??
            product.categoryName ??
            "Electronics",

        price,

        oldPrice,

        discount,

        rating: Number(product.rating ?? 0),

        reviews: Number(
            product.reviews ??
            product.reviewCount ??
            0
        ),

        image:
            product.image ??
            product.imageUrl ??
            product.thumbnail ??
            "",

        description:
            product.description ??
            "Premium technology product from KHAN Store.",

        fullDescription:
            product.fullDescription ??
            product.description ??
            "Premium technology product from KHAN Store."
    };
}


/* =========================================================
   6. FIND CURRENT PRODUCT
   ========================================================= */

function findProduct(productId) {
    const products = getAllProducts();

    if (!productId) {
        return null;
    }

    const normalizedId = String(productId).trim();

    const product = products.find(item => {
        const normalized = normalizeProduct(item);

        if (!normalized) {
            return false;
        }

        return (
            normalized.id === normalizedId ||
            String(item._id ?? "") === normalizedId ||
            String(item.slug ?? "") === normalizedId
        );
    });

    return product ? normalizeProduct(product) : null;
}


/* =========================================================
   7. PAGE STATES
   ========================================================= */

function showLoading() {
    const loading = $("productLoading");
    const details = $("productDetails");
    const error = $("productError");

    if (loading) {
        loading.classList.remove("hidden");
    }

    if (details) {
        details.classList.add("hidden");
    }

    if (error) {
        error.classList.add("hidden");
    }
}

function hideLoading() {
    const loading = $("productLoading");

    if (loading) {
        loading.classList.add("hidden");
    }
}

function showProduct() {
    hideLoading();

    const details = $("productDetails");

    if (details) {
        details.classList.remove("hidden");
    }
}

function showError(message = "Product could not be found.") {
    hideLoading();

    const details = $("productDetails");
    const error = $("productError");
    const errorText = $("productErrorText");

    if (details) {
        details.classList.add("hidden");
    }

    if (errorText) {
        errorText.textContent = message;
    }

    if (error) {
        error.classList.remove("hidden");
    }
}


/* =========================================================
   8. RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {
    if (!product) {
        showError("Product could not be found.");
        return;
    }

    currentProduct = product;
    currentQuantity = 1;

    /* Breadcrumb */

    if ($("breadcrumbProduct")) {
        $("breadcrumbProduct").textContent = product.name;
    }

    /* Discount */

    const discount = Number(product.discount) || 0;

    if ($("productDiscount")) {
        $("productDiscount").textContent =
            discount > 0 ? `${discount}% OFF` : "";
    }

    /* Image */

    if ($("productImage")) {
        $("productImage").src = product.image || "";
        $("productImage").alt = product.name;
    }

    if ($("imageCaption")) {
        $("imageCaption").textContent = product.name;
    }

    /* Category */

    if ($("productCategory")) {
        $("productCategory").textContent = product.category;
    }

    if ($("productMetaCategory")) {
        $("productMetaCategory").textContent = product.category;
    }

    /* Name */

    if ($("productName")) {
        $("productName").textContent = product.name;
    }

    /* Rating */

    const rating = Number(product.rating) || 0;
    const reviewCount = Number(product.reviews) || 0;

    if ($("productStars")) {
        $("productStars").innerHTML = getStars(rating);
    }

    if ($("productRating")) {
        $("productRating").textContent = rating.toFixed(1);
    }

    if ($("productReviews")) {
        $("productReviews").textContent =
            `${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`;
    }

    /* Description */

    if ($("productDescription")) {
        $("productDescription").textContent =
            product.description || "";
    }

    /* Price */

    if ($("productPrice")) {
        $("productPrice").textContent =
            formatPrice(product.price);
    }

    if ($("productOldPrice")) {
        if (product.oldPrice && product.oldPrice > product.price) {
            $("productOldPrice").textContent =
                formatPrice(product.oldPrice);
            $("productOldPrice").style.display = "inline";
        } else {
            $("productOldPrice").textContent = "";
            $("productOldPrice").style.display = "none";
        }
    }

    if ($("productSave")) {
        const saving =
            Number(product.oldPrice || 0) -
            Number(product.price || 0);

        if (saving > 0) {
            $("productSave").textContent =
                `Save ${formatPrice(saving)}`;
            $("productSave").style.display = "inline";
        } else {
            $("productSave").textContent = "";
            $("productSave").style.display = "none";
        }
    }

    /* Stock */

    const stock =
        Number(
            product.stock ??
            product.stockCount ??
            product.quantity ??
            10
        );

    if ($("stockStatus")) {
        if (stock <= 0) {
            $("stockStatus").textContent = "Out of Stock";
            $("stockStatus").style.color = "#dc2626";
        } else {
            $("stockStatus").textContent = "In Stock";
            $("stockStatus").style.color = "#15803d";
        }
    }

    if ($("stockCount")) {
        if (stock > 0) {
            $("stockCount").textContent =
                `(${stock} available)`;
        } else {
            $("stockCount").textContent = "";
        }
    }

    /* Quantity */

    if ($("productQuantity")) {
        $("productQuantity").value = "1";
    }

    updatePurchaseButtons(stock);

    /* Description */

    if ($("fullDescription")) {
        $("fullDescription").innerHTML =
            escapeHTML(
                product.fullDescription ||
                product.description ||
                ""
            ).replace(/\n/g, "<br>");
    }

    /* Product ID */

    if ($("productId")) {
        $("productId").textContent = product.id;
    }

    /* Wishlist */

    updateWishlistButton();

    /* Reviews */

    renderReviews();

    /* Related */

    renderRelatedProducts();

    showProduct();
}


/* =========================================================
   9. PURCHASE BUTTON STATE
   ========================================================= */

function updatePurchaseButtons(stock = 1) {
    const disabled = Number(stock) <= 0;

    if ($("addToCartBtn")) {
        $("addToCartBtn").disabled = disabled;
    }

    if ($("buyNowBtn")) {
        $("buyNowBtn").disabled = disabled;
    }

    if ($("decreaseQty")) {
        $("decreaseQty").disabled = disabled;
    }

    if ($("increaseQty")) {
        $("increaseQty").disabled = disabled;
    }
}


/* =========================================================
   10. QUANTITY
   ========================================================= */

function setupQuantity() {
    const decrease = $("decreaseQty");
    const increase = $("increaseQty");
    const input = $("productQuantity");

    if (decrease) {
        decrease.addEventListener("click", () => {
            currentQuantity = Math.max(1, currentQuantity - 1);

            if (input) {
                input.value = currentQuantity;
            }
        });
    }

    if (increase) {
        increase.addEventListener("click", () => {
            currentQuantity = Math.min(
                99,
                currentQuantity + 1
            );

            if (input) {
                input.value = currentQuantity;
            }
        });
    }

    if (input) {
        input.addEventListener("input", () => {
            let value = parseInt(input.value, 10);

            if (Number.isNaN(value) || value < 1) {
                value = 1;
            }

            if (value > 99) {
                value = 99;
            }

            currentQuantity = value;
            input.value = value;
        });

        input.addEventListener("blur", () => {
            if (!input.value || Number(input.value) < 1) {
                currentQuantity = 1;
                input.value = "1";
            }
        });
    }
}


/* =========================================================
   11. CART
   ========================================================= */

function getCart() {
    const cart = readStorage(CART_KEY, []);

    return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
    writeStorage(CART_KEY, cart);
    updateCartCount();
}

function addProductToCart(product, quantity = 1) {
    if (!product) {
        return false;
    }

    const cart = getCart();

    const productId = String(product.id);

    const existingIndex = cart.findIndex(item => {
        return String(
            item.id ??
            item.productId ??
            item._id
        ) === productId;
    });

    if (existingIndex !== -1) {
        const existing = cart[existingIndex];

        existing.quantity =
            Number(existing.quantity || 0) +
            Number(quantity || 1);

        existing.qty = existing.quantity;

        cart[existingIndex] = existing;
    } else {
        cart.push({
            id: product.id,
            productId: product.id,
            name: product.name,
            title: product.name,
            category: product.category,
            price: Number(product.price) || 0,
            oldPrice: Number(product.oldPrice) || 0,
            image: product.image || "",
            quantity: Number(quantity) || 1,
            qty: Number(quantity) || 1
        });
    }

    saveCart(cart);

    return true;
}

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((total, item) => {
        return total + Number(
            item.quantity ??
            item.qty ??
            1
        );
    }, 0);

    const counters = queryAll(".cart-count");

    counters.forEach(counter => {
        counter.textContent = count;
        counter.style.display = count > 0 ? "inline-flex" : "";
    });
}


/* =========================================================
   12. ADD TO CART
   ========================================================= */

function handleAddToCart() {
    if (!currentProduct) {
        return;
    }

    const quantity = Math.max(
        1,
        Number(currentQuantity) || 1
    );

    const success = addProductToCart(
        currentProduct,
        quantity
    );

    if (success) {
        showToast(
            "Added to Cart",
            `${currentProduct.name} added to your cart.`
        );

        animateCartButton();
    }
}

function animateCartButton() {
    const button = $("addToCartBtn");

    if (!button) {
        return;
    }

    const originalHTML = button.innerHTML;

    button.innerHTML =
        '<i class="fa-solid fa-check"></i> Added to Cart';

    button.classList.add("added");

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove("added");
    }, 1500);
}


/* =========================================================
   13. BUY NOW
   ========================================================= */

function handleBuyNow() {
    if (!currentProduct) {
        return;
    }

    const quantity = Math.max(
        1,
        Number(currentQuantity) || 1
    );

    addProductToCart(
        currentProduct,
        quantity
    );

    window.location.href = "checkout.html";
}


/* =========================================================
   14. WISHLIST
   ========================================================= */

function getWishlist() {
    const wishlist = readStorage(
        WISHLIST_KEY,
        []
    );

    return Array.isArray(wishlist)
        ? wishlist
        : [];
}

function saveWishlist(wishlist) {
    writeStorage(
        WISHLIST_KEY,
        wishlist
    );

    updateWishlistCount();
}

function isProductInWishlist(productId) {
    const wishlist = getWishlist();

    return wishlist.some(item => {
        const id =
            typeof item === "object"
                ? item.id ?? item.productId ?? item._id
                : item;

        return String(id) === String(productId);
    });
}

function toggleWishlist() {
    if (!currentProduct) {
        return;
    }

    let wishlist = getWishlist();

    const index = wishlist.findIndex(item => {
        const id =
            typeof item === "object"
                ? item.id ?? item.productId ?? item._id
                : item;

        return String(id) === String(currentProduct.id);
    });

    if (index !== -1) {
        wishlist.splice(index, 1);

        saveWishlist(wishlist);

        showToast(
            "Removed from Wishlist",
            currentProduct.name
        );
    } else {
        wishlist.push({
            id: currentProduct.id,
            productId: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            oldPrice: currentProduct.oldPrice,
            image: currentProduct.image,
            category: currentProduct.category
        });

        saveWishlist(wishlist);

        showToast(
            "Added to Wishlist",
            currentProduct.name
        );
    }

    updateWishlistButton();
}

function updateWishlistButton() {
    const button = $("wishlistBtn");

    if (!button || !currentProduct) {
        return;
    }

    const active =
        isProductInWishlist(currentProduct.id);

    button.classList.toggle(
        "active",
        active
    );

    button.setAttribute(
        "aria-label",
        active
            ? "Remove from wishlist"
            : "Add to wishlist"
    );

    const icon = button.querySelector("i");

    if (icon) {
        icon.className = active
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";
    }
}

function updateWishlistCount() {
    const wishlist = getWishlist();

    const counters =
        queryAll(".wishlist-count");

    counters.forEach(counter => {
        counter.textContent =
            wishlist.length;

        counter.style.display =
            wishlist.length > 0
                ? "inline-flex"
                : "";
    });
}


/* =========================================================
   15. DESCRIPTION / SHIPPING TABS
   ========================================================= */

function setupDetailsTabs() {
    const descriptionTab = $("descriptionTab");
    const shippingTab = $("shippingTab");

    const descriptionContent =
        $("fullDescription");

    const shippingContent =
        $("shippingContent");

    if (descriptionTab) {
        descriptionTab.addEventListener(
            "click",
            () => {

                descriptionTab.classList.add("active");

                if (shippingTab) {
                    shippingTab.classList.remove("active");
                }

                if (descriptionContent) {
                    descriptionContent.classList.remove(
                        "hidden"
                    );
                }

                if (shippingContent) {
                    shippingContent.classList.add(
                        "hidden"
                    );
                }
            }
        );
    }

    if (shippingTab) {
        shippingTab.addEventListener(
            "click",
            () => {

                shippingTab.classList.add("active");

                if (descriptionTab) {
                    descriptionTab.classList.remove("active");
                }

                if (descriptionContent) {
                    descriptionContent.classList.add(
                        "hidden"
                    );
                }

                if (shippingContent) {
                    shippingContent.classList.remove(
                        "hidden"
                    );
                }
            }
        );
    }
}


/* =========================================================
   16. REVIEWS DATA
   ========================================================= */

function getReviewStorageKey(productId) {
    return `khanReviews_${productId}`;
}

function getReviews() {
    if (!currentProduct) {
        return [];
    }

    const productReviews =
        readStorage(
            getReviewStorageKey(currentProduct.id),
            []
        );

    if (Array.isArray(productReviews)) {
        return productReviews;
    }

    return [];
}

function saveReviews(reviews) {
    if (!currentProduct) {
        return;
    }

    writeStorage(
        getReviewStorageKey(currentProduct.id),
        reviews
    );
}


/* =========================================================
   17. RENDER REVIEWS
   ========================================================= */

function renderReviews() {
    if (!currentProduct) {
        return;
    }

    const reviews = getReviews();

    const baseRating =
        Number(currentProduct.rating) || 0;

    const baseReviewCount =
        Number(currentProduct.reviews) || 0;

    let averageRating = baseRating;
    let totalReviews = baseReviewCount;

    if (reviews.length > 0) {
        averageRating =
            getAverageRating(reviews);

        totalReviews =
            reviews.length;
    }

    if ($("reviewsAverage")) {
        $("reviewsAverage").textContent =
            averageRating.toFixed(1);
    }

    if ($("reviewsAverageStars")) {
        $("reviewsAverageStars").innerHTML =
            getStars(averageRating);
    }

    if ($("reviewsTotal")) {
        $("reviewsTotal").textContent =
            `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`;
    }

    renderRatingBreakdown(
        reviews,
        averageRating,
        totalReviews
    );

    renderReviewList(reviews);
}

function renderRatingBreakdown(
    reviews,
    averageRating,
    totalReviews
) {
    const counts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    if (reviews.length > 0) {
        reviews.forEach(review => {
            const rating =
                Math.round(
                    Number(review.rating) || 0
                );

            if (rating >= 1 && rating <= 5) {
                counts[rating]++;
            }
        });
    } else {
        const approximate =
            Math.max(
                0,
                Number(totalReviews) || 0
            );

        const rounded =
            Math.round(averageRating);

        if (rounded >= 1 && rounded <= 5) {
            counts[rounded] = approximate;
        }
    }

    for (let rating = 5; rating >= 1; rating--) {
        const countElement =
            $(`ratingCount${rating}`);

        const barElement =
            $(`ratingBar${rating}`);

        if (countElement) {
            countElement.textContent =
                counts[rating];
        }

        if (barElement) {
            const percentage =
                totalReviews > 0
                    ? (counts[rating] / totalReviews) * 100
                    : 0;

            barElement.style.width =
                `${Math.min(100, percentage)}%`;
        }
    }
}

function renderReviewList(reviews) {
    const list = $("reviewsList");
    const empty = $("reviewsEmpty");
    const count = $("reviewsListCount");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (count) {
        count.textContent =
            `${reviews.length} ${reviews.length === 1 ? "Review" : "Reviews"}`;
    }

    if (reviews.length === 0) {
        if (empty) {
            empty.classList.remove("hidden");
        }

        return;
    }

    if (empty) {
        empty.classList.add("hidden");
    }

    reviews.forEach(review => {
        const article =
            document.createElement("article");

        article.className =
            "review-item";

        const name =
            escapeHTML(
                review.name || "Customer"
            );

        const text =
            escapeHTML(
                review.text || review.comment || ""
            );

        const rating =
            Number(review.rating) || 0;

        const date =
            review.date ||
            new Date().toLocaleDateString(
                "en-IN"
            );

        article.innerHTML = `
            <div class="review-item-header">

                <div class="review-user">

                    <div class="review-avatar">
                        ${escapeHTML(
                            (review.name || "C")
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </div>

                    <div>
                        <div class="review-user-name">
                            ${name}
                        </div>

                        <div class="review-date">
                            ${escapeHTML(date)}
                        </div>
                    </div>

                </div>

                <div class="review-item-rating">
                    ${getStars(rating)}
                </div>

            </div>

            <p class="review-item-text">
                ${text}
            </p>
        `;

        list.appendChild(article);
    });
}


/* =========================================================
   18. REVIEW FORM
   ========================================================= */

function setupReviewForm() {

    const writeButton =
        $("writeReviewBtn");

    const emptyWriteButton =
        $("emptyWriteReviewBtn");

    const wrapper =
        $("reviewFormWrapper");

    const closeButton =
        $("closeReviewForm");

    const cancelButton =
        $("cancelReviewBtn");

    const form =
        $("reviewForm");

    const starInput =
        $("reviewStarInput");

    const ratingText =
        $("ratingSelectedText");

    const reviewText =
        $("reviewText");

    const charCount =
        $("reviewCharCount");


    function openForm() {
        if (!wrapper) {
            return;
        }

        wrapper.classList.remove("hidden");

        wrapper.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function closeForm() {
        if (wrapper) {
            wrapper.classList.add("hidden");
        }

        currentReviewRating = 0;

        queryAll(
            ".review-rating-input button"
        ).forEach(button => {
            button.classList.remove("active");
        });

        if (ratingText) {
            ratingText.textContent =
                "Select a rating";
        }
    }


    if (writeButton) {
        writeButton.addEventListener(
            "click",
            openForm
        );
    }

    if (emptyWriteButton) {
        emptyWriteButton.addEventListener(
            "click",
            openForm
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeForm
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeForm
        );
    }


    if (starInput) {

        const stars =
            queryAll(
                "button",
                starInput
            );

        stars.forEach((star, index) => {

            star.addEventListener(
                "click",
                () => {

                    currentReviewRating =
                        index + 1;

                    stars.forEach(
                        (item, starIndex) => {

                            item.classList.toggle(
                                "active",
                                starIndex <
                                currentReviewRating
                            );

                            const icon =
                                item.querySelector("i");

                            if (icon) {
                                icon.className =
                                    starIndex <
                                    currentReviewRating
                                        ? "fa-solid fa-star"
                                        : "fa-regular fa-star";
                            }
                        }
                    );

                    if (ratingText) {
                        ratingText.textContent =
                            `${currentReviewRating}/5`;
                    }
                }
            );
        });
    }


    if (reviewText && charCount) {

        const updateCount = () => {

            charCount.textContent =
                `${reviewText.value.length}/500`;
        };

        reviewText.addEventListener(
            "input",
            updateCount
        );

        updateCount();
    }


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                if (!currentProduct) {
                    return;
                }

                const nameInput =
                    $("reviewName");

                const textInput =
                    $("reviewText");

                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";

                const text =
                    textInput
                        ? textInput.value.trim()
                        : "";

                if (!name) {
                    showToast(
                        "Name Required",
                        "Please enter your name."
                    );
                    return;
                }

                if (currentReviewRating < 1) {
                    showToast(
                        "Rating Required",
                        "Please select a star rating."
                    );
                    return;
                }

                if (text.length < 5) {
                    showToast(
                        "Review Too Short",
                        "Please write a little more about the product."
                    );
                    return;
                }

                const reviews =
                    getReviews();

                reviews.unshift({
                    id: generateId("review"),
                    name,
                    rating: currentReviewRating,
                    text,
                    date:
                        new Date().toLocaleDateString(
                            "en-IN"
                        )
                });

                saveReviews(reviews);

                form.reset();

                currentReviewRating = 0;

                queryAll(
                    ".review-rating-input button"
                ).forEach(button => {
                    button.classList.remove("active");

                    const icon =
                        button.querySelector("i");

                    if (icon) {
                        icon.className =
                            "fa-regular fa-star";
                    }
                });

                if (ratingText) {
                    ratingText.textContent =
                        "Select a rating";
                }

                if (charCount) {
                    charCount.textContent =
                        "0/500";
                }

                if (wrapper) {
                    wrapper.classList.add("hidden");
                }

                renderReviews();

                showToast(
                    "Review Submitted",
                    "Thank you for sharing your review."
                );
            }
        );
    }
}


/* =========================================================
   19. REVIEW SORT
   ========================================================= */

function setupReviewSort() {

    const select =
        $("reviewSort");

    if (!select) {
        return;
    }

    select.addEventListener(
        "change",
        () => {

            let reviews =
                getReviews();

            const value =
                select.value;

            if (value === "highest") {

                reviews.sort(
                    (a, b) =>
                        Number(b.rating || 0) -
                        Number(a.rating || 0)
                );

            } else if (value === "lowest") {

                reviews.sort(
                    (a, b) =>
                        Number(a.rating || 0) -
                        Number(b.rating || 0)
                );

            } else {

                reviews.sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                );
            }

            renderReviewList(reviews);
        }
    );
}


/* =========================================================
   20. RELATED PRODUCTS
   ========================================================= */

function renderRelatedProducts() {

    const container =
        $("relatedProducts");

    if (!container || !currentProduct) {
        return;
    }

    const products =
        getAllProducts()
            .map((item, index) =>
                normalizeProduct(item, index)
            )
            .filter(Boolean);

    let related =
        products.filter(product => {

            return (
                product.id !== currentProduct.id &&
                product.category === currentProduct.category
            );
        });

    if (related.length < 4) {

        const additional =
            products.filter(product => {

                return (
                    product.id !== currentProduct.id &&
                    !related.some(
                        item =>
                            item.id === product.id
                    )
                );
            });

        related =
            related.concat(additional);
    }

    related =
        related.slice(0, 4);

    container.innerHTML = "";

    if (related.length === 0) {
        container.innerHTML =
            `<p>No related products available.</p>`;
        return;
    }

    related.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "related-product-card";

        const rating =
            Number(product.rating) || 0;

        const oldPriceHTML =
            product.oldPrice > product.price
                ? `<span class="old">${formatPrice(product.oldPrice)}</span>`
                : "";

        card.innerHTML = `
            <a
                href="product-details.html?id=${encodeURIComponent(product.id)}"
                style="text-decoration:none;color:inherit;display:block;"
            >

                <div class="related-product-image">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >

                </div>

                <div class="related-product-info">

                    <div class="related-product-category">
                        ${escapeHTML(product.category)}
                    </div>

                    <h3 class="related-product-name">
                        ${escapeHTML(product.name)}
                    </h3>

                    <div class="related-product-rating">
                        ${getStars(rating)}
                        <span>
                            ${rating.toFixed(1)}
                        </span>
                    </div>

                    <div class="related-product-price">
                        <span class="current">
                            ${formatPrice(product.price)}
                        </span>

                        ${oldPriceHTML}
                    </div>

                </div>

            </a>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   21. TOAST
   ========================================================= */

let toastTimer = null;

function showToast(title, message) {

    const toast =
        $("toast");

    const toastTitle =
        $("toastTitle");

    const toastMessage =
        $("toastMessage");

    if (!toast) {
        return;
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

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
}

function setupToast() {

    const close =
        $("closeToast");

    if (close) {
        close.addEventListener(
            "click",
            () => {
                const toast =
                    $("toast");

                if (toast) {
                    toast.classList.remove(
                        "show"
                    );
                }
            }
        );
    }
}


/* =========================================================
   22. HEADER COUNTERS
   ========================================================= */

function updateHeaderCounters() {
    updateCartCount();
    updateWishlistCount();
}


/* =========================================================
   23. RETRY
   ========================================================= */

function setupRetry() {

    const button =
        $("retryProductBtn");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {
            loadProduct();
        }
    );
}


/* =========================================================
   24. EVENT LISTENERS
   ========================================================= */

function setupProductActions() {

    const addButton =
        $("addToCartBtn");

    const buyButton =
        $("buyNowBtn");

    const wishlistButton =
        $("wishlistBtn");

    if (addButton) {
        addButton.addEventListener(
            "click",
            handleAddToCart
        );
    }

    if (buyButton) {
        buyButton.addEventListener(
            "click",
            handleBuyNow
        );
    }

    if (wishlistButton) {
        wishlistButton.addEventListener(
            "click",
            toggleWishlist
        );
    }
}


/* =========================================================
   25. LOAD PRODUCT
   ========================================================= */

function loadProduct() {

    showLoading();

    const productId =
        getProductIdFromURL();

    if (!productId) {

        showError(
            "No product was selected. Please open a product from the store."
        );

        return;
    }

    setTimeout(() => {

        try {

            const product =
                findProduct(productId);

            if (!product) {

                showError(
                    "This product is no longer available."
                );

                return;
            }

            renderProduct(product);

        } catch (error) {

            console.error(
                "Product loading error:",
                error
            );

            showError(
                "Something went wrong while loading the product."
            );
        }

    }, 100);
}


/* =========================================================
   26. SEARCH HEADER
   ========================================================= */

function setupSearch() {

    const searchForm =
        $("searchForm");

    const searchInput =
        $("searchInput");

    if (!searchForm || !searchInput) {
        return;
    }

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const value =
                searchInput.value.trim();

            if (!value) {
                return;
            }

            window.location.href =
                `products.html?search=${encodeURIComponent(value)}`;
        }
    );
}


/* =========================================================
   27. THEME BUTTON
   ========================================================= */

function setupTheme() {

    const themeButton =
        $("themeBtn");

    if (!themeButton) {
        return;
    }

    const savedTheme =
        localStorage.getItem(
            "khanTheme"
        );

    if (savedTheme === "dark") {
        document.body.classList.add(
            "dark-mode"
        );
    }

    updateThemeIcon();

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );

            localStorage.setItem(
                "khanTheme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        }
    );
}

function updateThemeIcon() {

    const button =
        $("themeBtn");

    if (!button) {
        return;
    }

    const icon =
        button.querySelector("i");

    if (!icon) {
        return;
    }

    const dark =
        document.body.classList.contains(
            "dark-mode"
        );

    icon.className =
        dark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";
}


/* =========================================================
   28. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "KHAN Store Product Details JS loaded."
        );

        setupQuantity();
        setupDetailsTabs();
        setupReviewForm();
        setupReviewSort();
        setupToast();
        setupRetry();
        setupProductActions();
        setupSearch();
        setupTheme();

        updateHeaderCounters();

        loadProduct();
    }
);


/* =========================================================
   29. GLOBAL DEBUG HELPERS
   ========================================================= */

window.KhanProductDetails = {
    getCurrentProduct: () => currentProduct,

    getCart,

    getWishlist,

    getStars,

    addProductToCart,

    updateCartCount,

    updateWishlistCount,

    loadProduct
};