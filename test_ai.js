require("dotenv").config({ path: ".env.local" });
const { GoogleGenAI } = require("@google/genai");

async function run() {
  console.log("Testing Gemini API Key...");
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY found in .env.local");
    return;
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Test prompt: return {"status": "ok"} as JSON.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    console.log("Response:", response.text);
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.status) console.error("Status:", err.status);
    if (err.details) console.error("Details:", err.details);
  }
}

run();
