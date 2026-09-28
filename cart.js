/* =========================================================
   KHAN STORE - CART PAGE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   CART SETTINGS
   ========================================================= */

const FREE_DELIVERY_LIMIT = 999;
const DELIVERY_CHARGE = 49;
const MAX_QUANTITY = 10;


/* =========================================================
   CART STATE
   ========================================================= */

let cartData = loadCart();

let discountAmount = 0;
let appliedCoupon = "";


/* =========================================================
   LOAD CART
   ========================================================= */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem("khanCart");

        if (!savedCart) {
            return [];
        }

        const parsedCart =
            JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart
            .filter(item => item && typeof item === "object")
            .map(item => {

                return {
                    id:
                        item.id ??
                        item.productId ??
                        item.name,

                    productId:
                        item.productId ??
                        item.id ??
                        "",

                    name:
                        item.name ??
                        item.title ??
                        "Product",

                    price:
                        Number(
                            item.price ??
                            item.currentPrice ??
                            0
                        ),

                    oldPrice:
                        Number(
                            item.oldPrice ??
                            item.originalPrice ??
                            0
                        ),

                    image:
                        item.image ??
                        item.img ??
                        "",

                    category:
                        item.category ??
                        "Electronics",

                    quantity:
                        Math.max(
                            1,
                            Number(item.quantity ?? 1)
                        )
                };

            });

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        return [];
    }
}


/* =========================================================
   ELEMENTS
   ========================================================= */

const cartItemsContainer =
    document.getElementById("cartItems");

const emptyCart =
    document.getElementById("emptyCart");

const cartItemText =
    document.getElementById("cartItemText");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const deliveryElement =
    document.getElementById("delivery");

const grandTotalElement =
    document.getElementById("grandTotal");

const deliveryMessage =
    document.getElementById("deliveryMessage");

const clearCartBtn =
    document.getElementById("clearCartBtn");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const couponInput =
    document.getElementById("couponInput");

const applyCouponBtn =
    document.getElementById("applyCouponBtn");

const couponMessage =
    document.getElementById("couponMessage");


/* =========================================================
   PRICE FORMAT
   ========================================================= */

function cartFormatPrice(price) {

    return "₹" +
        Number(price || 0)
            .toLocaleString("en-IN");

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCartData() {

    localStorage.setItem(
        "khanCart",
        JSON.stringify(cartData)
    );

}


/* =========================================================
   TOTAL QUANTITY
   ========================================================= */

function getTotalQuantity() {

    return cartData.reduce(
        (total, item) => {

            return total +
                Math.max(
                    1,
                    Number(item.quantity || 1)
                );

        },
        0
    );

}


/* =========================================================
   SUBTOTAL
   ========================================================= */

function getSubtotal() {

    return cartData.reduce(
        (total, item) => {

            const price =
                Number(item.price || 0);

            const quantity =
                Math.max(
                    1,
                    Number(item.quantity || 1)
                );

            return total +
                (price * quantity);

        },
        0
    );

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";


    /* =====================================================
       EMPTY CART
       ===================================================== */

    if (cartData.length === 0) {

        if (emptyCart) {
            emptyCart.classList.add("show");
        }

        cartItemsContainer.style.display =
            "none";

        if (clearCartBtn) {
            clearCartBtn.style.display =
                "none";
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        updateSummary();
        updateItemText();

        return;
    }


    /* =====================================================
       CART HAS PRODUCTS
       ===================================================== */

    if (emptyCart) {
        emptyCart.classList.remove("show");
    }

    cartItemsContainer.style.display =
        "block";

    if (clearCartBtn) {
        clearCartBtn.style.display =
            "flex";
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }


    /* =====================================================
       CREATE CART ITEMS
       ===================================================== */

    cartData.forEach(
        (product, index) => {

            const item =
                document.createElement("div");

            item.className =
                "cart-item";


            const quantity =
                Math.max(
                    1,
                    Number(product.quantity || 1)
                );


            const price =
                Number(product.price || 0);


            const oldPrice =
                Number(product.oldPrice || 0);


            const total =
                price * quantity;


            const safeName =
                escapeHTML(
                    product.name ||
                    "Product"
                );


            const safeCategory =
                escapeHTML(
                    product.category ||
                    "Electronics"
                );


            const safeImage =
                escapeHTML(
                    product.image ||
                    ""
                );


            item.innerHTML = `

                <div class="cart-product-info">

                    <div class="cart-product-image">

                        ${
                            safeImage
                            ?
                            `
                            <img
                                src="${safeImage}"
                                alt="${safeName}"
                                loading="lazy"
                                onerror="
                                    this.style.display='none';
                                    this.parentElement.innerHTML='<i class=&quot;fa-solid fa-box&quot;></i>';
                                "
                            >
                            `
                            :
                            `
                            <i class="fa-solid fa-box"></i>
                            `
                        }

                    </div>


                    <div class="cart-product-details">

                        <span class="cart-product-category">
                            ${safeCategory}
                        </span>

                        <h3 class="cart-product-name">
                            ${safeName}
                        </h3>

                        <button
                            type="button"
                            class="remove-product"
                            data-index="${index}"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Remove

                        </button>

                    </div>

                </div>


                <div class="cart-item-price">

                    ${cartFormatPrice(price)}

                    ${
                        oldPrice > price
                        ?
                        `
                        <span class="cart-old-price">
                            ${cartFormatPrice(oldPrice)}
                        </span>
                        `
                        :
                        ""
                    }

                </div>


                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-btn decrease"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span class="quantity-number">
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-btn increase"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    ${cartFormatPrice(total)}

                </div>

            `;


            cartItemsContainer.appendChild(item);

        }
    );


    updateSummary();

    updateItemText();

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(index, amount) {

    if (!cartData[index]) {
        return;
    }


    let quantity =
        Number(
            cartData[index].quantity || 1
        );


    quantity += amount;


    /* =====================================================
       REMOVE WHEN ZERO
       ===================================================== */

    if (quantity <= 0) {

        removeCartItem(index);

        return;
    }


    /* =====================================================
       MAXIMUM QUANTITY
       ===================================================== */

    if (quantity > MAX_QUANTITY) {

        showCartToast(
            `Maximum quantity is ${MAX_QUANTITY}`,
            "error"
        );

        return;
    }


    cartData[index].quantity =
        quantity;


    saveCartData();

    renderCart();

    updateMainCartCount();

}


/* =========================================================
   REMOVE ITEM
   ========================================================= */

function removeCartItem(index) {

    if (!cartData[index]) {
        return;
    }


    const productName =
        cartData[index].name ||
        "Product";


    cartData.splice(
        index,
        1
    );


    saveCartData();

    renderCart();

    updateMainCartCount();


    showCartToast(
        `${productName} removed from cart`
    );

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    if (cartData.length === 0) {
        return;
    }


    const confirmed =
        window.confirm(
            "Are you sure you want to remove all products from your cart?"
        );


    if (!confirmed) {
        return;
    }


    cartData = [];

    discountAmount = 0;

    appliedCoupon = "";


    if (couponInput) {
        couponInput.disabled = false;
        couponInput.value = "";
    }


    if (applyCouponBtn) {
        applyCouponBtn.disabled = false;
    }


    if (couponMessage) {
        couponMessage.textContent = "";
    }


    saveCartData();

    renderCart();

    updateMainCartCount();


    showCartToast(
        "Cart cleared successfully"
    );

}


/* =========================================================
   UPDATE SUMMARY
   ========================================================= */

function updateSummary() {

    const subtotal =
        getSubtotal();


    /* =====================================================
       DELIVERY
       ===================================================== */

    let delivery = 0;


    if (
        subtotal > 0 &&
        subtotal < FREE_DELIVERY_LIMIT
    ) {

        delivery =
            DELIVERY_CHARGE;

    }


    /* =====================================================
       RESET DISCOUNT WHEN EMPTY
       ===================================================== */

    if (subtotal <= 0) {

        discountAmount = 0;

        appliedCoupon = "";

    }


    /* =====================================================
       TOTAL
       ===================================================== */

    const grandTotal =
        Math.max(
            0,
            subtotal +
            delivery -
            discountAmount
        );


    /* =====================================================
       UPDATE HTML
       ===================================================== */

    if (subtotalElement) {

        subtotalElement.textContent =
            cartFormatPrice(subtotal);

    }


    if (discountElement) {

        discountElement.textContent =
            "- " +
            cartFormatPrice(
                discountAmount
            );

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
            ?
            "FREE"
            :
            cartFormatPrice(delivery);

    }


    if (grandTotalElement) {

        grandTotalElement.textContent =
            cartFormatPrice(grandTotal);

    }


    /* =====================================================
       DELIVERY MESSAGE
       ===================================================== */

    if (!deliveryMessage) {
        return;
    }


    if (subtotal <= 0) {

        deliveryMessage.textContent =
            "Add products to your cart.";

    }

    else if (
        subtotal >= FREE_DELIVERY_LIMIT
    ) {

        deliveryMessage.textContent =
            "Congratulations! You unlocked free delivery.";

    }

    else {

        const remaining =
            FREE_DELIVERY_LIMIT -
            subtotal;


        deliveryMessage.textContent =
            `Add ${cartFormatPrice(remaining)} more for FREE delivery.`;

    }

}


/* =========================================================
   UPDATE ITEM TEXT
   ========================================================= */

function updateItemText() {

    if (!cartItemText) {
        return;
    }


    const quantity =
        getTotalQuantity();


    if (quantity === 0) {

        cartItemText.textContent =
            "0 items in your cart";

    }

    else if (quantity === 1) {

        cartItemText.textContent =
            "1 item in your cart";

    }

    else {

        cartItemText.textContent =
            `${quantity} items in your cart`;

    }

}


/* =========================================================
   UPDATE MAIN CART COUNT
   ========================================================= */

function updateMainCartCount() {

    const count =
        getTotalQuantity();


    document
        .querySelectorAll(
            "#cartCount, .cart-count, [data-cart-count]"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

            }
        );

}


/* =========================================================
   COUPON SYSTEM
   ========================================================= */

function applyCoupon() {

    if (!couponInput) {
        return;
    }


    const code =
        couponInput.value
            .trim()
            .toUpperCase();


    /* =====================================================
       EMPTY CODE
       ===================================================== */

    if (!code) {

        setCouponMessage(
            "Please enter a coupon code.",
            "error"
        );

        return;
    }


    /* =====================================================
       ALREADY APPLIED
       ===================================================== */

    if (appliedCoupon) {

        setCouponMessage(
            "A coupon is already applied.",
            "error"
        );

        return;
    }


    const subtotal =
        getSubtotal();


    if (subtotal <= 0) {

        setCouponMessage(
            "Add products before applying a coupon.",
            "error"
        );

        return;
    }


    /* =====================================================
       KHAN10
       ===================================================== */

    if (code === "KHAN10") {

        if (subtotal < 500) {

            setCouponMessage(
                "Minimum order value is ₹500.",
                "error"
            );

            return;
        }


        discountAmount =
            Math.round(
                subtotal * 0.10
            );


        appliedCoupon =
            code;


        setCouponMessage(
            "10% discount applied successfully!",
            "success"
        );


        couponInput.disabled =
            true;


        if (applyCouponBtn) {
            applyCouponBtn.disabled =
                true;
        }


        updateSummary();


        showCartToast(
            "Coupon KHAN10 applied successfully"
        );


        return;
    }


    /* =====================================================
       SAVE200
       ===================================================== */

    if (code === "SAVE200") {

        if (subtotal < 1500) {

            setCouponMessage(
                "Minimum order value is ₹1500.",
                "error"
            );

            return;
        }


        discountAmount =
            200;


        appliedCoupon =
            code;


        setCouponMessage(
            "₹200 discount applied successfully!",
            "success"
        );


        couponInput.disabled =
            true;


        if (applyCouponBtn) {
            applyCouponBtn.disabled =
                true;
        }


        updateSummary();


        showCartToast(
            "Coupon SAVE200 applied successfully"
        );


        return;
    }


    /* =====================================================
       INVALID
       ===================================================== */

    setCouponMessage(
        "Invalid coupon code.",
        "error"
    );

}


/* =========================================================
   COUPON MESSAGE
   ========================================================= */

function setCouponMessage(
    message,
    type
) {

    if (!couponMessage) {
        return;
    }


    couponMessage.textContent =
        message;


    couponMessage.style.color =
        type === "success"
        ?
        "#198754"
        :
        "#e53935";

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function goToCheckout() {

    if (cartData.length === 0) {

        showCartToast(
            "Your cart is empty",
            "error"
        );

        return;
    }


    saveCartData();


    window.location.href =
        "checkout.html";

}


/* =========================================================
   TOAST
   ========================================================= */

function showCartToast(
    message,
    type = "success"
) {

    const oldToast =
        document.querySelector(
            ".khan-toast"
        );


    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `khan-toast ${type}`;


    toast.innerHTML = `

        <div class="toast-icon">

            ${
                type === "error"
                ?
                "✕"
                :
                "✓"
            }

        </div>

        <div class="toast-message">

            ${escapeHTML(message)}

        </div>

        <button
            type="button"
            class="toast-close"
            aria-label="Close"
        >
            &times;
        </button>

    `;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(() => {

        toast.classList.add(
            "show"
        );

    });


    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                toast.remove();

            }
        );

    }


    setTimeout(() => {

        if (toast.parentElement) {

            toast.remove();

        }

    }, 3000);

}


/* =========================================================
   CART ITEM EVENT DELEGATION
   ========================================================= */

function setupCartEvents() {

    if (!cartItemsContainer) {
        return;
    }


    cartItemsContainer.addEventListener(
        "click",
        function(event) {

            const removeButton =
                event.target.closest(
                    ".remove-product"
                );


            if (removeButton) {

                const index =
                    Number(
                        removeButton.dataset.index
                    );


                removeCartItem(index);

                return;
            }


            const decreaseButton =
                event.target.closest(
                    ".decrease"
                );


            if (decreaseButton) {

                const index =
                    Number(
                        decreaseButton.dataset.index
                    );


                changeQuantity(
                    index,
                    -1
                );

                return;
            }


            const increaseButton =
                event.target.closest(
                    ".increase"
                );


            if (increaseButton) {

                const index =
                    Number(
                        increaseButton.dataset.index
                    );


                changeQuantity(
                    index,
                    1
                );

            }

        }
    );

}


/* =========================================================
   INITIALIZE CART
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderCart();

        updateMainCartCount();

        setupCartEvents();


        /* =================================================
           CLEAR CART
           ================================================= */

        if (clearCartBtn) {

            clearCartBtn.addEventListener(
                "click",
                clearCart
            );

        }


        /* =================================================
           COUPON
           ================================================= */

        if (applyCouponBtn) {

            applyCouponBtn.addEventListener(
                "click",
                applyCoupon
            );

        }


        if (couponInput) {

            couponInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        applyCoupon();

                    }

                }
            );

        }


        /* =================================================
           CHECKOUT
           ================================================= */

        if (checkoutBtn) {

            checkoutBtn.addEventListener(
                "click",
                goToCheckout
            );

        }

    }
);


/* =========================================================
   CART PAGE END
   ========================================================= */