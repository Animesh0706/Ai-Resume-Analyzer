const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  analyzeResume,
  analyzeResumeFromFile,
  getHistory,
  getResumeById
} = require("../controllers/resumeController");

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"), // field name
  analyzeResumeFromFile
);

router.post("/analyze", authMiddleware, analyzeResume);
router.get("/history", authMiddleware, getHistory);
router.get("/:id", authMiddleware, getResumeById);

module.exports = router;