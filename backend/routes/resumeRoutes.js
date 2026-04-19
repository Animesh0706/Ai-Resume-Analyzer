const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  analyzeResume,
  getHistory
} = require("../controllers/resumeController");

router.post("/analyze", authMiddleware, analyzeResume);
router.get("/history", authMiddleware, getHistory);

module.exports = router;