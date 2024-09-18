const express = require('express');
const assetController = require('../../controllers/asset.controller');
const {asyncHandler} = require("../../auth/checkAuth")
const router = express.Router();

router.post('/shop/signup', asyncHandler(assetController.signUp));
router.post('/shop/login', asyncHandler(assetController.login));

module.exports = router;