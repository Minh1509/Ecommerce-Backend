'use strict'

const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const checkoutController = require('../../controllers/checkout.controller');


router.post("/review", asyncHandler(checkoutController.checkoutReview))



module.exports = router;