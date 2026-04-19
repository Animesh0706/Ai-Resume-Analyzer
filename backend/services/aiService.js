require("dotenv").config();
const axios = require("axios");

const ANALYSIS_VERSION = 1;

const normalizeAnalysis = (rawAnalysis = {}) => {
  const safeSkills = Array.isArray(rawAnalysis.skills)
    ? rawAnalysis.skills
        .map((skill) => String(skill).trim())
        .filter(Boolean)
        .slice(0, 15)
    : [];

  const safeSuggestions = Array.isArray(rawAnalysis.suggestions)
    ? rawAnalysis.suggestions
        .map((suggestion) => String(suggestion).trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const breakdown = rawAnalysis.scoreBreakdown || {};
  const formatting = Number(breakdown.formatting) || 0;
  const contentQuality = Number(breakdown.contentQuality) || 0;
  const impact = Number(breakdown.impact) || 0;
  const skillsMatch = Number(breakdown.skillsMatch) || 0;
  const professionalism = Number(breakdown.professionalism) || 0;
  const deduction = Number(rawAnalysis.deduction) || 0;

  const safeBreakdown = {
    formatting: Math.max(0, Math.min(20, Math.round(formatting))),
    contentQuality: Math.max(0, Math.min(25, Math.round(contentQuality))),
    impact: Math.max(0, Math.min(20, Math.round(impact))),
    skillsMatch: Math.max(0, Math.min(20, Math.round(skillsMatch))),
    professionalism: Math.max(0, Math.min(15, Math.round(professionalism)))
  };
  const safeDeduction = Math.max(0, Math.min(20, Math.round(deduction)));

  const weightedScore = Math.round(
    safeBreakdown.formatting +
      safeBreakdown.contentQuality +
      safeBreakdown.impact +
      safeBreakdown.skillsMatch +
      safeBreakdown.professionalism -
      safeDeduction
  );

  const boundedScore = Math.max(0, Math.min(100, weightedScore));

  return {
    skills: safeSkills,
    scoreBreakdown: safeBreakdown,
    deduction: safeDeduction,
    score: boundedScore,
    suggestions: safeSuggestions
  };
};

const analyzeResume = async (resumeText) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a strict ATS and recruiter resume evaluator.
Score conservatively and only reward evidence that is explicitly present in the resume.
Do not guess missing experience, missing impact, or missing formatting quality.
Most resumes should score in the 45-75 range.
Scores above 80 should be rare and reserved for resumes with clear quantified impact, strong structure, relevant skills, and polished writing.
If the resume is vague, generic, repetitive, weakly formatted, or lacks measurable achievements, lower the score accordingly.
Return valid JSON only.`
        },
        {
          role: "user",
          content: `Return ONLY JSON:
          {
            "skills": [],
            "scoreBreakdown": {
              "formatting": number,
              "contentQuality": number,
              "impact": number,
              "skillsMatch": number,
              "professionalism": number
            },
            "deduction": number,
            "score": number,
            "suggestions": []
          }

          Use this strict scoring rubric:
          - formatting: 0-20
            Evaluate section clarity, readability, ATS-friendly structure, and consistency.
          - contentQuality: 0-25
            Evaluate relevance, clarity, completeness, and strength of bullet points.
          - impact: 0-20
            Reward quantified achievements, ownership, and outcome-driven statements.
            Give a low score if bullets are generic or lack metrics/results.
          - skillsMatch: 0-20
            Reward role-relevant technical/domain skills explicitly mentioned in the resume.
            Do not reward assumed skills.
          - professionalism: 0-15
            Evaluate grammar, tone, spelling, and overall polish.
          - deduction: 0-20
            Apply deductions for weak or missing sections, vague claims, repeated wording,
            poor formatting, missing measurable results, very short content, or obvious ATS issues.

          Scoring bands:
          - 0-39: very weak resume
          - 40-54: below average, major improvements needed
          - 55-69: average to decent, but still missing important strengths
          - 70-79: strong resume
          - 80-89: excellent resume, should be uncommon
          - 90-100: exceptional, almost never use unless the resume is clearly outstanding

          Additional rules:
          - Calculate "score" as the sum of the five category scores minus deduction.
          - Do not inflate scores to be nice.
          - If there are no quantified achievements, the impact score should usually stay below 10.
          - If the resume is generic or thin, keep the total score below 70.
          - If formatting/content is merely acceptable, do not award near-maximum points.
          - Suggestions must be specific, actionable, and based on actual weaknesses in the resume.

          Resume:
          ${resumeText}`
        }
      ],
      temperature: 0
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const raw = response.data.choices[0].message.content;

  // Clean markdown code blocks if present
  let cleanJson = raw.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  return normalizeAnalysis(JSON.parse(cleanJson));
};

analyzeResume.ANALYSIS_VERSION = ANALYSIS_VERSION;

module.exports = analyzeResume;
