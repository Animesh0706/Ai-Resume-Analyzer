require("dotenv").config();
const axios = require("axios");

const ANALYSIS_VERSION = 2;

const asTrimmedString = (value) => String(value || "").trim();

const normalizeInsightItems = (items, fallbackTitle) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        const text = asTrimmedString(item);
        if (!text) return null;
        return {
          title: `${fallbackTitle} ${index + 1}`,
          description: text
        };
      }

      if (!item || typeof item !== "object") return null;

      const title = asTrimmedString(
        item.title || item.heading || item.name || item.label
      );
      const description = asTrimmedString(
        item.description || item.detail || item.summary || item.reason || item.value
      );

      if (!title && !description) return null;

      return {
        title: title || `${fallbackTitle} ${index + 1}`,
        description
      };
    })
    .filter(Boolean)
    .slice(0, 5);
};

const normalizeMetricItems = (items, keyField, valueField) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const key = asTrimmedString(
        item[keyField] || item.term || item.keyword || item.category || item.name
      );
      const value = Number(
        item[valueField] || item.density || item.relevance || item.score
      );

      if (!key) return null;

      return {
        [keyField]: key,
        [valueField]: Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0
      };
    })
    .filter(Boolean);
};

const normalizeOmissions = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        const keyword = asTrimmedString(item);
        if (!keyword) return null;
        return { keyword, description: "" };
      }

      if (!item || typeof item !== "object") return null;

      const keyword = asTrimmedString(item.keyword || item.term || item.name);
      const description = asTrimmedString(
        item.description || item.detail || item.reason
      );

      if (!keyword && !description) return null;

      return {
        keyword: keyword || "Missing Keyword",
        description
      };
    })
    .filter(Boolean)
    .slice(0, 5);
};

const normalizeAnalysis = (rawAnalysis = {}) => {
  const safeSkills = Array.isArray(rawAnalysis.skills)
    ? rawAnalysis.skills
        .map((skill) => String(skill).trim())
        .filter(Boolean)
        .slice(0, 15)
    : [];

  const safeSuggestions = normalizeInsightItems(
    rawAnalysis.suggestions || rawAnalysis.refinementAreas || rawAnalysis.improvements,
    "Improvement"
  );

  const safeKeyStrengths = normalizeInsightItems(
    rawAnalysis.keyStrengths || rawAnalysis.strengths || rawAnalysis.highlights,
    "Strength"
  );

  const km = rawAnalysis.keywordMetrics || rawAnalysis.keywords || {};
  const safeKeywordMetrics = {
    optimizationDensity: Math.max(0, Math.min(100, Number(km.optimizationDensity) || 0)),
    hardSkillsFocus: normalizeMetricItems(
      km.hardSkillsFocus || km.skillCategories,
      "category",
      "density"
    ).slice(0, 5),
    identifiedKeywords: normalizeMetricItems(
      km.identifiedKeywords || km.topKeywords,
      "keyword",
      "density"
    ).slice(0, 10),
    criticalOmissions: normalizeOmissions(km.criticalOmissions || km.missingKeywords)
  };

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
    suggestions: safeSuggestions,
    keyStrengths: safeKeyStrengths,
    keywordMetrics: safeKeywordMetrics
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
            "skills": ["string"],
            "scoreBreakdown": {
              "formatting": number,
              "contentQuality": number,
              "impact": number,
              "skillsMatch": number,
              "professionalism": number
            },
            "deduction": number,
            "score": number,
            "suggestions": [{"title": "string", "description": "string"}],
            "keyStrengths": [{"title": "string", "description": "string"}],
            "keywordMetrics": {
              "optimizationDensity": number,
              "hardSkillsFocus": [{"category": "string", "density": number}],
              "identifiedKeywords": [{"keyword": "string", "density": number}],
              "criticalOmissions": [{"keyword": "string", "description": "string"}]
            }
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
          - Always return at least 3 suggestions and at least 3 keyStrengths unless the resume text is almost empty.
          - Suggestions must be specific, actionable areas with a clear title and description.
          - Key Strengths should highlight the candidate's core narrative strengths and each item must include both title and description.
          - keywordMetrics.optimizationDensity should be a percentage calculation of resonant keywords.
          - hardSkillsFocus should categorize main skills (e.g., Architecture, Leadership) with a density out of 100.
          - criticalOmissions should suggest missing industry keywords that would elevate this resume.

          Resume:
          \${resumeText}`
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
