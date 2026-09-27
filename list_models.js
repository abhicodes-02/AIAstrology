require("dotenv").config({ path: ".env.local" });
const { GoogleGenAI } = require("@google/genai");

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.list();
  const models = [];
  for await (const m of response) {
     models.push(m.name);
  }
  console.log(models);
}
run();
