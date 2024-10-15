'use strict';

const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            const { productId, quantity } = JSON.parse(message);
            InventoryServiceTest.updateInventory(productId, quantity);
        });
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with quantity ${quantity}`);
    }
}

module.exports = InventoryServiceTest;