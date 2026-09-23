import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config({ path: ".env.local" });

async function testModel(modelName: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: modelName,
      contents: "Say hello",
    });
    console.log(`[${modelName}] Success:`, res.text);
  } catch (err: any) {
    console.error(`[${modelName}] Error:`, err.message);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-1.5-pro");
  await testModel("gemini-2.5-flash");
}
run();
