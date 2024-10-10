"use strict";

const {
  BadRequestErrorResponse,
  NotFoundError,
} = require("../core/error.response");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositorities/cart.repo");
const {
  checkProductByServer,
} = require("../models/repositorities/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquiredLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /*
     cartId
     userId
     shop_order_ids : [
            {
                shopId,
                shop_discounts: [
                    {
                        shopId,
                        codeId,
                        codeId
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
        }
     ]
     */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestErrorResponse("Cart not found ");

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi ship
        totalDiscount: 0, // tong tien giam gia
        totalCheckout: 0, // tong thanh toan
      },
      shop_order_ids_new = [];

    //  tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // check product available
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0])
        throw new BadRequestErrorResponse("order wrong");

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //   new shop_discount >0 , check xem co hop le khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].codeId,
          userId,
          shopId: shop_discounts[0].shopId,
          product: checkProductServer,
        });

        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia >o
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return { shop_order_ids, shop_order_ids_new, checkout_order };
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address ={},
    user_payment= {}
  }){
    const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
      cartId, userId, shop_order_ids
    })


    // thuật toán flat map
    // check lại 1 lần nữa xem vượt tồn kho hay không
    // get new array products
    const products = shop_order_ids_new.flatMap(order => order.item_products);
    console.log('[1]', products);
    const acquireProduct = []

    // sử dụng optimistic locks : khóa lạc quan : chặn luồng đi của nhiều luồng, chỉ cho phép 1 luồng đi qua, thực hiện check từng luồng 1, để chắc chắn chưa vượt quá số lượng tồn kho
    for (let i = 0; i < products.length; i++) {
      const {productId, quantity} = products[i];
      const keyLock = await acquiredLock({
        productId, quantity, cartId
      })
      acquireProduct.push(keyLock? true: false);
      if(keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check if co 1 sp hết hàng 
    if(acquireProduct.includes(false)) {
      throw new BadRequestErrorResponse("Một số sp đã được cập nhật, vui lòng quay lại giỏ hàng...")
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    });

    // th: nếu insert thành công thì remove product trong giỏ hàng
    if(newOrder) {
      //remove product in my cart
    }

    return newOrder;
  }

  // query order
  static async getOrdersByUser() {

  }

  // query order using id [user]
  static async getOrderByUser() {

  }

  // Cancel order [user]
  static async cancelOrderByUser() {

  }

  // update order status [shop || admin] , !important
  static async updateOrderStatusByShop() {

  }

}

module.exports = CheckoutService;
