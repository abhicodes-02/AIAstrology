"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";
import {
  getKpAyanamsa,
  getKpDetailsForLongitude,
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

  const monthNames = [
    "Month 1 (Solar Return Initiation)",
    "Month 2 (Resource Alignment)",
    "Month 3 (Action & Endeavor)",
    "Month 4 (Domestic Equilibrium)",
    "Month 5 (Creative & Speculative Vitality)",
    "Month 6 (Professional Diligence)",
    "Month 7 (Relational & Partnership Gateway)",
    "Month 8 (Transformational Transition)",
    "Month 9 (Higher Insight & Destiny Direction)",
    "Month 10 (Status & Authority Zenith)",
    "Month 11 (Fulfillment of Desires & Gains)",
    "Month 12 (Year-End Synthesis & Reflection)"
  ];

  let kpVarshaphalData = {
    age,
    solarReturnSign: natalSunKp.signName,
    solarReturnStarLord: natalSunKp.starLord,
    solarReturnSubLord: natalSunKp.subLord,
    varshaphal: `In KP (Krishnamurti Paddhati) Astrology, this annual solar return cycle is governed by your natal Sun's KP Sub-Lord (${natalSunKp.subLord}) and Star Lord (${natalSunKp.starLord}). In KP principles, the Sun is the cosmic source of vitality, while its Sub-Lord acts as the definitive arbiter of whether major yearly efforts achieve decisive fruition. Over this upcoming 12-month solar cycle, your primary professional, financial, and personal initiatives will undergo systematic elevation. By leveraging the analytical discernment of ${natalSunKp.subLord}, obstacles will convert into enduring milestones.`,
    monthlyPredictions: monthNames.map((mName, i) => ({
      month: mName,
      theme: i % 2 === 0 ? "Strategic Progression" : "Consolidation & Balance",
      prediction: `Under the governing influence of KP transit configurations during this phase, focus on calculated execution. The active Star Lord channels focused mental energy into essential responsibilities.`,
      career: `Professional clarity improves. High-impact tasks undertaken during this monthly phase yield solid recognition from superiors and clients.`,
      relationships: `Interpersonal warmth and clear dialogue dissolve mutual doubts, fostering deepened companionship and mutual support.`
    }))
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
2. Detail how the Sub-Lord filters the planetary influences across the 12 calendar months.
3. Provide a full 12-month breakdown with theme, prediction, career, and relationships for each month.

Return ONLY a JSON object:
{
  "varshaphal": "A massive, deeply analyzed Yearly Varshaphal (Annual Prediction) detailing the major themes, opportunities, health, and challenges for the upcoming year based on KP Sub-Lord rules.",
  "monthlyPredictions": [
    {
      "month": "Month 1 (e.g. Month 1)",
      "theme": "A 3-5 word theme for this month",
      "prediction": "The main detailed paragraph describing the astrological KP sub-lord transits and overall energy.",
      "career": "Specific career and financial prediction for this month.",
      "relationships": "Specific love and family prediction for this month."
    }
    // Repeat for all 12 months
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
            if (parsed.varshaphal) kpVarshaphalData.varshaphal = parsed.varshaphal;
            if (Array.isArray(parsed.monthlyPredictions) && parsed.monthlyPredictions.length > 0) {
              kpVarshaphalData.monthlyPredictions = parsed.monthlyPredictions;
            }
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
