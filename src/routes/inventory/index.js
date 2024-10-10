'use strict'

const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const inventoryController = require('../../controllers/inventory.controller');


router.use(authentication);
router.post("", asyncHandler(inventoryController.addStockToInventory))



module.exports = router;