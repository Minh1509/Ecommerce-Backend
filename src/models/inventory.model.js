"use strict";

const { Schema, model } = require("mongoose");

const document_name = "inventory";
const collection_name = "inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "product" },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "shop"},
    inven_stock: {type:  Number, required: true },
    inven_location:  { type: String, default: "unknown" },
    inven_reservations: { type: Array, default: [] }, // lưu lại khi người dùng đặt hàng và trừ đi số lượng tồn kho
  },
  {
    timestamps: true,
    collection: collection_name,
  }
);

//Export the model
module.exports = {
  inventory: model(document_name, inventorySchema),
};
