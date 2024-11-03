"use strict";

const { BadRequestErrorResponse } = require("../core/error.response");
const {
  clothing,
  electronic,
  product,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositorities/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProducts,
  updateProductById,
} = require("../models/repositorities/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "clothings":
        return new ClothingProduct(payload).createProduct();
      case "electronics":
        return new ElectronicProduct(payload).createProduct();
      case "funitures":
        return new FunitureProduct(payload).createProduct();
      default:
        throw new BadRequestErrorResponse("Invalid Error Type");
    }
  }
  static async updateProduct(type, productId, payload) {
    switch (type) {
      case "clothings":
        return new ClothingProduct(payload).updateProduct(productId);
      case "electronics":
        return new ElectronicProduct(payload).updateProduct(productId);
      case "furnitures":
        return new FunitureProduct(payload).updateProduct(productId);
      default:
        throw new BadRequestErrorResponse("Invalid Error Type");
    }
  }

  // Put
  static async publishProductByShop({ product_id, product_shop }) {
    return await publishProductByShop({ product_id, product_shop });
  }
  static async unPublishProductByShop({ product_id, product_shop }) {
    return await unPublishProductByShop({ product_id, product_shop });
  }
  // End put

  //Query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop(query, limit, skip);
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop(query, limit, skip);
  }

  static async searchProductByUser(keySearch) {
    return await searchProductByUser({ keySearch });
  }
  static async findProducts({ product_id, filter = { isPublished: true } }) {
    return await findProducts({
      product_id,
      filter,
      unSelect: ["__v", "createdAt", "updatedAt"],
    });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_price",
        "product_thumb",
        "product_shop",
      ],
    });
  }
  // End query
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
    const newProduct = await product.create({
      ...this,
      _id: productid,
    });

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });

      // push noti system collection
      pushNotiToSystem({
        type: "PROMOTION-001",
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((re) => console.log(re))
        .catch((err) => console.error(err));
    }

    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
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

  async updateProduct(productId) {
    // 1 rm attribute has null, undefined
    // 2. check xem update ở chỗ nào: nếu có attr product => update cả product và product_type , nếu ko thì chỉ có product
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attribute) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attribute),
        model: clothing,
      });
    }

    // update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
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
  async updateProduct(productId) {
    const objectParams = this;
    if (objectParams.product_attribute) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attribute),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
class FunitureProduct extends Product {
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
    const newFuniture = await furniture.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newFuniture) {
      throw new BadRequestErrorResponse("Error creating new electronic");
    }
    const newProduct = await super.createProduct(newFuniture._id);
    return newProduct;
  }
  async updateProduct(productId) {
    const objectParams = this;
    if (objectParams.product_attribute) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attribute),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

module.exports = ProductFactory;
