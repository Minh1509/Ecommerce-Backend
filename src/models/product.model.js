"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const document_name = "product";
const collection_name = "products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["electronics", "clothings", "furnitures"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attribute: { type: Schema.Types.Mixed },
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Ratung must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: collection_name,
  }
);
// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
const furnitureSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    timestamps: true,
    collection: "furnitures",
  }
);

// Export the model
module.exports = {
  product: model(document_name, productSchema),
  clothing: model("clothing", clothingSchema),
  electronic: model("electronic", electronicSchema),
  furniture: model("furniture", furnitureSchema),
};
