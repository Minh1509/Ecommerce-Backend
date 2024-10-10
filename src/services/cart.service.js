"use strict";

const { NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositorities/cart.repo");
const { getProductById } = require("../models/repositorities/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

// add product by user
// reduce product quantity [user]
// incre product quantity [user]
// get cart [user]
// delete cart [user]
// delete cart item [user]

class CartService {
  static async addToCart({ userId, product = {} }) {
    // check cart ton tai ko
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      //create cart
      return await createUserCart({ userId, product });
    }

    // neu co cart roi nhung chua co product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai va có sản phẩm định thêm thì update
    return await updateUserCartQuantity({ userId, product });
  }

  // update cart
  //   shop_order_ids : [
  //     {
  //       shopId,
  //       item_products: [
  //         {
  //           quantity,
  //           price,
  //           shopId,
  //           old_quantity,
  //           productId
  //         }
  //       ],
  //       version: khóa bi quan, khóa lạc quan, khóa phân tán
  //     }
  //   ]
  static async updateCart({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("ShopId is not found");
    }

    if (quantity === 0) {
      // delete
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  // delete
  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    console.log(typeof userId);
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
