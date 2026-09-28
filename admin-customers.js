"use strict";

/* =========================================================
   KHAN STORE - ADMIN CUSTOMERS
   MongoDB Connected Version
   ========================================================= */

const API_URL = "http://https://khan-store.onrender.com";

const ORDER_KEY = "khanOrders";
const ADMIN_LOGIN_KEY = "khanAdminLoggedIn";
const ADMIN_KEY = "khanAdmin";

let customers = [];
let filteredCustomers = [];
let selectedCustomer = null;
let sortAZ = true;
let toastTimer = null;


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatPrice(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
}


function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function getInitials(name) {

    const parts = String(name || "Customer")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "C";
    }

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


/* =========================================================
   ADMIN AUTH
   ========================================================= */

function checkAdminLogin() {

    const loggedIn =
        localStorage.getItem(
            ADMIN_LOGIN_KEY
        );

    if (loggedIn !== "true") {

        window.location.href =
            "admin-login.html";

        return false;
    }

    return true;
}


/* =========================================================
   ADMIN INFO
   ========================================================= */

function loadAdminInfo() {

    try {

        const admin =
            JSON.parse(
                localStorage.getItem(
                    ADMIN_KEY
                ) || "null"
            );

        if (!admin) {
            return;
        }

        if ($("#adminName")) {
            $("#adminName").textContent =
                admin.name ||
                "KHAN Store Admin";
        }

        if ($("#adminEmail")) {
            $("#adminEmail").textContent =
                admin.email ||
                "admin@khanstore.com";
        }

    } catch (error) {

        console.error(
            "Admin info error:",
            error
        );

    }
}


/* =========================================================
   GET ORDERS
   ========================================================= */

function getOrders() {

    try {

        const orders =
            JSON.parse(
                localStorage.getItem(
                    ORDER_KEY
                ) || "[]"
            );

        return Array.isArray(orders)
            ? orders
            : [];

    } catch (error) {

        console.error(
            "Orders loading error:",
            error
        );

        return [];
    }
}


/* =========================================================
   LOAD CUSTOMERS FROM MONGODB
   ========================================================= */

async function loadCustomers() {

    const tbody =
        $("#customersTableBody");

    if (tbody) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Loading customers...
                </td>
            </tr>
        `;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/users`
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.users)
        ) {

            throw new Error(
                "Invalid customer response"
            );

        }


        const orders =
            getOrders();


        customers =
            data.users.map(
                user => {

                    const userEmail =
                        String(
                            user.email || ""
                        )
                            .trim()
                            .toLowerCase();


                    const userPhone =
                        String(
                            user.phone || ""
                        )
                            .replace(
                                /\D/g,
                                ""
                            );


                    const userName =
                        String(
                            user.name || ""
                        )
                            .trim()
                            .toLowerCase();


                    const customerOrders =
                        orders.filter(
                            order => {

                                const email =
                                    String(
                                        order?.customer?.email ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase();


                                const phone =
                                    String(
                                        order?.customer?.phone ||
                                        ""
                                    )
                                        .replace(
                                            /\D/g,
                                            ""
                                        );


                                const name =
                                    String(
                                        order?.customer?.name ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase();


                                return (

                                    (
                                        userEmail &&
                                        email &&
                                        userEmail === email
                                    )

                                    ||

                                    (
                                        userPhone &&
                                        phone &&
                                        userPhone === phone
                                    )

                                    ||

                                    (
                                        userName &&
                                        name &&
                                        userName === name
                                    )

                                );

                            }
                        );


                    const totalSpent =
                        customerOrders.reduce(
                            (
                                total,
                                order
                            ) => {

                                return (
                                    total +
                                    Number(
                                        order?.pricing?.total ||
                                        order?.total ||
                                        0
                                    )
                                );

                            },
                            0
                        );


                    return {

                        id:
                            user._id ||
                            user.id,

                        name:
                            user.name ||
                            "Customer",

                        email:
                            user.email ||
                            "",

                        phone:
                            user.phone ||
                            "",

                        createdAt:
                            user.createdAt,

                        orders:
                            customerOrders,

                        orderCount:
                            customerOrders.length,

                        totalSpent:
                            totalSpent

                    };

                }
            );


        filteredCustomers =
            [...customers];


        updateStats();

        applySorting();

        renderCustomers();


    } catch (error) {

        console.error(
            "Customer API error:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="error-cell">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <strong>
                            Unable to load customers
                        </strong>

                        <span>
                            Make sure the KHAN Store backend
                            is running on port 5000.
                        </span>

                        <button
                            type="button"
                            id="retryCustomersBtn"
                            class="retry-btn"
                        >
                            Try Again
                        </button>

                    </td>
                </tr>
            `;

        }


        $("#retryCustomersBtn")
            ?.addEventListener(
                "click",
                loadCustomers
            );

    }

}


/* =========================================================
   STATS
   ========================================================= */

function updateStats() {

    const total =
        customers.length;


    const active =
        customers.filter(
            customer =>
                customer.email ||
                customer.phone
        ).length;


    const withOrders =
        customers.filter(
            customer =>
                customer.orderCount > 0
        ).length;


    const now =
        Date.now();


    const thirtyDays =
        30 *
        24 *
        60 *
        60 *
        1000;


    const newCustomers =
        customers.filter(
            customer => {

                const date =
                    new Date(
                        customer.createdAt
                    ).getTime();

                if (
                    Number.isNaN(date)
                ) {
                    return false;
                }

                return (
                    now - date <=
                    thirtyDays
                );

            }
        ).length;


    if ($("#totalCustomers")) {
        $("#totalCustomers").textContent =
            total;
    }


    if ($("#activeCustomers")) {
        $("#activeCustomers").textContent =
            active;
    }


    if ($("#customersWithOrders")) {
        $("#customersWithOrders").textContent =
            withOrders;
    }


    if ($("#newCustomers")) {
        $("#newCustomers").textContent =
            newCustomers;
    }

}


/* =========================================================
   SEARCH + FILTER
   ========================================================= */

function applySearch() {

    const keyword =
        String(
            $("#customerSearch")?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const filter =
        $("#customerFilter")?.value ||
        "all";


    filteredCustomers =
        customers.filter(
            customer => {

                const text = [

                    customer.name,

                    customer.email,

                    customer.phone

                ]
                    .join(" ")
                    .toLowerCase();


                const searchMatch =
                    !keyword ||
                    text.includes(
                        keyword
                    );


                let filterMatch =
                    true;


                if (
                    filter === "orders"
                ) {

                    filterMatch =
                        customer.orderCount > 0;

                }


                if (
                    filter === "no-orders"
                ) {

                    filterMatch =
                        customer.orderCount === 0;

                }


                return (
                    searchMatch &&
                    filterMatch
                );

            }
        );


    applySorting();

    renderCustomers();

}


/* =========================================================
   SORT
   ========================================================= */

function applySorting() {

    filteredCustomers.sort(
        (a, b) => {

            const nameA =
                String(a.name || "")
                    .toLowerCase();

            const nameB =
                String(b.name || "")
                    .toLowerCase();


            return sortAZ
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);

        }
    );

}


/* =========================================================
   RENDER TABLE
   ========================================================= */

function renderCustomers() {

    const tbody =
        $("#customersTableBody");

    const empty =
        $("#emptyCustomers");


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (!filteredCustomers.length) {

        if (empty) {
            empty.hidden = false;
        }

        updateResultCount();

        return;
    }


    if (empty) {
        empty.hidden = true;
    }


    filteredCustomers.forEach(
        customer => {

            const row =
                document.createElement("tr");


            const initials =
                getInitials(
                    customer.name
                );


            const hasOrders =
                customer.orderCount > 0;


            row.innerHTML = `

                <td>

                    <div class="customer-cell">

                        <div class="customer-avatar">
                            ${escapeHTML(initials)}
                        </div>

                        <div class="customer-cell-info">

                            <strong>
                                ${escapeHTML(
                                    customer.name
                                )}
                            </strong>

                            <span>
                                Customer
                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <div class="contact-cell">

                        <span>
                            ${escapeHTML(
                                customer.email ||
                                "No email"
                            )}
                        </span>

                        <small>
                            ${escapeHTML(
                                customer.phone ||
                                "No phone"
                            )}
                        </small>

                    </div>

                </td>


                <td>

                    <span class="orders-count">
                        ${customer.orderCount}
                    </span>

                </td>


                <td>

                    <span class="spent-amount">
                        ${formatPrice(
                            customer.totalSpent
                        )}
                    </span>

                </td>


                <td>

                    <span class="joined-date">
                        ${formatDate(
                            customer.createdAt
                        )}
                    </span>

                </td>


                <td>

                    <span class="customer-status ${
                        hasOrders
                            ? "active"
                            : "no-orders"
                    }">

                        ${
                            hasOrders
                                ? "Active"
                                : "No Orders"
                        }

                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="customer-view-btn"
                        data-customer-id="${escapeHTML(
                            customer.id
                        )}"
                        title="View Customer"
                    >

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }
    );


    tbody
        .querySelectorAll(
            ".customer-view-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openCustomerModal(
                            button.dataset.customerId
                        );

                    }
                );

            }
        );


    updateResultCount();

}


/* =========================================================
   RESULT COUNT
   ========================================================= */

function updateResultCount() {

    const element =
        $("#resultCount");

    if (!element) {
        return;
    }


    const count =
        filteredCustomers.length;


    element.textContent =
        `${count} customer${
            count === 1
                ? ""
                : "s"
        }`;

}


/* =========================================================
   CUSTOMER MODAL
   ========================================================= */

function openCustomerModal(id) {

    selectedCustomer =
        customers.find(
            customer =>
                String(customer.id) ===
                String(id)
        );


    if (!selectedCustomer) {
        return;
    }


    const customer =
        selectedCustomer;


    const orders =
        customer.orders || [];


    if ($("#modalAvatar")) {

        $("#modalAvatar").textContent =
            getInitials(
                customer.name
            );

    }


    if ($("#modalCustomerName")) {

        $("#modalCustomerName").textContent =
            customer.name ||
            "Customer";

    }


    if ($("#modalCustomerEmail")) {

        $("#modalCustomerEmail").textContent =
            customer.email ||
            "No email";

    }


    if ($("#modalCustomerEmail2")) {

        $("#modalCustomerEmail2").textContent =
            customer.email ||
            "No email";

    }


    if ($("#modalCustomerPhone")) {

        $("#modalCustomerPhone").textContent =
            customer.phone ||
            "No phone";

    }


    if ($("#modalCustomerOrders")) {

        $("#modalCustomerOrders").textContent =
            orders.length;

    }


    if ($("#modalCustomerSpent")) {

        $("#modalCustomerSpent").textContent =
            formatPrice(
                customer.totalSpent
            );

    }


    if ($("#modalCustomerJoined")) {

        $("#modalCustomerJoined").textContent =
            formatDate(
                customer.createdAt
            );

    }


    if ($("#modalCustomerStatus")) {

        $("#modalCustomerStatus").textContent =
            orders.length > 0
                ? "Active"
                : "No Orders";

        $("#modalCustomerStatus").className =
            "customer-status " +
            (
                orders.length > 0
                    ? "active"
                    : "no-orders"
            );

    }


    renderCustomerOrders(
        orders
    );


    const modal =
        $("#customerModal");


    if (modal) {

        modal.hidden = false;

        document.body.style.overflow =
            "hidden";

    }

}


/* =========================================================
   CUSTOMER ORDERS
   ========================================================= */

function renderCustomerOrders(orders) {

    const container =
        $("#modalOrdersList");

    const count =
        $("#modalOrderCount");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (count) {

        count.textContent =
            `${orders.length} order${
                orders.length === 1
                    ? ""
                    : "s"
            }`;

    }


    if (!orders.length) {

        container.innerHTML = `

            <div class="modal-no-orders">

                <i class="fa-solid fa-box-open"></i>

                <p>
                    No orders found for this customer.
                </p>

            </div>

        `;

        return;
    }


    [...orders]
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt || 0
                ) -
                new Date(
                    a.createdAt || 0
                )
        )
        .slice(0, 5)
        .forEach(
            order => {

                const item =
                    document.createElement("div");

                item.className =
                    "modal-order-item";


                const total =
                    Number(
                        order?.pricing?.total ||
                        order?.total ||
                        0
                    );


                item.innerHTML = `

                    <div class="modal-order-info">

                        <strong>
                            ${escapeHTML(
                                order.id ||
                                "Order"
                            )}
                        </strong>

                        <span>
                            ${formatDate(
                                order.createdAt
                            )}
                            •
                            ${escapeHTML(
                                order.status ||
                                "Placed"
                            )}
                        </span>

                    </div>


                    <div class="modal-order-price">
                        ${formatPrice(total)}
                    </div>

                `;


                container.appendChild(item);

            }
        );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeCustomerModal() {

    const modal =
        $("#customerModal");

    if (modal) {
        modal.hidden = true;
    }

    document.body.style.overflow = "";

    selectedCustomer = null;

}


/* =========================================================
   VIEW CUSTOMER ORDERS
   ========================================================= */

function viewCustomerOrders() {

    if (!selectedCustomer) {
        return;
    }


    if (
        !selectedCustomer.orders ||
        !selectedCustomer.orders.length
    ) {

        showToast(
            "This customer has no orders",
            "error"
        );

        return;
    }


    const name =
        encodeURIComponent(
            selectedCustomer.name
        );


    window.location.href =
        `admin-orders.html?search=${name}`;

}


/* =========================================================
   SORT BUTTON
   ========================================================= */

function toggleSort() {

    sortAZ =
        !sortAZ;


    const button =
        $("#sortCustomersBtn");


    if (button) {

        button.innerHTML =
            sortAZ
                ? `
                    <i class="fa-solid fa-arrow-down-a-z"></i>
                    Sort A-Z
                  `
                : `
                    <i class="fa-solid fa-arrow-up-z-a"></i>
                    Sort Z-A
                  `;

    }


    applySorting();

    renderCustomers();

}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

function clearSearch() {

    if ($("#customerSearch")) {
        $("#customerSearch").value = "";
    }

    if ($("#customerFilter")) {
        $("#customerFilter").value = "all";
    }

    filteredCustomers =
        [...customers];

    applySorting();

    renderCustomers();

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "success"
) {

    const toast =
        $("#adminToast");

    const title =
        $("#adminToastTitle");

    const text =
        $("#adminToastText");


    if (!toast) {
        return;
    }


    if (title) {

        title.textContent =
            type === "error"
                ? "Error"
                : "Success";

    }


    if (text) {
        text.textContent =
            message;
    }


    const icon =
        toast.querySelector(
            ".toast-icon i"
        );


    if (icon) {

        icon.className =
            type === "error"
                ? "fa-solid fa-circle-xmark"
                : "fa-solid fa-check";

    }


    toast.classList.add("show");


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
   REFRESH
   ========================================================= */

function refreshCustomers() {

    loadCustomers();

    showToast(
        "Customer list refreshed"
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutAdmin() {

    localStorage.removeItem(
        ADMIN_LOGIN_KEY
    );

    localStorage.removeItem(
        ADMIN_KEY
    );

    window.location.href =
        "admin-login.html";

}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function setupMobileSidebar() {

    const button =
        $("#adminMenuBtn");

    const sidebar =
        $("#adminSidebar");


    if (!button || !sidebar) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                window.innerWidth > 900
            ) {
                return;
            }


            if (
                !sidebar.contains(
                    event.target
                ) &&
                !button.contains(
                    event.target
                )
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {

    $("#customerSearch")
        ?.addEventListener(
            "input",
            applySearch
        );


    $("#customerFilter")
        ?.addEventListener(
            "change",
            applySearch
        );


    $("#clearSearchBtn")
        ?.addEventListener(
            "click",
            clearSearch
        );


    $("#sortCustomersBtn")
        ?.addEventListener(
            "click",
            toggleSort
        );


    $("#refreshCustomersBtn")
        ?.addEventListener(
            "click",
            refreshCustomers
        );


    $("#logoutBtn")
        ?.addEventListener(
            "click",
            logoutAdmin
        );


    $("#closeCustomerModal")
        ?.addEventListener(
            "click",
            closeCustomerModal
        );


    $("#closeCustomerModalBtn")
        ?.addEventListener(
            "click",
            closeCustomerModal
        );


    $("#customerModalOverlay")
        ?.addEventListener(
            "click",
            closeCustomerModal
        );


    $("#viewCustomerOrdersBtn")
        ?.addEventListener(
            "click",
            viewCustomerOrders
        );


    $("#closeToast")
        ?.addEventListener(
            "click",
            () => {

                $("#adminToast")
                    ?.classList
                    .remove("show");

            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeCustomerModal();

                $("#adminToast")
                    ?.classList
                    .remove("show");

            }

        }
    );

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkAdminLogin()) {
            return;
        }


        loadAdminInfo();

        setupEvents();

        setupMobileSidebar();

        loadCustomers();

    }
);