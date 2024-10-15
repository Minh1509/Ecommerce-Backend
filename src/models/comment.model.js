"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const commentSchema = new Schema(
  {
    comment_productId: { type: Schema.Types.ObjectId, ref: "product" },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: "text" },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: "comment" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "comments",
  }
);

//Export the model
module.exports = model("comment", commentSchema);
