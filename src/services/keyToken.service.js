"use strict";

const keyTokenModel = require("../models/keyToken.model");

const mongoose = require("mongoose");

// Tao token
class keyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
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
    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean(); // Ensure userId is converted to ObjectId
  };
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
}

module.exports = keyTokenService;
