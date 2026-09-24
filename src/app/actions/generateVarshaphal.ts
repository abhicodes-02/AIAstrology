"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";

export async function fetchAIVarshaphalData(name: string, dob: string, tob: string, pob: string) {
  // 1. Geocode the location
  let lat = 22.5726;
  let lon = 88.3639;
  let countryCode = "in";
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1&addressdetails=1`, {
      headers: { "User-Agent": "AIAstrology/1.0" }
    });
    const geoData = await geoRes.json();
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
      countryCode = geoData[0].address?.country_code || "";
    }
  } catch (err) {
    console.error("Geocoding failed", err);
  }

  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);

  const birth = { year, month, day, hour, minute, latitude: lat, longitude: lon, timezone };

  const chartOptions = { includeNodes: "true" as const };
  const chart = celestine.calculateChart(birth, chartOptions);

  const ayanamsa = 23.85 + (year - 2000) * (50.29 / 3600);
  
  const getSidereal = (tropical: number) => {
    let sidereal = tropical - ayanamsa;
    if (sidereal < 0) sidereal += 360;
    return sidereal;
  };

  const sunData = (chart as any).planets?.find((b: any) => b.name === "Sun");
  const siderealSun = sunData ? getSidereal(sunData.longitude) : 0;
  
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  let varshaphalData: any = {
    varshaphal: `[AI NOT CONFIGURED] Please add your GEMINI_API_KEY to generate your Yearly Varshaphal (Annual Prediction).`,
    monthlyPredictions: [{ month: "Configuration Required", prediction: `[AI NOT CONFIGURED] Please add your GEMINI_API_KEY to unlock your month-by-month forecast.` }]
  };

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as an expert Bengali Vedic Astrologer. (IMPORTANT: Write the entire response in English). A user named ${name} was born on ${dob} in ${pob}. Their Sun is in ${signs[Math.floor(siderealSun / 30)]}. 
      Generate a deeply detailed Varshaphal (Solar Return Annual Forecast) for their current year of life, incorporating transits and planetary returns.
      Return ONLY a JSON object with these exact keys:
      {
        "varshaphal": "A massive, deeply analyzed Yearly Varshaphal (Annual Prediction) detailing the major themes, opportunities, health, and challenges for the upcoming year.",
        "monthlyPredictions": [
          { 
            "month": "Month 1 (e.g. January)", 
            "theme": "A 3-5 word theme for this month",
            "prediction": "The main detailed paragraph describing the astrological transits and overall energy for this month.",
            "career": "Specific career and financial prediction for this month.",
            "relationships": "Specific love and family prediction for this month."
          },
          { 
            "month": "Month 2 (e.g. February)", 
            "theme": "A 3-5 word theme for this month",
            "prediction": "The main detailed paragraph describing the astrological transits and overall energy for this month.",
            "career": "Specific career and financial prediction for this month.",
            "relationships": "Specific love and family prediction for this month."
          }
          // ... all 12 months
        ]
      }`;
      
      let aiJson: any = null;
      const fallbackModels = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
      
      for (const modelName of fallbackModels) {
        if (aiJson) break;
        
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          if (response.text) {
            const cleanedText = response.text.replace(/```json\n?|```/g, '').trim();
            aiJson = JSON.parse(cleanedText);
            break;
          }
        } catch (err: any) {
          console.warn(`[Model: ${modelName}] Varshaphal AI generation failed. Error:`, err.message);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (aiJson) {
        varshaphalData.varshaphal = aiJson.varshaphal || "[AI ERROR] The AI model stopped generating before reaching your Varshaphal.";
        
        if (Array.isArray(aiJson.monthlyPredictions)) {
          varshaphalData.monthlyPredictions = aiJson.monthlyPredictions;
        } else if (typeof aiJson.monthlyPredictions === 'object' && aiJson.monthlyPredictions !== null) {
          varshaphalData.monthlyPredictions = Object.entries(aiJson.monthlyPredictions).map(([key, val]) => ({ month: key, prediction: val as string, theme: "Cosmic Shift", career: "N/A", relationships: "N/A" }));
        } else {
          varshaphalData.monthlyPredictions = [{ month: "Overview", prediction: aiJson.monthlyPredictions || "[AI ERROR] The AI model stopped generating before reaching your monthly breakdown.", theme: "General", career: "", relationships: "" }];
        }
      } else {
        throw new Error("All fallback models failed due to rate limits or API errors.");
      }
    } catch (err: any) {
      console.error("All AI retries failed for Varshaphal.", err);
      varshaphalData.varshaphal = `[AI ERROR] The AI generation failed: ${err?.message || 'Unknown error'}. Please try again later.`;
    }
  }

  return varshaphalData;
}

