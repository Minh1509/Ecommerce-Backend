"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const document_name = "cart";
const collection_name = "carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: { type: Array, required: true, default: [] },
    // productId, shopId, quantity, name, price
    cart_count_product: {
        type: Number, default: 0
    },
    cart_userId: {type: Number,required: true }
  },
  {
    timestamps: true,
    collection: collection_name
  }
);

//Export the model
module.exports = model(document_name, cartSchema);
