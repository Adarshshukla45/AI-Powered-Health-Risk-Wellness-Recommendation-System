const express = require("express");
const {
  listProducts,
  getProductById,
  getStandaloneRecommendations,
} = require("../controllers/productController");

const router = express.Router();

// Public: browsing wellness product information doesn't require login.
router.get("/recommendations", getStandaloneRecommendations);
router.get("/:id", getProductById);
router.get("/", listProducts);

module.exports = router;
