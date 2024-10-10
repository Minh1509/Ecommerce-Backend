"use strict";

const {
  BadRequestErrorResponse,
  NotFoundError,
} = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExits,
} = require("../models/repositorities/discount.repo");
const { findAllProducts } = require("../models/repositorities/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

// discount ServiceWorker
// 1. generate discount code (admin, shop)
// 2. get discount amount(user)
// 3. get all discount codes (user, shop)
// 4. verify discount code(user)
// 5. delete discode code(admin, shop)
// 6. cancel discount code(user)

class DiscountService {
  // 1.Create discount
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      users_used,
      used_count,
      max_uses_per_user,
    } = payload;
    if (new Date() < Date(start_date) || new Date() > Date(end_date)) {
      throw new BadRequestErrorResponse("Discount code is expried");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestErrorResponse("Start date must be before end date");
    }
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_isActive) {
      throw new BadRequestErrorResponse("Discount Exit");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_used_count: used_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_isActive: is_active,
      discount_applies_to: applies_to,

      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }
  static async updateDiscountCode() {}

  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId:  convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount && !foundDiscount.discount_isActive) {
      throw new NotFoundError("Discount not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop:  convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get the product ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId:  convertToObjectIdMongodb(shopId),
        discount_isActive: true,
      },

      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }

  //
  static async getDiscountAmount({ code, userId, shopId, product }) {
    const foundDiscount = await checkDiscountExits({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId:  convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount not found");

    const {
      discount_isActive,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
      discount_users_used
    } = foundDiscount;

    if (!discount_isActive) {
      throw new NotFoundError("Discount expired");
    }

    if (!discount_max_uses)
      throw new NotFoundError("Discount hết lượt sử dụng");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount has expired");
    }

    // check xem co xet gia tri toi thieu cua discount ko
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = product.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          "Discount require a minium order value of " + discount_min_order_value
        );
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userDiscountUsage = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (
        userDiscountUsage &&
        userDiscountUsage.uses >= discount_max_uses_per_user
      ) {
        throw new NotFoundError(
          "User has exceeded the maximum uses for this discount"
        );
      }
    }

    // check discount laf fixed_amount hay ko
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  // delete discount : dua vao 1 database khac la history
  static async deleteDiscount({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: new convertToObjectIdMongodb(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode ({codeId, shopId, userId}) {
    const foundDiscount = await checkDiscountExits({
      model: discount,
      filter : {
        discount_code : codeId,
        discount_shopId:  convertToObjectIdMongodb(shopId)
      }
    })

    if(!foundDiscount ) {
      throw new NotFoundError("Discount exit");
    }

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses:  1,
        discount_used_count: -1
      } 
    })
    return result;
  }
  
}

module.exports = DiscountService;
