"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";
import {
  getKpAyanamsa,
  getKpDetailsForLongitude,
  KpCusp,
  formatDMS
} from "@/lib/kpAstrology";

export async function fetchAIKpVarshaphalData(
  name: string,
  dob: string,
  tob: string,
  pob: string
) {
  let lat = 22.5726;
  let lon = 88.3639;
  let countryCode = "in";
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1&addressdetails=1`,
      { headers: { "User-Agent": "AIAstrology/1.0" } }
    );
    const geoData = await geoRes.json();
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
      countryCode = geoData[0].address?.country_code || "";
    }
  } catch (err) {
    console.error("Geocoding failed for KP Varshaphal:", err);
  }

  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);

  const birthAyanamsa = getKpAyanamsa(year, month, day);
  const birthChart = celestine.calculateChart(
    { year, month, day, hour, minute, latitude: lat, longitude: lon, timezone },
    { includeNodes: "true", houseSystem: "placidus" }
  );

  const natalSun = birthChart.planets.find((p: any) => p.name === "Sun");
  const siderealNatalSunLon = natalSun ? ((natalSun.longitude - birthAyanamsa + 360) % 360) : 0;
  const natalSunKp = getKpDetailsForLongitude(siderealNatalSunLon);

  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  let kpVarshaphalData = {
    age,
    solarReturnSign: natalSunKp.signName,
    solarReturnStarLord: natalSunKp.starLord,
    solarReturnSubLord: natalSunKp.subLord,
    varshaphal: `In KP Astrology Varshaphal, this annual solar cycle is calibrated through your natal Sun's KP Sub-Lord (${natalSunKp.subLord}) and Star Lord (${natalSunKp.starLord}). The sub-lord dictates the primary accomplishments and structural shifts over the next 12 months. Your efforts will crystallize into solid career milestones, reinforced by disciplined execution and clear strategic decisions.`,
    monthlyPredictions: [
      { month: "Quarter 1 (Months 1-3)", prediction: `Activated under ${natalSunKp.starLord} Star Lord: Excellent period for initiating long-delayed projects, professional expansion, and expanding influential networks.` },
      { month: "Quarter 2 (Months 4-6)", prediction: `Governed by financial significators: Favorable cash flow with strategic re-investments. Ensure contracts are reviewed with meticulous attention.` },
      { month: "Quarter 3 (Months 7-9)", prediction: `Sub-Lord shift activates personal evolution: Harmonic interpersonal bonds, heightened creative productivity, and rewarding travels.` },
      { month: "Quarter 4 (Months 10-12)", prediction: `Fructification and rewards: Harvest of year-long ventures, heightened authority, and solid domestic contentment.` }
    ]
  };

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a Grand Master of KP (Krishnamurti Paddhati) Astrology.
Generate an in-depth KP Varshaphal (Annual Solar Return Forecast) for ${name}, born ${dob} at ${tob} in ${pob}.
Current Year of Life / Age: ${age} years old.
Natal Sun is at ${natalSunKp.degFormatted} in ${natalSunKp.signName} | Star Lord: ${natalSunKp.starLord} | Sub-Lord: ${natalSunKp.subLord}.

Analyze this upcoming year using strict KP Astrology methodology:
1. Examine the Cuspal Sub-Lord combinations for major milestones (Career: 2-6-10-11, Wealth: 2-11, Stability: 1-4-9).
2. Detail how the Sub-Lord filters the planetary influences across the 12 months.
3. Provide a breakdown of 4 quarters / key monthly periods.

Return ONLY a JSON object:
{
  "varshaphal": "Comprehensive, technical, and insightful annual forecast based on KP Sub-Lord principles.",
  "monthlyPredictions": [
    { "month": "Q1: Month 1-3", "prediction": "Detailed KP prediction for this period." },
    { "month": "Q2: Month 4-6", "prediction": "Detailed KP prediction for this period." },
    { "month": "Q3: Month 7-9", "prediction": "Detailed KP prediction for this period." },
    { "month": "Q4: Month 10-12", "prediction": "Detailed KP prediction for this period." }
  ]
}`;

      const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      for (const m of models) {
        try {
          const res = await ai.models.generateContent({
            model: m,
            contents: prompt,
            config: { temperature: 0.7, responseMimeType: "application/json" }
          });
          if (res.text) {
            const parsed = JSON.parse(res.text.replace(/```json\n?|```/g, "").trim());
            kpVarshaphalData = { ...kpVarshaphalData, ...parsed };
            break;
          }
        } catch (e: any) {
          console.warn(`KP Varshaphal AI ${m} failed:`, e.message);
        }
      }
    } catch (err) {
      console.error("KP Varshaphal generation failed:", err);
    }
  }

  return kpVarshaphalData;
}
