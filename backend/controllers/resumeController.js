const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const analyzeResume = require("../services/aiService");

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text required" });
    }

    const analysis = await analyzeResume(resumeText);

    const newResume = await Resume.create({
      user: req.user.userId,
      resumeText,
      analysis
    });

    res.json({
      success: true,
      message: "Analysis saved",
      data: newResume
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.analyzeResumeFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    const analysis = await analyzeResume(resumeText);

    const newResume = await Resume.create({
      user: req.user.userId,
      resumeText,
      analysis
    });

    res.json({
      success: true,
      message: "File analyzed successfully",
      data: newResume
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Resume.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};