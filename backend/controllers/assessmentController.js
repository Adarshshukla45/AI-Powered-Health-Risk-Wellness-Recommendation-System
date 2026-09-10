const Assessment = require("../models/Assessment");
const { getPrediction } = require("../services/mlServiceClient");
const { getRecommendations } = require("../services/recommendationEngine");

async function createAssessment(req, res, next) {
  try {
    const { symptoms, freeText, age, gender, duration, severity } = req.body;

    if ((!symptoms || symptoms.length === 0) && !freeText) {
      return res.status(400).json({
        message: "Please provide at least one symptom or a description of how you're feeling.",
      });
    }

    const prediction = await getPrediction({
      symptoms,
      freeText,
      age,
      gender,
    });

    const normalizedSymptoms = prediction.normalized_symptoms || symptoms || [];
    const riskLevel = prediction.risk_level;

    const recommendationResult = await getRecommendations({
      symptoms: normalizedSymptoms,
      riskLevel,
    });

    const assessment = await Assessment.create({
      userId: req.user._id,
      symptoms: normalizedSymptoms,
      freeText,
      age,
      gender,
      duration,
      severity,
      prediction: {
        possibleConditions: (prediction.possible_conditions || []).map((c) => ({
          name: c.name,
          probability: c.probability,
        })),
        importantSymptoms: prediction.important_symptoms || [],
        modelExplanationNote: prediction.model_explanation_note || "",
      },
      riskLevel,
      redFlags: {
        isUrgent: prediction.red_flags?.is_urgent || false,
        triggeredBy: prediction.red_flags?.triggered_by || [],
      },
      progressionGuidance: {
        whatToMonitor: prediction.progression_guidance?.what_to_monitor || [],
        whenToSeekHelp: prediction.progression_guidance?.when_to_seek_help || [],
      },
      recommendedProductIds: recommendationResult.skip
        ? []
        : recommendationResult.products.map((p) => p._id),
      recommendationsSkippedReason: recommendationResult.skip ? recommendationResult.reason : undefined,
      modelVersion: "1.0.0",
    });

    res.status(201).json({
      id: assessment._id,
      riskLevel: assessment.riskLevel,
      prediction: assessment.prediction,
      redFlags: assessment.redFlags,
      progressionGuidance: assessment.progressionGuidance,
      wellnessProducts: recommendationResult.skip ? [] : recommendationResult.products,
      recommendationsSkippedReason: assessment.recommendationsSkippedReason,
      createdAt: assessment.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const assessments = await Assessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("-freeText")
      .limit(100);
    res.json({ assessments });
  } catch (err) {
    next(err);
  }
}

async function getAssessmentById(req, res, next) {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id }).populate(
      "recommendedProductIds"
    );
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }
    res.json({ assessment });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAssessment, getHistory, getAssessmentById };
