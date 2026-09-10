const express = require("express");
const { body, validationResult } = require("express-validator");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("A valid email is required."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("age").optional().isInt({ min: 0, max: 120 }).withMessage("Age must be between 0 and 120."),
    body("gender").optional().isIn(["male", "female", "other", "prefer_not_to_say"]),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("A valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.get("/me", protect, me);

module.exports = router;
