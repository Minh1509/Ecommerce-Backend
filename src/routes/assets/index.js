const express = require('express');
const assetController = require('../../controllers/asset.controller');
const router = express.Router();

router.post('/shop/signup', assetController.signUp);
router.get('/', (req, res, next) => {
    try {
        return res.send('Hello');
    } catch (error) {
        next(error);
    }
});

module.exports = router;