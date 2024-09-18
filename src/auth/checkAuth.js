"use strict";

const { BadRequestErrorResponse } = require("../core/error.response");
const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      throw new BadRequestErrorResponse("Fobidden Erroe")
    }
    // check object ( kiem tra xem co ton tai trong database ko)
    const object = await findById(key);
    if (!object) {
     throw new BadRequestErrorResponse("Forbidden Error")
    }
    req.object = object;
    return next();
  } catch (error) {}
};
const checkPermission = (permission) => {
  // su dung ham bao đóng (Clause Sure) trả về 1 hàm và có thể nhận các biến của hàm cha
  return (req, res, next) => {
    if (!req.object.permissions) {
     throw new BadRequestErrorResponse('Permission denied')
    }
    console.log("Permission:: ", req.object.permissions);
    const validPermission = req.object.permissions.includes(permission);
    if (!validPermission) {
      throw new BadRequestErrorResponse('Permission denied')
    }
    return next();
  };
};

const asyncHandler = fn => {
  return (req, res, next) =>{
      fn(req, res, next).catch(next);
  }
}

module.exports = { apiKey, checkPermission, asyncHandler };
