const express = require('express');
const router = express.Router();

router.use("/auth", require("./auth/auth"));
router.use("/cartitem", require("./api/cartitem"))
router.use("/comment", require("./api/comment"));
router.use("/posts", require("./api/posts"));
router.use("/product", require("./api/product"));
router.use("/shoppingcart", require("./api/shoppingcart"));
router.use("/tags", require("./api/tags"));

module.exports = router;