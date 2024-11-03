'use strict'

"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
// san sinh ra 1 caí noti thì push vào noti của hệ thống chứ ko phải cho thẳng lên user

// order-001: order success
// order-002: order failed
// promotion-001: new promotion (khuyen mai)
// shop-001: new product by user following
const notificationSchema = new Schema(
  {
    noti_type : {type: String, enum: ['ORDER-001', 'ORDER-002', "PROMOTION-001","SHOP-001"], required: true},
    noti_senderId: {type:  Schema.Types.ObjectId , required: true, ref : 'shop'},
    noti_receivedId: {type: Number, required: true, },
    noti_content: {type: String, required: true},
    noti_options: {type: Object, default: {}} // vi du nhan duoc 1 voucher cuar 1 shop : abc thì object sẽ lưu là tên shop: abc
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

//Export the model
module.exports = model("notification", notificationSchema);
