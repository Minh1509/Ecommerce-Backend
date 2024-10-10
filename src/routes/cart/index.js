const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const cartController = require('../../controllers/cart.controller');


router.post("", asyncHandler(cartController.addToCart))
router.delete("", asyncHandler(cartController.deleteCart))
router.post("/update", asyncHandler(cartController.updateCart))
router.get("", asyncHandler(cartController.listToCart))


module.exports = router;