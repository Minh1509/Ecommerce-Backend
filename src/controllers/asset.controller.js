"use strict";

const { CREATE, SuccessResponse } = require("../core/success.response");
const assetService = require("../services/asset.service");

class assetController {
  logout = async(req, res, next) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await assetService.logout(req.keyStore)
    }).send(res);
  }
  login = async(req, res, next) => {
    new SuccessResponse({
      metadata: await assetService.login(req.body)
    }).send(res);
  }
  signUp = async (req, res, next) => {
    console.log("Signup::", req.body);
    new CREATE({
      message: "Registered OK !!",
      metadata: await assetService.signUp(req.body),
      option: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new assetController();
