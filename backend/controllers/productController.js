const Product = require("../models/Product");

async function listProducts(req, res, next) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ category: 1, name: 1 });
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/recommendations?symptoms=cough,high_fever
 * Lightweight endpoint for the frontend to preview recommendations
 * outside the context of a saved assessment (e.g. products browse page).
 * Still respects the same safety gate as the assessment flow.
 */
async function getStandaloneRecommendations(req, res, next) {
  try {
    const { getRecommendations } = require("../services/recommendationEngine");
    const symptoms = (req.query.symptoms || "").split(",").map((s) => s.trim()).filter(Boolean);
    const riskLevel = req.query.riskLevel || (symptoms.length ? "LOW" : "INSUFFICIENT_INFO");
    const result = await getRecommendations({ symptoms, riskLevel });
    if (result.skip) {
      return res.json({ products: [], skippedReason: result.reason });
    }
    res.json({ products: result.products });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProductById, getStandaloneRecommendations };
