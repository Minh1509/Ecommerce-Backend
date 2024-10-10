"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // update + -
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart success",
      metadata: await CartService.updateCart(req.body),
    }).send(res);
  };
  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "delete cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "list cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
