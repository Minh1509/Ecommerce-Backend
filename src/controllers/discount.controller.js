'use strict';

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        new SuccessResponse ({
            message: "Success create discount",
            metadata: await DiscountService.createDiscountCode({...req.body, shopId: req.user.userId})
        }).send(res)
    }
    getAllDiscountCodeWithProduct = async(req, res, next) => {
        new SuccessResponse ({
            message: "Get all discount with product success",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({...req.query})
        }).send(res)
    }
    getAllDiscountCodesByShop = async(req, res, next) => {
        new SuccessResponse ({
            message: "get all discount by shop success",
            metadata: await DiscountService.getAllDiscountCodesByShop({ ...req.query, shopId: req.user.userId})
        }).send(res)
    }
    
    getDiscountAmount = async(req, res, next) => {
        new SuccessResponse ({
            message: "get discount amount success",
            metadata: await DiscountService.getDiscountAmount({...req.body})
        }).send(res)
    }
    deleteDiscount = async(req, res, next) => {
        new SuccessResponse ({
            message: "Delete account success ",
            metadata: await DiscountService.deleteDiscount({...req.body, shopId: req.user.userId})
        }).send(res)
    }
    cancelDiscountCode = async(req, res, next) => {
        new SuccessResponse ({
            message: "Cancel account success",
            metadata: await DiscountService.cancelDiscountCode({...req.body,userId: req.user.userId, shopId: req.user.userId})
        }).send(res)
    }
}

module.exports = new DiscountController();