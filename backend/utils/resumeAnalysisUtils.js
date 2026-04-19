const crypto = require("crypto");

const normalizeResumeText = (resumeText = "") =>
  String(resumeText)
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const createContentHash = (resumeText) =>
  crypto.createHash("sha256").update(normalizeResumeText(resumeText)).digest("hex");

module.exports = {
  createContentHash,
  normalizeResumeText
};
