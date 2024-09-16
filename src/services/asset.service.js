"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { ConflictErrorResponse } = require("../core/error.response");

const roleShop = {
  shop: "Shop",
  write: "Writer",
  editor: "Editor",
  admin: "Admin",
};
class assetService {
  static signUp = async ({ name, email, password }) => {
    // step1 : Check email
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new ConflictErrorResponse("Email is registered");
    }

    // Create shop
    const hashPass = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPass,
      roles: [roleShop.shop],
    });

    // Tao refresh token, accessToken để khi đăng ký thành công thì người dùng sẽ sử dụng refresh token, accessToken tức là khi đăng ký xong sẽ cấp
    //   refresh token, accessToken để truy cập vào hệ thống luôn
    //  Nhiều hệ thống thường đăng ký xong , xong phải đăng nhập mới được vào hệ thống, lúc đó mới cấp refresh, access

    if (newShop) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey }); // save vao collection keymodel
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        return {
          code: "xxxx",
          message: "publicKeyString error",
        };
      }

      // tao refreshToken, accessToken pair
      const tokens = await createTokenPair(
        { user: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("Create token::", tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            field: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = assetService;
