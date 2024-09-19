"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const document_name = "product";
const collection_name = "products";
// Declare the Schema of the Mongo model
const productModel = new Schema(
  {
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: true,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: {
      type: String,
      require: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attribute: { type: Schema.Types.Mixed, require: true },
  },
  {
    timestamps: true,
    collection: collection_name,
  }
);

const clothingModel = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "products",
  }
);
const electronicModel = new Schema(
  {
    manufactor: { type: String, require: true },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

//Export the model
module.exports = {
  product: model(document_name, productModel),
  clothing: model("clothings", clothingModel),
  electronic: model("electronics", electronicModel),
};
