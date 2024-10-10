"use strict";
const { convertToObjectIdMongodb } = require("../../utils");
const cart = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };
  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_state: "active",
  };
  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = { upsert: false, new: true };

  const result = await cart.findOneAndUpdate(query, updateSet, options);
  if (!result) {
    // Nếu không tìm thấy sản phẩm để cập nhật, thêm sản phẩm mới vào giỏ hàng
    return await cart.findOneAndUpdate(
      { cart_userId: userId, cart_state: "active" },
      { $push: { cart_products: product } },
      { new: true }
    );
  }
  return result;
};

const findCartById = async(cartId) => {
  return await cart.findOne({_id:convertToObjectIdMongodb(cartId), cart_state: 'active'}).lean();
}

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  findCartById
};
