const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, age, gender } = req.body;

    const existing = await User.findOne({ email: email?.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const user = await User.create({ name, email, password, age, gender });
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = signToken(user._id);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    res.json({ user: req.user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
