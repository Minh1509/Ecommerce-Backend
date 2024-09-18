"use strict";

const keyTokenModel = require("../models/keyToken.model");

// Tao token
class keyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey , refreshToken}) => {
    try {
      //   level 0
      //     const tokens = await keyTokenModel.create({
      //         user: userId,
      //         publicKey : publicKey,
      //         privateKey: privateKey
      //     })
      //     return tokens? tokens.publicKey: null;

      // levelxxx
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens? tokens.publicKey : null
    } catch (error) {
      return error;
    }
  };
}

module.exports = keyTokenService;
