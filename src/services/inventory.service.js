'use strict'

const { BadRequestErrorResponse } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositorities/product.repo")

class InventoryService {
    static async addStockToInventory ({
        stock, productId, shopId,location = 'To Huu , ha Noi'
    }){
        const product = await getProductById(productId);
        if(!product) throw new BadRequestErrorResponse("The product does not exists");

        const query = {inven_shopId: shopId, inven_productId: productId},
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        },options= {updateSet: true, new: true}
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService;