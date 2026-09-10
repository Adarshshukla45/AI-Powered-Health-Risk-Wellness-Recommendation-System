const Product = require("../models/Product");

/**
 * symptoms -> wellness category. Deliberately NOT disease -> product.
 * Only symptoms with a fairly direct, commonly understood link to a
 * wellness category are mapped; anything not listed here simply
 * contributes no category (safer than guessing).
 */
const SYMPTOM_TO_WELLNESS_CATEGORY = {
  cough: ["Throat & Respiratory", "Cold & Immunity"],
  throat_irritation: ["Throat & Respiratory"],
  patches_in_throat: ["Throat & Respiratory"],
  phlegm: ["Throat & Respiratory", "Cold & Immunity"],
  congestion: ["Cold & Immunity"],
  runny_nose: ["Cold & Immunity"],
  continuous_sneezing: ["Cold & Immunity"],
  mild_fever: ["Fever & Immunity"],
  high_fever: ["Fever & Immunity"],
  chills: ["Fever & Immunity"],

  stomach_pain: ["Digestive Health"],
  abdominal_pain: ["Digestive Health"],
  belly_pain: ["Digestive Health"],
  indigestion: ["Digestive Health"],
  constipation: ["Digestive Health"],
  acidity: ["Digestive Health"],
  passage_of_gases: ["Digestive Health"],
  loss_of_appetite: ["Digestive Health"],

  anxiety: ["Mental Wellness"],
  mood_swings: ["Mental Wellness"],
  irritability: ["Mental Wellness"],
  lack_of_concentration: ["Mental Wellness"],
  restlessness: ["Mental Wellness"],

  fatigue: ["Stress & Vitality"],
  muscle_weakness: ["Stress & Vitality"],
  lethargy: ["Stress & Vitality"],
  weakness_in_limbs: ["Stress & Vitality"],
};

const MIN_SYMPTOMS_FOR_RECOMMENDATION = 1;

/**
 * Returns { skip: true, reason } when recommendations should NOT be shown,
 * or { skip: false, products } with a ranked, deduped product list.
 *
 * Safety gate (per project spec, section 10):
 *  - never recommend when riskLevel === "URGENT"
 *  - never recommend when there isn't enough information
 */
async function getRecommendations({ symptoms, riskLevel }) {
  if (riskLevel === "URGENT") {
    return { skip: true, reason: "Risk level is URGENT — wellness products are not shown; please seek medical care." };
  }
  if (riskLevel === "INSUFFICIENT_INFO" || !symptoms || symptoms.length < MIN_SYMPTOMS_FOR_RECOMMENDATION) {
    return { skip: true, reason: "Insufficient information to make a safe wellness suggestion." };
  }

  // symptoms -> candidate wellness categories, with a simple vote count
  // per category so more strongly-signaled categories rank higher.
  const categoryVotes = {};
  for (const symptom of symptoms) {
    const categories = SYMPTOM_TO_WELLNESS_CATEGORY[symptom];
    if (!categories) continue;
    for (const cat of categories) {
      categoryVotes[cat] = (categoryVotes[cat] || 0) + 1;
    }
  }

  const rankedCategories = Object.entries(categoryVotes)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  if (rankedCategories.length === 0) {
    return { skip: true, reason: "No matching wellness category for the reported symptoms." };
  }

  const products = await Product.find({ category: { $in: rankedCategories } }).lean();

  // Rank products by the position of their category in rankedCategories
  const categoryRank = new Map(rankedCategories.map((c, i) => [c, i]));
  products.sort((a, b) => categoryRank.get(a.category) - categoryRank.get(b.category));

  return { skip: false, products: products.slice(0, 6) };
}

module.exports = { getRecommendations, SYMPTOM_TO_WELLNESS_CATEGORY };
