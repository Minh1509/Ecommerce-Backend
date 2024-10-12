const express = require("express");
const router = express.Router();
const { apiKey, checkPermission } = require("../auth/checkAuth");
const {pushToLogDiscord} = require('../middlewares/index')

// add log to discord
router.use(pushToLogDiscord);
//check apiKey
router.use(apiKey);
//check permission
router.use(checkPermission("0000"));


router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./assets"));

module.exports = router;
