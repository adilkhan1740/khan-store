"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    // =====================================================
    // CONFIG
    // =====================================================

    const API_URL = "http://https://khan-store.onrender.com";

    const CART_KEY = "khanCart";
    const LOCAL_ORDER_KEY = "khanOrders";


    // =====================================================
    // LOGIN CHECK
    // =====================================================

    const isLoggedIn =
        localStorage.getItem("khanLoggedIn");

    if (isLoggedIn !== "true") {

        sessionStorage.setItem(
            "khanRedirectAfterLogin",
            "my-orders.html"
        );

        window.location.href = "login.html";

        return;
    }


    // =====================================================
    // ELEMENTS
    // =====================================================

    const ordersList =
        document.getElementById("ordersList");

    const emptyOrders =
        document.getElementById("emptyOrders");

    const orderCount =
        document.getElementById("orderCount");

    const orderSearch =
        document.getElementById("orderSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const ordersToast =
        document.getElementById("ordersToast");

    const ordersToastText =
        document.getElementById("ordersToastText");


    // =====================================================
    // CURRENT USER
    // =====================================================

    let currentUser = null;

    try {

        const savedUser =
            localStorage.getItem("khanUser");

        if (savedUser) {

            currentUser =
                JSON.parse(savedUser);

        }

    } catch (error) {

        console.error(
            "Could not read logged-in user:",
            error
        );

    }


    console.log(
        "KHAN Store Logged User:",
        currentUser
    );


    // =====================================================
    // ORDERS
    // =====================================================

    let orders = [];


    // =====================================================
    // LOAD LOCAL ORDERS
    // =====================================================

    function loadLocalOrders() {

        try {

            const savedOrders =
                localStorage.getItem(
                    LOCAL_ORDER_KEY
                );

            if (!savedOrders) {
                return [];
            }

            const parsed =
                JSON.parse(savedOrders);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "Could not load local orders:",
                error
            );

            return [];

        }

    }


    // =====================================================
    // NORMALIZE CUSTOMER
    // =====================================================

    function normalizeCustomer(order) {

        if (!order) {
            return {};
        }


        let customer =
            order.customer ||
            order.customerInfo ||
            order.customerDetails ||
            {};


        // ---------------------------------------------
        // Sometimes customer may be JSON string
        // ---------------------------------------------

        if (
            typeof customer === "string"
        ) {

            try {

                customer =
                    JSON.parse(customer);

            } catch (error) {

                console.warn(
                    "Could not parse customer data:",
                    error
                );

                customer = {};

            }

        }


        if (
            !customer ||
            typeof customer !== "object"
        ) {

            customer = {};

        }


        return customer;

    }


    // =====================================================
    // NORMALIZE BACKEND ORDER
    // =====================================================

    function normalizeOrder(order) {

        if (!order) {
            return null;
        }


        const customer =
            normalizeCustomer(order);


        const normalizedItems =
            Array.isArray(order.items)
                ? order.items.map(item => {

                    return {

                        id:
                            item.productId ||
                            item.id ||
                            "",

                        productId:
                            item.productId ||
                            item.id ||
                            "",

                        name:
                            item.name ||
                            "Product",

                        image:
                            item.image ||
                            "images/placeholder.jpg",

                        price:
                            Number(
                                item.price || 0
                            ),

                        quantity:
                            Number(
                                item.quantity || 1
                            ),

                        subtotal:
                            Number(
                                item.subtotal ||
                                (
                                    Number(
                                        item.price || 0
                                    ) *
                                    Number(
                                        item.quantity || 1
                                    )
                                )
                            )

                    };

                })
                : [];


        return {

            id:
                order.orderId ||
                order.id ||
                order._id ||
                "N/A",

            orderId:
                order.orderId ||
                order.id ||
                order._id ||
                "N/A",

            status:
                order.status ||
                "Placed",

            createdAt:
                order.createdAt ||
                order.updatedAt ||
                new Date().toISOString(),

            updatedAt:
                order.updatedAt ||
                order.createdAt ||
                new Date().toISOString(),

            customer:
                customer,

            paymentMethod:
                order.paymentMethod ||
                "cod",

            paymentStatus:
                order.paymentStatus ||
                "pending",

            deliveryType:
                order.deliveryType ||
                "standard",

            items:
                normalizedItems,

            pricing:
                order.pricing || {

                    subtotal: 0,
                    delivery: 0,
                    tax: 0,
                    discount: 0,
                    total: 0

                }

        };

    }


    // =====================================================
    // GET USER EMAIL
    // =====================================================

    function getCurrentUserEmail() {

        return String(
            currentUser?.email ||
            ""
        )
            .trim()
            .toLowerCase();

    }


    // =====================================================
    // GET USER PHONE
    // =====================================================

    function getCurrentUserPhone() {

        return String(
            currentUser?.phone ||
            ""
        )
            .replace(
                /\D/g,
                ""
            );

    }


    // =====================================================
    // GET USER ID
    // =====================================================

    function getCurrentUserId() {

        return String(
            currentUser?.id ||
            currentUser?._id ||
            ""
        )
            .trim();

    }


    // =====================================================
    // CHECK ORDER BELONGS TO CURRENT USER
    // =====================================================

    function belongsToCurrentUser(order) {

        if (!currentUser) {

            return false;

        }


        const customer =
            normalizeCustomer(order);


        // ---------------------------------------------
        // CURRENT USER
        // ---------------------------------------------

        const userEmail =
            getCurrentUserEmail();

        const userPhone =
            getCurrentUserPhone();

        const userId =
            getCurrentUserId();


        // ---------------------------------------------
        // ORDER EMAIL
        // ---------------------------------------------

        const orderEmail =
            String(
                customer.email ||
                customer.emailAddress ||
                order?.email ||
                order?.customerEmail ||
                ""
            )
                .trim()
                .toLowerCase();


        // ---------------------------------------------
        // ORDER PHONE
        // ---------------------------------------------

        const orderPhone =
            String(
                customer.phone ||
                customer.mobile ||
                customer.mobileNumber ||
                customer.phoneNumber ||
                order?.phone ||
                order?.customerPhone ||
                ""
            )
                .replace(
                    /\D/g,
                    ""
                );


        // ---------------------------------------------
        // ORDER USER ID
        // ---------------------------------------------

        const orderUserId =
            String(
                customer.userId ||
                customer.userID ||
                customer.user_id ||
                customer.id ||
                customer._id ||
                order?.userId ||
                order?.userID ||
                order?.user_id ||
                order?.customerId ||
                ""
            )
                .trim();


        // ---------------------------------------------
        // DEBUG
        // ---------------------------------------------

        console.log(
            "ORDER MATCH CHECK:",
            {
                orderId:
                    order.orderId ||
                    order.id,

                userEmail:
                    userEmail,

                orderEmail:
                    orderEmail,

                userPhone:
                    userPhone,

                orderPhone:
                    orderPhone,

                userId:
                    userId,

                orderUserId:
                    orderUserId,

                customer:
                    customer
            }
        );


        // ---------------------------------------------
        // EMAIL MATCH
        // ---------------------------------------------

        if (
            userEmail &&
            orderEmail &&
            userEmail === orderEmail
        ) {

            console.log(
                "ORDER MATCHED BY EMAIL"
            );

            return true;

        }


        // ---------------------------------------------
        // PHONE MATCH
        // ---------------------------------------------

        if (
            userPhone &&
            orderPhone &&
            userPhone === orderPhone
        ) {

            console.log(
                "ORDER MATCHED BY PHONE"
            );

            return true;

        }


        // ---------------------------------------------
        // USER ID MATCH
        // ---------------------------------------------

        if (
            userId &&
            orderUserId &&
            userId === orderUserId
        ) {

            console.log(
                "ORDER MATCHED BY USER ID"
            );

            return true;

        }


        return false;

    }


    // =====================================================
    // LOAD ORDERS FROM MONGODB
    // =====================================================

    async function loadOrdersFromMongoDB() {

        try {

            console.log(
                "Loading orders from MongoDB..."
            );


            const response =
                await fetch(
                    `${API_URL}/api/orders`,
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
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "MongoDB Orders:",
                data
            );


            // -----------------------------------------
            // GET BACKEND ORDERS
            // -----------------------------------------

            let backendOrders = [];


            if (
                Array.isArray(data)
            ) {

                backendOrders =
                    data;

            }

            else if (
                data &&
                Array.isArray(data.orders)
            ) {

                backendOrders =
                    data.orders;

            }


            console.log(
                "BACKEND ORDER COUNT:",
                backendOrders.length
            );


            // -----------------------------------------
            // NORMALIZE
            // -----------------------------------------

            const normalized =
                backendOrders
                    .map(
                        normalizeOrder
                    )
                    .filter(Boolean);


            console.log(
                "NORMALIZED ORDERS:",
                normalized
            );


            // -----------------------------------------
            // FILTER CURRENT USER
            // -----------------------------------------

            const userOrders =
                normalized.filter(
                    order =>
                        belongsToCurrentUser(
                            order
                        )
                );


            console.log(
                "USER ORDERS:",
                userOrders
            );


            // -----------------------------------------
            // SORT NEWEST FIRST
            // -----------------------------------------

            userOrders.sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            );


            // -----------------------------------------
            // SAVE BACKUP
            // -----------------------------------------

            if (
                userOrders.length > 0
            ) {

                try {

                    localStorage.setItem(
                        LOCAL_ORDER_KEY,
                        JSON.stringify(
                            userOrders
                        )
                    );

                } catch (error) {

                    console.warn(
                        "Could not save local order backup:",
                        error
                    );

                }


                return userOrders;

            }


            // -----------------------------------------
            // CHECK LOCAL BACKUP
            // -----------------------------------------

            const localOrders =
                loadLocalOrders();


            const localUserOrders =
                localOrders
                    .map(
                        normalizeOrder
                    )
                    .filter(Boolean)
                    .filter(
                        order =>
                            belongsToCurrentUser(
                                order
                            )
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                    );


            if (
                localUserOrders.length > 0
            ) {

                console.log(
                    "USING LOCAL BACKUP ORDERS:",
                    localUserOrders
                );


                return localUserOrders;

            }


            return [];

        } catch (error) {

            console.error(
                "MongoDB orders could not be loaded:",
                error
            );


            // -----------------------------------------
            // LOCAL STORAGE FALLBACK
            // -----------------------------------------

            const localOrders =
                loadLocalOrders();


            const localUserOrders =
                localOrders
                    .map(
                        normalizeOrder
                    )
                    .filter(Boolean)
                    .filter(
                        order =>
                            belongsToCurrentUser(
                                order
                            )
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                    );


            return localUserOrders;

        }

    }


    // =====================================================
    // UPDATE ORDER COUNT
    // =====================================================

    function updateOrderCount(count) {

        if (orderCount) {

            orderCount.textContent =
                count;

        }

    }


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    function formatPrice(price) {

        return "₹" +
            Number(
                price || 0
            )
                .toLocaleString(
                    "en-IN"
                );

    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(dateString) {

        if (!dateString) {

            return "Date unavailable";

        }


        const date =
            new Date(
                dateString
            );


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return "Date unavailable";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

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


    // =====================================================
    // GET ORDER TOTAL
    // =====================================================

    function getOrderTotal(order) {

        if (
            order.pricing &&
            order.pricing.total !== undefined
        ) {

            return Number(
                order.pricing.total
            );

        }


        if (
            order.total !== undefined
        ) {

            return Number(
                order.total
            );

        }


        return 0;

    }


    // =====================================================
    // RENDER ORDERS
    // =====================================================

    function renderOrders(list) {

        if (!ordersList) {

            console.error(
                "ordersList element not found."
            );

            return;

        }


        updateOrderCount(
            list.length
        );


        if (
            list.length === 0
        ) {

            ordersList.innerHTML =
                "";


            if (emptyOrders) {

                emptyOrders.style.display =
                    "block";

            }

            return;

        }


        if (emptyOrders) {

            emptyOrders.style.display =
                "none";

        }


        ordersList.innerHTML =
            list
                .map(
                    createOrderCard
                )
                .join("");


        attachButtonEvents();

    }


    // =====================================================
    // CREATE ORDER CARD
    // =====================================================

    function createOrderCard(order) {

        const orderId =
            order.orderId ||
            order.id ||
            "N/A";


        const status =
            order.status ||
            "Placed";


        const orderDate =
            formatDate(
                order.createdAt
            );


        const total =
            getOrderTotal(
                order
            );


        const items =
            Array.isArray(
                order.items
            )
                ? order.items
                : [];


        let productsHTML = "";


        if (
            items.length > 0
        ) {

            productsHTML =
                items
                    .map(
                        item => {

                            const name =
                                item.name ||
                                "Product";


                            const price =
                                Number(
                                    item.price ||
                                    0
                                );


                            const quantity =
                                Number(
                                    item.quantity ||
                                    1
                                );


                            const image =
                                item.image ||
                                "images/placeholder.jpg";


                            return `
                                <div class="order-product">

                                    <div class="order-product-image">

                                        <img
                                            src="${escapeHTML(image)}"
                                            alt="${escapeHTML(name)}"
                                            onerror="this.src='images/placeholder.jpg'"
                                        >

                                    </div>


                                    <div class="order-product-info">

                                        <h3>
                                            ${escapeHTML(name)}
                                        </h3>

                                        <p>
                                            Qty: ${quantity}
                                        </p>

                                        <strong>
                                            ${formatPrice(
                                                price * quantity
                                            )}
                                        </strong>

                                    </div>

                                </div>
                            `;

                        }
                    )
                    .join("");

        }

        else {

            productsHTML = `
                <p class="no-products">
                    Product information unavailable.
                </p>
            `;

        }


        return `
            <article
                class="order-card"
                data-order-id="${escapeHTML(orderId)}"
            >

                <div class="order-card-header">

                    <div class="order-main-info">

                        <span class="order-label">
                            ORDER ID
                        </span>

                        <strong class="order-id">
                            ${escapeHTML(orderId)}
                        </strong>

                    </div>


                    <span
                        class="order-status ${getStatusClass(status)}"
                    >
                        ${escapeHTML(status)}
                    </span>

                </div>


                <div class="order-date">

                    <i class="fa-regular fa-calendar"></i>

                    Ordered on ${orderDate}

                </div>


                <div class="order-products">

                    ${productsHTML}

                </div>


                <div class="order-card-footer">

                    <div class="order-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ${formatPrice(total)}
                        </strong>

                    </div>


                    <div class="order-actions">

                        <a
                            href="order-success.html?order=${encodeURIComponent(orderId)}"
                            class="order-action"
                        >

                            <i class="fa-solid fa-eye"></i>

                            View Order

                        </a>


                        <a
                            href="track-order.html?order=${encodeURIComponent(orderId)}"
                            class="order-action"
                        >

                            <i class="fa-solid fa-location-dot"></i>

                            Track Order

                        </a>


                        <button
                            type="button"
                            class="order-action copy-order-btn"
                            data-order-id="${escapeHTML(orderId)}"
                        >

                            <i class="fa-regular fa-copy"></i>

                            Copy ID

                        </button>


                        <button
                            type="button"
                            class="order-action shop-again-btn"
                            data-order-id="${escapeHTML(orderId)}"
                        >

                            <i class="fa-solid fa-cart-shopping"></i>

                            Shop Again

                        </button>

                    </div>

                </div>

            </article>
        `;

    }


    // =====================================================
    // STATUS CLASS
    // =====================================================

    function getStatusClass(status) {

        const value =
            String(
                status || "Placed"
            )
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


        return "status-" + value;

    }


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    function filterOrders() {

        const search =
            orderSearch
                ? orderSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";


        const filtered =
            orders.filter(
                order => {

                    const orderId =
                        String(
                            order.orderId ||
                            order.id ||
                            ""
                        )
                            .toLowerCase();


                    const status =
                        String(
                            order.status ||
                            "Placed"
                        );


                    const customerName =
                        String(
                            order.customer?.name ||
                            ""
                        )
                            .toLowerCase();


                    const searchMatch =
                        !search ||
                        orderId.includes(
                            search
                        ) ||
                        customerName.includes(
                            search
                        );


                    const statusMatch =
                        selectedStatus === "all" ||
                        status === selectedStatus;


                    return (
                        searchMatch &&
                        statusMatch
                    );

                }
            );


        renderOrders(
            filtered
        );

    }


    // =====================================================
    // SEARCH EVENT
    // =====================================================

    if (orderSearch) {

        orderSearch.addEventListener(
            "input",
            filterOrders
        );

    }


    // =====================================================
    // FILTER EVENT
    // =====================================================

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterOrders
        );

    }


    // =====================================================
    // BUTTON EVENTS
    // =====================================================

    function attachButtonEvents() {


        // -----------------------------------------
        // COPY ORDER ID
        // -----------------------------------------

        document
            .querySelectorAll(
                ".copy-order-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const orderId =
                                button.dataset.orderId;


                            try {

                                if (
                                    navigator.clipboard
                                ) {

                                    await navigator
                                        .clipboard
                                        .writeText(
                                            orderId
                                        );

                                }


                                showToast(
                                    "Order ID copied."
                                );

                            } catch (error) {

                                showToast(
                                    orderId
                                );

                            }

                        }
                    );

                }
            );


        // -----------------------------------------
        // SHOP AGAIN
        // -----------------------------------------

        document
            .querySelectorAll(
                ".shop-again-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const orderId =
                                button.dataset.orderId;


                            const order =
                                orders.find(
                                    item =>
                                        (
                                            item.orderId ||
                                            item.id
                                        ) ===
                                        orderId
                                );


                            if (!order) {

                                showToast(
                                    "Order not found."
                                );

                                return;

                            }


                            let cart = [];


                            try {

                                const savedCart =
                                    localStorage.getItem(
                                        CART_KEY
                                    );


                                cart =
                                    savedCart
                                        ? JSON.parse(
                                            savedCart
                                        )
                                        : [];

                            } catch (error) {

                                cart = [];

                            }


                            if (
                                !Array.isArray(cart)
                            ) {

                                cart = [];

                            }


                            // ---------------------------------
                            // ADD ORDER ITEMS TO CART
                            // ---------------------------------

                            (
                                order.items || []
                            )
                                .forEach(
                                    item => {

                                        const productId =
                                            item.productId ||
                                            item.id ||
                                            item.name;


                                        const existing =
                                            cart.find(
                                                cartItem =>
                                                    String(
                                                        cartItem.id ||
                                                        cartItem.productId ||
                                                        cartItem.name
                                                    ) ===
                                                    String(
                                                        productId
                                                    )
                                            );


                                        if (existing) {

                                            existing.quantity =
                                                Number(
                                                    existing.quantity ||
                                                    0
                                                ) +
                                                Number(
                                                    item.quantity ||
                                                    1
                                                );

                                        }

                                        else {

                                            cart.push({

                                                id:
                                                    productId,

                                                productId:
                                                    item.productId ||
                                                    productId,

                                                name:
                                                    item.name ||
                                                    "Product",

                                                image:
                                                    item.image ||
                                                    "images/placeholder.jpg",

                                                price:
                                                    Number(
                                                        item.price ||
                                                        0
                                                    ),

                                                quantity:
                                                    Number(
                                                        item.quantity ||
                                                        1
                                                    )

                                            });

                                        }

                                    }
                                );


                            localStorage.setItem(
                                CART_KEY,
                                JSON.stringify(
                                    cart
                                )
                            );


                            showToast(
                                "Products added to cart."
                            );


                            setTimeout(
                                () => {

                                    window.location.href =
                                        "cart.html";

                                },
                                800
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        if (
            !ordersToast ||
            !ordersToastText
        ) {

            return;

        }


        ordersToastText.textContent =
            message;


        ordersToast.classList.add(
            "show"
        );


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(
                () => {

                    ordersToast.classList.remove(
                        "show"
                    );

                },
                2500
            );

    }


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    orders =
        await loadOrdersFromMongoDB();


    console.log(
        "FINAL MY ORDERS:",
        orders
    );


    // =====================================================
    // FIRST RENDER
    // =====================================================

    renderOrders(
        orders
    );

});