const express = require('express');

const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const productController = require('../../controllers/product.controller');



// authentication for logout
router.use(authentication)
router.post('/product', asyncHandler(productController.createProduct));


module.exports = router;