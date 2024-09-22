"use strict";

const { Schema, model } = require("mongoose");

const document_name = "product";
const collection_name = "products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["electronics", "clothings", "furnitures"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attribute: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: collection_name,
  }
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    timestamps: true,
    collection: "clothings",
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

// Export the model
module.exports = {
  product: model(document_name, productSchema),
  clothing: model("clothing", clothingSchema),
  electronic: model("electronic", electronicSchema),
 
};
