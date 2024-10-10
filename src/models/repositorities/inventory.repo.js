"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const { inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};


// dat hang: tru di tồn kho, khi có người đang đặt hàng thì nên cho vào 1 mảng, nếu đặt thành công thì remove người đó
const reservationInventory = async({productId, quantity, cartId}) => {
  const query = {
    inven_productId : convertToObjectIdMongodb(productId),
    inven_stock: {$gte: quantity}

  }, updateSet = {
    $inc : {
      inven_stock : -quantity
    },
    $push: {
      inven_reservations : {
        quantity,cartId,
        createOn : new Date()
      }
    }
  }, options = {upsert: true, new: true}

  return await inventory.updateOne(query, updateSet, options)
}

module.exports = { insertInventory , reservationInventory};