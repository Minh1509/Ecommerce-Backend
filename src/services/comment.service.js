"use strict";

const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { findProducts } = require("../models/repositorities/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

/*
 *  key features: comment service
 * + add comment [user, shop]
 * + get list of comment [user, shop]
 * delete a comment [user | shop | admin]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("paren comment not fount");
      rightValue = parentComment.comment_right;

      // updateMany
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");

      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })
        .skip(offset)
        .limit(limit);
      return comments;
    }
    const comments = await commentModel
      .find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_parentId: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 })
      .skip(offset)
      .limit(limit);
    return comments;
  }

  static async deleteComments({ commentId, productId }) {
    // check product exit in database
    const foundProduct = await findProducts({ product_id: productId });
    if (!foundProduct) throw new NotFoundError("product not found");

    // 1. xac dinh left, right cua commentId
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // 2. tinh with
    const width = rightValue - leftValue + 1; // duong vien

    // xoa tát cả comment trong cả cụm
    await commentModel.deleteMany({
      comment_productId: convertToObjectIdMongodb(commentId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    // 4. caaph nhat left , right con lai
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(commentId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(commentId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );
    return true;
  }
}

module.exports = CommentService;
