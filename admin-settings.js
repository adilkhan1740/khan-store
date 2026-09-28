/* =========================================================
   KHAN STORE ADMIN SETTINGS
   MongoDB Connected
========================================================= */

const API_URL = "http://https://khan-store.onrender.com";


// =========================================================
// DEFAULT SETTINGS
// =========================================================

const DEFAULT_SETTINGS = {
    store: {
        name: "KHAN Store",
        email: "support@khanstore.com",
        phone: "+91 98765 43210",
        currency: "INR",
        address: ""
    },

    delivery: {
        freeDeliveryAmount: 999,
        deliveryCharge: 49,
        estimatedDelivery: "2-4",
        returnDays: 7
    },

    tax: {
        taxRate: 18,
        taxMode: "included"
    },

    notifications: {
        newOrder: true,
        newCustomer: true,
        lowStock: true,
        marketing: false
    }
};


// =========================================================
// DOM READY
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    protectAdminPage();

    setupEvents();

    loadSettings();

    loadAdminInfo();

});


// =========================================================
// ADMIN PROTECTION
// =========================================================

function protectAdminPage() {

    const isAdminLoggedIn =
        localStorage.getItem("khanAdminLoggedIn");

    if (
        isAdminLoggedIn !== "true" &&
        isAdminLoggedIn !== "1"
    ) {

        // Demo admin protection
        const adminEmail =
            localStorage.getItem("khanAdminEmail");

        if (!adminEmail) {

            // Uncomment if you want strict login protection
            // window.location.href = "admin-login.html";

        }

    }

}


// =========================================================
// ADMIN INFO
// =========================================================

function loadAdminInfo() {

    const adminName =
        localStorage.getItem("khanAdminName") ||
        "Administrator";

    const adminNameElement =
        document.getElementById("adminName");

    if (adminNameElement) {
        adminNameElement.textContent = adminName;
    }

}


// =========================================================
// SETUP EVENTS
// =========================================================

function setupEvents() {

    const saveBtn =
        document.getElementById("saveSettingsBtn");

    const resetBtn =
        document.getElementById("resetSettingsBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const changePasswordBtn =
        document.getElementById("changePasswordBtn");

    const closePasswordModal =
        document.getElementById("closePasswordModal");

    const cancelPasswordBtn =
        document.getElementById("cancelPasswordBtn");

    const passwordForm =
        document.getElementById("passwordForm");


    if (saveBtn) {
        saveBtn.addEventListener("click", saveSettings);
    }


    if (resetBtn) {
        resetBtn.addEventListener(
            "click",
            resetSettings
        );
    }


    if (logoutBtn) {
        logoutBtn.addEventListener(
            "click",
            logoutAdmin
        );
    }


    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener(
            "click",
            toggleMobileMenu
        );
    }


    if (changePasswordBtn) {
        changePasswordBtn.addEventListener(
            "click",
            openPasswordModal
        );
    }


    if (closePasswordModal) {
        closePasswordModal.addEventListener(
            "click",
            closePasswordModalHandler
        );
    }


    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener(
            "click",
            closePasswordModalHandler
        );
    }


    if (passwordForm) {
        passwordForm.addEventListener(
            "submit",
            handlePasswordChange
        );
    }


    const passwordModal =
        document.getElementById("passwordModal");

    if (passwordModal) {

        passwordModal.addEventListener(
            "click",
            (event) => {

                if (event.target === passwordModal) {
                    closePasswordModalHandler();
                }

            }
        );

    }

}


// =========================================================
// LOAD SETTINGS FROM MONGODB
// =========================================================

async function loadSettings() {

    try {

        showToast(
            "Loading",
            "Loading store settings...",
            "info"
        );

        const response =
            await fetch(`${API_URL}/api/settings`);

        if (!response.ok) {
            throw new Error("Failed to load settings");
        }

        const data =
            await response.json();

        const settings =
            normalizeSettings(data);

        fillSettingsForm(settings);

        localStorage.setItem(
            "khanStoreSettings",
            JSON.stringify(settings)
        );

        hideToast();


    } catch (error) {

        console.error(
            "Settings Load Error:",
            error
        );

        // LocalStorage fallback

        const localSettings =
            localStorage.getItem(
                "khanStoreSettings"
            );

        if (localSettings) {

            try {

                const settings =
                    JSON.parse(localSettings);

                fillSettingsForm(
                    normalizeSettings(settings)
                );

                showToast(
                    "Offline Mode",
                    "Loaded saved browser settings.",
                    "info"
                );

            } catch (parseError) {

                console.error(
                    "Local Settings Error:",
                    parseError
                );

                fillSettingsForm(
                    DEFAULT_SETTINGS
                );

            }

        } else {

            fillSettingsForm(
                DEFAULT_SETTINGS
            );

        }

    }

}


// =========================================================
// NORMALIZE SETTINGS
// =========================================================

function normalizeSettings(data = {}) {

    return {

        store: {
            ...DEFAULT_SETTINGS.store,
            ...(data.store || {})
        },

        delivery: {
            ...DEFAULT_SETTINGS.delivery,
            ...(data.delivery || {})
        },

        tax: {
            ...DEFAULT_SETTINGS.tax,
            ...(data.tax || {})
        },

        notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...(data.notifications || {})
        }

    };

}


// =========================================================
// FILL FORM
// =========================================================

function fillSettingsForm(settings) {

    // Store

    setValue(
        "storeName",
        settings.store.name
    );

    setValue(
        "storeEmail",
        settings.store.email
    );

    setValue(
        "storePhone",
        settings.store.phone
    );

    setValue(
        "storeCurrency",
        settings.store.currency
    );

    setValue(
        "storeAddress",
        settings.store.address
    );


    // Delivery

    setValue(
        "freeDeliveryAmount",
        settings.delivery.freeDeliveryAmount
    );

    setValue(
        "deliveryCharge",
        settings.delivery.deliveryCharge
    );

    setValue(
        "estimatedDelivery",
        settings.delivery.estimatedDelivery
    );

    setValue(
        "returnDays",
        settings.delivery.returnDays
    );


    // Tax

    setValue(
        "taxRate",
        settings.tax.taxRate
    );

    setValue(
        "taxMode",
        settings.tax.taxMode
    );


    // Notifications

    setChecked(
        "newOrderNotification",
        settings.notifications.newOrder
    );

    setChecked(
        "newCustomerNotification",
        settings.notifications.newCustomer
    );

    setChecked(
        "lowStockNotification",
        settings.notifications.lowStock
    );

    setChecked(
        "marketingNotification",
        settings.notifications.marketing
    );

}


// =========================================================
// GET FORM SETTINGS
// =========================================================

function getFormSettings() {

    return {

        store: {

            name:
                getValue("storeName").trim(),

            email:
                getValue("storeEmail").trim(),

            phone:
                getValue("storePhone").trim(),

            currency:
                getValue("storeCurrency"),

            address:
                getValue("storeAddress").trim()

        },


        delivery: {

            freeDeliveryAmount:
                Number(
                    getValue(
                        "freeDeliveryAmount"
                    ) || 0
                ),

            deliveryCharge:
                Number(
                    getValue(
                        "deliveryCharge"
                    ) || 0
                ),

            estimatedDelivery:
                getValue(
                    "estimatedDelivery"
                ),

            returnDays:
                Number(
                    getValue("returnDays") || 7
                )

        },


        tax: {

            taxRate:
                Number(
                    getValue("taxRate") || 0
                ),

            taxMode:
                getValue("taxMode")

        },


        notifications: {

            newOrder:
                getChecked(
                    "newOrderNotification"
                ),

            newCustomer:
                getChecked(
                    "newCustomerNotification"
                ),

            lowStock:
                getChecked(
                    "lowStockNotification"
                ),

            marketing:
                getChecked(
                    "marketingNotification"
                )

        }

    };

}


// =========================================================
// SAVE SETTINGS
// =========================================================

async function saveSettings() {

    const settings =
        getFormSettings();


    // Basic validation

    if (!settings.store.name) {

        showToast(
            "Error",
            "Please enter store name.",
            "error"
        );

        return;
    }


    if (
        settings.store.email &&
        !isValidEmail(settings.store.email)
    ) {

        showToast(
            "Error",
            "Please enter a valid store email.",
            "error"
        );

        return;
    }


    if (
        settings.tax.taxRate < 0 ||
        settings.tax.taxRate > 100
    ) {

        showToast(
            "Error",
            "Tax rate must be between 0 and 100.",
            "error"
        );

        return;
    }


    const saveBtn =
        document.getElementById(
            "saveSettingsBtn"
        );

    const originalHTML =
        saveBtn
            ? saveBtn.innerHTML
            : "";


    if (saveBtn) {

        saveBtn.disabled = true;

        saveBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/settings`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(settings)
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to save settings"
            );

        }


        const savedSettings =
            normalizeSettings(
                data.settings ||
                settings
            );


        localStorage.setItem(
            "khanStoreSettings",
            JSON.stringify(
                savedSettings
            )
        );


        fillSettingsForm(
            savedSettings
        );


        showToast(
            "Success",
            "Settings saved successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Settings Save Error:",
            error
        );


        // Save local backup

        localStorage.setItem(
            "khanStoreSettings",
            JSON.stringify(settings)
        );


        showToast(
            "Offline Saved",
            "MongoDB unavailable. Settings saved in browser.",
            "info"
        );


    } finally {

        if (saveBtn) {

            saveBtn.disabled = false;

            saveBtn.innerHTML =
                originalHTML;

        }

    }

}


// =========================================================
// RESET SETTINGS
// =========================================================

async function resetSettings() {

    const confirmed =
        confirm(
            "Are you sure you want to reset all store settings to default?"
        );


    if (!confirmed) {
        return;
    }


    fillSettingsForm(
        DEFAULT_SETTINGS
    );


    localStorage.setItem(
        "khanStoreSettings",
        JSON.stringify(
            DEFAULT_SETTINGS
        )
    );


    try {

        await fetch(
            `${API_URL}/api/settings`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        DEFAULT_SETTINGS
                    )
            }
        );


        showToast(
            "Reset Complete",
            "Settings restored to default.",
            "success"
        );


    } catch (error) {

        console.error(
            "Reset Error:",
            error
        );


        showToast(
            "Reset Complete",
            "Default settings restored locally.",
            "info"
        );

    }

}


// =========================================================
// PASSWORD MODAL
// =========================================================

function openPasswordModal() {

    const modal =
        document.getElementById(
            "passwordModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.add("active");


    const current =
        document.getElementById(
            "currentPassword"
        );

    if (current) {
        current.focus();
    }

}


function closePasswordModalHandler() {

    const modal =
        document.getElementById(
            "passwordModal"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }


    const form =
        document.getElementById(
            "passwordForm"
        );

    if (form) {
        form.reset();
    }

}


// =========================================================
// PASSWORD CHANGE
// =========================================================

async function handlePasswordChange(event) {

    event.preventDefault();


    const currentPassword =
        getValue("currentPassword");

    const newPassword =
        getValue("newPassword");

    const confirmPassword =
        getValue("confirmPassword");


    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        showToast(
            "Error",
            "Please fill all password fields.",
            "error"
        );

        return;
    }


    if (newPassword.length < 6) {

        showToast(
            "Error",
            "New password must contain at least 6 characters.",
            "error"
        );

        return;
    }


    if (
        newPassword !==
        confirmPassword
    ) {

        showToast(
            "Error",
            "New passwords do not match.",
            "error"
        );

        return;
    }


    /*
       Admin password API is intentionally
       not changed here until proper admin
       authentication is implemented.
    */

    showToast(
        "Info",
        "Password API will be connected with secure admin authentication.",
        "info"
    );


    closePasswordModalHandler();

}


// =========================================================
// MOBILE MENU
// =========================================================

function toggleMobileMenu() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (!sidebar) {
        return;
    }


    sidebar.classList.toggle(
        "open"
    );

}


// =========================================================
// LOGOUT
// =========================================================

function logoutAdmin() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "khanAdminLoggedIn"
    );

    localStorage.removeItem(
        "khanAdminEmail"
    );

    localStorage.removeItem(
        "khanAdminName"
    );


    window.location.href =
        "admin-login.html";

}


// =========================================================
// FORM HELPERS
// =========================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value =
            value ?? "";
    }

}


function getChecked(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.checked
        : false;

}


function setChecked(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.checked =
            Boolean(value);
    }

}


// =========================================================
// EMAIL VALIDATION
// =========================================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


// =========================================================
// TOAST
// =========================================================

let toastTimer = null;


function showToast(
    title,
    message,
    type = "success"
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

    if (
        !toast ||
        !toastTitle ||
        !toastMessage
    ) {
        return;
    }


    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    const icon =
        toast.querySelector(
            ".toast-icon i"
        );


    if (icon) {

        if (type === "error") {

            icon.className =
                "fa-solid fa-circle-exclamation";

        } else if (type === "info") {

            icon.className =
                "fa-solid fa-circle-info";

        } else {

            icon.className =
                "fa-solid fa-check";

        }

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3500);

}


function hideToast() {

    const toast =
        document.getElementById(
            "toast"
        );

    if (toast) {

        toast.classList.remove(
            "show"
        );

    }

}