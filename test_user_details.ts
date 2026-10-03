import { fetchAIKpKundliData } from "./src/app/actions/generateKpKundli";

async function runTest() {
  try {
    console.log("Starting test for Abhimannyu Choudhury (Working Professional, Committed)...");
    
    const data = await fetchAIKpKundliData(
      "Abhimannyu Choudhury",
      "2002-01-09",
      "09:30",
      "Maheshtala, Kolkata",
      "working professional",
      "committed"
    );

    console.log("\n==== CAREER PREDICTION ====\n", data.career);
    console.log("\n==== MARRIAGE / RELATIONSHIP PREDICTION ====\n", data.relationships);
    console.log("\n==== BREAKTHROUGHS TIMELINE ====\n", data.breakthroughs);

    let compliance = {
      way1: "PASS", 
      way2: "PASS",
      way3: "PASS", 
      way4: "PASS", 
      way5: "PASS", 
    };

    if (data.breakthroughs.includes("Internship") || data.career.includes("Internship")) compliance.way1 = "FAIL (Mentioned Internship for Working Professional)";
    if (!data.breakthroughs.includes("2026") && !data.breakthroughs.includes("2027")) compliance.way3 = "FAIL (Missed immediate years)";
    if (data.relationships.includes("divorce") || data.relationships.includes("Divorce")) compliance.way5 = "FAIL (Mentioned divorce)";
    
    console.log("\n==== TEST COMPLIANCE RESULTS ====");
    console.log(compliance);
    
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
