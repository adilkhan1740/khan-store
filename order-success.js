// =========================================================
// KHAN STORE — ORDER SUCCESS PAGE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const ORDER_KEY = "khanLastOrder";

    // =====================================================
    // ELEMENTS
    // =====================================================

    const successOrderId = document.getElementById("successOrderId");
    const orderDate = document.getElementById("orderDate");
    const paymentMethod = document.getElementById("paymentMethod");
    const deliveryMethod = document.getElementById("deliveryMethod");
    const totalItems = document.getElementById("totalItems");

    const productCount = document.getElementById("productCount");
    const successProducts = document.getElementById("successProducts");

    const successSubtotal = document.getElementById("successSubtotal");
    const successDelivery = document.getElementById("successDelivery");
    const successDiscount = document.getElementById("successDiscount");
    const successDiscountRow = document.getElementById("successDiscountRow");
    const successTotal = document.getElementById("successTotal");

    const customerName = document.getElementById("customerName");
    const customerAddress = document.getElementById("customerAddress");
    const customerCityState = document.getElementById("customerCityState");
    const customerPhone = document.getElementById("customerPhone");

    const copyOrderIdBtn = document.getElementById("copyOrderIdBtn");

    const successToast = document.getElementById("successToast");
    const toastMessage = document.getElementById("toastMessage");


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    function formatPrice(amount) {
        const value = Number(amount) || 0;

        return "₹" + value.toLocaleString("en-IN");
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =====================================================
    // LOAD LAST ORDER
    // =====================================================

    function loadOrder() {
        try {
            const savedOrder = localStorage.getItem(ORDER_KEY);

            if (!savedOrder) {
                return null;
            }

            const order = JSON.parse(savedOrder);

            if (!order || typeof order !== "object") {
                return null;
            }

            return order;

        } catch (error) {

            console.error("Order loading error:", error);

            return null;
        }
    }


    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    function getPaymentName(method) {

        if (!method) {
            return "Not specified";
        }

        const payment = String(method).toLowerCase();

        if (payment === "cod") {
            return "Cash on Delivery";
        }

        if (payment === "online") {
            return "Online Payment";
        }

        return method;
    }


    // =====================================================
    // DELIVERY METHOD
    // =====================================================

    function getDeliveryName(method) {

        if (!method) {
            return "Standard Delivery";
        }

        const delivery = String(method).toLowerCase();

        if (delivery === "standard") {
            return "Standard Delivery";
        }

        if (delivery === "express") {
            return "Express Delivery";
        }

        if (delivery === "free") {
            return "Free Delivery";
        }

        return method;
    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "--";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "--";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    // =====================================================
    // FORMAT PHONE
    // =====================================================

    function formatPhone(phone) {

        if (!phone) {
            return "--";
        }

        const value = String(phone);

        if (value.length === 10) {
            return "+91 " + value;
        }

        return value;
    }


    // =====================================================
    // RENDER ORDER ID
    // =====================================================

    function renderOrderId(order) {

        if (!successOrderId) {
            return;
        }

        const id = order.orderId || order.id || "KHS--------";

        successOrderId.textContent = id;
    }


    // =====================================================
    // RENDER BASIC ORDER DETAILS
    // =====================================================

    function renderOrderDetails(order) {

        if (orderDate) {
            orderDate.textContent = formatDate(order.createdAt);
        }

        if (paymentMethod) {
            paymentMethod.textContent =
                getPaymentName(order.paymentMethod);
        }

        if (deliveryMethod) {
            deliveryMethod.textContent =
                getDeliveryName(order.deliveryMethod);
        }

        const items = Array.isArray(order.items)
            ? order.items
            : [];

        const itemQuantity = items.reduce((total, item) => {
            return total + (Number(item.quantity) || 1);
        }, 0);

        if (totalItems) {
            totalItems.textContent =
                `${itemQuantity} ${itemQuantity === 1 ? "item" : "items"}`;
        }

        if (productCount) {
            productCount.textContent =
                `${itemQuantity} ${itemQuantity === 1 ? "item" : "items"}`;
        }
    }


    // =====================================================
    // RENDER PRODUCTS
    // =====================================================

    function renderProducts(order) {

        if (!successProducts) {
            return;
        }

        const items = Array.isArray(order.items)
            ? order.items
            : [];

        if (items.length === 0) {

            successProducts.innerHTML = `
                <div class="empty-success-products">
                    <i class="fa-solid fa-box-open"></i>
                    <p>No product information available.</p>
                </div>
            `;

            return;
        }


        successProducts.innerHTML = items.map((item, index) => {

            const name =
                item.name ||
                item.title ||
                "Product";

            const image =
                item.image ||
                item.img ||
                "https://via.placeholder.com/150?text=Product";

            const quantity =
                Number(item.quantity) || 1;

            const price =
                Number(item.price) || 0;

            const itemTotal =
                Number(item.total) ||
                price * quantity;

            const category =
                item.category ||
                "Electronics";


            return `
                <div class="success-product">

                    <div class="success-product-image">

                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            onerror="this.src='https://via.placeholder.com/150?text=Product'"
                        >

                    </div>


                    <div class="success-product-info">

                        <div class="success-product-name">
                            ${escapeHtml(name)}
                        </div>

                        <div class="success-product-meta">
                            Qty: ${quantity}
                            &nbsp;•&nbsp;
                            ${escapeHtml(category)}
                        </div>

                    </div>


                    <div class="success-product-price">
                        ${formatPrice(itemTotal)}
                    </div>

                </div>
            `;

        }).join("");
    }


    // =====================================================
    // RENDER PRICE SUMMARY
    // =====================================================

    function renderPricing(order) {

        const pricing = order.pricing || {};

        const subtotal =
            Number(pricing.subtotal) || 0;

        const delivery =
            Number(pricing.delivery) || 0;

        const discount =
            Number(pricing.discount) || 0;

        const calculatedTotal =
            subtotal + delivery - discount;

        const total =
            Number(pricing.total) || calculatedTotal;


        if (successSubtotal) {
            successSubtotal.textContent =
                formatPrice(subtotal);
        }


        if (successDelivery) {

            successDelivery.textContent =
                delivery === 0
                    ? "FREE"
                    : formatPrice(delivery);

        }


        if (successDiscount) {

            successDiscount.textContent =
                "-" + formatPrice(discount);

        }


        if (successDiscountRow) {

            successDiscountRow.style.display =
                discount > 0
                    ? "flex"
                    : "none";

        }


        if (successTotal) {

            successTotal.textContent =
                formatPrice(Math.max(0, total));

        }
    }


    // =====================================================
    // RENDER CUSTOMER / ADDRESS
    // =====================================================

    function renderAddress(order) {

        const customer =
            order.customer || {};

        const address =
            order.shippingAddress || {};


        if (customerName) {

            customerName.textContent =
                customer.name || "Customer";

        }


        if (customerAddress) {

            customerAddress.textContent =
                address.address || "--";

        }


        if (customerCityState) {

            const city =
                address.city || "";

            const state =
                address.state || "";

            const pincode =
                address.pincode || "";

            const locationParts = [
                city,
                state
            ].filter(Boolean);

            let locationText =
                locationParts.join(", ");

            if (pincode) {

                locationText +=
                    locationText
                        ? " - " + pincode
                        : pincode;

            }

            customerCityState.textContent =
                locationText || "--";
        }


        if (customerPhone) {

            customerPhone.textContent =
                formatPhone(customer.phone);

        }
    }


    // =====================================================
    // COPY ORDER ID
    // =====================================================

    function copyOrderId() {

        const order = loadOrder();

        if (!order) {
            showToast("Order information not found.");
            return;
        }

        const id =
            order.orderId ||
            order.id ||
            "";

        if (!id) {
            showToast("Order ID not available.");
            return;
        }


        if (navigator.clipboard) {

            navigator.clipboard.writeText(id)
                .then(() => {
                    showToast("Order ID copied!");
                })
                .catch(() => {
                    fallbackCopy(id);
                });

        } else {

            fallbackCopy(id);

        }
    }


    // =====================================================
    // FALLBACK COPY
    // =====================================================

    function fallbackCopy(text) {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);

        textarea.select();

        try {

            document.execCommand("copy");

            showToast("Order ID copied!");

        } catch (error) {

            showToast("Unable to copy Order ID.");

        }

        document.body.removeChild(textarea);
    }


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        if (!successToast) {
            return;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        successToast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer =
            setTimeout(() => {

                successToast.classList.remove("show");

            }, 2500);
    }


    // =====================================================
    // NO ORDER FOUND
    // =====================================================

    function showNoOrder() {

        if (successOrderId) {
            successOrderId.textContent = "Order Not Found";
        }

        if (successProducts) {

            successProducts.innerHTML = `
                <div class="empty-success-products">

                    <i class="fa-solid fa-box-open"></i>

                    <h3>
                        Order information not found
                    </h3>

                    <p>
                        Please place an order first or open your orders page.
                    </p>

                </div>
            `;
        }


        if (customerName) {
            customerName.textContent = "--";
        }

        if (customerAddress) {
            customerAddress.textContent = "--";
        }

        if (customerCityState) {
            customerCityState.textContent = "--";
        }

        if (customerPhone) {
            customerPhone.textContent = "--";
        }
    }


    // =====================================================
    // COPY BUTTON
    // =====================================================

    if (copyOrderIdBtn) {

        copyOrderIdBtn.addEventListener(
            "click",
            copyOrderId
        );

    }


    // =====================================================
    // INITIALIZE
    // =====================================================

    function init() {

        const order = loadOrder();

        if (!order) {

            showNoOrder();

            return;
        }


        renderOrderId(order);

        renderOrderDetails(order);

        renderProducts(order);

        renderPricing(order);

        renderAddress(order);


        // Save latest order ID for tracking pages
        const orderId =
            order.orderId ||
            order.id ||
            "";

        if (orderId) {

            sessionStorage.setItem(
                "khanLatestOrderId",
                orderId
            );

        }

    }


    init();

});