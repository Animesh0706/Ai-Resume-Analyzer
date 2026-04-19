require("dotenv").config();
const axios = require("axios");

const analyzeResume = async (resumeText) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Return ONLY JSON:
          {
            "skills": [],
            "score": number (0-100),
            "suggestions": []
          }

          Resume:
          ${resumeText}`
        }
      ]
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

  return JSON.parse(cleanJson);
};

module.exports = analyzeResume;