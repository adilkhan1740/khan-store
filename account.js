document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // CHECK LOGIN
    // ==============================

    const isLoggedIn = localStorage.getItem("khanLoggedIn");

    if (isLoggedIn !== "true") {
        sessionStorage.setItem(
            "khanRedirectAfterLogin",
            "account.html"
        );

        window.location.href = "login.html";
        return;
    }


    // ==============================
    // GET USER DATA
    // ==============================

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("khanUser"));
    } catch (error) {
        console.error("User data error:", error);
    }


    if (!user) {
        localStorage.removeItem("khanLoggedIn");

        sessionStorage.setItem(
            "khanRedirectAfterLogin",
            "account.html"
        );

        window.location.href = "login.html";
        return;
    }


    // ==============================
    // ELEMENTS
    // ==============================

    const nameElements = document.querySelectorAll(
        "#accountName, #profileName, .account-name"
    );

    const emailElements = document.querySelectorAll(
        "#accountEmail, #profileEmail, .account-email"
    );

    const phoneElements = document.querySelectorAll(
        "#accountPhone, #profilePhone, .account-phone"
    );


    // ==============================
    // SHOW USER DATA
    // ==============================

    nameElements.forEach(element => {
        element.textContent = user.name || "User";
    });

    emailElements.forEach(element => {
        element.textContent = user.email || "No email";
    });

    phoneElements.forEach(element => {
        element.textContent = user.phone || "No phone";
    });


    // ==============================
    // AVATAR INITIAL
    // ==============================

    const avatarElements = document.querySelectorAll(
        "#profileAvatar, .profile-avatar"
    );

    const firstLetter = (user.name || "U")
        .trim()
        .charAt(0)
        .toUpperCase();

    avatarElements.forEach(avatar => {
        avatar.textContent = firstLetter;
    });


    // ==============================
    // LOGOUT
    // ==============================

    const logoutButtons = document.querySelectorAll(
        "#logoutBtn, .logout-btn"
    );

    logoutButtons.forEach(button => {

        button.addEventListener("click", () => {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmLogout) return;

            // Remove login session
            localStorage.removeItem("khanLoggedIn");
            localStorage.removeItem("khanUser");

            // Clear redirect information
            sessionStorage.removeItem(
                "khanRedirectAfterLogin"
            );

            // Go to login
            window.location.href = "login.html";
        });

    });


    // ==============================
    // ACCOUNT NAVIGATION
    // ==============================

    const ordersBtn = document.querySelector(
        "#myOrdersBtn"
    );

    if (ordersBtn) {
        ordersBtn.addEventListener("click", () => {
            window.location.href = "my-orders.html";
        });
    }


    const wishlistBtn = document.querySelector(
        "#wishlistBtn"
    );

    if (wishlistBtn) {
        wishlistBtn.addEventListener("click", () => {
            window.location.href = "wishlist.html";
        });
    }


    const cartBtn = document.querySelector(
        "#cartBtn"
    );

    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    }


    // ==============================
    // EDIT PROFILE
    // ==============================

    const editBtn = document.querySelector(
        "#editProfileBtn"
    );

    const editForm = document.querySelector(
        "#editProfileForm"
    );

    if (editBtn && editForm) {

        editBtn.addEventListener("click", () => {
            editForm.classList.toggle("active");
        });

    }


    // ==============================
    // ACCOUNT LOADED
    // ==============================

    console.log(
        "KHAN Store Account Loaded:",
        user
    );

});