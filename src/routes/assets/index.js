const express = require('express');
const assetController = require('../../controllers/asset.controller');
const {asyncHandler} = require("../../auth/checkAuth")
const router = express.Router();

router.post('/shop/signup', asyncHandler(assetController.signUp));

module.exports = router;