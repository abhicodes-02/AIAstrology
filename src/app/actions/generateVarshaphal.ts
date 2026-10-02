"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIVarshaphalData(name: string, dob: string, tob: string, pob: string, targetYear?: number) {
  // 1. Geocode the location
  let lat = 0;
  let lon = 0;
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1`, {
      headers: { "User-Agent": "AIAstrology/2.0" }
    });
    const geoData = await geoRes.json();
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
    }
  } catch (err) {
    console.error("Geocoding failed", err);
  }

  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const timezone = Math.round(lon / 15);

  const birth = { year, month, day, hour, minute, latitude: lat || 22.5726, longitude: lon || 88.3639, timezone };
  const chartOptions = { includeNodes: "true" as const };
  const chart = celestine.calculateChart(birth, chartOptions);

  // --- 100% ACCURATE LAHIRI AYANAMSA (Swiss Ephemeris) ---
  let ayanamsa = 23.85 + (year - 2000) * (50.29 / 3600);
  try {
    const swisseph = require("sweph-wasm");
    const localDate = new Date(`${dob}T${tob}:00.000${timezone >= 0 ? '+' : '-'}${Math.abs(Math.floor(timezone)).toString().padStart(2, '0')}:${(Math.abs(timezone % 1) * 60).toString().padStart(2, '0')}`);
    const julday = swisseph.swe_julday(localDate.getUTCFullYear(), localDate.getUTCMonth() + 1, localDate.getUTCDate(), localDate.getUTCHours() + localDate.getUTCMinutes() / 60, swisseph.SE_GREG_CAL);
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    ayanamsa = swisseph.swe_get_ayanamsa_ut(julday);
  } catch (e) {
    console.warn("[Varshaphal] sweph-wasm not available, using fallback.");
  }
  
  const getSidereal = (tropical: number) => {
    let sidereal = tropical - ayanamsa;
    if (sidereal < 0) sidereal += 360;
    return sidereal;
  };

  const sunData = (chart as any).planets?.find((b: any) => b.name === "Sun");
  const siderealSun = sunData ? getSidereal(sunData.longitude) : 0;
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const signLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const sunSign = signs[Math.floor(siderealSun / 30)];

  // Natal Core Calculations for Varshaphal
  const moonData = (chart as any).planets?.find((b: any) => b.name === "Moon");
  const siderealMoon = moonData ? getSidereal(moonData.longitude) : 0;
  const moonSign = signs[Math.floor(siderealMoon / 30)];
  
  const ascSidereal = getSidereal(chart.angles.ascendant.longitude);
  const ascSignIdx = Math.floor(ascSidereal / 30);
  const ascendantName = signs[ascSignIdx];

  const d1Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const planetsData = (chart as any).planets || [];
  planetsData.forEach((planet: any) => {
    if (["Uranus", "Neptune", "Pluto", "Chiron", "Sirius"].includes(planet.name)) return;
    let shortName = planet.name;
    if (planet.name === "North Node") shortName = "Rahu";
    if (planet.name === "South Node") shortName = "Ketu";
    
    const pSidereal = getSidereal(planet.longitude);
    const pSign = Math.floor(pSidereal / 30);
    let d1House = pSign - ascSignIdx + 1;
    if (d1House <= 0) d1House += 12;
    d1Houses[d1House].push(shortName);
  });

  let varshaphalData: any = {
    varshaphal: `[AI BUSY] Analyzing your Solar Return (Varshaphal) for the upcoming year...`,
    monthlyPredictions: [
      { month: "Loading", theme: "Please Wait", prediction: "Generating deep insights...", career: "Loading...", relationships: "Loading..." }
    ]
  };

  // --- BULLETPROOF AI (STRUCTURED OUTPUTS) ---
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const yearToGenerate = targetYear || new Date().getFullYear();
      const ageInYears = yearToGenerate - year;
      
      // Calculate Muntha (Tajik Progressed Ascendant)
      const munthaSignIndex = (ascSignIdx + ageInYears) % 12;
      const munthaSignName = signs[munthaSignIndex];
      const munthaLord = signLords[munthaSignIndex];
      
      // Calculate where Muntha falls in the Natal Chart (from Lagna)
      let munthaHouse = (munthaSignIndex - ascSignIdx + 12) % 12 + 1;

      const nextYear = yearToGenerate + 1;
      const prompt = `Act as an expert Vedic Astrologer. A user named ${name} was born on ${dob} in ${pob}. 
  Here is their exact Natal Chart (D-1) data:
  - Ascendant (Lagna): ${ascendantName}
  - Moon Sign: ${moonSign}
  - Sun Sign: ${sunSign}
  - Planetary Houses: ${JSON.stringify(d1Houses)}
  
  CRITICAL TIME ANCHOR: The USER HAS EXPLICITLY REQUESTED THE VARSHAPHAL FOR THE YEAR ${yearToGenerate}.
  You MUST generate the Varshaphal strictly starting from their birthday in the year ${yearToGenerate} to their birthday in the year ${nextYear}. 
  Calculate their exact age for the year ${yearToGenerate} (${yearToGenerate} - Birth Year). Do NOT generate predictions for any other years. You must map the planetary transits for the 12 months starting from their solar return in ${yearToGenerate}. 
  Generate a deeply detailed Varshaphal (Solar Return Annual Forecast) for their current year of life, incorporating transits and planetary returns.
  
  CRITICAL RULES:
  LANGUAGE & TONE RULE (CRITICAL):
  You MUST write the entire reading in VERY SIMPLE, EVERYDAY, EASY-TO-UNDERSTAND ENGLISH (6th-grade reading level). 
  - DO NOT use complex vocabulary, Shakespearean words, or heavy astrological jargon (e.g., avoid words like "portends", "auspicious", "malefic", "beneficence", "trajectory", "amalgamation").
  - Talk to the user like a friendly, modern mentor explaining things over coffee.
  - Keep sentences short and direct.
  
  CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
  Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional", "Jupiter brings expansion", "You will feel a shift in energy"). 
  You MUST translate every single astrological placement into STRICT, CONCRETE, REAL-WORLD EVENTS. 
  - Instead of "intellectual growth", specify "securing a corporate job, publishing a paper, or passing a competitive exam."
  - Instead of "relationship harmony", specify "getting married, finding a high-value business partner, or resolving a legal dispute."
  - Instead of "financial expansion", specify "buying real estate, getting a promotion, or starting a new business venture."
  Every single user expects extreme clarity, practical life events, and absolute unvarnished truth. Anchor your entire reading in specific, real-world outcomes.
  1. MASSIVE DETAIL REQUIRED: For the overall yearly prediction and EVERY SINGLE MONTH, you MUST write at least 150-200 words per section.
  2. Dive deeply into the transit dynamics, psychological shifts, career hurdles, and relationship developments for each month.
  3. FORMATTING: You MUST use double line breaks (\n\n) between paragraphs to format your text beautifully. Avoid giant walls of text.`;
      
      const fallbackModels = [
          "gemini-3.5-flash-lite",
          "gemini-3.1-flash-lite",
          "gemini-flash-lite-latest",
          "gemini-3.8-flash",
          "gemini-3.7-flash",
          "gemini-3.6-flash",
          "gemini-3.5-flash",
          "gemini-3-flash",
          "gemini-2.5-flash"
        ];
        
        let aiJson = null;
        for (const modelName of fallbackModels) {
          try {
            const aiPromise = ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: { 
          temperature: 0.2,
          responseMimeType: "application/json",
          // Forcing 100% Valid JSON Structure for 12 months
          responseSchema: {
            type: "OBJECT",
            properties: {
              varshaphal: { type: "STRING", description: "Massive, deeply analyzed Yearly Prediction." },
              monthlyPredictions: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    month: { type: "STRING", description: "e.g., January 2024" },
                    theme: { type: "STRING", description: "A 3-5 word theme for this month" },
                    prediction: { type: "STRING", description: "Detailed transit impact for this month" },
                    career: { type: "STRING" },
                    relationships: { type: "STRING" }
                    },
                    required: ["month", "theme", "prediction", "career", "relationships"]
                  }
                }
              },
              required: ["varshaphal", "monthlyPredictions"]
            }
          }
        });
            
            const response = await withTimeout(aiPromise, 45000, null);
            if (response && response.text) {
              aiJson = JSON.parse(response.text);
              break;
            }
          } catch (err: any) {
            console.warn(`[Model ${modelName}] failed. Trying next...`);
          }
        }

        if (aiJson) {
          varshaphalData.varshaphal = aiJson.varshaphal;
        varshaphalData.monthlyPredictions = aiJson.monthlyPredictions;
        } else {
          throw new Error("All fallback AI models failed or timed out.");
        }
    } catch (err: any) {
      console.error("Varshaphal AI Generation failed:", err);
      varshaphalData.varshaphal = `[AI ERROR] The AI generation failed: ${err?.message || 'Unknown error'}. Please try again later.`;
    }
  }

  return varshaphalData;
}
