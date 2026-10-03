import { NextResponse } from "next/server";
import { fetchAIKpKundliData } from "../../actions/generateKpKundli";

export async function GET() {
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
    }
  ];

  const results = [];

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    try {
      const data = await fetchAIKpKundliData(s.name, s.dob, s.tob, s.pob, s.lifeStage, s.relationshipStatus);
      
      const hasBr = data.breakthroughs.includes("<br>");
      const hasWeek = data.breakthroughs.toLowerCase().includes("week");
      
      results.push({
        name: s.name,
        status: "PASS",
        hasHtmlTags: hasBr,
        hasExactWeekPinpointing: hasWeek,
        breakthroughSnippet: data.breakthroughs.substring(0, 1000)
      });

    } catch (e: any) {
      results.push({
        name: s.name,
        status: "FAIL",
        error: e.message
      });
    }
  }

  return NextResponse.json(results);
}
