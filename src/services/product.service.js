"use strict";

const { BadRequestErrorResponse } = require("../core/error.response");
const { clothing, electronic, product } = require("../models/product.model");

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "clothings":
        return new ClothingProduct(payload).createProduct();
      case "electronics":
        return new ElectronicProduct(payload).createProduct();
      default:
        throw new BadRequestErrorResponse("Invalid Error Type");
    }
  }
}

class Product {
  constructor(
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_quantity,
    product_shop,
    product_attribute
  ) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
  }

  async createProduct(productid) {
    return await product.create({
      ...this,
      _id: productid,
    });
  }
}

class ClothingProduct extends Product {
  constructor(payload) {
    super(
      payload.product_name,
      payload.product_thumb,
      payload.product_description,
      payload.product_price,
      payload.product_type,
      payload.product_quantity,
      payload.product_shop,
      payload.product_attribute
    );
  }
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestErrorResponse("Create clothing error");
    }
    const newProduct = await super.createProduct(newClothing._id);
    return newProduct;
  }
}

class ElectronicProduct extends Product {
  constructor(payload) {
    super(
      payload.product_name,
      payload.product_thumb,
      payload.product_description,
      payload.product_price,
      payload.product_type,
      payload.product_quantity,
      payload.product_shop,
      payload.product_attribute
    );
  }
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestErrorResponse("Error creating new electronic");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    return newProduct;
  }
}

module.exports = ProductFactory;
