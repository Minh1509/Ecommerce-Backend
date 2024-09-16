"use strict";

const assetService = require("../services/asset.service");

class assetController {
  signUp = async (req, res, next) => {
    console.log("Signup::", req.body);
    // 200 ok
    // 201 create
    return res.status(201).json(await assetService.signUp(req.body));
  };
}

module.exports = new assetController();
