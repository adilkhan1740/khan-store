"use strict";

/* =========================================================
   KHAN STORE — ADMIN DASHBOARD
   FULL MONGODB CONNECTED VERSION
========================================================= */

const API_URL = "http://https://khan-store.onrender.com";

const ORDERS_KEY = "khanOrders";
const PRODUCTS_KEY = "khanProducts";


/* =========================================================
   AUTH
========================================================= */

function checkAdminAuth() {

    if (localStorage.getItem("khanAdminLoggedIn") !== "true") {
        window.location.href = "admin-login.html";
        return false;
    }

    return true;
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    if (!checkAdminAuth()) return;

    loadAdminProfile();

    setupEvents();

    await loadDashboard();

});


/* =========================================================
   ADMIN PROFILE
========================================================= */

function loadAdminProfile() {

    const adminName = document.getElementById("adminName");

    if (!adminName) return;

    try {

        const admin = JSON.parse(
            localStorage.getItem("khanAdmin") || "null"
        );

        if (admin?.name) {

            adminName.textContent = admin.name;

        } else if (admin?.email) {

            adminName.textContent = admin.email;

        } else {

            adminName.textContent = "Administrator";

        }

    } catch {

        adminName.textContent = "Administrator";

    }

}


/* =========================================================
   LOAD COMPLETE DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const [
            orders,
            products,
            customers
        ] = await Promise.all([

            getOrders(),

            getProducts(),

            getCustomers()

        ]);


        updateStats(
            orders,
            products,
            customers
        );


        renderRecentOrders(orders);

        renderTopProducts(orders);

        renderLowStock(products);

        renderOrderStatus(orders);

        updateLastUpdated();


        console.log("Dashboard Data:", {
            orders,
            products,
            customers
        });


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showToast(
            "Dashboard Error",
            "Some dashboard data could not be loaded."
        );

    }

}


/* =========================================================
   ORDERS — MONGODB
========================================================= */

async function getOrders() {

    try {

        const response = await fetch(
            `${API_URL}/api/orders`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `Orders API failed: ${response.status}`
            );

        }


        const data = await response.json();


        let orders = [];


        if (Array.isArray(data)) {

            orders = data;

        } else if (Array.isArray(data.orders)) {

            orders = data.orders;

        }


        orders = orders
            .map(normalizeOrder)
            .sort(
                (a, b) =>
                    getDateValue(b) -
                    getDateValue(a)
            );


        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );


        return orders;


    } catch (error) {

        console.warn(
            "MongoDB Orders unavailable. Using localStorage.",
            error
        );


        return getLocalOrders();

    }

}


/* =========================================================
   LOCAL ORDERS FALLBACK
========================================================= */

function getLocalOrders() {

    try {

        const orders = JSON.parse(
            localStorage.getItem(
                ORDERS_KEY
            ) || "[]"
        );


        if (!Array.isArray(orders)) {
            return [];
        }


        return orders
            .map(normalizeOrder)
            .sort(
                (a, b) =>
                    getDateValue(b) -
                    getDateValue(a)
            );


    } catch {

        return [];

    }

}


/* =========================================================
   NORMALIZE ORDER
========================================================= */

function normalizeOrder(order) {

    const orderId =
        order.orderId ||
        order.id ||
        "";


    const items =
        Array.isArray(order.items)
            ? order.items.map(item => {

                const price =
                    Number(item.price) || 0;


                const quantity =
                    Number(item.quantity) || 1;


                return {

                    ...item,

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
                        item.title ||
                        "Product",

                    price,

                    quantity,

                    subtotal:
                        Number(item.subtotal) ||
                        price * quantity

                };

            })
            : [];


    const pricing = {

        subtotal:
            Number(order.pricing?.subtotal) || 0,

        delivery:
            Number(order.pricing?.delivery) || 0,

        discount:
            Number(order.pricing?.discount) || 0,

        tax:
            Number(order.pricing?.tax) || 0,

        total:
            Number(order.pricing?.total) || 0

    };


    return {

        ...order,

        id: orderId,

        orderId,

        items,

        pricing,

        status:
            normalizeStatus(order.status)

    };

}


/* =========================================================
   PRODUCTS — MONGODB
========================================================= */

async function getProducts() {

    try {

        const response = await fetch(
            `${API_URL}/api/products`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `Products API failed: ${response.status}`
            );

        }


        const data = await response.json();


        let products = [];


        if (Array.isArray(data)) {

            products = data;

        } else if (Array.isArray(data.products)) {

            products = data.products;

        }


        products = products.map(product => {

            return {

                ...product,

                id:
                    product.productId ||
                    product.id ||
                    "",

                productId:
                    product.productId ||
                    product.id ||
                    "",

                name:
                    product.name ||
                    "Product",

                stock:
                    Number(
                        product.stock ??
                        product.quantity ??
                        0
                    ),

                price:
                    Number(product.price) || 0

            };

        });


        localStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(products)
        );


        return products;


    } catch (error) {

        console.warn(
            "MongoDB Products unavailable. Using localStorage.",
            error
        );


        return getLocalProducts();

    }

}


/* =========================================================
   LOCAL PRODUCTS FALLBACK
========================================================= */

function getLocalProducts() {

    try {

        const products = JSON.parse(
            localStorage.getItem(
                PRODUCTS_KEY
            ) || "[]"
        );


        if (!Array.isArray(products)) {
            return [];
        }


        return products.map(product => {

            return {

                ...product,

                id:
                    product.productId ||
                    product.id ||
                    "",

                productId:
                    product.productId ||
                    product.id ||
                    "",

                stock:
                    Number(
                        product.stock ??
                        product.quantity ??
                        0
                    )

            };

        });


    } catch {

        return [];

    }

}


/* =========================================================
   CUSTOMERS — MONGODB
========================================================= */

async function getCustomers() {

    try {

        const response = await fetch(
            `${API_URL}/api/users`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `Customers API failed: ${response.status}`
            );

        }


        const data = await response.json();


        if (
            data?.success &&
            Array.isArray(data.users)
        ) {

            return data.users;

        }


        if (Array.isArray(data)) {

            return data;

        }


        throw new Error(
            "Invalid customers response"
        );


    } catch (error) {

        console.warn(
            "MongoDB Customers unavailable. Creating customers from orders."
        );


        return getCustomersFromOrders();

    }

}


/* =========================================================
   CUSTOMER FALLBACK FROM ORDERS
========================================================= */

function getCustomersFromOrders() {

    const orders = getLocalOrders();

    const map = new Map();


    orders.forEach(order => {

        const email =
            order.customer?.email;


        if (!email) return;


        const normalizedEmail =
            String(email)
                .trim()
                .toLowerCase();


        if (!map.has(normalizedEmail)) {

            map.set(
                normalizedEmail,
                {

                    name:
                        order.customer?.name ||
                        "Customer",

                    email:
                        normalizedEmail,

                    phone:
                        order.customer?.phone ||
                        ""

                }
            );

        }

    });


    return [...map.values()];

}


/* =========================================================
   ORDER TOTAL
========================================================= */

function getOrderTotal(order) {

    if (
        order?.pricing &&
        Number.isFinite(
            Number(order.pricing.total)
        )
    ) {

        return Number(
            order.pricing.total
        );

    }


    if (
        Number.isFinite(
            Number(order.total)
        )
    ) {

        return Number(order.total);

    }


    if (Array.isArray(order?.items)) {

        const subtotal =
            order.items.reduce(
                (sum, item) => {

                    const price =
                        Number(item.price) || 0;

                    const quantity =
                        Number(item.quantity) || 1;

                    return (
                        sum +
                        price * quantity
                    );

                },
                0
            );


        const delivery =
            Number(
                order.pricing?.delivery
            ) || 0;


        const discount =
            Number(
                order.pricing?.discount
            ) || 0;


        const tax =
            Number(
                order.pricing?.tax
            ) || 0;


        return Math.max(
            0,
            subtotal +
            delivery +
            tax -
            discount
        );

    }


    return 0;

}


/* =========================================================
   STATS
========================================================= */

function updateStats(
    orders,
    products,
    customers
) {

    const totalRevenue =
        orders.reduce(
            (sum, order) =>
                sum +
                getOrderTotal(order),
            0
        );


    const pendingOrders =
        orders.filter(order => {

            const status =
                normalizeStatus(
                    order.status
                );


            return (
                status === "Placed" ||
                status === "Processing"
            );

        }).length;


    setText(
        "totalOrders",
        orders.length
    );


    setText(
        "totalRevenue",
        formatCurrency(totalRevenue)
    );


    setText(
        "totalCustomers",
        customers.length
    );


    setText(
        "pendingOrders",
        pendingOrders
    );


    setText(
        "totalProducts",
        products.length
    );


    setText(
        "ordersChange",
        `${orders.length} total`
    );


    setText(
        "customersChange",
        `${customers.length} registered`
    );


    setText(
        "productsChange",
        `${products.length} active`
    );


    setText(
        "pendingChange",
        `${pendingOrders} pending`
    );

}


/* =========================================================
   RECENT ORDERS
========================================================= */

function renderRecentOrders(orders) {

    const container =
        document.getElementById(
            "recentOrders"
        );


    if (!container) return;


    const recent =
        [...orders]
            .sort(
                (a, b) =>
                    getDateValue(b) -
                    getDateValue(a)
            )
            .slice(0, 6);


    if (!recent.length) {

        container.innerHTML = `
            <div class="dashboard-empty">
                <i class="fa-solid fa-box-open"></i>
                <p>No orders found</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        recent.map(order => {

            const customer =
                escapeHTML(
                    order.customer?.name ||
                    "Customer"
                );


            const id =
                escapeHTML(
                    order.orderId ||
                    order.id ||
                    "ORDER"
                );


            const total =
                formatCurrency(
                    getOrderTotal(order)
                );


            const status =
                normalizeStatus(
                    order.status
                );


            return `
                <div class="recent-order-item">

                    <div class="recent-order-icon">
                        <i class="fa-solid fa-box"></i>
                    </div>

                    <div class="recent-order-info">

                        <strong>
                            ${id}
                        </strong>

                        <span>
                            ${customer}
                        </span>

                    </div>

                    <div class="recent-order-right">

                        <strong>
                            ${total}
                        </strong>

                        <span
                            class="status-badge ${getStatusClass(status)}"
                        >
                            ${escapeHTML(status)}
                        </span>

                    </div>

                </div>
            `;

        }).join("");

}


/* =========================================================
   TOP PRODUCTS
========================================================= */

function renderTopProducts(orders) {

    const container =
        document.getElementById(
            "topProducts"
        );


    if (!container) return;


    const productMap = new Map();


    orders.forEach(order => {

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        items.forEach(item => {

            const name =
                item.name ||
                item.title ||
                "Product";


            const quantity =
                Number(item.quantity) || 1;


            const existing =
                productMap.get(name) || {

                    name,

                    quantity: 0

                };


            existing.quantity += quantity;


            productMap.set(
                name,
                existing
            );

        });

    });


    const products =
        [...productMap.values()]
            .sort(
                (a, b) =>
                    b.quantity -
                    a.quantity
            )
            .slice(0, 5);


    if (!products.length) {

        container.innerHTML = `
            <div class="dashboard-empty">
                <i class="fa-solid fa-chart-column"></i>
                <p>No product sales yet</p>
            </div>
        `;

        return;

    }


    const max =
        Math.max(
            ...products.map(
                item => item.quantity
            )
        );


    container.innerHTML =
        products.map(item => {

            const percentage =
                max > 0
                    ? (
                        item.quantity /
                        max
                    ) * 100
                    : 0;


            return `
                <div class="top-product-row">

                    <div class="top-product-info">

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <span>
                            ${item.quantity} sold
                        </span>

                    </div>

                    <div class="top-product-bar">

                        <div
                            class="top-product-progress"
                            style="width:${percentage}%"
                        ></div>

                    </div>

                </div>
            `;

        }).join("");

}


/* =========================================================
   LOW STOCK
========================================================= */

function renderLowStock(products) {

    const container =
        document.getElementById(
            "lowStockProducts"
        );


    if (!container) return;


    const lowStock =
        products
            .map(product => {

                const stock =
                    Number(
                        product.stock ??
                        product.quantity ??
                        0
                    );


                return {
                    ...product,
                    stock
                };

            })
            .filter(
                product =>
                    product.stock <= 10
            )
            .sort(
                (a, b) =>
                    a.stock -
                    b.stock
            )
            .slice(0, 5);


    if (!lowStock.length) {

        container.innerHTML = `
            <div class="dashboard-empty">
                <i class="fa-solid fa-circle-check"></i>
                <p>All products have healthy stock</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        lowStock.map(product => {

            const stockClass =
                product.stock <= 0
                    ? "out"
                    : "low";


            return `
                <div class="low-stock-row">

                    <div class="low-stock-product">

                        <div class="stock-icon">
                            <i class="fa-solid fa-box"></i>
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    product.name ||
                                    "Product"
                                )}
                            </strong>

                            <span>
                                SKU:
                                ${escapeHTML(
                                    product.productId ||
                                    product.sku ||
                                    "N/A"
                                )}
                            </span>

                        </div>

                    </div>

                    <span
                        class="stock-count ${stockClass}"
                    >
                        ${
                            product.stock <= 0
                                ? "Out of stock"
                                : `${product.stock} left`
                        }
                    </span>

                </div>
            `;

        }).join("");

}


/* =========================================================
   ORDER STATUS
========================================================= */

function renderOrderStatus(orders) {

    const container =
        document.getElementById(
            "orderStatusSummary"
        );


    if (!container) return;


    const statuses = {

        placed: 0,

        processing: 0,

        shipped: 0,

        "out for delivery": 0,

        delivered: 0,

        cancelled: 0

    };


    orders.forEach(order => {

        const status =
            normalizeStatus(
                order.status
            );


        const key =
            status.toLowerCase();


        if (
            statuses[key] !== undefined
        ) {

            statuses[key]++;

        } else {

            statuses.placed++;

        }

    });


    container.innerHTML = `

        <div class="status-summary-item">

            <span class="status-dot placed"></span>

            <span>Placed</span>

            <strong>
                ${statuses.placed}
            </strong>

        </div>

        <div class="status-summary-item">

            <span class="status-dot processing"></span>

            <span>Processing</span>

            <strong>
                ${statuses.processing}
            </strong>

        </div>

        <div class="status-summary-item">

            <span class="status-dot shipped"></span>

            <span>Shipped</span>

            <strong>
                ${statuses.shipped}
            </strong>

        </div>

        <div class="status-summary-item">

            <span class="status-dot delivered"></span>

            <span>Delivered</span>

            <strong>
                ${statuses.delivered}
            </strong>

        </div>

        <div class="status-summary-item">

            <span class="status-dot cancelled"></span>

            <span>Cancelled</span>

            <strong>
                ${statuses.cancelled}
            </strong>

        </div>

    `;

}


/* =========================================================
   STATUS NORMALIZE
========================================================= */

function normalizeStatus(status) {

    const value =
        String(
            status || "Placed"
        )
        .trim()
        .toLowerCase();


    switch (value) {

        case "placed":
            return "Placed";

        case "pending":
            return "Placed";

        case "processing":
            return "Processing";

        case "shipped":
            return "Shipped";

        case "out for delivery":

        case "out-for-delivery":

        case "outfordelivery":
            return "Out for Delivery";

        case "delivered":
            return "Delivered";

        case "cancelled":

        case "canceled":
            return "Cancelled";

        default:
            return "Placed";

    }

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status) {

    return `
        status-${String(status)
            .toLowerCase()
            .replace(/\s+/g, "-")}
    `.trim();

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function setupQuickActions() {

    const actions = {

        orders:
            "admin-orders.html",

        products:
            "admin-products.html",

        customers:
            "admin-customers.html",

        analytics:
            "admin-analytics.html",

        settings:
            "admin-settings.html"

    };


    Object.entries(actions).forEach(
        ([id, url]) => {

            const element =
                document.getElementById(
                    `quick-${id}`
                );


            if (!element) return;


            element.addEventListener(
                "click",
                () => {

                    window.location.href =
                        url;

                }
            );

        }
    );

}


/* =========================================================
   REFRESH
========================================================= */

function refreshDashboard() {

    const button =
        document.getElementById(
            "refreshBtn"
        );


    if (button) {

        button.classList.add(
            "loading"
        );

        button.disabled = true;

    }


    loadDashboard()
        .finally(() => {

            if (button) {

                button.classList.remove(
                    "loading"
                );

                button.disabled = false;

            }


            showToast(
                "Dashboard Updated",
                "Latest MongoDB store data has been loaded."
            );

        });

}


/* =========================================================
   LAST UPDATED
========================================================= */

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) return;


    const now = new Date();


    element.textContent =
        `Updated ${now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )}`;

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutAdmin() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) return;


    localStorage.removeItem(
        "khanAdminLoggedIn"
    );


    localStorage.removeItem(
        "khanAdmin"
    );


    window.location.href =
        "admin-login.html";

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!sidebar) return;


    sidebar.classList.toggle(
        "open"
    );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

    setupQuickActions();


    const refreshBtn =
        document.getElementById(
            "refreshBtn"
        );


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            refreshDashboard
        );

    }


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logoutAdmin
        );

    }


    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            toggleSidebar
        );

    }


    document
        .querySelectorAll(".sidebar-nav a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    const sidebar =
                        document.getElementById(
                            "sidebar"
                        );


                    if (
                        sidebar &&
                        window.innerWidth <= 800
                    ) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                }
            );

        });

}


/* =========================================================
   HELPERS
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


function getDateValue(order) {

    const date =
        order.createdAt ||
        order.date ||
        order.created_at;


    const timestamp =
        date
            ? new Date(date).getTime()
            : 0;


    return Number.isFinite(timestamp)
        ? timestamp
        : 0;

}


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(amount) || 0
    );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(
    title,
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastTitle =
        document.getElementById(
            "toastTitle"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (!toast) return;


    if (toastTitle) {

        toastTitle.textContent =
            title;

    }


    if (toastMessage) {

        toastMessage.textContent =
            message;

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}