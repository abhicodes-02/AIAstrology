import { fetchAIKpKundliData } from "./src/app/actions/generateKpKundli";

async function runTest() {
  try {
    console.log("Starting jargon-free regression test for Abhimannyu (Fresher, Committed)...");
    
    const data = await fetchAIKpKundliData(
      "Abhimannyu",
      "2002-01-09",
      "09:35",
      "Kolkata",
      "Fresher",
      "Committed"
    );

    if (data) {
      console.log("\n=== JARGON-FREE BREAKTHROUGHS ===");
      console.log(JSON.stringify(data.breakthroughs, null, 2));
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
