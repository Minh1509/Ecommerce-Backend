'use strict'

const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler")
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const commentController = require('../../controllers/comment.controller');

router.use(authentication);

router.post("", asyncHandler(commentController.createComment))
router.get("", asyncHandler(commentController.getCommentsByParentId))
router.delete("", asyncHandler(commentController.deleteComments))



module.exports = router;