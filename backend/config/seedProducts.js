require("dotenv").config();
const connectDB = require("./db");
const Product = require("../models/Product");
const products = require("./products.seed");

async function seed() {
  await connectDB();
  console.log(`Seeding ${products.length} products...`);

  for (const p of products) {
    await Product.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true });
  }

  console.log("Done. Products in DB:", await Product.countDocuments());
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
