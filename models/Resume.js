const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resumeText: String,
  analysis: {
    skills: [String],
    score: Number,
    suggestions: [String],
  }
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);