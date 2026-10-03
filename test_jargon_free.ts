import dotenv from "dotenv"; dotenv.config({path: ".env.local"}); import { fetchAIKpKundliData as generateKpKundli } from "./test_engine";

async function runTest() {
  try {
    console.log("Starting jargon-free test for Shimli (Career Break/Student, Committed)...");
    
    const data = await generateKpKundli(
      "Shimli",
      "1998-11-30",
      "00:03",
      "Barrackpore",
      "career_break_student",
      "committed"
    );

    if (data) {
      console.log("\n=== JARGON-FREE BREAKTHROUGHS ===");
      console.log(data.breakthroughs);
      console.log("\n=== JARGON-FREE CAREER READING ===");
      console.log(data.career);
    } else {
      console.error("Failed to generate data.");
    }
  } catch (error) {
    console.error("Test Error:", error);
  }
}

runTest();
