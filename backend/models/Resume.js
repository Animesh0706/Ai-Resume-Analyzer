const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  contentHash: {
    type: String,
    index: true,
  },
  analysisVersion: {
    type: Number,
    default: 1,
    index: true,
  },
  resumeText: String,
  analysis: {
    skills: [String],
    scoreBreakdown: {
      formatting: Number,
      contentQuality: Number,
      impact: Number,
      skillsMatch: Number,
      professionalism: Number,
    },
    deduction: Number,
    score: Number,
    suggestions: [String],
  }
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
