const express = require('express');

const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const productController = require('../../controllers/product.controller');

// Search by user
router.get('/search/:keySearch', asyncHandler(productController.getSearchProductByUser));
router.get('/all', asyncHandler(productController.getFindAllProduct));
router.get('/:id', asyncHandler(productController.getFindProducts));

router.use(authentication)
router.post('/', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

//Query for shop , tức là cần authen 
// Publish cho shop cần authen, user thì ko cần
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));


module.exports = router;