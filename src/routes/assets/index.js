const express = require('express');
const assetController = require('../../controllers/asset.controller');
const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils")

router.post('/shop/signup', asyncHandler(assetController.signUp));
router.post('/shop/login', asyncHandler(assetController.login));

// authentication for logout
router.use(authentication)
router.post('/shop/logout', asyncHandler(assetController.logout));
router.post('/shop/handlerRefreshToken', asyncHandler(assetController.handlerRefreshToken));

module.exports = router;