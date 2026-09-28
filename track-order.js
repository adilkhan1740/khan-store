document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ track-order.js loaded");

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const trackForm = document.getElementById("trackForm");
    const orderIdInput = document.getElementById("orderIdInput");

    const trackError = document.getElementById("trackError");
    const trackErrorText = document.getElementById("trackErrorText");

    const initialState = document.getElementById("initialState");
    const orderResult = document.getElementById("orderResult");

    const displayOrderId = document.getElementById("displayOrderId");
    const displayOrderDate = document.getElementById("displayOrderDate");
    const currentStatus = document.getElementById("currentStatus");
    const estimatedDelivery = document.getElementById("estimatedDelivery");
    const itemCount = document.getElementById("itemCount");

    const orderItems = document.getElementById("orderItems");

    const customerName = document.getElementById("customerName");
    const customerAddress = document.getElementById("customerAddress");
    const customerCityState = document.getElementById("customerCityState");
    const customerPhone = document.getElementById("customerPhone");

    const paymentMethod = document.getElementById("paymentMethod");
    const deliveryMethod = document.getElementById("deliveryMethod");

    const trackSubtotal = document.getElementById("trackSubtotal");
    const trackDelivery = document.getElementById("trackDelivery");
    const trackDiscountRow = document.getElementById("trackDiscountRow");
    const trackDiscount = document.getElementById("trackDiscount");
    const trackTotal = document.getElementById("trackTotal");

    const copyOrderBtn = document.getElementById("copyOrderBtn");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    const toast = document.getElementById("trackToast");
    const toastMessage = document.getElementById("toastMessage");


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenuBtn && mobileMenu) {

        mobileMenuBtn.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            const icon = mobileMenuBtn.querySelector("i");

            if (mobileMenu.classList.contains("active")) {

                if (icon) {
                    icon.className = "fa-solid fa-xmark";
                }

            } else {

                if (icon) {
                    icon.className = "fa-solid fa-bars";
                }

            }

        });

    }


    /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

    function formatCurrency(value) {

        const number = Number(value) || 0;

        return "₹" + number.toLocaleString("en-IN");

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    }


    /* =====================================================
       GET ORDERS
    ===================================================== */

    function getOrders() {

        try {

            const orders = JSON.parse(
                localStorage.getItem("khanOrders") || "[]"
            );

            return Array.isArray(orders) ? orders : [];

        } catch (error) {

            console.error("Unable to read khanOrders:", error);

            return [];

        }

    }


    /* =====================================================
       FIND ORDER
    ===================================================== */

    function findOrder(orderId) {

        const orders = getOrders();

        const searchId = String(orderId)
            .trim()
            .toLowerCase();

        return orders.find(order => {

            const id = String(
                order.orderId ||
                order.id ||
                ""
            )
                .trim()
                .toLowerCase();

            return id === searchId;

        });

    }


    /* =====================================================
       GET ORDER ITEMS
    ===================================================== */

    function getOrderItems(order) {

        return (
            order.items ||
            order.products ||
            order.cart ||
            []
        );

    }


    /* =====================================================
       GET ITEM NAME
    ===================================================== */

    function getItemName(item) {

        return (
            item.name ||
            item.title ||
            item.productName ||
            "Product"
        );

    }


    /* =====================================================
       GET ITEM IMAGE
    ===================================================== */

    function getItemImage(item) {

        return (
            item.image ||
            item.img ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
        );

    }


    /* =====================================================
       GET ITEM PRICE
    ===================================================== */

    function getItemPrice(item) {

        return Number(
            item.price ||
            item.salePrice ||
            item.amount ||
            0
        );

    }


    /* =====================================================
       GET ITEM QUANTITY
    ===================================================== */

    function getItemQuantity(item) {

        return Number(
            item.quantity ||
            item.qty ||
            1
        );

    }


    /* =====================================================
       GET STATUS
    ===================================================== */

    function getStatus(order) {

        const status = String(
            order.status ||
            order.orderStatus ||
            "Placed"
        ).trim();

        return status;

    }


    /* =====================================================
       NORMALIZE STATUS
    ===================================================== */

    function normalizeStatus(status) {

        const value = String(status)
            .toLowerCase()
            .trim();

        if (value === "placed") {
            return "Placed";
        }

        if (
            value === "processing" ||
            value === "confirmed"
        ) {
            return "Processing";
        }

        if (
            value === "shipped" ||
            value === "shipping"
        ) {
            return "Shipped";
        }

        if (
            value === "out for delivery" ||
            value === "out_for_delivery"
        ) {
            return "Out for Delivery";
        }

        if (
            value === "delivered" ||
            value === "completed"
        ) {
            return "Delivered";
        }

        return status || "Placed";

    }


    /* =====================================================
       STATUS INDEX
    ===================================================== */

    function getStatusIndex(status) {

        const statuses = [
            "Placed",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered"
        ];

        const normalized = normalizeStatus(status);

        const index = statuses.indexOf(normalized);

        return index >= 0 ? index : 0;

    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    function showError(message) {

        if (trackErrorText) {
            trackErrorText.textContent = message;
        }

        if (trackError) {
            trackError.classList.remove("hidden");
        }

        if (orderResult) {
            orderResult.classList.add("hidden");
        }

        if (initialState) {
            initialState.classList.remove("hidden");
        }

    }


    /* =====================================================
       HIDE ERROR
    ===================================================== */

    function hideError() {

        if (trackError) {
            trackError.classList.add("hidden");
        }

    }


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts(items) {

        if (!orderItems) {
            return;
        }

        if (!items.length) {

            orderItems.innerHTML = `
                <div class="order-item">
                    <div class="order-item-info">
                        <h3>No product information available</h3>
                    </div>
                </div>
            `;

            return;

        }

        orderItems.innerHTML = items.map(item => {

            const name = getItemName(item);
            const image = getItemImage(item);
            const price = getItemPrice(item);
            const quantity = getItemQuantity(item);

            return `
                <div class="order-item">

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(name)}"
                        class="order-item-image"
                        onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'"
                    >

                    <div class="order-item-info">

                        <h3>
                            ${escapeHtml(name)}
                        </h3>

                        <p>
                            Quantity: ${quantity}
                        </p>

                    </div>

                    <div class="order-item-price">
                        ${formatCurrency(price * quantity)}
                    </div>

                </div>
            `;

        }).join("");

    }


    /* =====================================================
       UPDATE TIMELINE
    ===================================================== */

    function updateTimeline(status) {

        const currentIndex = getStatusIndex(status);

        const steps = document.querySelectorAll(
            ".tracking-step"
        );

        steps.forEach((step, index) => {

            if (index <= currentIndex) {
                step.classList.add("completed");
            } else {
                step.classList.remove("completed");
            }

        });

    }


    /* =====================================================
       ESTIMATED DELIVERY
    ===================================================== */

    function getEstimatedDelivery(order) {

        if (order.estimatedDelivery) {
            return formatDate(order.estimatedDelivery);
        }

        if (order.deliveryDate) {
            return formatDate(order.deliveryDate);
        }

        if (order.createdAt || order.date || order.orderDate) {

            const baseDate = new Date(
                order.createdAt ||
                order.date ||
                order.orderDate
            );

            if (!Number.isNaN(baseDate.getTime())) {

                baseDate.setDate(
                    baseDate.getDate() + 5
                );

                return formatDate(baseDate);

            }

        }

        return "3–5 business days";

    }


    /* =====================================================
       SHOW ORDER
    ===================================================== */

    function showOrder(order) {

        hideError();

        if (initialState) {
            initialState.classList.add("hidden");
        }

        if (orderResult) {
            orderResult.classList.remove("hidden");
        }


        /* ORDER ID */

        const orderId =
            order.orderId ||
            order.id ||
            "—";

        if (displayOrderId) {
            displayOrderId.textContent = orderId;
        }


        /* STATUS */

        const status = normalizeStatus(
            getStatus(order)
        );

        if (currentStatus) {
            currentStatus.textContent = status;
        }

        updateTimeline(status);


        /* DATE */

        const orderDate =
            order.createdAt ||
            order.orderDate ||
            order.date;

        if (displayOrderDate) {
            displayOrderDate.textContent =
                formatDate(orderDate);
        }


        /* DELIVERY */

        if (estimatedDelivery) {
            estimatedDelivery.textContent =
                getEstimatedDelivery(order);
        }


        /* ITEMS */

        const items = getOrderItems(order);

        const totalItems = items.reduce(
            (total, item) => {
                return total + getItemQuantity(item);
            },
            0
        );

        if (itemCount) {
            itemCount.textContent = totalItems;
        }

        renderProducts(items);


        /* CUSTOMER */

        const customer =
            order.customer ||
            order.shippingAddress ||
            order.address ||
            {};


        const name =
            order.fullName ||
            order.name ||
            customer.fullName ||
            customer.name ||
            "—";


        const address =
            order.address ||
            customer.address ||
            "—";


        const city =
            order.city ||
            customer.city ||
            "";


        const state =
            order.state ||
            customer.state ||
            "";


        const phone =
            order.phone ||
            order.mobile ||
            customer.phone ||
            customer.mobile ||
            "—";


        if (customerName) {
            customerName.textContent = name;
        }

        if (customerAddress) {
            customerAddress.textContent = address;
        }

        if (customerCityState) {

            const cityState = [
                city,
                state
            ]
                .filter(Boolean)
                .join(", ");

            customerCityState.textContent =
                cityState || "—";

        }

        if (customerPhone) {
            customerPhone.textContent = phone;
        }


        /* PAYMENT */

        const payment =
            order.paymentMethod ||
            order.payment ||
            "Cash on Delivery";

        if (paymentMethod) {
            paymentMethod.textContent =
                payment === "cod"
                    ? "Cash on Delivery"
                    : payment === "online"
                        ? "Online Payment"
                        : payment;
        }


        /* DELIVERY METHOD */

        const delivery =
            order.deliveryMethod ||
            order.delivery ||
            "Standard Delivery";

        if (deliveryMethod) {

            deliveryMethod.textContent =
                delivery === "standard"
                    ? "Standard Delivery"
                    : delivery === "express"
                        ? "Express Delivery"
                        : delivery === "free"
                            ? "Free Delivery"
                            : delivery;

        }


        /* PRICES */

        let subtotal = Number(
            order.subtotal ||
            order.subTotal ||
            0
        );

        let deliveryCharge = Number(
            order.deliveryCharge ||
            order.deliveryPrice ||
            order.shipping ||
            0
        );

        let discount = Number(
            order.discount ||
            0
        );

        let total = Number(
            order.total ||
            order.grandTotal ||
            order.finalTotal ||
            0
        );


        /* Calculate subtotal if missing */

        if (!subtotal && items.length) {

            subtotal = items.reduce(
                (sum, item) => {
                    return sum +
                        (
                            getItemPrice(item) *
                            getItemQuantity(item)
                        );
                },
                0
            );

        }


        /* Calculate total if missing */

        if (!total) {

            total =
                subtotal +
                deliveryCharge -
                discount;

        }


        if (trackSubtotal) {
            trackSubtotal.textContent =
                formatCurrency(subtotal);
        }

        if (trackDelivery) {

            trackDelivery.textContent =
                deliveryCharge === 0
                    ? "FREE"
                    : formatCurrency(deliveryCharge);

        }

        if (trackDiscount) {

            trackDiscount.textContent =
                "−" + formatCurrency(discount);

        }

        if (trackDiscountRow) {

            if (discount > 0) {
                trackDiscountRow.classList.remove("hidden");
            } else {
                trackDiscountRow.classList.add("hidden");
            }

        }

        if (trackTotal) {
            trackTotal.textContent =
                formatCurrency(total);
        }


        /* SAVE CURRENT ORDER */

        sessionStorage.setItem(
            "khanTrackedOrder",
            JSON.stringify(order)
        );

    }


    /* =====================================================
       TRACK ORDER
    ===================================================== */

    function trackOrder(orderId) {

        const cleanId = String(orderId || "").trim();

        if (!cleanId) {

            showError(
                "Please enter your Order ID."
            );

            return;

        }

        console.log(
            "🔍 Searching for:",
            cleanId
        );

        const order = findOrder(cleanId);

        if (!order) {

            console.log(
                "❌ Order not found:",
                cleanId
            );

            showError(
                "We couldn't find an order with this Order ID."
            );

            return;

        }

        console.log(
            "✅ Order found:",
            order
        );

        showOrder(order);

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (trackForm) {

        trackForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                trackOrder(
                    orderIdInput.value
                );

            }
        );

    }


    /* =====================================================
       COPY ORDER ID
    ===================================================== */

    if (copyOrderBtn) {

        copyOrderBtn.addEventListener(
            "click",
            async () => {

                const orderId =
                    displayOrderId?.textContent?.trim();

                if (!orderId || orderId === "—") {
                    return;
                }

                try {

                    await navigator.clipboard.writeText(
                        orderId
                    );

                    showToast(
                        "Order ID copied successfully."
                    );

                } catch (error) {

                    showToast(
                        "Unable to copy Order ID."
                    );

                }

            }
        );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;

    function showToast(message) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent = message;

        toast.classList.remove("hidden");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.add("hidden");

        }, 2500);

    }


    /* =====================================================
       NAV COUNTS
    ===================================================== */

    function updateNavCounts() {

        let cart = [];

        let wishlist = [];

        try {

            cart = JSON.parse(
                localStorage.getItem("khanCart") || "[]"
            );

            wishlist = JSON.parse(
                localStorage.getItem("khanWishlist") || "[]"
            );

        } catch (error) {

            cart = [];
            wishlist = [];

        }


        const cartCount = cart.reduce(
            (total, item) => {
                return total +
                    Number(
                        item.quantity ||
                        item.qty ||
                        1
                    );
            },
            0
        );


        document.querySelectorAll(
            ".cart-count"
        ).forEach(element => {

            element.textContent = cartCount;

        });


        document.querySelectorAll(
            ".wishlist-count"
        ).forEach(element => {

            element.textContent =
                wishlist.length;

        });

    }

    updateNavCounts();


    /* =====================================================
       URL AUTO TRACK
       Example:
       track-order.html?order=KHS50973922
    ===================================================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const urlOrderId =
        urlParams.get("order");


    if (urlOrderId) {

        if (orderIdInput) {
            orderIdInput.value =
                urlOrderId;
        }

        trackOrder(urlOrderId);

    }

});