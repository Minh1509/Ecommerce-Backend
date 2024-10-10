"use strict";

const { model, Schema } = require("mongoose");
const document_name = "order";
const collection_name = "orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} }, //checkout_order
    order_shipping: { type: Object, default: {} }, // street, city, state, country
    order_payment: { type: Object, default: {} }, // visa , tien  mat
    order_products: { type: Array, required: true }, // shop_order_ids_new
    order_trackingNumber: { type: String, default: "#000011117338" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: collection_name,
  }
);

module.exports = {
  order: model(document_name, orderSchema),
};
