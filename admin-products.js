/* =========================================================
   KHAN STORE - ADMIN PRODUCTS JS
   MONGODB CONNECTED VERSION
========================================================= */

const API_URL = "http://https://khan-store.onrender.com";

const PRODUCT_KEY = "khanProducts";
const ADMIN_LOGIN_KEY = "khanAdminLoggedIn";
const ADMIN_KEY = "khanAdmin";

let products = [];
let filteredProducts = [];
let editingProductId = null;
let deletingProductId = null;


/* =========================================================
   DOM
========================================================= */

const sidebar = document.querySelector(".admin-sidebar");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
const menuToggle = document.querySelector(".menu-toggle");

const adminName = document.querySelector("#adminName");
const adminEmail = document.querySelector("#adminEmail");

const totalProducts = document.querySelector("#totalProducts");
const inStockProducts = document.querySelector("#inStockProducts");
const lowStockProducts = document.querySelector("#lowStockProducts");
const outStockProducts = document.querySelector("#outStockProducts");

const addProductBtn = document.querySelector("#addProductBtn");

const productSearch = document.querySelector("#productSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const stockFilter = document.querySelector("#stockFilter");

const resultCount = document.querySelector("#resultCount");
const refreshProductsBtn =
    document.querySelector("#refreshProductsBtn");

const productsTableBody =
    document.querySelector("#productsTableBody");

const emptyProducts =
    document.querySelector("#emptyProducts");

const productModal =
    document.querySelector("#productModal");

const modalTitle =
    document.querySelector("#modalTitle");

const closeProductModal =
    document.querySelector("#closeProductModal");

const cancelProductBtn =
    document.querySelector("#cancelProductBtn");

const productForm =
    document.querySelector("#productForm");

const productId =
    document.querySelector("#productId");

const productName =
    document.querySelector("#productName");

const productCategory =
    document.querySelector("#productCategory");

const productPrice =
    document.querySelector("#productPrice");

const productOldPrice =
    document.querySelector("#productOldPrice");

const productDiscount =
    document.querySelector("#productDiscount");

const productStock =
    document.querySelector("#productStock");

const productRating =
    document.querySelector("#productRating");

const productReviews =
    document.querySelector("#productReviews");

const productImage =
    document.querySelector("#productImage");

const productDescription =
    document.querySelector("#productDescription");

const deleteModal =
    document.querySelector("#deleteModal");

const cancelDeleteBtn =
    document.querySelector("#cancelDeleteBtn");

const confirmDeleteBtn =
    document.querySelector("#confirmDeleteBtn");

const logoutBtn =
    document.querySelector("#logoutBtn");

const adminToast =
    document.querySelector("#adminToast");

const adminToastTitle =
    document.querySelector("#adminToastTitle");

const adminToastText =
    document.querySelector("#adminToastText");

const closeToast =
    document.querySelector("#closeToast");


/* =========================================================
   PAGE PROTECTION
========================================================= */

function checkAdminLogin() {

    const loggedIn =
        localStorage.getItem(ADMIN_LOGIN_KEY);

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
                localStorage.getItem(ADMIN_KEY)
            );

        if (!admin) return;

        if (adminName) {

            adminName.textContent =
                admin.name ||
                "KHAN Store Admin";
        }

        if (adminEmail) {

            adminEmail.textContent =
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
   DEFAULT PRODUCTS
========================================================= */

function getDefaultProducts() {

    return [

        {
            productId: "1",
            name: "iPhone 15 Pro",
            category: "Smartphone",
            price: 109999,
            oldPrice: 134999,
            discount: 19,
            stock: 25,
            rating: 4.8,
            reviews: 324,
            image:
                "https://images.unsplash.com/photo-1592286927505-2fd2d1c4f6c4?auto=format&fit=crop&w=800&q=85",
            description:
                "Premium smartphone with powerful performance and advanced camera system.",
            status: "Active"
        },

        {
            productId: "2",
            name: "Samsung Galaxy S24",
            category: "Smartphone",
            price: 69999,
            oldPrice: 84999,
            discount: 18,
            stock: 32,
            rating: 4.8,
            reviews: 267,
            image:
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=85",
            description:
                "Flagship Android smartphone with premium display and performance.",
            status: "Active"
        },

        {
            productId: "3",
            name: "MacBook Air M2",
            category: "Laptop",
            price: 89999,
            oldPrice: 99999,
            discount: 10,
            stock: 14,
            rating: 4.9,
            reviews: 187,
            image:
                "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=85",
            description:
                "Lightweight laptop powered by Apple Silicon.",
            status: "Active"
        },

        {
            productId: "4",
            name: "Premium Wireless Headphones",
            category: "Headphones",
            price: 4999,
            oldPrice: 6999,
            discount: 29,
            stock: 8,
            rating: 4.7,
            reviews: 156,
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
            description:
                "Wireless headphones with immersive sound and comfortable design.",
            status: "Active"
        },

        {
            productId: "5",
            name: "Smart Watch Pro",
            category: "Smartwatch",
            price: 7499,
            oldPrice: 9999,
            discount: 25,
            stock: 5,
            rating: 4.6,
            reviews: 98,
            image:
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=85",
            description:
                "Smartwatch with fitness tracking and everyday smart features.",
            status: "Active"
        },

        {
            productId: "6",
            name: "Premium Wireless Earbuds",
            category: "Accessories",
            price: 4999,
            oldPrice: 6999,
            discount: 29,
            stock: 0,
            rating: 4.6,
            reviews: 142,
            image:
                "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=85",
            description:
                "Compact wireless earbuds with high-quality audio.",
            status: "Active"
        }

    ];
}


/* =========================================================
   LOCAL STORAGE BACKUP
========================================================= */

function saveLocalBackup() {

    try {

        localStorage.setItem(
            PRODUCT_KEY,
            JSON.stringify(products)
        );

    } catch (error) {

        console.error(
            "Local product backup error:",
            error
        );

    }
}


/* =========================================================
   LOAD LOCAL BACKUP
========================================================= */

function loadLocalBackup() {

    try {

        const saved =
            localStorage.getItem(PRODUCT_KEY);

        if (!saved) {

            return [];
        }

        const parsed =
            JSON.parse(saved);

        if (!Array.isArray(parsed)) {

            return [];
        }

        return parsed.map(normalizeProduct);

    } catch (error) {

        console.error(
            "Local product loading error:",
            error
        );

        return [];
    }
}


/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(product) {

    return {

        productId:
            String(
                product.productId ??
                product.id ??
                ""
            ),

        id:
            String(
                product.productId ??
                product.id ??
                ""
            ),

        name:
            product.name || "",

        category:
            product.category || "",

        price:
            Number(product.price) || 0,

        oldPrice:
            Number(product.oldPrice) || 0,

        discount:
            Number(product.discount) || 0,

        stock:
            Number(product.stock) || 0,

        rating:
            Number(product.rating) || 0,

        reviews:
            Number(product.reviews) || 0,

        image:
            product.image || "",

        description:
            product.description || "",

        status:
            product.status || "Active",

        createdAt:
            product.createdAt || "",

        updatedAt:
            product.updatedAt || ""

    };
}


/* =========================================================
   LOAD PRODUCTS FROM MONGODB
========================================================= */

async function loadProducts() {

    try {

        showLoadingState();

        const response =
            await fetch(
                `${API_URL}/api/products`
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
            !Array.isArray(data.products)
        ) {

            throw new Error(
                "Invalid product response"
            );
        }


        products =
            data.products.map(
                normalizeProduct
            );


        /*
         * Agar MongoDB bilkul empty hai
         * aur localStorage me purane products hain,
         * to unko MongoDB me transfer karenge.
         */

        if (products.length === 0) {

            const localProducts =
                loadLocalBackup();


            if (localProducts.length > 0) {

                await seedLocalProducts(
                    localProducts
                );

                return;
            }


            /*
             * Agar localStorage bhi empty hai,
             * default products MongoDB me jayenge.
             */

            const defaults =
                getDefaultProducts();


            await seedLocalProducts(
                defaults
            );

            return;
        }


        saveLocalBackup();

        updateStats();

        applyFilters();


    } catch (error) {

        console.error(
            "MongoDB product loading error:",
            error
        );


        /*
         * MongoDB fail ho to local backup
         * automatically use hoga.
         */

        const localProducts =
            loadLocalBackup();


        if (localProducts.length > 0) {

            products =
                localProducts;

        } else {

            products =
                getDefaultProducts();

            saveLocalBackup();
        }


        updateStats();

        applyFilters();


        showToast(
            "Offline Mode",
            "MongoDB unavailable. Local product backup is being used."
        );
    }
}


/* =========================================================
   SEED LOCAL PRODUCTS TO MONGODB
========================================================= */

async function seedLocalProducts(
    localProducts
) {

    try {

        let imported = 0;


        for (
            const product of localProducts
        ) {

            const normalized =
                normalizeProduct(
                    product
                );


            if (
                !normalized.productId ||
                !normalized.name
            ) {

                continue;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/products`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    productId:
                                        normalized.productId,

                                    name:
                                        normalized.name,

                                    category:
                                        normalized.category,

                                    price:
                                        normalized.price,

                                    oldPrice:
                                        normalized.oldPrice,

                                    discount:
                                        normalized.discount,

                                    rating:
                                        normalized.rating,

                                    reviews:
                                        normalized.reviews,

                                    stock:
                                        normalized.stock,

                                    image:
                                        normalized.image,

                                    description:
                                        normalized.description,

                                    status:
                                        normalized.status

                                })
                        }
                    );


                if (response.ok) {

                    imported++;
                }

            } catch (error) {

                console.error(
                    "Product import error:",
                    error
                );

            }
        }


        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        const data =
            await response.json();


        if (
            data.success &&
            Array.isArray(data.products)
        ) {

            products =
                data.products.map(
                    normalizeProduct
                );

            saveLocalBackup();

            updateStats();

            applyFilters();


            showToast(
                "Products Connected",
                `${imported} product(s) are now saved in MongoDB.`
            );
        }


    } catch (error) {

        console.error(
            "Product seed error:",
            error
        );

        products =
            localProducts.map(
                normalizeProduct
            );

        saveLocalBackup();

        updateStats();

        applyFilters();
    }
}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(value) {

    return "₹" +
        (Number(value) || 0)
            .toLocaleString("en-IN");
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   STOCK STATUS
========================================================= */

function getStockStatus(stock) {

    const quantity =
        Number(stock) || 0;

    if (quantity <= 0) {

        return {
            text: "Out of Stock",
            className: "out-stock"
        };
    }

    if (quantity <= 10) {

        return {
            text: "Low Stock",
            className: "low-stock"
        };
    }

    return {
        text: "In Stock",
        className: "in-stock"
    };
}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    const total =
        products.length;

    const inStock =
        products.filter(
            product =>
                Number(product.stock) > 10
        ).length;

    const lowStock =
        products.filter(
            product =>
                Number(product.stock) > 0 &&
                Number(product.stock) <= 10
        ).length;

    const outStock =
        products.filter(
            product =>
                Number(product.stock) <= 0
        ).length;


    if (totalProducts) {

        totalProducts.textContent =
            total;
    }

    if (inStockProducts) {

        inStockProducts.textContent =
            inStock;
    }

    if (lowStockProducts) {

        lowStockProducts.textContent =
            lowStock;
    }

    if (outStockProducts) {

        outStockProducts.textContent =
            outStock;
    }
}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function applyFilters() {

    const search =
        productSearch?.value
            ?.trim()
            .toLowerCase() || "";

    const category =
        categoryFilter?.value ||
        "all";

    const stock =
        stockFilter?.value ||
        "all";


    filteredProducts =
        products.filter(
            product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();

                const productCategory =
                    String(
                        product.category || ""
                    ).toLowerCase();

                const id =
                    String(
                        product.productId ||
                        product.id ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    productCategory.includes(search) ||
                    id.includes(search);


                const matchesCategory =
                    category === "all" ||
                    product.category === category;


                const quantity =
                    Number(product.stock) || 0;


                let matchesStock = true;


                if (
                    stock === "in-stock"
                ) {

                    matchesStock =
                        quantity > 10;
                }


                if (
                    stock === "low-stock"
                ) {

                    matchesStock =
                        quantity > 0 &&
                        quantity <= 10;
                }


                if (
                    stock === "out-stock"
                ) {

                    matchesStock =
                        quantity <= 0;
                }


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStock
                );
            }
        );


    renderProducts();
}


/* =========================================================
   LOADING STATE
========================================================= */

function showLoadingState() {

    if (!productsTableBody) return;

    productsTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                style="
                    text-align:center;
                    padding:40px;
                "
            >

                <i
                    class="fa-solid fa-spinner fa-spin"
                    style="margin-right:8px;"
                ></i>

                Loading products...

            </td>

        </tr>

    `;
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    if (!productsTableBody) return;


    productsTableBody.innerHTML = "";


    if (resultCount) {

        resultCount.textContent =
            `${filteredProducts.length} product${
                filteredProducts.length !== 1
                    ? "s"
                    : ""
            }`;
    }


    if (
        filteredProducts.length === 0
    ) {

        if (emptyProducts) {

            emptyProducts.style.display =
                "block";
        }

        return;
    }


    if (emptyProducts) {

        emptyProducts.style.display =
            "none";
    }


    filteredProducts.forEach(
        product => {

            const stock =
                Number(product.stock) || 0;


            const stockStatus =
                getStockStatus(stock);


            const image =
                product.image ||
                "https://via.placeholder.com/100?text=Product";


            const currentId =
                product.productId ||
                product.id;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="product-cell">

                        <div class="product-image">

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(product.name)}"
                                loading="lazy"
                                onerror="
                                    this.src='https://via.placeholder.com/100?text=Product'
                                "
                            >

                        </div>


                        <div class="product-info">

                            <div class="product-name">

                                ${escapeHTML(
                                    product.name
                                )}

                            </div>


                            <div class="product-id">

                                ID:
                                ${escapeHTML(
                                    currentId
                                )}

                            </div>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="category-badge">

                        ${escapeHTML(
                            product.category ||
                            "Other"
                        )}

                    </span>

                </td>


                <td>

                    <span class="price-current">

                        ${formatPrice(
                            product.price
                        )}

                    </span>


                    ${
                        Number(product.oldPrice) > 0
                            ? `
                                <span class="price-old">

                                    ${formatPrice(
                                        product.oldPrice
                                    )}

                                </span>
                            `
                            : ""
                    }

                </td>


                <td>

                    <span
                        class="
                            stock-number
                            stock-${stockStatus.className}
                        "
                    >

                        ${stock}

                    </span>

                </td>


                <td>

                    <span class="rating">

                        <i class="fa-solid fa-star"></i>

                        ${Number(
                            product.rating || 0
                        ).toFixed(1)}

                    </span>

                </td>


                <td>

                    <span
                        class="
                            product-status
                            status-${stockStatus.className}
                        "
                    >

                        ${stockStatus.text}

                    </span>

                </td>


                <td>

                    <div class="product-actions">

                        <button
                            type="button"
                            class="table-action edit"
                            data-id="${escapeHTML(
                                currentId
                            )}"
                            title="Edit Product"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="table-action delete"
                            data-id="${escapeHTML(
                                currentId
                            )}"
                            title="Delete Product"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            productsTableBody.appendChild(row);
        }
    );


    attachProductActions();
}


/* =========================================================
   PRODUCT ACTIONS
========================================================= */

function attachProductActions() {

    document
        .querySelectorAll(
            ".table-action.edit"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openEditProduct(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".table-action.delete"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openDeleteModal(
                            button.dataset.id
                        );

                    }
                );

            }
        );
}


/* =========================================================
   OPEN ADD PRODUCT
========================================================= */

function openAddProduct() {

    editingProductId = null;


    if (modalTitle) {

        modalTitle.textContent =
            "Add Product";
    }


    if (productForm) {

        productForm.reset();
    }


    if (productId) {

        productId.value = "";
    }


    if (productDiscount) {

        productDiscount.value = "0";
    }


    if (productRating) {

        productRating.value = "0";
    }


    if (productReviews) {

        productReviews.value = "0";
    }


    if (productModal) {

        productModal.classList.add(
            "active"
        );
    }


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            productName?.focus();

        },
        100
    );
}


/* =========================================================
   OPEN EDIT PRODUCT
========================================================= */

function openEditProduct(id) {

    const product =
        products.find(
            item =>
                String(
                    item.productId ||
                    item.id
                ) ===
                String(id)
        );


    if (!product) {

        showToast(
            "Error",
            "Product not found."
        );

        return;
    }


    editingProductId =
        product.productId ||
        product.id;


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Product";
    }


    if (productId) {

        productId.value =
            editingProductId;
    }


    if (productName) {

        productName.value =
            product.name || "";
    }


    if (productCategory) {

        productCategory.value =
            product.category || "";
    }


    if (productPrice) {

        productPrice.value =
            product.price || 0;
    }


    if (productOldPrice) {

        productOldPrice.value =
            product.oldPrice || 0;
    }


    if (productDiscount) {

        productDiscount.value =
            product.discount || 0;
    }


    if (productStock) {

        productStock.value =
            product.stock || 0;
    }


    if (productRating) {

        productRating.value =
            product.rating || 0;
    }


    if (productReviews) {

        productReviews.value =
            product.reviews || 0;
    }


    if (productImage) {

        productImage.value =
            product.image || "";
    }


    if (productDescription) {

        productDescription.value =
            product.description || "";
    }


    if (productModal) {

        productModal.classList.add(
            "active"
        );
    }


    document.body.classList.add(
        "modal-open"
    );
}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModalWindow() {

    if (productModal) {

        productModal.classList.remove(
            "active"
        );
    }


    document.body.classList.remove(
        "modal-open"
    );


    editingProductId = null;
}


/* =========================================================
   GENERATE PRODUCT ID
========================================================= */

function generateProductId() {

    const numbers =
        products
            .map(
                product =>
                    Number(
                        product.productId ||
                        product.id
                    )
            )
            .filter(
                number =>
                    Number.isFinite(number)
            );


    const nextId =
        numbers.length
            ? Math.max(...numbers) + 1
            : 1;


    return String(nextId);
}


/* =========================================================
   SAVE PRODUCT
========================================================= */

async function saveProduct(event) {

    event.preventDefault();


    const name =
        productName?.value.trim();


    const category =
        productCategory?.value;


    const price =
        Number(
            productPrice?.value
        ) || 0;


    const oldPrice =
        Number(
            productOldPrice?.value
        ) || 0;


    const discount =
        Number(
            productDiscount?.value
        ) || 0;


    const stock =
        Number(
            productStock?.value
        ) || 0;


    const rating =
        Number(
            productRating?.value
        ) || 0;


    const reviews =
        Number(
            productReviews?.value
        ) || 0;


    const image =
        productImage?.value.trim() ||
        "";


    const description =
        productDescription?.value.trim() ||
        "";


    if (!name) {

        showToast(
            "Product Name Required",
            "Please enter a product name."
        );

        productName?.focus();

        return;
    }


    if (!category) {

        showToast(
            "Category Required",
            "Please select a category."
        );

        productCategory?.focus();

        return;
    }


    if (price <= 0) {

        showToast(
            "Invalid Price",
            "Product price must be greater than 0."
        );

        productPrice?.focus();

        return;
    }


    if (stock < 0) {

        showToast(
            "Invalid Stock",
            "Stock cannot be negative."
        );

        productStock?.focus();

        return;
    }


    let calculatedDiscount =
        discount;


    if (
        oldPrice > price &&
        oldPrice > 0
    ) {

        calculatedDiscount =
            Math.round(
                (
                    (oldPrice - price) /
                    oldPrice
                ) * 100
            );
    }


    const currentProductId =
        editingProductId ||
        generateProductId();


    const productData = {

        productId:
            String(
                currentProductId
            ),

        name,

        category,

        price,

        oldPrice,

        discount:
            calculatedDiscount,

        stock,

        rating:
            Math.min(
                5,
                Math.max(
                    0,
                    rating
                )
            ),

        reviews:
            Math.max(
                0,
                reviews
            ),

        image,

        description,

        status:
            "Active"

    };


    /*
     * EDIT PRODUCT
     */

    if (editingProductId) {

        try {

            const response =
                await fetch(

                    `${API_URL}/api/products/${encodeURIComponent(
                        editingProductId
                    )}`,

                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                productData
                            )

                    }

                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update product"
                );
            }


            const updatedProduct =
                normalizeProduct(
                    data.product
                );


            const index =
                products.findIndex(
                    product =>
                        String(
                            product.productId ||
                            product.id
                        ) ===
                        String(
                            editingProductId
                        )
                );


            if (index !== -1) {

                products[index] =
                    updatedProduct;
            }


            saveLocalBackup();

            updateStats();

            applyFilters();

            closeProductModalWindow();


            showToast(
                "Product Updated",
                "Product has been updated in MongoDB successfully."
            );


        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            showToast(
                "Update Failed",
                error.message ||
                "Unable to update product."
            );

        }


        return;
    }


    /*
     * ADD NEW PRODUCT
     */

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            productData
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to add product"
            );
        }


        const newProduct =
            normalizeProduct(
                data.product
            );


        products.unshift(
            newProduct
        );


        saveLocalBackup();

        updateStats();

        applyFilters();

        closeProductModalWindow();


        showToast(
            "Product Added",
            "New product has been saved in MongoDB successfully."
        );


    } catch (error) {

        console.error(
            "Add product error:",
            error
        );


        showToast(
            "Add Product Failed",
            error.message ||
            "Unable to add product."
        );

    }
}


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(id) {

    const product =
        products.find(
            item =>
                String(
                    item.productId ||
                    item.id
                ) ===
                String(id)
        );


    if (!product) {

        showToast(
            "Error",
            "Product not found."
        );

        return;
    }


    deletingProductId =
        product.productId ||
        product.id;


    if (deleteModal) {

        deleteModal.classList.add(
            "active"
        );
    }


    document.body.classList.add(
        "modal-open"
    );
}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    if (deleteModal) {

        deleteModal.classList.remove(
            "active"
        );
    }


    document.body.classList.remove(
        "modal-open"
    );


    deletingProductId = null;
}


/* =========================================================
   DELETE PRODUCT
========================================================= */

async function deleteProduct() {

    if (!deletingProductId) {

        closeDeleteModal();

        return;
    }


    const deletedProduct =
        products.find(
            product =>
                String(
                    product.productId ||
                    product.id
                ) ===
                String(
                    deletingProductId
                )
        );


    if (!deletedProduct) {

        closeDeleteModal();

        showToast(
            "Error",
            "Product not found."
        );

        return;
    }


    try {

        const response =
            await fetch(

                `${API_URL}/api/products/${encodeURIComponent(
                    deletingProductId
                )}`,

                {
                    method: "DELETE"
                }

            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete product"
            );
        }


        products =
            products.filter(
                product =>
                    String(
                        product.productId ||
                        product.id
                    ) !==
                    String(
                        deletingProductId
                    )
            );


        saveLocalBackup();

        updateStats();

        applyFilters();

        closeDeleteModal();


        showToast(
            "Product Deleted",
            `${deletedProduct.name} has been removed from MongoDB.`
        );


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showToast(
            "Delete Failed",
            error.message ||
            "Unable to delete product."
        );

    }
}


/* =========================================================
   REFRESH PRODUCTS
========================================================= */

async function refreshProducts() {

    await loadProducts();

    showToast(
        "Products Refreshed",
        "Products loaded from MongoDB successfully."
    );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(
    title,
    message
) {

    if (!adminToast) return;


    if (adminToastTitle) {

        adminToastTitle.textContent =
            title;
    }


    if (adminToastText) {

        adminToastText.textContent =
            message;
    }


    adminToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                adminToast.classList.remove(
                    "show"
                );

            },
            3500
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

function toggleSidebar() {

    sidebar?.classList.toggle(
        "active"
    );

    sidebarOverlay?.classList.toggle(
        "active"
    );
}


function closeSidebar() {

    sidebar?.classList.remove(
        "active"
    );

    sidebarOverlay?.classList.remove(
        "active"
    );
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

if (addProductBtn) {

    addProductBtn.addEventListener(
        "click",
        openAddProduct
    );
}


if (closeProductModal) {

    closeProductModal.addEventListener(
        "click",
        closeProductModalWindow
    );
}


if (cancelProductBtn) {

    cancelProductBtn.addEventListener(
        "click",
        closeProductModalWindow
    );
}


if (productForm) {

    productForm.addEventListener(
        "submit",
        saveProduct
    );
}


if (cancelDeleteBtn) {

    cancelDeleteBtn.addEventListener(
        "click",
        closeDeleteModal
    );
}


if (confirmDeleteBtn) {

    confirmDeleteBtn.addEventListener(
        "click",
        deleteProduct
    );
}


if (productSearch) {

    productSearch.addEventListener(
        "input",
        applyFilters
    );
}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );
}


if (stockFilter) {

    stockFilter.addEventListener(
        "change",
        applyFilters
    );
}


if (refreshProductsBtn) {

    refreshProductsBtn.addEventListener(
        "click",
        refreshProducts
    );
}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logoutAdmin
    );
}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleSidebar
    );
}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );
}


if (closeToast) {

    closeToast.addEventListener(
        "click",
        () => {

            adminToast?.classList.remove(
                "show"
            );

        }
    );
}


/* =========================================================
   CLOSE MODALS ON BACKDROP
========================================================= */

if (productModal) {

    productModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModal
            ) {

                closeProductModalWindow();
            }

        }
    );
}


if (deleteModal) {

    deleteModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                deleteModal
            ) {

                closeDeleteModal();
            }

        }
    );
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeProductModalWindow();

        closeDeleteModal();

        closeSidebar();
    }
);


/* =========================================================
   SIDEBAR LINKS
========================================================= */

document
    .querySelectorAll(
        ".admin-sidebar a"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                closeSidebar
            );

        }
    );


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminLogin()) {
            return;
        }


        loadAdminInfo();


        await loadProducts();

    }
);