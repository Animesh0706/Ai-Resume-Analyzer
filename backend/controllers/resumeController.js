const Resume = require("../models/Resume");
const analyzeResume = require("../services/aiService");

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text required" });
    }

    // AI Analysis
    const analysis = await analyzeResume(resumeText);

    // Save in DB
    const newResume = await Resume.create({
      user: req.user.userId,
      resumeText,
      analysis
    });

    res.json({
      message: "Analysis saved",
      data: newResume
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get history
exports.getHistory = async (req, res) => {
  const history = await Resume.find({ user: req.user.userId })
    .sort({ createdAt: -1 });

  res.json(history);
};