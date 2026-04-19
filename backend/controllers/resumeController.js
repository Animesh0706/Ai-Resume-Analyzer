const { PDFParse } = require("pdf-parse");
const Resume = require("../models/Resume");
const analyzeResume = require("../services/aiService");
const {
  createContentHash,
  normalizeResumeText
} = require("../utils/resumeAnalysisUtils");

const ANALYSIS_VERSION = analyzeResume.ANALYSIS_VERSION || 1;

const findExistingAnalysis = async (resumeText) => {
  const normalizedText = normalizeResumeText(resumeText);
  const contentHash = createContentHash(normalizedText);

  const existingResume = await Resume.findOne({
    contentHash,
    analysisVersion: ANALYSIS_VERSION
  }).sort({ createdAt: -1 });

  return {
    normalizedText,
    contentHash,
    existingAnalysis: existingResume?.analysis || null
  };
};

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text required" });
    }

    const {
      normalizedText,
      contentHash,
      existingAnalysis
    } = await findExistingAnalysis(resumeText);

    const analysis = existingAnalysis || await analyzeResume(normalizedText);

    const newResume = await Resume.create({
      user: req.user.userId,
      contentHash,
      analysisVersion: ANALYSIS_VERSION,
      resumeText: normalizedText,
      analysis
    });

    res.json({
      success: true,
      message: "Analysis saved",
      analysisSource: existingAnalysis ? "cached" : "generated",
      data: newResume
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.analyzeResumeFromFile = async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    parser = new PDFParse({ data: req.file.buffer });
    const data = await parser.getText();
    const resumeText = data.text?.trim();

    if (!resumeText) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    const {
      normalizedText,
      contentHash,
      existingAnalysis
    } = await findExistingAnalysis(resumeText);

    const analysis = existingAnalysis || await analyzeResume(normalizedText);

    const newResume = await Resume.create({
      user: req.user.userId,
      contentHash,
      analysisVersion: ANALYSIS_VERSION,
      resumeText: normalizedText,
      fileName: req.file.originalname,
      analysis
    });

    res.json({
      success: true,
      message: "File analyzed successfully",
      analysisSource: existingAnalysis ? "cached" : "generated",
      data: newResume
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (parser) {
      await parser.destroy();
    }
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

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.userId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
