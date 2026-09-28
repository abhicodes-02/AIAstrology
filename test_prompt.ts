import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testPrompt() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Act as a master traditional Vedic Astrologer. A seeker named Test has Lagna Aries. 
  Write in clear, simple language that anyone can easily understand. Aim for exactly 150-200 words per field (detailed but fast to generate). Return ONLY a valid JSON object with these exact keys:
  {
    "reading": "A deeply realistic opening analysis.",
    "career": "A grounded, deep-dive evaluation of their professional journey."
  }`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    console.log("Raw output:");
    console.log(response.text);
    const cleanedText = response.text.replace(/\`\`\`json\n?|\`\`\`/g, '').trim();
    JSON.parse(cleanedText);
    console.log("JSON Parse Success!");
  } catch (err) {
    console.error("Error:", err);
  }
}

testPrompt();
