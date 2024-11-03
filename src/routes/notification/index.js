'use strict'

const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const notificationController = require('../../controllers/notification.controller');

router.use(authentication);

router.get("", asyncHandler(notificationController.listNotiByUser))




module.exports = router;