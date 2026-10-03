import dotenv from "dotenv";
dotenv.config({path: ".env.local"});
import { fetchAIKpKundliData as generateKpKundli } from "./test_engine";

async function runBTR() {
  console.log("Starting BTR sequence for Shimli...");
  
  for (let m = 5; m <= 10; m++) {
    const timeStr = `00:${m < 10 ? '0'+m : m}`;
    console.log(`\n=============================\nTesting Time: ${timeStr}\n=============================`);
    try {
      const data = await generateKpKundli(
        "Shimli",
        "1998-11-30",
        timeStr,
        "Barrackpore",
        "career_break_student",
        "committed"
      );
      if (data && data.breakthroughs) {
        console.log(data.breakthroughs);
      }
    } catch (e) {
      console.log(`Error at ${timeStr}:`, e);
    }
  }
}

runBTR();

