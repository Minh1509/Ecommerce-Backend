"use strict";

const assetService = require("../services/asset.service");

class assetController {
  signUp = async (req, res, next) => {
    try {
      console.log("Signup::", req.body);
      // 200 ok
      // 201 create
      return res.status(201).json(await assetService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new assetController();
