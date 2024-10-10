const express = require("express");
const router = express.Router();
const { apiKey, checkPermission } = require("../auth/checkAuth");

//check apiKey
router.use(apiKey);
//check permission
router.use(checkPermission("0000"));


router.use("/v1/api", require("./assets"));
router.use("/v1/api", require("./product"));

module.exports = router;
