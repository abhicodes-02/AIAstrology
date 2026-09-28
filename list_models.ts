import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function checkModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const models = await ai.models.list();
    const modelNames = [];
    for await (const model of models) {
      if (model.name.includes('gemini')) {
        modelNames.push(model.name);
      }
    }
    console.log("AVAILABLE MODELS:", modelNames);
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

checkModels();
