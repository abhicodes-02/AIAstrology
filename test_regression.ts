import { fetchAIKpKundliData } from "./src/app/actions/generateKpKundli";

async function runTests() {
  console.log("Starting Regression Tests for KP Kundli (Way 1 & Way 2)...\n");

  const samples = [
    {
      name: "Student (Age 20)",
      dob: "2006-05-10",
      tob: "14:30",
      pob: "Kolkata, India",
      lifeStage: "student",
      relationshipStatus: "single"
    },
    {
      name: "Fresher (Age 24)",
      dob: "2002-08-15",
      tob: "09:15",
      pob: "Delhi, India",
      lifeStage: "fresher",
      relationshipStatus: "single"
    },
    {
      name: "Employed (Age 32)",
      dob: "1994-11-20",
      tob: "18:45",
      pob: "Mumbai, India",
      lifeStage: "employed",
      relationshipStatus: "married"
    },
    {
      name: "Business (Age 45)",
      dob: "1981-02-25",
      tob: "04:10",
      pob: "Bangalore, India",
      lifeStage: "business",
      relationshipStatus: "married"
    }
  ];

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    console.log(`\n--- RUNNING TEST ${i + 1}: ${s.name} ---`);
    try {
      const data = await fetchAIKpKundliData(s.name, s.dob, s.tob, s.pob, s.lifeStage, s.relationshipStatus);
      
      console.log(`[OK] Generated Data for ${s.name}`);
      console.log(`\n--- BREAKTHROUGHS (Snippet) ---`);
      // Print just the first 500 characters of the breakthroughs
      console.log(data.breakthroughs.substring(0, 1000));
      
      // Basic Assertions
      if (data.breakthroughs.includes("<br>")) {
        console.error(`[FAIL] Found <br> tags in ${s.name} output!`);
      } else {
        console.log(`[PASS] No HTML tags found.`);
      }

      if (data.breakthroughs.toLowerCase().includes("week")) {
        console.log(`[PASS] Found exact week pinpointing (Way 2 working).`);
      } else {
        console.warn(`[WARN] Did not find 'week' keyword in breakthroughs. AI might have missed Hot Date pinpointing.`);
      }

    } catch (e) {
      console.error(`[FAIL] Error generating data for ${s.name}:`, e);
    }
  }
}

// Load env vars
require("dotenv").config({ path: ".env.local" });
runTests();
