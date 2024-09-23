"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class productController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product from drafts success",
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "UnPublish product success",
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // Query
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts success",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish success",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getSearchProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get search product  success",
      metadata: await ProductFactory.searchProductByUser(req.params.keySearch),
    }).send(res);
  };
  getFindAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get find all product success",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };
  getFindProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get find product success",
      metadata: await ProductFactory.findProducts({product_id: req.params.id}),
    }).send(res);
  };

  // End Query
}

module.exports = new productController();
