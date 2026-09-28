const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "storeSettings"
    },

    store: {
      name: { type: String, default: "KHAN Store" },
      email: { type: String, default: "support@khanstore.com" },
      phone: { type: String, default: "+91 98765 43210" },
      currency: { type: String, default: "INR" },
      address: { type: String, default: "" }
    },

    delivery: {
      freeDeliveryAmount: { type: Number, default: 999 },
      deliveryCharge: { type: Number, default: 49 },
      estimatedDelivery: { type: String, default: "2-4" },
      returnDays: { type: Number, default: 7 }
    },

    tax: {
      taxRate: { type: Number, default: 18 },
      taxMode: {
        type: String,
        enum: ["included", "excluded"],
        default: "included"
      }
    },

    notifications: {
      newOrder: { type: Boolean, default: true },
      newCustomer: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);