const mongoose = require("mongoose");

const possibleConditionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    probability: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  symptoms: { type: [String], default: [] },
  freeText: { type: String, maxlength: 2000 },
  age: { type: Number, min: 0, max: 120 },
  gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
  duration: { type: String }, // e.g. "3 days", collected as free text from the form
  severity: { type: String, enum: ["mild", "moderate", "severe"] },

  prediction: {
    possibleConditions: { type: [possibleConditionSchema], default: [] },
    importantSymptoms: { type: [String], default: [] },
    modelExplanationNote: { type: String },
  },

  riskLevel: {
    type: String,
    enum: ["LOW", "MODERATE", "HIGH", "URGENT", "INSUFFICIENT_INFO"],
    required: true,
  },
  redFlags: {
    isUrgent: { type: Boolean, default: false },
    triggeredBy: { type: [String], default: [] },
  },
  progressionGuidance: {
    whatToMonitor: { type: [String], default: [] },
    whenToSeekHelp: { type: [String], default: [] },
  },

  recommendedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  recommendationsSkippedReason: { type: String }, // e.g. "URGENT risk" or "insufficient information"

  modelVersion: { type: String, default: "1.0.0" },
  createdAt: { type: Date, default: Date.now },
});

assessmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Assessment", assessmentSchema);
