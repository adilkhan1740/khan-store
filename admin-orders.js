/* =========================================================
   KHAN STORE - ADMIN ORDERS
   MongoDB Connected Order Management
========================================================= */

const API_URL = "http://localhost:5000";

let allOrders = [];
let filteredOrders = [];
let selectedOrderId = null;


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {
    return "₹" + Number(price || 0).toLocaleString("en-IN");
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getOrderId(order) {
    return order?.orderId || order?.id || order?._id || "";
}


function getOrderStatus(order) {
    return order?.status || "Placed";
}


function getOrderTotal(order) {
    return Number(
        order?.pricing?.total ??
        order?.total ??
        0
    );
}


function getOrderItems(order) {
    return Array.isArray(order?.items)
        ? order.items
        : [];
}


function getStatusClass(status) {
    return String(status || "Placed")
        .toLowerCase()
        .replace(/\s+/g, "-");
}


function getProductImage(item) {
    const image = item?.image || item?.img || "";

    if (!image) {
        return "";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:image/")
    ) {
        return image;
    }

    if (image.startsWith("/")) {
        return image;
    }

    if (
        image.startsWith("images/") ||
        image.startsWith("./images/")
    ) {
        return image;
    }

    return `images/${image}`;
}


/* =========================================================
   LOAD ORDERS FROM MONGODB
========================================================= */

async function loadOrders() {

    const tableBody =
        document.querySelector("#ordersTableBody");

    if (tableBody) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    <div class="orders-loading">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Loading orders...</span>
                    </div>
                </td>
            </tr>
        `;
    }

    try {

        const response =
            await fetch(`${API_URL}/api/orders`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data =
            await response.json();

        if (Array.isArray(data)) {

            allOrders = data;

        } else if (Array.isArray(data.orders)) {

            allOrders = data.orders;

        } else if (Array.isArray(data.data)) {

            allOrders = data.data;

        } else {

            allOrders = [];
        }


        allOrders.sort((a, b) => {

            return (
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            );
        });


        filteredOrders = [...allOrders];

        updateStats();
        applyFilters();


        console.log(
            "MongoDB Orders Loaded:",
            allOrders
        );

    } catch (error) {

        console.error(
            "Order loading error:",
            error
        );

        allOrders = [];
        filteredOrders = [];

        updateStats();

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-cell">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <strong>
                            Unable to load orders
                        </strong>

                        <span>
                            Please make sure the backend
                            server is running on port 5000.
                        </span>

                        <button
                            type="button"
                            class="retry-btn"
                            id="retryOrdersBtn"
                        >
                            <i class="fa-solid fa-rotate-right"></i>
                            Retry
                        </button>

                    </td>
                </tr>
            `;

            document
                .querySelector("#retryOrdersBtn")
                ?.addEventListener(
                    "click",
                    loadOrders
                );
        }
    }
}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    const totalOrders =
        allOrders.length;


    const pendingOrders =
        allOrders.filter(order => {

            return [
                "Placed",
                "Processing"
            ].includes(
                getOrderStatus(order)
            );

        }).length;


    const shippedOrders =
        allOrders.filter(order => {

            return [
                "Shipped",
                "Out for Delivery"
            ].includes(
                getOrderStatus(order)
            );

        }).length;


    const deliveredOrders =
        allOrders.filter(order => {

            return (
                getOrderStatus(order) ===
                "Delivered"
            );

        }).length;


    const totalElement =
        document.querySelector("#totalOrders");

    const pendingElement =
        document.querySelector("#pendingOrders");

    const shippedElement =
        document.querySelector("#shippedOrders");

    const deliveredElement =
        document.querySelector("#deliveredOrders");

    const sidebarCount =
        document.querySelector("#sidebarOrderCount");


    if (totalElement) {
        totalElement.textContent =
            totalOrders;
    }


    if (pendingElement) {
        pendingElement.textContent =
            pendingOrders;
    }


    if (shippedElement) {
        shippedElement.textContent =
            shippedOrders;
    }


    if (deliveredElement) {
        deliveredElement.textContent =
            deliveredOrders;
    }


    if (sidebarCount) {
        sidebarCount.textContent =
            totalOrders;
    }
}


/* =========================================================
   RENDER ORDERS
========================================================= */

function renderOrders() {

    const tableBody =
        document.querySelector(
            "#ordersTableBody"
        );

    const resultCount =
        document.querySelector(
            "#resultCount"
        );

    const emptyOrders =
        document.querySelector(
            "#emptyOrders"
        );


    if (!tableBody) {
        return;
    }


    if (resultCount) {
        resultCount.textContent =
            filteredOrders.length;
    }


    if (!filteredOrders.length) {

        tableBody.innerHTML = "";

        if (emptyOrders) {
            emptyOrders.hidden = false;
        }

        return;
    }


    if (emptyOrders) {
        emptyOrders.hidden = true;
    }


    tableBody.innerHTML =
        filteredOrders
            .map(order => {

                const orderId =
                    getOrderId(order);

                const customer =
                    order.customer || {};

                const items =
                    getOrderItems(order);

                const totalItems =
                    items.reduce(
                        (total, item) => {

                            return (
                                total +
                                Number(
                                    item?.quantity || 1
                                )
                            );

                        },
                        0
                    );

                const total =
                    getOrderTotal(order);

                const status =
                    getOrderStatus(order);

                const createdAt =
                    order.createdAt
                        ? new Date(
                            order.createdAt
                        ).toLocaleString(
                            "en-IN",
                            {
                                dateStyle: "medium",
                                timeStyle: "short"
                            }
                        )
                        : "-";


                return `
                    <tr>

                        <td>
                            <strong class="order-id">
                                #${escapeHTML(orderId)}
                            </strong>
                        </td>


                        <td>

                            <div class="customer-cell">

                                <strong>
                                    ${escapeHTML(
                                        customer.name ||
                                        "Customer"
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        customer.phone ||
                                        customer.email ||
                                        ""
                                    )}
                                </small>

                            </div>

                        </td>


                        <td>
                            ${totalItems}
                        </td>


                        <td>

                            <strong>
                                ${formatPrice(total)}
                            </strong>

                        </td>


                        <td>

                            <small>
                                ${escapeHTML(createdAt)}
                            </small>

                        </td>


                        <td>

                            <span
                                class="status-badge status-${getStatusClass(status)}"
                            >
                                ${escapeHTML(status)}
                            </span>

                        </td>


                        <td>

                            <div class="order-actions">

                                <button
                                    type="button"
                                    class="view-order-btn"
                                    data-order-id="${escapeHTML(orderId)}"
                                    title="View Order"
                                    aria-label="View Order"
                                >
                                    <i class="fa-solid fa-eye"></i>
                                </button>


                                <button
                                    type="button"
                                    class="status-order-btn"
                                    data-order-id="${escapeHTML(orderId)}"
                                    title="Edit Order Status"
                                    aria-label="Edit Order Status"
                                >
                                    <i class="fa-solid fa-pen"></i>
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            })
            .join("");
}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector("#orderSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        applyFilters
    );
}


/* =========================================================
   STATUS FILTER
========================================================= */

function initializeStatusFilter() {

    const filter =
        document.querySelector("#statusFilter");

    if (!filter) {
        return;
    }

    filter.addEventListener(
        "change",
        applyFilters
    );
}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const searchInput =
        document.querySelector("#orderSearch");

    const filter =
        document.querySelector("#statusFilter");


    const query =
        String(
            searchInput?.value || ""
        )
            .trim()
            .toLowerCase();


    const selectedStatus =
        filter?.value || "all";


    filteredOrders =
        allOrders.filter(order => {

            const orderId =
                String(
                    getOrderId(order)
                ).toLowerCase();


            const customer =
                order.customer || {};


            const name =
                String(
                    customer.name || ""
                ).toLowerCase();


            const email =
                String(
                    customer.email || ""
                ).toLowerCase();


            const phone =
                String(
                    customer.phone || ""
                ).toLowerCase();


            const status =
                getOrderStatus(order);


            const matchesSearch =
                !query ||
                orderId.includes(query) ||
                name.includes(query) ||
                email.includes(query) ||
                phone.includes(query);


            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


    renderOrders();
}


/* =========================================================
   VIEW ORDER
========================================================= */

function viewOrder(orderId) {

    console.log(
        "VIEW BUTTON CLICKED:",
        orderId
    );


    const order =
        allOrders.find(
            item =>
                String(
                    getOrderId(item)
                ) === String(orderId)
        );


    if (!order) {

        showToast(
            "Error",
            "Order not found.",
            "error"
        );

        return;
    }


    selectedOrderId =
        String(orderId);


    const modal =
        document.querySelector("#orderModal");


    if (!modal) {

        console.error(
            "Order modal not found in HTML."
        );

        return;
    }


    const customer =
        order.customer || {};

    const items =
        getOrderItems(order);

    const pricing =
        order.pricing || {};

    const status =
        getOrderStatus(order);


    /* =====================================================
       CUSTOMER DETAILS
    ===================================================== */

    setText(
        "#modalOrderId",
        "#" + getOrderId(order)
    );


    setText(
        "#modalCustomerName",
        customer.name || "-"
    );


    setText(
        "#modalCustomerPhone",
        customer.phone || "-"
    );


    setText(
        "#modalCustomerEmail",
        customer.email || "-"
    );


    const address =
        customer.address ||
        [
            customer.city,
            customer.state,
            customer.pincode
        ]
            .filter(Boolean)
            .join(", ") ||
        "-";


    setText(
        "#modalCustomerAddress",
        address
    );


    /* =====================================================
       PRODUCTS
    ===================================================== */

    const productsContainer =
        document.querySelector(
            "#modalProducts"
        );


    if (productsContainer) {

        if (!items.length) {

            productsContainer.innerHTML = `
                <div class="modal-empty">
                    <i class="fa-solid fa-box-open"></i>
                    <span>No products found.</span>
                </div>
            `;

        } else {

            productsContainer.innerHTML =
                items
                    .map(item => {

                        const quantity =
                            Number(
                                item?.quantity || 1
                            );


                        const price =
                            Number(
                                item?.price || 0
                            );


                        const subtotal =
                            Number(
                                item?.subtotal ??
                                price * quantity
                            );


                        const image =
                            getProductImage(item);


                        return `
                            <div class="modal-product">

                                <div class="modal-product-image">

                                    ${
                                        image
                                            ? `
                                                <img
                                                    src="${escapeHTML(image)}"
                                                    alt="${escapeHTML(
                                                        item?.name ||
                                                        "Product"
                                                    )}"
                                                    onerror="this.style.display='none';"
                                                >
                                            `
                                            : `
                                                <i class="fa-solid fa-image"></i>
                                            `
                                    }

                                </div>


                                <div class="modal-product-info">

                                    <strong>
                                        ${escapeHTML(
                                            item?.name ||
                                            "Product"
                                        )}
                                    </strong>

                                    <span>
                                        Qty: ${quantity}
                                    </span>

                                </div>


                                <strong class="modal-product-price">
                                    ${formatPrice(subtotal)}
                                </strong>

                            </div>
                        `;

                    })
                    .join("");
        }
    }


    /* =====================================================
       STATUS
    ===================================================== */

    setText(
        "#modalCurrentStatus",
        status
    );


    const statusSelect =
        document.querySelector(
            "#modalStatusSelect"
        );


    if (statusSelect) {
        statusSelect.value = status;
    }


    /* =====================================================
       PRICING
    ===================================================== */

    setText(
        "#modalSubtotal",
        formatPrice(
            pricing.subtotal ??
            items.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.subtotal ??
                        Number(item?.price || 0) *
                        Number(item?.quantity || 1)
                    ),
                0
            )
        )
    );


    setText(
        "#modalDelivery",
        formatPrice(
            pricing.delivery ??
            0
        )
    );


    setText(
        "#modalDiscount",
        formatPrice(
            pricing.discount ??
            0
        )
    );


    setText(
        "#modalTotal",
        formatPrice(
            pricing.total ??
            getOrderTotal(order)
        )
    );


    /* =====================================================
       SHOW MODAL
       IMPORTANT: CSS USES .show
    ===================================================== */

    modal.classList.add("show");


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    console.log(
        "ORDER MODAL OPENED:",
        orderId
    );
}


/* =========================================================
   SET TEXT
========================================================= */

function setText(selector, value) {

    const element =
        document.querySelector(selector);


    if (element) {

        element.textContent =
            value ?? "-";
    }
}


/* =========================================================
   CLOSE ORDER MODAL
========================================================= */

function closeOrderModal() {

    const modal =
        document.querySelector(
            "#orderModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    selectedOrderId = null;


    console.log(
        "ORDER MODAL CLOSED"
    );
}


/* =========================================================
   SAVE CURRENT STATUS
========================================================= */

async function saveCurrentOrderStatus() {

    if (!selectedOrderId) {

        showToast(
            "Error",
            "No order selected.",
            "error"
        );

        return;
    }


    const select =
        document.querySelector(
            "#modalStatusSelect"
        );


    const newStatus =
        select?.value;


    if (!newStatus) {
        return;
    }


    const button =
        document.querySelector(
            "#saveStatusBtn"
        );


    const originalHTML =
        button?.innerHTML;


    if (button) {

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving...
        `;
    }


    const success =
        await updateOrderStatus(
            selectedOrderId,
            newStatus
        );


    if (button) {

        button.disabled = false;

        button.innerHTML =
            originalHTML;
    }


    if (success) {

        setText(
            "#modalCurrentStatus",
            newStatus
        );

        closeOrderModal();
    }
}


/* =========================================================
   UPDATE ORDER STATUS - MONGODB
========================================================= */

async function updateOrderStatus(
    orderId,
    newStatus
) {

    if (!orderId || !newStatus) {
        return false;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/orders/${encodeURIComponent(
                    orderId
                )}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Status update failed"
            );
        }


        const order =
            allOrders.find(
                item =>
                    String(
                        getOrderId(item)
                    ) === String(orderId)
            );


        if (order) {

            order.status =
                data.order?.status ||
                newStatus;
        }


        syncLocalOrderStatus(
            orderId,
            newStatus
        );


        updateStats();
        applyFilters();


        showToast(
            "Success",
            "Order status updated successfully.",
            "success"
        );


        console.log(
            "Order status updated:",
            orderId,
            newStatus
        );


        return true;


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        showToast(
            "Error",
            error.message ||
            "Unable to update order status.",
            "error"
        );


        return false;
    }
}


/* =========================================================
   LOCAL STORAGE STATUS SYNC
========================================================= */

function syncLocalOrderStatus(
    orderId,
    status
) {

    try {

        const localOrders =
            JSON.parse(
                localStorage.getItem(
                    "khanOrders"
                )
            ) || [];


        if (!Array.isArray(localOrders)) {
            return;
        }


        let changed = false;


        localOrders.forEach(order => {

            const id =
                order.orderId ||
                order.id ||
                order._id;


            if (
                String(id) ===
                String(orderId)
            ) {

                order.status =
                    status;

                changed = true;
            }
        });


        if (changed) {

            localStorage.setItem(
                "khanOrders",
                JSON.stringify(
                    localOrders
                )
            );
        }

    } catch (error) {

        console.warn(
            "Local order sync failed:",
            error
        );
    }
}


/* =========================================================
   TRACK SELECTED ORDER
========================================================= */

function trackSelectedOrder() {

    if (!selectedOrderId) {

        showToast(
            "Error",
            "No order selected.",
            "error"
        );

        return;
    }


    window.location.href =
        `track-order.html?order=${encodeURIComponent(
            selectedOrderId
        )}`;
}


/* =========================================================
   REFRESH BUTTON
========================================================= */

function initializeRefreshButton() {

    const button =
        document.querySelector(
            "#refreshOrdersBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async function () {

            const originalHTML =
                button.innerHTML;


            button.disabled = true;


            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Refreshing...
            `;


            await loadOrders();


            button.disabled = false;


            button.innerHTML =
                originalHTML;
        }
    );
}


/* =========================================================
   TABLE ACTIONS
========================================================= */

function initializeTableActions() {

    document.addEventListener(
        "click",
        function (event) {

            const viewButton =
                event.target.closest(
                    ".view-order-btn"
                );


            if (viewButton) {

                event.preventDefault();
                event.stopPropagation();


                const orderId =
                    viewButton.getAttribute(
                        "data-order-id"
                    );


                console.log(
                    "VIEW BUTTON FOUND:",
                    orderId
                );


                if (!orderId) {

                    showToast(
                        "Error",
                        "Order ID not found.",
                        "error"
                    );

                    return;
                }


                viewOrder(orderId);

                return;
            }


            const editButton =
                event.target.closest(
                    ".status-order-btn"
                );


            if (editButton) {

                event.preventDefault();
                event.stopPropagation();


                const orderId =
                    editButton.getAttribute(
                        "data-order-id"
                    );


                console.log(
                    "EDIT BUTTON FOUND:",
                    orderId
                );


                if (!orderId) {

                    showToast(
                        "Error",
                        "Order ID not found.",
                        "error"
                    );

                    return;
                }


                viewOrder(orderId);

                return;
            }

        },
        false
    );
}


/* =========================================================
   MODAL EVENTS
========================================================= */

function initializeModalEvents() {

    const modal =
        document.querySelector(
            "#orderModal"
        );


    const closeButton =
        document.querySelector(
            "#closeOrderModal"
        );


    const saveButton =
        document.querySelector(
            "#saveStatusBtn"
        );


    const trackButton =
        document.querySelector(
            "#trackModalOrderBtn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeOrderModal
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeOrderModal();
                }
            }
        );
    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveCurrentOrderStatus
        );
    }


    if (trackButton) {

        trackButton.addEventListener(
            "click",
            trackSelectedOrder
        );
    }
}


/* =========================================================
   ESCAPE KEY
========================================================= */

function initializeEscapeKey() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {
                closeOrderModal();
            }

        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    const button =
        document.querySelector(
            "#adminLogoutBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

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
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const menuToggle =
        document.querySelector(
            "#menuToggle"
        );


    const sidebar =
        document.querySelector(
            "#adminSidebar"
        );


    if (!menuToggle || !sidebar) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "active"
            );

        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message,
    type = "success"
) {

    const toast =
        document.querySelector(
            "#adminToast"
        );


    if (!toast) {
        return;
    }


    const titleElement =
        document.querySelector(
            "#adminToastTitle"
        );


    const textElement =
        document.querySelector(
            "#adminToastText"
        );


    const icon =
        toast.querySelector(
            ".toast-icon i"
        );


    if (titleElement) {
        titleElement.textContent =
            title;
    }


    if (textElement) {
        textElement.textContent =
            message;
    }


    if (icon) {

        icon.className =
            type === "error"
                ? "fa-solid fa-xmark"
                : "fa-solid fa-check";
    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toast._hideTimer
    );


    toast._hideTimer =
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
   CLOSE TOAST
========================================================= */

function initializeToast() {

    const closeButton =
        document.querySelector(
            "#closeToast"
        );


    const toast =
        document.querySelector(
            "#adminToast"
        );


    if (
        closeButton &&
        toast
    ) {

        closeButton.addEventListener(
            "click",
            function () {

                toast.classList.remove(
                    "show"
                );

            }
        );
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "KHAN Store Admin Orders initialized."
        );


        loadOrders();


        initializeSearch();


        initializeStatusFilter();


        initializeRefreshButton();


        initializeTableActions();


        initializeModalEvents();


        initializeEscapeKey();


        initializeLogout();


        initializeMobileMenu();


        initializeToast();

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.loadOrders =
    loadOrders;

window.viewOrder =
    viewOrder;

window.updateOrderStatus =
    updateOrderStatus;

window.closeOrderModal =
    closeOrderModal;