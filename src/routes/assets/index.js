const express = require('express');
const assetController = require('../../controllers/asset.controller');
const router = express.Router();

router.post('/shop/signup', assetController.signUp);

module.exports = router;