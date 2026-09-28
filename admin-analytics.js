"use strict";

/* =========================================================
   KHAN STORE — ADMIN ANALYTICS
   MongoDB Connected Version
========================================================= */

const API_URL = "http://https://khan-store.onrender.com";

let allOrders = [];
let allCustomers = [];

let salesChart = null;
let statusChart = null;


/* =========================================================
   ADMIN AUTH
========================================================= */

function checkAdmin() {

    if (
        localStorage.getItem("khanAdminLoggedIn") !== "true"
    ) {
        window.location.href = "admin-login.html";
        return false;
    }

    return true;
}


/* =========================================================
   HELPERS
========================================================= */

function money(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value) || 0
    );

}


function formatDate(date) {

    if (!date) return "-";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
        return "-";
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatDateTime(date) {

    if (!date) return "-";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
        return "-";
    }

    return parsed.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
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
   NORMALIZE ORDER
========================================================= */

function normalizeOrder(order) {

    const items =
        Array.isArray(order.items)
            ? order.items.map(item => {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 1;

                return {

                    ...item,

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


    return {

        ...order,

        id:
            order.orderId ||
            order.id ||
            "",

        orderId:
            order.orderId ||
            order.id ||
            "",

        createdAt:
            order.createdAt ||
            order.date ||
            order.created_at ||
            "",

        status:
            normalizeStatus(
                order.status
            ),

        customer: {

            name:
                order.customer?.name ||
                "Customer",

            email:
                order.customer?.email ||
                "",

            phone:
                order.customer?.phone ||
                ""

        },

        items,

        pricing: {

            subtotal:
                Number(
                    order.pricing?.subtotal
                ) || 0,

            delivery:
                Number(
                    order.pricing?.delivery
                ) || 0,

            tax:
                Number(
                    order.pricing?.tax
                ) || 0,

            discount:
                Number(
                    order.pricing?.discount
                ) || 0,

            total:
                Number(
                    order.pricing?.total
                ) || 0

        },

        paymentMethod:
            order.paymentMethod ||
            "cod",

        paymentStatus:
            order.paymentStatus ||
            "pending"

    };

}


/* =========================================================
   LOAD ORDERS FROM MONGODB
========================================================= */

async function loadOrders() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`
            );


        if (!response.ok) {

            throw new Error(
                `Orders API Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        let orders = [];


        if (Array.isArray(data)) {

            orders = data;

        }

        else if (
            Array.isArray(data.orders)
        ) {

            orders = data.orders;

        }


        allOrders =
            orders
                .map(normalizeOrder)
                .sort(
                    (a, b) =>
                        getDateValue(b) -
                        getDateValue(a)
                );


        localStorage.setItem(
            "khanOrders",
            JSON.stringify(allOrders)
        );


        console.log(
            "Analytics MongoDB Orders:",
            allOrders
        );


    } catch (error) {

        console.warn(
            "MongoDB orders unavailable. Using localStorage.",
            error
        );


        try {

            const local =
                JSON.parse(
                    localStorage.getItem(
                        "khanOrders"
                    ) || "[]"
                );


            allOrders =
                Array.isArray(local)
                    ? local
                        .map(normalizeOrder)
                        .sort(
                            (a, b) =>
                                getDateValue(b) -
                                getDateValue(a)
                        )
                    : [];


        } catch {

            allOrders = [];

        }

    }

}


/* =========================================================
   LOAD CUSTOMERS
========================================================= */

async function loadCustomers() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/users`
            );


        if (!response.ok) {

            throw new Error(
                `Customers API Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            data?.success &&
            Array.isArray(data.users)
        ) {

            allCustomers =
                data.users;

            return;

        }


        if (Array.isArray(data)) {

            allCustomers =
                data;

            return;

        }


        throw new Error(
            "Invalid customers response"
        );


    } catch (error) {

        console.warn(
            "Customers API unavailable. Creating customer list from orders."
        );


        const customerMap =
            new Map();


        allOrders.forEach(order => {

            const email =
                String(
                    order.customer?.email ||
                    ""
                )
                .trim()
                .toLowerCase();


            if (!email) return;


            if (
                !customerMap.has(email)
            ) {

                customerMap.set(
                    email,
                    {

                        name:
                            order.customer?.name ||
                            "Customer",

                        email

                    }
                );

            }

        });


        allCustomers =
            [...customerMap.values()];

    }

}


/* =========================================================
   DATE RANGE
========================================================= */

function getDateRange() {

    const select =
        document.getElementById(
            "salesPeriod"
        );


    const selectedDays =
        Number(
            select?.value || 30
        );


    const days =
        Number.isFinite(selectedDays) &&
        selectedDays > 0
            ? selectedDays
            : 30;


    const end =
        new Date();


    end.setHours(
        23,
        59,
        59,
        999
    );


    const start =
        new Date();


    start.setHours(
        0,
        0,
        0,
        0
    );


    start.setDate(
        start.getDate() -
        days +
        1
    );


    return {

        start,

        end,

        days

    };

}


/* =========================================================
   FILTER ORDERS
========================================================= */

function getFilteredOrders() {

    const {
        start,
        end
    } = getDateRange();


    return allOrders.filter(order => {

        const date =
            new Date(
                order.createdAt
            );


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return false;

        }


        return (
            date >= start &&
            date <= end
        );

    });

}


/* =========================================================
   ORDER TOTAL
========================================================= */

function getOrderTotal(order) {

    if (
        Number.isFinite(
            Number(
                order.pricing?.total
            )
        )
    ) {

        return Number(
            order.pricing.total
        );

    }


    return (
        Array.isArray(order.items)
            ? order.items.reduce(
                (
                    total,
                    item
                ) => {

                    return (
                        total +
                        (
                            Number(
                                item.price
                            ) || 0
                        ) *
                        (
                            Number(
                                item.quantity
                            ) || 1
                        )
                    );

                },
                0
            )
            : 0
    );

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const orders =
        getFilteredOrders();


    const revenue =
        orders.reduce(
            (
                total,
                order
            ) =>
                total +
                getOrderTotal(order),
            0
        );


    const customerEmails =
        new Set();


    orders.forEach(order => {

        const email =
            String(
                order.customer?.email ||
                ""
            )
            .trim()
            .toLowerCase();


        if (email) {

            customerEmails.add(
                email
            );

        }

    });


    const customerCount =
        customerEmails.size ||
        allCustomers.length ||
        0;


    const averageOrderValue =
        orders.length
            ? revenue / orders.length
            : 0;


    setText(
        "totalRevenue",
        money(revenue)
    );


    setText(
        "totalOrders",
        orders.length.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "totalCustomers",
        customerCount.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "averageOrder",
        money(
            averageOrderValue
        )
    );


    const range =
        getDateRange();


    setText(
        "analyticsDate",
        `${formatDate(
            range.start
        )} - ${formatDate(
            range.end
        )}`
    );

}


/* =========================================================
   REVENUE CHART
========================================================= */

function createRevenueChart() {

    const canvas =
        document.getElementById(
            "salesChart"
        );


    if (!canvas) return;


    if (
        typeof Chart ===
        "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    const orders =
        getFilteredOrders();


    const {
        start,
        days
    } =
        getDateRange();


    const labels = [];

    const revenueData = [];


    /*
     * Daily chart
     */

    if (days <= 30) {

        for (
            let i = 0;
            i < days;
            i++
        ) {

            const bucketStart =
                new Date(start);


            bucketStart.setDate(
                start.getDate() +
                i
            );


            const bucketEnd =
                new Date(
                    bucketStart
                );


            bucketEnd.setDate(
                bucketEnd.getDate() +
                1
            );


            labels.push(
                bucketStart.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                )
            );


            const total =
                orders
                    .filter(order => {

                        const date =
                            new Date(
                                order.createdAt
                            );


                        return (
                            date >=
                            bucketStart &&
                            date <
                            bucketEnd
                        );

                    })
                    .reduce(
                        (
                            sum,
                            order
                        ) =>
                            sum +
                            getOrderTotal(
                                order
                            ),
                        0
                    );


            revenueData.push(
                total
            );

        }

    }

    /*
     * Monthly chart
     */

    else {

        const months =
            days <= 90
                ? 3
                : 12;


        for (
            let i = 0;
            i < months;
            i++
        ) {

            const bucketStart =
                new Date(
                    start.getFullYear(),
                    start.getMonth() +
                    i,
                    1
                );


            const bucketEnd =
                new Date(
                    bucketStart.getFullYear(),
                    bucketStart.getMonth() +
                    1,
                    1
                );


            labels.push(
                bucketStart.toLocaleDateString(
                    "en-IN",
                    {
                        month: "short",
                        year: "numeric"
                    }
                )
            );


            const total =
                orders
                    .filter(order => {

                        const date =
                            new Date(
                                order.createdAt
                            );


                        return (
                            date >=
                            bucketStart &&
                            date <
                            bucketEnd
                        );

                    })
                    .reduce(
                        (
                            sum,
                            order
                        ) =>
                            sum +
                            getOrderTotal(
                                order
                            ),
                        0
                    );


            revenueData.push(
                total
            );

        }

    }


    if (salesChart) {

        salesChart.destroy();

    }


    salesChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [
                        {

                            label:
                                "Revenue",

                            data:
                                revenueData,

                            borderWidth:
                                3,

                            fill:
                                true,

                            tension:
                                0.35

                        }
                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    context =>
                                        money(
                                            context.raw
                                        )

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    value =>
                                        money(
                                            value
                                        )

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   ORDER STATUS CHART
========================================================= */

function createStatusChart() {

    const canvas =
        document.getElementById(
            "orderStatusChart"
        );


    if (!canvas) return;


    if (
        typeof Chart ===
        "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    const statuses = {

        Placed: 0,

        Processing: 0,

        Shipped: 0,

        "Out for Delivery": 0,

        Delivered: 0,

        Cancelled: 0

    };


    getFilteredOrders()
        .forEach(order => {

            const status =
                normalizeStatus(
                    order.status
                );


            if (
                Object.prototype.hasOwnProperty.call(
                    statuses,
                    status
                )
            ) {

                statuses[status]++;

            }

        });


    setText(
        "statusTotal",
        getFilteredOrders().length
    );


    if (statusChart) {

        statusChart.destroy();

    }


    statusChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels:
                        Object.keys(
                            statuses
                        ),

                    datasets: [
                        {

                            data:
                                Object.values(
                                    statuses
                                ),

                            borderWidth:
                                0

                        }
                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }
        );


    renderStatusLegend(
        statuses
    );

}


/* =========================================================
   STATUS LEGEND
========================================================= */

function renderStatusLegend(
    statuses
) {

    const container =
        document.getElementById(
            "statusLegend"
        );


    if (!container) return;


    container.innerHTML =
        Object.entries(
            statuses
        )
        .map(
            ([status, count]) => `

                <div
                    class="status-legend-item"
                >

                    <span
                        class="status-legend-name"
                    >
                        ${escapeHTML(
                            status
                        )}
                    </span>

                    <strong>
                        ${count}
                    </strong>

                </div>

            `
        )
        .join("");

}


/* =========================================================
   TOP PRODUCTS
========================================================= */

function renderTopProducts() {

    const container =
        document.getElementById(
            "topProducts"
        );


    if (!container) return;


    const productMap =
        new Map();


    getFilteredOrders()
        .forEach(order => {

            if (
                !Array.isArray(
                    order.items
                )
            ) return;


            order.items.forEach(item => {

                const name =
                    item.name ||
                    "Unknown Product";


                if (
                    !productMap.has(
                        name
                    )
                ) {

                    productMap.set(
                        name,
                        {

                            name,

                            quantity: 0,

                            revenue: 0

                        }
                    );

                }


                const product =
                    productMap.get(
                        name
                    );


                product.quantity +=
                    Number(
                        item.quantity
                    ) || 0;


                product.revenue +=
                    Number(
                        item.subtotal
                    ) ||
                    (
                        (
                            Number(
                                item.price
                            ) || 0
                        ) *
                        (
                            Number(
                                item.quantity
                            ) || 0
                        )
                    );

            });

        });


    const products =
        [...productMap.values()]
            .sort(
                (a, b) =>
                    b.revenue -
                    a.revenue
            )
            .slice(
                0,
                5
            );


    if (!products.length) {

        container.innerHTML = `
            <div class="empty-state">
                No product sales available
            </div>
        `;

        return;

    }


    container.innerHTML =
        products.map(
            (
                product,
                index
            ) => `

                <div
                    class="top-product-item"
                >

                    <div
                        class="top-product-rank"
                    >
                        ${index + 1}
                    </div>

                    <div
                        class="top-product-info"
                    >

                        <strong>
                            ${escapeHTML(
                                product.name
                            )}
                        </strong>

                        <span>
                            ${product.quantity}
                            units sold
                        </span>

                    </div>

                    <div
                        class="top-product-revenue"
                    >
                        ${money(
                            product.revenue
                        )}
                    </div>

                </div>

            `
        )
        .join("");

}


/* =========================================================
   PAYMENT METHODS
========================================================= */

function renderPaymentMethods() {

    const container =
        document.getElementById(
            "paymentMethods"
        );


    if (!container) return;


    const paymentMap =
        new Map();


    getFilteredOrders()
        .forEach(order => {

            let method =
                String(
                    order.paymentMethod ||
                    "cod"
                )
                .toLowerCase();


            if (
                method === "cod"
            ) {

                method =
                    "Cash on Delivery";

            }

            else if (
                method === "online"
            ) {

                method =
                    "Online Payment";

            }

            else {

                method =
                    method.toUpperCase();

            }


            if (
                !paymentMap.has(
                    method
                )
            ) {

                paymentMap.set(
                    method,
                    {

                        count: 0,

                        revenue: 0

                    }
                );

            }


            const data =
                paymentMap.get(
                    method
                );


            data.count++;


            data.revenue +=
                getOrderTotal(
                    order
                );

        });


    const methods =
        [...paymentMap.entries()];


    if (!methods.length) {

        container.innerHTML = `
            <div class="empty-state">
                No payment data available
            </div>
        `;

        return;

    }


    container.innerHTML =
        methods.map(
            (
                [method, data]
            ) => `

                <div
                    class="payment-method-item"
                >

                    <div>

                        <strong>
                            ${escapeHTML(
                                method
                            )}
                        </strong>

                        <span>
                            ${data.count}
                            orders
                        </span>

                    </div>

                    <strong>
                        ${money(
                            data.revenue
                        )}
                    </strong>

                </div>

            `
        )
        .join("");

}


/* =========================================================
   RECENT SALES
========================================================= */

function renderRecentSales() {

    const tbody =
        document.getElementById(
            "recentSalesBody"
        );


    const empty =
        document.getElementById(
            "recentSalesEmpty"
        );


    if (!tbody) return;


    const orders =
        [...allOrders]
            .sort(
                (a, b) =>
                    getDateValue(b) -
                    getDateValue(a)
            )
            .slice(
                0,
                10
            );


    tbody.innerHTML = "";


    if (!orders.length) {

        if (empty) {

            empty.style.display =
                "block";

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    orders.forEach(order => {

        const row =
            document.createElement(
                "tr"
            );


        const status =
            normalizeStatus(
                order.status
            );


        row.innerHTML = `

            <td>

                <strong>
                    ${escapeHTML(
                        order.orderId ||
                        "-"
                    )}
                </strong>

            </td>

            <td>
                ${escapeHTML(
                    order.customer?.name ||
                    "Customer"
                )}
            </td>

            <td>
                ${formatDateTime(
                    order.createdAt
                )}
            </td>

            <td>
                ${money(
                    getOrderTotal(
                        order
                    )
                )}
            </td>

            <td>

                <span
                    class="status-badge ${getStatusClass(
                        status
                    )}"
                >
                    ${escapeHTML(
                        status
                    )}
                </span>

            </td>

        `;


        tbody.appendChild(
            row
        );

    });

}


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateAnalytics() {

    updateStats();

    createRevenueChart();

    createStatusChart();

    renderTopProducts();

    renderPaymentMethods();

    renderRecentSales();

}


/* =========================================================
   REFRESH
========================================================= */

async function refreshAnalytics(
    showMessage = true
) {

    const button =
        document.getElementById(
            "refreshBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.classList.add(
            "loading"
        );

    }


    try {

        await Promise.all([
            loadOrders(),
            loadCustomers()
        ]);


        updateAnalytics();


        setText(
            "lastUpdated",
            `Last updated: ${new Date().toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )}`
        );


        if (showMessage) {

            showToast(
                "Analytics Updated",
                "Latest MongoDB data loaded successfully."
            );

        }


    } catch (error) {

        console.error(
            "Analytics refresh error:",
            error
        );


        showToast(
            "Analytics Error",
            "Unable to load analytics data."
        );

    }


    finally {

        if (button) {

            button.disabled =
                false;

            button.classList.remove(
                "loading"
            );

        }

    }

}


/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(status) {

    const value =
        String(
            status ||
            "Placed"
        )
        .trim()
        .toLowerCase();


    switch (value) {

        case "placed":
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
        status-${String(
            status
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        )}
    `.trim();

}


/* =========================================================
   DATE VALUE
========================================================= */

function getDateValue(order) {

    const date =
        order.createdAt ||
        order.date ||
        order.created_at;


    const value =
        date
            ? new Date(date).getTime()
            : 0;


    return Number.isFinite(
        value
    )
        ? value
        : 0;

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(
    title,
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    const toastTitle =
        document.getElementById(
            "toastTitle"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


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
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   ADMIN INFO
========================================================= */

function loadAdminInfo() {

    const element =
        document.getElementById(
            "adminName"
        );


    if (!element) return;


    try {

        const admin =
            JSON.parse(
                localStorage.getItem(
                    "khanAdmin"
                ) || "null"
            );


        if (admin?.name) {

            element.textContent =
                admin.name;

        }

        else if (admin?.email) {

            element.textContent =
                admin.email;

        }

        else {

            element.textContent =
                "Administrator";

        }

    } catch {

        element.textContent =
            "Administrator";

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuBtn"
        );


    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    if (
        !button ||
        !sidebar
    ) return;


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                sidebar.classList.contains(
                    "open"
                ) &&
                !sidebar.contains(
                    event.target
                ) &&
                event.target !== button
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const button =
        document.getElementById(
            "logoutBtn"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

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
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const pages = {

        dashboard:
            "admin-dashboard.html",

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


    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                () => {

                    const page =
                        element.dataset.page;


                    if (
                        pages[page]
                    ) {

                        window.location.href =
                            pages[page];

                    }

                }
            );

        });


    document
        .querySelectorAll(
            "[data-section]"
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                () => {

                    const section =
                        element.dataset.section;


                    if (
                        pages[section]
                    ) {

                        window.location.href =
                            pages[section];

                    }

                }
            );

        });

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdmin()) {
            return;
        }


        loadAdminInfo();

        setupNavigation();

        setupMobileMenu();

        setupLogout();


        const period =
            document.getElementById(
                "salesPeriod"
            );


        if (period) {

            period.addEventListener(
                "change",
                () => {

                    updateAnalytics();

                }
            );

        }


        const refreshButton =
            document.getElementById(
                "refreshBtn"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                () => {

                    refreshAnalytics(
                        true
                    );

                }
            );

        }


        await refreshAnalytics(
            false
        );

    }
);