"use strict";

// Luu lai idUser, publicKey, refreshToken

const { Schema, model } = require("mongoose"); // Erase if already required

const document_name = "key";
const collection_name = "keys";
// Declare the Schema of the Mongo model
var KeyTokenSchema = new Schema(
  {
    user: { // user nay se chứa userId
      type: Schema.Types.ObjectId,
      required: true,
      ref: "shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      // sử dụng để biết các hacker sử dụng trái phép token này
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: collection_name,
  }
);

//Export the model
module.exports = model(document_name, KeyTokenSchema);
