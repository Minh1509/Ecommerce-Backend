"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Fobidden Error",
      });
    }
    // check object ( kiem tra xem co ton tai trong database ko)
    const object = await findById(key);
    if (!object) {
      return res.status(403).json({
        message: "Fobidden Error",
      });
    }
    req.object = object;
    return next();
  } catch (error) {}
};
const checkPermission = (permission) => {
  // su dung ham bao đóng (Clause Sure) trả về 1 hàm và có thể nhận các biến của hàm cha
  return (req, res, next) => {
    if (!req.object.permissions) {
      return res.status(403).json({
        message: "Permissions denied",
      });
    }
    console.log("Permission:: ", req.object.permissions);
    const validPermission = req.object.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permissions denied",
      });
    }
    return next();
  };
};

module.exports = { apiKey, checkPermission };
