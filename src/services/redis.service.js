'use strict'

const redis = require('redis')
const {promisify} = require('util');
const { reservationInventory } = require('../models/repositorities/inventory.repo');
const redisClient = redis.createClient();

const expireAsync = promisify(redisClient.expire).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const acquiredLock = async(productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTime = 10;
    const expireTime = 3000; // 3s;
    for (let i = 0; i < retryTime; i++) {
        // tạo 1 key , thằng nào nắm được key thì vào thanh toán
        const result = await setAsync(key, expireTime);
        console.log(`result:::`, result);
        if(result ===1) {
            // thao tac voi inventory

            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })

            if(isReservation.modifiedCount) {
                await expireAsync(key, expireTime)
                return key
            }
            return null;
        }else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        
    }
}

// giai phong log để người khác vào thanh toán tiếp
const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
}

module.exports = {
    acquiredLock,
    releaseLock
}