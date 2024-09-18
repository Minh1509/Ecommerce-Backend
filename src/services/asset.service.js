"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  ConflictErrorResponse,
  BadRequestErrorResponse,
  AuthFailureError,
} = require("../core/error.response");
const findByEmail = require("./shop.service");

const roleShop = {
  shop: "Shop",
  write: "Writer",
  editor: "Editor",
  admin: "Admin",
};
class assetService {
  static logout = async (keyStore) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };
  /*
  1 . check email trong db
  2. match password
  3. create accessToken, refreshToken and save
  4 . generate tokens
  5. getData return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestErrorResponse("Uer is not registered");

    // 2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Mật khẩu không khớp");

    // 3.
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    // 4.
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await keyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id,
    });
    return {
      metadata: {
        shop: getInfoData({
          field: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };
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
  };
}

module.exports = assetService;
