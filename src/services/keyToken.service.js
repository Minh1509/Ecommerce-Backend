'use strict'

const keyTokenModel = require("../models/keyToken.model");

// Tao token
class keyTokenService {
    static createKeyToken = async ({userId, publicKey}) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey : publicKey
            })
            return tokens? tokens.publicKey: null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = keyTokenService;