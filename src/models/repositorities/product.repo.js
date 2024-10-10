"use strict";

const { Types } = require("mongoose");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../../models/product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findAllDraftsForShop = async (query, limit, skip) => {
  return await queryProduct(query, limit, skip);
};
const findAllPublishForShop = async (query, limit, skip) => {
  return await queryProduct(query, limit, skip);
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, "i");
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { id: -1 } : { id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProducts = async({product_id, filter, unSelect}) => {
  const query = {_id: product_id, ...filter}
  return await product.findOne(query).select(unGetSelectData(unSelect))
}


const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });
  if (!foundShop) return null;

  const result = await product.updateOne(
    { _id: foundShop._id },
    {
      $set: {
        isDraft: false,
        isPublished: true,
      },
    }
  );
  return result ? 1 : 0;
};
const unPublishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });
  if (!foundShop) return null;

  const result = await product.updateOne(
    { _id: foundShop._id },
    {
      $set: {
        isDraft: true,
        isPublished: false,
      },
    }
  );
  return result ? 1 : 0;
};

const queryProduct = async (query, limit, skip) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProducts
};
