"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, required: true },
    discount_max_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // so luong discount dc ap dung
    discount_used_count: { type: Number, required: true }, // so luong discoun da su dung
    discount_users_used: { type: Array , default: [] }, // ai da dung
    discount_max_uses_per_user: { type: Number, required: true }, // so luong toi da cho phep 1 nguoi su dung
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "shop" },
    discount_isActive: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham duoc ap dung
  },
  {
    timestamps: true,
    collection: "discounts",
  }
);

// Export the model
module.exports = {
  discount: model("discount", discountSchema),
};
