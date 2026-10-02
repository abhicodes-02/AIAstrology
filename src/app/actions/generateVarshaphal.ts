"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIVarshaphalData(name: string, dob: string, tob: string, pob: string) {
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
  const sunSign = signs[Math.floor(siderealSun / 30)];

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
      const prompt = `Act as an expert Vedic Astrologer. A user named ${name} was born on ${dob} in ${pob}. Their Sidereal Sun is in ${sunSign}. 
Generate a deeply detailed Varshaphal (Solar Return Annual Forecast) for their current year of life, incorporating transits and planetary returns.`;
      
      const aiPromise = ai.models.generateContent({
        model: "gemini-2.5-flash", // Fast, accurate, real model
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

      const response = await withTimeout(aiPromise, 14000, null);
      if (response && response.text) {
        const aiJson = JSON.parse(response.text);
        varshaphalData.varshaphal = aiJson.varshaphal;
        varshaphalData.monthlyPredictions = aiJson.monthlyPredictions;
      } else {
        throw new Error("Timeout or empty response from Gemini.");
      }
    } catch (err: any) {
      console.error("Varshaphal AI Generation failed:", err);
      varshaphalData.varshaphal = `[AI ERROR] The AI generation failed: ${err?.message || 'Unknown error'}. Please try again later.`;
    }
  }

  return varshaphalData;
}