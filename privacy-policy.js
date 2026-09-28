/* =========================================================
   KHAN STORE — PRIVACY POLICY
   privacy-policy.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const currentYear = document.getElementById("currentYear");
  const cartCount = document.getElementById("cartCount");
  const mobileCartCount = document.getElementById("mobileCartCount");

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  const toast = document.getElementById("privacyToast");
  const toastMessage = document.getElementById("toastMessage");

  const sidebarLinks = document.querySelectorAll(
    ".privacy-sidebar-nav a"
  );

  const sections = document.querySelectorAll(
    ".privacy-section"
  );


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  function updateCurrentYear() {
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }
  }

  updateCurrentYear();


  /* =======================================================
     CART COUNT
     ======================================================= */

  function getCartItems() {
    try {
      const cart = JSON.parse(
        localStorage.getItem("khanCart") || "[]"
      );

      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      console.warn("KHAN Store: Unable to read cart.", error);
      return [];
    }
  }


  function updateCartCount() {
    const cart = getCartItems();

    const totalItems = cart.reduce((total, item) => {
      const quantity = Number(item.quantity);

      return total + (
        Number.isFinite(quantity) && quantity > 0
          ? quantity
          : 0
      );
    }, 0);

    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0
        ? "inline-flex"
        : "none";
    }

    if (mobileCartCount) {
      mobileCartCount.textContent = totalItems;
      mobileCartCount.style.display = totalItems > 0
        ? "inline-flex"
        : "none";
    }
  }

  updateCartCount();


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  function openMobileMenu() {
    if (!mobileNav || !mobileMenuBtn) return;

    mobileNav.classList.add("active");

    mobileMenuBtn.setAttribute(
      "aria-expanded",
      "true"
    );

    const icon = mobileMenuBtn.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    }
  }


  function closeMobileMenu() {
    if (!mobileNav || !mobileMenuBtn) return;

    mobileNav.classList.remove("active");

    mobileMenuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    const icon = mobileMenuBtn.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }


  function toggleMobileMenu() {
    if (!mobileNav) return;

    if (mobileNav.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }


  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    mobileMenuBtn.addEventListener(
      "click",
      toggleMobileMenu
    );
  }


  /* =======================================================
     CLOSE MOBILE MENU AFTER LINK CLICK
     ======================================================= */

  if (mobileNav) {
    const mobileLinks = mobileNav.querySelectorAll("a");

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }


  /* =======================================================
     ESC KEY
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });


  /* =======================================================
     CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
     ======================================================= */

  document.addEventListener("click", (event) => {
    if (!mobileNav || !mobileMenuBtn) return;

    const clickedInsideMenu =
      mobileNav.contains(event.target);

    const clickedButton =
      mobileMenuBtn.contains(event.target);

    if (
      mobileNav.classList.contains("active") &&
      !clickedInsideMenu &&
      !clickedButton
    ) {
      closeMobileMenu();
    }
  });


  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }


  /* =======================================================
     SIDEBAR ACTIVE SECTION
     ======================================================= */

  function setActiveSidebarLink(id) {
    sidebarLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (href === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }


  /* =======================================================
     SMOOTH SIDEBAR NAVIGATION
     ======================================================= */

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = 90;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      setActiveSidebarLink(target.id);

      history.replaceState(
        null,
        "",
        href
      );
    });
  });


  /* =======================================================
     ACTIVE SECTION WHILE SCROLLING
     ======================================================= */

  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          const activeSection =
            visibleSections[0].target;

          setActiveSidebarLink(
            activeSection.id
          );
        }
      },
      {
        root: null,
        rootMargin: "-110px 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =======================================================
     INITIAL ACTIVE SECTION
     ======================================================= */

  function setInitialSection() {
    const hash = window.location.hash;

    if (hash) {
      const targetId = hash.substring(1);

      const target =
        document.getElementById(targetId);

      if (target) {
        setActiveSidebarLink(targetId);
        return;
      }
    }

    if (sections.length > 0) {
      setActiveSidebarLink(
        sections[0].id
      );
    }
  }

  setInitialSection();


  /* =======================================================
     HANDLE HASH CHANGES
     ======================================================= */

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;

    if (!hash) return;

    const targetId = hash.substring(1);

    const target =
      document.getElementById(targetId);

    if (!target) return;

    setActiveSidebarLink(targetId);

    const headerHeight = 90;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });


  /* =======================================================
     UPDATE CART WHEN STORAGE CHANGES
     ======================================================= */

  window.addEventListener(
    "storage",
    (event) => {
      if (event.key === "khanCart") {
        updateCartCount();
      }
    }
  );


  /* =======================================================
     SAME-TAB CART UPDATE SUPPORT
     ======================================================= */

  window.addEventListener(
    "khanCartUpdated",
    () => {
      updateCartCount();
    }
  );


  /* =======================================================
     WINDOW RESIZE
     ======================================================= */

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > 900 &&
        mobileNav &&
        mobileNav.classList.contains("active")
      ) {
        closeMobileMenu();
      }
    }
  );


  /* =======================================================
     INTERNAL LINKS
     ======================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href");

        if (
          href &&
          href !== "#" &&
          document.querySelector(href)
        ) {
          closeMobileMenu();
        }
      });
    });


  /* =======================================================
     CART LINK FEEDBACK
     ======================================================= */

  document
    .querySelectorAll(
      'a[href="cart.html"]'
    )
    .forEach((cartLink) => {
      cartLink.addEventListener("click", () => {
        updateCartCount();
      });
    });


  /* =======================================================
     LOG PAGE READY
     ======================================================= */

  console.log(
    "KHAN Store Privacy Policy loaded successfully."
  );
});