const mongoose = require("mongoose");

const garmentSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    garments: [garmentSchema],

    totalBill: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["RECEIVED", "PROCESSING", "READY", "DELIVERED"],
      default: "RECEIVED",
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);