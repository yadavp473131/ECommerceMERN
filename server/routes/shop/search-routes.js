const express = require("express");
const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();

router.get('/:keyword', searchProducts);
// router.get('/get/:id', getProductDetails);


module.exports = router;