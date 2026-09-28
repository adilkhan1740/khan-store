const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const User = require("./models/User");
const StoreSettings = require("./models/StoreSettings");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Setting = require("./models/Setting");


const app = express();

const PORT = 5000;

const MONGO_URL =
    "mongodb://127.0.0.1:27017/khanstore";


/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(cors());

app.use(express.json());


/* =========================================================
   MONGODB CONNECTION
   ========================================================= */

mongoose
    .connect(MONGO_URL)
    .then(() => {

        console.log(
            "MongoDB Connected Successfully ✅"
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error
        );

    });


/* =========================================================
   HOME
   ========================================================= */

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message: "KHAN Store Backend is running 🚀"
        });

    }
);


/* =========================================================
   SIGNUP
   ========================================================= */

app.post(
    "/api/signup",
    async (req, res) => {

        try {

            const {
                name,
                email,
                phone,
                password
            } = req.body;


            if (
                !name ||
                !email ||
                !phone ||
                !password
            ) {

                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });

            }


            const existingUser =
                await User.findOne({
                    email:
                        email
                            .trim()
                            .toLowerCase()
                });


            if (existingUser) {

                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            const user =
                await User.create({

                    name:
                        name.trim(),

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    phone:
                        phone.trim(),

                    password:
                        hashedPassword

                });


            res.status(201).json({

                success: true,

                message:
                    "Account created successfully",

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    createdAt:
                        user.createdAt

                }

            });

        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error during signup"

            });

        }

    }
);


/* =========================================================
   LOGIN
   ========================================================= */

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required"

                });

            }


            const user =
                await User.findOne({

                    email:
                        email
                            .trim()
                            .toLowerCase()

                });


            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            res.json({

                success: true,

                message:
                    "Login successful",

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    createdAt:
                        user.createdAt

                }

            });

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error during login"

            });

        }

    }
);


/* =========================================================
   ADMIN - GET ALL CUSTOMERS
   ========================================================= */

app.get(
    "/api/users",
    async (req, res) => {

        try {

            const users =
                await User
                    .find({})
                    .select("-password")
                    .sort({
                        createdAt: -1
                    });


            res.json({

                success: true,

                count:
                    users.length,

                users:
                    users

            });

        } catch (error) {

            console.error(
                "Get Users Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load customers"

            });

        }

    }
);


/* =========================================================
   CREATE ORDER
   ========================================================= */

app.post(
    "/api/orders",
    async (req, res) => {

        try {

            const orderData = req.body;


            if (
                !orderData.orderId ||
                !orderData.customer ||
                !orderData.customer.name ||
                !orderData.customer.email ||
                !orderData.items ||
                !Array.isArray(orderData.items) ||
                orderData.items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order data"

                });

            }


            const existingOrder =
                await Order.findOne({
                    orderId:
                        orderData.orderId
                });


            if (existingOrder) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Order already exists",

                    order:
                        existingOrder

                });

            }


            const order =
                await Order.create({

                    orderId:
                        orderData.orderId,

                    customer: {

                        name:
                            orderData.customer.name,

                        email:
                            orderData.customer.email,

                        phone:
                            orderData.customer.phone || "",

                        address:
                            orderData.customer.address || "",

                        city:
                            orderData.customer.city || "",

                        state:
                            orderData.customer.state || "",

                        pincode:
                            orderData.customer.pincode || ""

                    },

                    items:
                        orderData.items.map(
                            (item) => ({

                                productId:
                                    item.productId || "",

                                name:
                                    item.name,

                                image:
                                    item.image || "",

                                price:
                                    Number(item.price) || 0,

                                quantity:
                                    Number(item.quantity) || 1,

                                subtotal:
                                    Number(item.subtotal) ||
                                    (
                                        Number(item.price || 0) *
                                        Number(item.quantity || 1)
                                    )

                            })
                        ),

                    pricing: {

                        subtotal:
                            Number(
                                orderData.pricing?.subtotal
                            ) || 0,

                        delivery:
                            Number(
                                orderData.pricing?.delivery
                            ) || 0,

                        tax:
                            Number(
                                orderData.pricing?.tax
                            ) || 0,

                        discount:
                            Number(
                                orderData.pricing?.discount
                            ) || 0,

                        total:
                            Number(
                                orderData.pricing?.total
                            ) || 0

                    },

                    paymentMethod:
                        orderData.paymentMethod || "cod",

                    paymentStatus:
                        orderData.paymentStatus || "pending",

                    deliveryType:
                        orderData.deliveryType || "standard",

                    status:
                        orderData.status || "Placed"

                });


            res.status(201).json({

                success: true,

                message:
                    "Order created successfully",

                order:
                    order

            });

        } catch (error) {

            console.error(
                "Create Order Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to create order",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   GET ALL ORDERS
   ========================================================= */

app.get(
    "/api/orders",
    async (req, res) => {

        try {

            const orders =
                await Order
                    .find({})
                    .sort({
                        createdAt: -1
                    });


            res.json({

                success: true,

                count:
                    orders.length,

                orders:
                    orders

            });

        } catch (error) {

            console.error(
                "Get Orders Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load orders"

            });

        }

    }
);


/* =========================================================
   GET SINGLE ORDER
   ========================================================= */

app.get(
    "/api/orders/:orderId",
    async (req, res) => {

        try {

            const order =
                await Order.findOne({

                    orderId:
                        req.params.orderId

                });


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });

            }


            res.json({

                success: true,

                order:
                    order

            });

        } catch (error) {

            console.error(
                "Get Order Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load order"

            });

        }

    }
);


/* =========================================================
   UPDATE ORDER STATUS
   ========================================================= */

app.put(
    "/api/orders/:orderId/status",
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            const allowedStatuses = [

                "Placed",

                "Processing",

                "Shipped",

                "Out for Delivery",

                "Delivered",

                "Cancelled"

            ];


            if (
                !status ||
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order status"

                });

            }


            const order =
                await Order.findOneAndUpdate(

                    {
                        orderId:
                            req.params.orderId
                    },

                    {
                        $set: {
                            status:
                                status
                        }
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Order status updated successfully",

                order:
                    order

            });

        } catch (error) {

            console.error(
                "Update Order Status Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update order status"

            });

        }

    }
);


/* =========================================================
   DELETE ORDER
   ========================================================= */

app.delete(
    "/api/orders/:orderId",
    async (req, res) => {

        try {

            const order =
                await Order.findOneAndDelete({

                    orderId:
                        req.params.orderId

                });


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Order deleted successfully"

            });

        } catch (error) {

            console.error(
                "Delete Order Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete order"

            });

        }

    }
);


/* =========================================================
   PRODUCTS - GET ALL
   ========================================================= */

app.get(
    "/api/products",
    async (req, res) => {

        try {

            const products =
                await Product
                    .find({})
                    .sort({
                        createdAt: -1
                    });


            res.json({

                success: true,

                count:
                    products.length,

                products:
                    products

            });

        } catch (error) {

            console.error(
                "Get Products Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load products"

            });

        }

    }
);


/* =========================================================
   PRODUCTS - GET SINGLE
   ========================================================= */

app.get(
    "/api/products/:productId",
    async (req, res) => {

        try {

            const product =
                await Product.findOne({

                    productId:
                        req.params.productId

                });


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            res.json({

                success: true,

                product:
                    product

            });

        } catch (error) {

            console.error(
                "Get Product Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load product"

            });

        }

    }
);


/* =========================================================
   PRODUCTS - CREATE
   ========================================================= */

app.post(
    "/api/products",
    async (req, res) => {

        try {

            const productData = req.body;


            if (
                !productData.productId ||
                !productData.name ||
                !productData.category ||
                productData.price === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product ID, name, category and price are required"

                });

            }


            const existingProduct =
                await Product.findOne({

                    productId:
                        productData.productId

                });


            if (existingProduct) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Product already exists",

                    product:
                        existingProduct

                });

            }


            const product =
                await Product.create({

                    productId:
                        String(
                            productData.productId
                        ).trim(),

                    name:
                        String(
                            productData.name
                        ).trim(),

                    category:
                        String(
                            productData.category
                        ).trim(),

                    price:
                        Number(
                            productData.price
                        ) || 0,

                    oldPrice:
                        Number(
                            productData.oldPrice
                        ) || 0,

                    discount:
                        Number(
                            productData.discount
                        ) || 0,

                    rating:
                        Number(
                            productData.rating
                        ) || 0,

                    reviews:
                        Number(
                            productData.reviews
                        ) || 0,

                    stock:
                        Number(
                            productData.stock
                        ) || 0,

                    image:
                        productData.image || "",

                    description:
                        productData.description || "",

                    status:
                        productData.status || "Active"

                });


            res.status(201).json({

                success: true,

                message:
                    "Product created successfully",

                product:
                    product

            });

        } catch (error) {

            console.error(
                "Create Product Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to create product",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   PRODUCTS - UPDATE
   ========================================================= */

app.put(
    "/api/products/:productId",
    async (req, res) => {

        try {

            const productData = req.body;


            const updateData = {

                name:
                    productData.name,

                category:
                    productData.category,

                price:
                    Number(
                        productData.price
                    ) || 0,

                oldPrice:
                    Number(
                        productData.oldPrice
                    ) || 0,

                discount:
                    Number(
                        productData.discount
                    ) || 0,

                rating:
                    Number(
                        productData.rating
                    ) || 0,

                reviews:
                    Number(
                        productData.reviews
                    ) || 0,

                stock:
                    Number(
                        productData.stock
                    ) || 0,

                image:
                    productData.image || "",

                description:
                    productData.description || "",

                status:
                    productData.status || "Active"

            };


            const product =
                await Product.findOneAndUpdate(

                    {
                        productId:
                            req.params.productId
                    },

                    {
                        $set:
                            updateData
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Product updated successfully",

                product:
                    product

            });

        } catch (error) {

            console.error(
                "Update Product Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update product",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   PRODUCTS - DELETE
   ========================================================= */

app.delete(
    "/api/products/:productId",
    async (req, res) => {

        try {

            const product =
                await Product.findOneAndDelete({

                    productId:
                        req.params.productId

                });


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Product deleted successfully",

                product:
                    product

            });

        } catch (error) {

            console.error(
                "Delete Product Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete product"

            });

        }

    }
);


/* =========================================================
   START SERVER
   ========================================================= */






















// ================= SETTINGS API =================

// GET STORE SETTINGS
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: "storeSettings" });

    if (!settings) {
      settings = await Setting.create({
        key: "storeSettings"
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({
      message: "Failed to load settings"
    });
  }
});


// SAVE / UPDATE STORE SETTINGS
app.put("/api/settings", async (req, res) => {
  try {
    const data = req.body;

    const settings = await Setting.findOneAndUpdate(
      { key: "storeSettings" },
      {
        $set: {
          store: {
            name: data.store?.name || "KHAN Store",
            email: data.store?.email || "",
            phone: data.store?.phone || "",
            currency: data.store?.currency || "INR",
            address: data.store?.address || ""
          },

          delivery: {
            freeDeliveryAmount: Number(
              data.delivery?.freeDeliveryAmount || 0
            ),

            deliveryCharge: Number(
              data.delivery?.deliveryCharge || 0
            ),

            estimatedDelivery:
              data.delivery?.estimatedDelivery || "2-4",

            returnDays: Number(
              data.delivery?.returnDays || 7
            )
          },

          tax: {
            taxRate: Number(
              data.tax?.taxRate || 0
            ),

            taxMode:
              data.tax?.taxMode === "excluded"
                ? "excluded"
                : "included"
          },

          notifications: {
            newOrder:
              Boolean(data.notifications?.newOrder),

            newCustomer:
              Boolean(data.notifications?.newCustomer),

            lowStock:
              Boolean(data.notifications?.lowStock),

            marketing:
              Boolean(data.notifications?.marketing)
          }
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      success: true,
      message: "Settings saved successfully",
      settings
    });

  } catch (error) {
    console.error("Save Settings Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save settings"
    });
  }
});











































app.listen(
    PORT,
    () => {

        console.log(
            `KHAN Store Backend running on http://localhost:${PORT}`
        );

    }
);