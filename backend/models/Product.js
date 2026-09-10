const mongoose = require("mongoose");

/**
 * A "products" collection entry is descriptive wellness-product
 * information only. It is never treated as a prescription: the
 * recommendation engine (services/recommendationEngine.js) is what
 * decides whether/when a product surfaces, and it always runs the
 * safety gate first (see that file for the URGENT/insufficient-info
 * exclusions).
 */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  description: { type: String, required: true },
  ingredients: { type: [String], default: [] },
  intendedUse: { type: String },
  warnings: { type: [String], default: [] },
  ageRestrictions: { type: String },
  sourceUrl: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
