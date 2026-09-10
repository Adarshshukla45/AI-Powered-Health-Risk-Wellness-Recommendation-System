const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Per project spec: store only name/email/password/age/gender/createdAt.
 * Do NOT add fields for medical history, symptoms, or diagnoses here —
 * that data belongs to Assessment documents, referenced by userId, so a
 * user's identity record stays minimal.
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  password: { type: String, required: true, minlength: 8, select: false },
  age: { type: Number, min: 0, max: 120 },
  gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    age: this.age,
    gender: this.gender,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
