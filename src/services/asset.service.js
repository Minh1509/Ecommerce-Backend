"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/authUtils");

const roleShop = {
  shop: "Shop",
  write: "Writer",
  editor: "Editor",
  admin: "Admin",
};
class assetService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1 : Check email
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Email is conflict",
        };
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

      // RSA puiblicKey (lưu database ), privateKey
      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });
        console.log({ privateKey, publicKey }); // save vao collection keymodel
        const publicKeyString = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // tao refreshToken, accessToken pair
        const tokens = await createTokenPair(
          { user: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log("Create token::", tokens);
        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = assetService;
