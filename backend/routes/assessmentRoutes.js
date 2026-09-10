const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  createAssessment,
  getHistory,
  getAssessmentById,
} = require("../controllers/assessmentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

router.use(protect);

router.post(
  "/",
  [
    body("symptoms").optional().isArray().withMessage("Symptoms must be a list."),
    body("freeText").optional().isString().isLength({ max: 2000 }),
    body("age").optional().isInt({ min: 0, max: 120 }),
    body("gender").optional().isIn(["male", "female", "other", "prefer_not_to_say"]),
    body("duration").optional().isString().isLength({ max: 100 }),
    body("severity").optional().isIn(["mild", "moderate", "severe"]),
  ],
  validate,
  createAssessment
);

router.get("/history", getHistory);
router.get("/:id", getAssessmentById);

module.exports = router;
