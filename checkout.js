"use strict";

/* =========================================================
   KHAN STORE - CHECKOUT
   REAL MONGODB ORDER INTEGRATION
   USER LINKED ORDERS
   ========================================================= */

const API_URL = "http://https://khan-store.onrender.com";

let cart = [];

let appliedCoupon = null;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadCart();

    setupDeliveryOptions();

    setupPaymentOptions();

    setupFormValidation();

    setupCoupon();

    setupPlaceOrder();

    setupInputRestrictions();

    loadLoggedUserData();

});


/* =========================================================
   LOAD LOGGED-IN USER
   ========================================================= */

function getLoggedInUser() {

    try {

        const savedUser =
            localStorage.getItem("khanUser");

        if (!savedUser) {
            return null;
        }

        const user =
            JSON.parse(savedUser);

        if (!user || typeof user !== "object") {
            return null;
        }

        return user;

    } catch (error) {

        console.error(
            "Could not read logged-in user:",
            error
        );

        return null;

    }

}


/* =========================================================
   LOAD USER DATA INTO CHECKOUT
   ========================================================= */

function loadLoggedUserData() {

    const user =
        getLoggedInUser();

    if (!user) {
        console.log(
            "No logged-in KHAN Store user found."
        );
        return;
    }

    console.log(
        "Checkout Logged User:",
        user
    );


    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");


    /*
       Only fill fields if they are empty.
       Existing checkout data will NOT be overwritten.
    */

    if (
        fullName &&
        !fullName.value.trim() &&
        user.name
    ) {

        fullName.value =
            user.name;

    }


    if (
        email &&
        !email.value.trim() &&
        user.email
    ) {

        email.value =
            user.email;

    }


    if (
        phone &&
        !phone.value.trim() &&
        user.phone
    ) {

        phone.value =
            user.phone;

    }

}


/* =========================================================
   LOAD CART
   ========================================================= */

function loadCart() {

    try {

        cart =
            JSON.parse(
                localStorage.getItem("khanCart")
            ) || [];

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        cart = [];

    }


    if (!Array.isArray(cart)) {

        cart = [];

    }


    if (cart.length === 0) {

        showEmptyCartMessage();

        return;

    }


    renderCheckoutProducts();

    calculateCheckoutTotal();

}


/* =========================================================
   EMPTY CART
   ========================================================= */

function showEmptyCartMessage() {

    const productsContainer =
        document.getElementById(
            "checkoutProducts"
        );


    if (productsContainer) {

        productsContainer.innerHTML = `

            <div class="checkout-empty">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some products before proceeding to checkout.
                </p>

                <a
                    href="products.html"
                    class="continue-shopping-btn"
                >
                    Continue Shopping
                </a>

            </div>

        `;

    }


    const placeOrderBtn =
        document.getElementById(
            "placeOrderBtn"
        );


    if (placeOrderBtn) {

        placeOrderBtn.disabled = true;

    }

}


/* =========================================================
   NORMALIZE CART ITEM
   ========================================================= */

function normalizeCartItem(item) {

    const price =
        Number(
            item.price ??
            item.productPrice ??
            item.salePrice ??
            0
        );


    const quantity =
        Math.max(
            1,
            Number(
                item.quantity ??
                item.qty ??
                1
            )
        );


    const name =
        item.name ||
        item.title ||
        item.productName ||
        "Product";


    const image =
        item.image ||
        item.imageUrl ||
        item.productImage ||
        "";


    const productId =
        item.productId ||
        item.id ||
        item._id ||
        "";


    return {

        productId:
            String(productId),

        name:
            String(name),

        image:
            String(image),

        price:
            price,

        quantity:
            quantity,

        subtotal:
            price * quantity

    };

}


/* =========================================================
   RENDER CHECKOUT PRODUCTS
   ========================================================= */

function renderCheckoutProducts() {

    const container =
        document.getElementById(
            "checkoutProducts"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    let totalItems = 0;


    cart.forEach((item) => {

        const product =
            normalizeCartItem(item);


        totalItems +=
            product.quantity;


        const productHTML = `

            <div class="checkout-product">

                <div class="checkout-product-image">

                    ${
                        product.image
                            ? `

                                <img
                                    src="${escapeHTML(product.image)}"
                                    alt="${escapeHTML(product.name)}"
                                    onerror="this.style.display='none';"
                                >

                            `
                            : `

                                <i class="fa-solid fa-box"></i>

                            `
                    }

                </div>


                <div class="checkout-product-info">

                    <h4 class="checkout-product-name">

                        ${escapeHTML(product.name)}

                    </h4>


                    <div class="checkout-product-meta">

                        <span>
                            Qty: ${product.quantity}
                        </span>


                        <strong>
                            ₹${formatMoney(product.subtotal)}
                        </strong>

                    </div>

                </div>

            </div>

        `;


        container.insertAdjacentHTML(
            "beforeend",
            productHTML
        );

    });


    const summaryItemCount =
        document.getElementById(
            "summaryItemCount"
        );


    if (summaryItemCount) {

        summaryItemCount.textContent =
            `${totalItems} ${
                totalItems === 1
                    ? "Item"
                    : "Items"
            }`;

    }

}


/* =========================================================
   DELIVERY OPTIONS
   ========================================================= */

function setupDeliveryOptions() {

    const deliveryOptions =
        document.querySelectorAll(
            ".delivery-option"
        );


    const deliveryRadios =
        document.querySelectorAll(
            'input[name="delivery"]'
        );


    deliveryOptions.forEach((option) => {

        option.addEventListener(
            "click",
            () => {

                const radio =
                    option.querySelector(
                        'input[name="delivery"]'
                    );


                if (!radio) {
                    return;
                }


                radio.checked = true;


                updateSelectedDelivery();


                calculateCheckoutTotal();

            }
        );


        option.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    const radio =
                        option.querySelector(
                            'input[name="delivery"]'
                        );


                    if (radio) {

                        radio.checked = true;


                        updateSelectedDelivery();


                        calculateCheckoutTotal();

                    }

                }

            }
        );


        option.setAttribute(
            "tabindex",
            "0"
        );

    });


    deliveryRadios.forEach((radio) => {

        radio.addEventListener(
            "change",
            () => {

                updateSelectedDelivery();

                calculateCheckoutTotal();

            }
        );

    });


    if (
        !document.querySelector(
            'input[name="delivery"]:checked'
        )
    ) {

        const standardRadio =
            document.querySelector(
                'input[name="delivery"][value="standard"]'
            );


        if (standardRadio) {

            standardRadio.checked = true;

        }

    }


    updateSelectedDelivery();

}


/* =========================================================
   UPDATE SELECTED DELIVERY
   ========================================================= */

function updateSelectedDelivery() {

    const options =
        document.querySelectorAll(
            ".delivery-option"
        );


    options.forEach((option) => {

        const radio =
            option.querySelector(
                'input[name="delivery"]'
            );


        if (!radio) {
            return;
        }


        const isSelected =
            radio.checked;


        option.classList.toggle(
            "active",
            isSelected
        );


        option.classList.remove(
            "selected"
        );


        option.setAttribute(
            "aria-checked",
            String(isSelected)
        );

    });

}


/* =========================================================
   GET DELIVERY TYPE
   ========================================================= */

function getDeliveryType() {

    const selected =
        document.querySelector(
            'input[name="delivery"]:checked'
        );


    return selected
        ? selected.value
        : "standard";

}


/* =========================================================
   GET DELIVERY CHARGE
   ========================================================= */

function getDeliveryCharge() {

    const deliveryType =
        getDeliveryType();


    switch (deliveryType) {

        case "standard":
            return 99;

        case "express":
            return 199;

        case "free":
            return 0;

        default:
            return 99;

    }

}


/* =========================================================
   PAYMENT OPTIONS
   ========================================================= */

function setupPaymentOptions() {

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option"
        );


    const paymentRadios =
        document.querySelectorAll(
            'input[name="payment"]'
        );


    paymentOptions.forEach((option) => {

        option.addEventListener(
            "click",
            () => {

                const radio =
                    option.querySelector(
                        'input[name="payment"]'
                    );


                if (!radio) {
                    return;
                }


                radio.checked = true;


                updateSelectedPayment();

            }
        );


        option.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    const radio =
                        option.querySelector(
                            'input[name="payment"]'
                        );


                    if (radio) {

                        radio.checked = true;

                        updateSelectedPayment();

                    }

                }

            }
        );


        option.setAttribute(
            "tabindex",
            "0"
        );

    });


    paymentRadios.forEach((radio) => {

        radio.addEventListener(
            "change",
            () => {

                updateSelectedPayment();

            }
        );

    });


    /* Default payment = COD */

    if (
        !document.querySelector(
            'input[name="payment"]:checked'
        )
    ) {

        const codRadio =
            document.querySelector(
                'input[name="payment"][value="cod"]'
            );


        if (codRadio) {

            codRadio.checked = true;

        }

    }


    updateSelectedPayment();

}


/* =========================================================
   UPDATE SELECTED PAYMENT
   ========================================================= */

function updateSelectedPayment() {

    const options =
        document.querySelectorAll(
            ".payment-option"
        );


    options.forEach((option) => {

        const radio =
            option.querySelector(
                'input[name="payment"]'
            );


        if (!radio) {
            return;
        }


        const isSelected =
            radio.checked;


        option.classList.toggle(
            "active",
            isSelected
        );


        option.classList.remove(
            "selected"
        );


        option.setAttribute(
            "aria-checked",
            String(isSelected)
        );

    });

}


/* =========================================================
   GET PAYMENT METHOD
   ========================================================= */

function getPaymentMethod() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    return selected
        ? selected.value
        : "cod";

}


/* =========================================================
   COUPON
   ========================================================= */

function setupCoupon() {

    const couponButton =
        document.getElementById(
            "applyCouponBtn"
        );


    const couponInput =
        document.getElementById(
            "couponInput"
        );


    if (
        !couponButton ||
        !couponInput
    ) {

        return;

    }


    couponButton.addEventListener(
        "click",
        applyCoupon
    );


    couponInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                applyCoupon();

            }

        }
    );

}


/* =========================================================
   APPLY COUPON
   ========================================================= */

function applyCoupon() {

    const input =
        document.getElementById(
            "couponInput"
        );


    if (!input) {
        return;
    }


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (!code) {

        showCouponMessage(
            "Please enter a coupon code.",
            "error"
        );

        return;

    }


    const subtotal =
        calculateSubtotal();


    let discount = 0;


    /* KHAN10 */

    if (code === "KHAN10") {

        discount =
            Math.round(
                subtotal * 0.10
            );


        appliedCoupon = {

            code:
                "KHAN10",

            discount:
                discount

        };


        showCouponMessage(
            `KHAN10 applied! You saved ₹${formatMoney(discount)}.`,
            "success"
        );

    }


    /* SAVE200 */

    else if (code === "SAVE200") {

        if (subtotal < 2000) {

            appliedCoupon = null;


            showCouponMessage(
                "SAVE200 requires a minimum order of ₹2,000.",
                "error"
            );


            calculateCheckoutTotal();


            return;

        }


        discount = 200;


        appliedCoupon = {

            code:
                "SAVE200",

            discount:
                discount

        };


        showCouponMessage(
            "SAVE200 applied! You saved ₹200.",
            "success"
        );

    }


    /* INVALID */

    else {

        appliedCoupon = null;


        showCouponMessage(
            "Invalid coupon code.",
            "error"
        );

    }


    calculateCheckoutTotal();

}


/* =========================================================
   COUPON MESSAGE
   ========================================================= */

function showCouponMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "couponMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `coupon-message ${type}`;

}


/* =========================================================
   CALCULATE SUBTOTAL
   ========================================================= */

function calculateSubtotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                normalizeCartItem(item);


            return total +
                product.subtotal;

        },
        0
    );

}


/* =========================================================
   CALCULATE TOTAL
   ========================================================= */

function calculateCheckoutTotal() {

    const subtotal =
        calculateSubtotal();


    const delivery =
        getDeliveryCharge();


    const discount =
        appliedCoupon
            ? Number(
                appliedCoupon.discount || 0
            )
            : 0;


    const tax = 0;


    const total =
        Math.max(
            0,
            subtotal +
            delivery +
            tax -
            discount
        );


    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );


    const deliveryElement =
        document.getElementById(
            "checkoutDelivery"
        );


    const discountElement =
        document.getElementById(
            "checkoutDiscount"
        );


    const discountRow =
        document.getElementById(
            "discountRow"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${formatMoney(subtotal)}`;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : `₹${formatMoney(delivery)}`;

    }


    if (discountElement) {

        discountElement.textContent =
            `-₹${formatMoney(discount)}`;

    }


    if (discountRow) {

        discountRow.style.display =
            discount > 0
                ? "flex"
                : "none";

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${formatMoney(total)}`;

    }


    return {

        subtotal,

        delivery,

        tax,

        discount,

        total

    };

}


/* =========================================================
   INPUT RESTRICTIONS
   ========================================================= */

function setupInputRestrictions() {

    const phone =
        document.getElementById("phone");


    const pincode =
        document.getElementById("pincode");


    const fullName =
        document.getElementById("fullName");


    const city =
        document.getElementById("city");


    if (phone) {

        phone.addEventListener(
            "input",
            () => {

                phone.value =
                    phone.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );

    }


    if (pincode) {

        pincode.addEventListener(
            "input",
            () => {

                pincode.value =
                    pincode.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

            }
        );

    }


    if (fullName) {

        fullName.addEventListener(
            "input",
            () => {

                fullName.value =
                    fullName.value.replace(
                        /[^a-zA-Z\s.'-]/g,
                        ""
                    );

            }
        );

    }


    if (city) {

        city.addEventListener(
            "input",
            () => {

                city.value =
                    city.value.replace(
                        /[^a-zA-Z\s.'-]/g,
                        ""
                    );

            }
        );

    }

}


/* =========================================================
   FORM VALIDATION
   ========================================================= */

function setupFormValidation() {

    const fields = [

        "fullName",

        "phone",

        "email",

        "address",

        "city",

        "state",

        "pincode"

    ];


    fields.forEach(
        (fieldId) => {

            const field =
                document.getElementById(
                    fieldId
                );


            if (!field) {
                return;
            }


            field.addEventListener(
                "input",
                () => {

                    clearFieldError(
                        fieldId
                    );

                }
            );


            field.addEventListener(
                "blur",
                () => {

                    validateField(
                        fieldId
                    );

                }
            );

        }
    );

}


/* =========================================================
   VALIDATE FIELD
   ========================================================= */

function validateField(fieldId) {

    const field =
        document.getElementById(
            fieldId
        );


    if (!field) {
        return true;
    }


    const value =
        field.value.trim();


    let errorMessage = "";


    switch (fieldId) {

        case "fullName":

            if (!value) {

                errorMessage =
                    "Please enter your full name.";

            } else if (value.length < 2) {

                errorMessage =
                    "Please enter a valid name.";

            }

            break;


        case "phone":

            if (!value) {

                errorMessage =
                    "Please enter your phone number.";

            } else if (
                !/^[6-9]\d{9}$/.test(value)
            ) {

                errorMessage =
                    "Please enter a valid 10-digit mobile number.";

            }

            break;


        case "email":

            if (!value) {

                errorMessage =
                    "Please enter your email.";

            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {

                errorMessage =
                    "Please enter a valid email address.";

            }

            break;


        case "address":

            if (!value) {

                errorMessage =
                    "Please enter your delivery address.";

            } else if (value.length < 5) {

                errorMessage =
                    "Please enter a complete address.";

            }

            break;


        case "city":

            if (!value) {

                errorMessage =
                    "Please enter your city.";

            }

            break;


        case "state":

            if (!value) {

                errorMessage =
                    "Please enter your state.";

            }

            break;


        case "pincode":

            if (!value) {

                errorMessage =
                    "Please enter your pincode.";

            } else if (
                !/^\d{6}$/.test(value)
            ) {

                errorMessage =
                    "Please enter a valid 6-digit pincode.";

            }

            break;

    }


    if (errorMessage) {

        showFieldError(
            fieldId,
            errorMessage
        );

        return false;

    }


    clearFieldError(
        fieldId
    );


    return true;

}


/* =========================================================
   VALIDATE FORM
   ========================================================= */

function validateForm() {

    const fields = [

        "fullName",

        "phone",

        "email",

        "address",

        "city",

        "state",

        "pincode"

    ];


    let isValid = true;


    fields.forEach(
        (fieldId) => {

            if (
                !validateField(fieldId)
            ) {

                isValid = false;

            }

        }
    );


    return isValid;

}


/* =========================================================
   FIELD ERROR
   ========================================================= */

function showFieldError(
    fieldId,
    message
) {

    const error =
        document.getElementById(
            `${fieldId}Error`
        );


    if (error) {

        error.textContent =
            message;

        error.style.display =
            "block";

    }


    const field =
        document.getElementById(
            fieldId
        );


    if (field) {

        field.classList.add(
            "error"
        );

    }

}


/* =========================================================
   CLEAR FIELD ERROR
   ========================================================= */

function clearFieldError(
    fieldId
) {

    const error =
        document.getElementById(
            `${fieldId}Error`
        );


    if (error) {

        error.textContent = "";

        error.style.display =
            "none";

    }


    const field =
        document.getElementById(
            fieldId
        );


    if (field) {

        field.classList.remove(
            "error"
        );

    }

}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function setupPlaceOrder() {

    const button =
        document.getElementById(
            "placeOrderBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            if (cart.length === 0) {

                showCheckoutToast(
                    "Your cart is empty.",
                    "error"
                );

                return;

            }


            if (!validateForm()) {

                showCheckoutToast(
                    "Please fill all required details correctly.",
                    "error"
                );

                return;

            }


            const originalText =
                button.innerHTML;


            button.disabled = true;


            button.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Placing Order...

            `;


            try {

                await createOrder();

            } catch (error) {

                console.error(
                    "ORDER ERROR:",
                    error
                );


                showCheckoutToast(
                    error.message ||
                    "Something went wrong while placing your order.",
                    "error"
                );


                button.disabled = false;


                button.innerHTML =
                    originalText;

            }

        }
    );

}


/* =========================================================
   CREATE ORDER
   ========================================================= */

async function createOrder() {

    const fullName =
        document.getElementById(
            "fullName"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const address =
        document.getElementById(
            "address"
        ).value.trim();


    const city =
        document.getElementById(
            "city"
        ).value.trim();


    const state =
        document.getElementById(
            "state"
        ).value.trim();


    const pincode =
        document.getElementById(
            "pincode"
        ).value.trim();


    const landmarkElement =
        document.getElementById(
            "landmark"
        );


    const landmark =
        landmarkElement
            ? landmarkElement.value.trim()
            : "";


    /* =====================================================
       GET LOGGED-IN USER
       ===================================================== */

    const loggedUser =
        getLoggedInUser();


    /*
       IMPORTANT:
       userId is taken from the logged-in account,
       NOT from checkout form.
    */

    const userId =
        loggedUser?.id ||
        loggedUser?._id ||
        loggedUser?.userId ||
        "";


    const userEmail =
        String(
            loggedUser?.email ||
            ""
        )
            .trim()
            .toLowerCase();


    const userPhone =
        String(
            loggedUser?.phone ||
            ""
        )
            .replace(
                /\D/g,
                ""
            );


    console.log(
        "ORDER USER LINK:",
        {
            userId,
            userEmail,
            userPhone
        }
    );


    /*
       User must be logged in.
    */

    if (!loggedUser || !userId) {

        throw new Error(
            "Your login session is missing. Please login again before placing the order."
        );

    }


    const paymentMethod =
        getPaymentMethod();


    const deliveryType =
        getDeliveryType();


    const pricing =
        calculateCheckoutTotal();


    const orderId =
        generateOrderId();


    const orderItems =
        cart.map(
            normalizeCartItem
        );


    /* =====================================================
       ORDER OBJECT
       ===================================================== */

    const order = {

        id:
            orderId,

        orderId:
            orderId,


        /*
           THIS IS THE IMPORTANT FIX
        */

        userId:
            String(userId),


        createdAt:
            new Date().toISOString(),


        status:
            "Processing",


        paymentStatus:
            "pending",


        paymentMethod:
            paymentMethod,


        deliveryMethod:
            deliveryType,


        deliveryType:
            deliveryType,


        /* =================================================
           CUSTOMER
           ================================================= */

        customer: {

            /*
               IMPORTANT USER LINK
            */

            userId:
                String(userId),


            name:
                fullName,


            email:
                email,


            phone:
                phone,


            address:
                address,


            city:
                city,


            state:
                state,


            pincode:
                pincode

        },


        /* =================================================
           ACCOUNT INFORMATION
           ================================================= */

        account: {

            userId:
                String(userId),

            email:
                userEmail,

            phone:
                userPhone

        },


        /* =================================================
           SHIPPING ADDRESS
           ================================================= */

        shippingAddress: {

            address:
                address,

            city:
                city,

            state:
                state,

            pincode:
                pincode,

            landmark:
                landmark

        },


        /* =================================================
           ITEMS
           ================================================= */

        items:
            orderItems,


        /* =================================================
           PRICING
           ================================================= */

        pricing: {

            subtotal:
                pricing.subtotal,

            delivery:
                pricing.delivery,

            tax:
                pricing.tax,

            discount:
                pricing.discount,

            total:
                pricing.total

        }

    };


    console.log(
        "ORDER CREATED WITH USER ID:",
        order
    );


    /* =====================================================
       SAVE ORDER TO MONGODB
       ===================================================== */

    const mongoResult =
        await saveOrderToMongoDB(
            order
        );


    if (!mongoResult.success) {

        throw new Error(
            mongoResult.message ||
            mongoResult.error ||
            "Unable to save order."
        );

    }


    console.log(
        "ORDER SAVED TO MONGODB:",
        mongoResult.order
    );


    /* =====================================================
       SAVE LOCAL ORDER
       ===================================================== */

    saveLocalOrder(
        order
    );


    /* =====================================================
       SAVE LAST ORDER
       ===================================================== */

    localStorage.setItem(
        "khanLastOrder",
        JSON.stringify(order)
    );


    sessionStorage.setItem(
        "khanLatestOrderId",
        orderId
    );


    /* =====================================================
       CLEAR CART
       ===================================================== */

    localStorage.removeItem(
        "khanCart"
    );


    /* =====================================================
       SUCCESS
       ===================================================== */

    window.location.href =
        `order-success.html?order=${encodeURIComponent(
            orderId
        )}`;

}


/* =========================================================
   SAVE ORDER TO MONGODB
   ========================================================= */

async function saveOrderToMongoDB(
    order
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            /*
                               IMPORTANT:
                               Send userId at TOP LEVEL too.
                            */

                            userId:
                                order.userId,


                            orderId:
                                order.orderId,


                            customer:
                                order.customer,


                            account:
                                order.account,


                            shippingAddress:
                                order.shippingAddress,


                            items:
                                order.items,


                            pricing:
                                order.pricing,


                            paymentMethod:
                                order.paymentMethod,


                            paymentStatus:
                                order.paymentStatus,


                            deliveryType:
                                order.deliveryType,


                            status:
                                order.status

                        })

                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            console.error(
                "Invalid server response:",
                jsonError
            );

        }


        console.log(
            "Order API Response:",
            data
        );


        if (!response.ok) {

            return {

                success:
                    false,

                message:
                    data?.message ||
                    data?.error ||
                    `Server error: ${response.status}`,

                error:
                    data?.error ||
                    ""

            };

        }


        if (
            !data ||
            data.success !== true
        ) {

            return {

                success:
                    false,

                message:
                    data?.message ||
                    "Order could not be saved.",

                error:
                    data?.error ||
                    ""

            };

        }


        return {

            success:
                true,

            order:
                data.order ||
                data.data ||
                order

        };


    } catch (error) {

        console.error(
            "Backend connection error:",
            error
        );


        return {

            success:
                false,

            message:
                "Cannot connect to KHAN Store backend. Please make sure the backend server is running on port 5000.",

            error:
                error.message

        };

    }

}


/* =========================================================
   SAVE LOCAL ORDER
   ========================================================= */

function saveLocalOrder(
    order
) {

    let orders = [];


    try {

        orders =
            JSON.parse(
                localStorage.getItem(
                    "khanOrders"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Local orders parse error:",
            error
        );

        orders = [];

    }


    if (!Array.isArray(orders)) {

        orders = [];

    }


    const existingIndex =
        orders.findIndex(
            (item) =>
                item.orderId ===
                order.orderId
        );


    if (existingIndex >= 0) {

        orders[
            existingIndex
        ] =
            order;

    } else {

        orders.unshift(
            order
        );

    }


    localStorage.setItem(
        "khanOrders",
        JSON.stringify(
            orders
        )
    );

}


/* =========================================================
   GENERATE ORDER ID
   ========================================================= */

function generateOrderId() {

    const randomNumber =
        Math.floor(
            10000000 +
            Math.random() * 90000000
        );


    return `KHS${randomNumber}`;

}


/* =========================================================
   TOAST
   ========================================================= */

function showCheckoutToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "checkoutToast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast ||
        !toastMessage
    ) {

        alert(message);

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.remove(
        "success",
        "error",
        "show"
    );


    toast.classList.add(
        type
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3500
    );

}


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function formatMoney(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 0
        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}