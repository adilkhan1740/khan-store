const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: ""
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);


const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },

      phone: {
        type: String,
        default: "",
        trim: true
      },

      address: {
        type: String,
        default: "",
        trim: true
      },

      city: {
        type: String,
        default: "",
        trim: true
      },

      state: {
        type: String,
        default: "",
        trim: true
      },

      pincode: {
        type: String,
        default: "",
        trim: true
      }
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0
      },

      delivery: {
        type: Number,
        default: 0,
        min: 0
      },

      tax: {
        type: Number,
        default: 0,
        min: 0
      },

      discount: {
        type: Number,
        default: 0,
        min: 0
      },

      total: {
        type: Number,
        required: true,
        min: 0
      }
    },

    paymentMethod: {
      type: String,
      default: "cod",
      enum: ["cod", "online"]
    },

    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed", "refunded"]
    },

    deliveryType: {
      type: String,
      default: "standard"
    },

    status: {
      type: String,
      default: "Placed",
      enum: [
        "Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ]
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Order", orderSchema);