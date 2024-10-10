const express = require('express');

const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const productController = require('../../controllers/product.controller');

// Search by user
router.get('/search/:keySearch', asyncHandler(productController.getSearchProductByUser));

router.use(authentication)
router.post('/product', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

//Query for shop , tức là cần authen 
// Publish cho shop cần authen, user thì ko cần
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));


module.exports = router;