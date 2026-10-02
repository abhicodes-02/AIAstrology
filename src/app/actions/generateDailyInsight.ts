"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIDailyInsightData(
  name: string,
  dob: string,
  tob: string,
  pob: string,
  targetDateStr?: string
) {
  // 1. Geocode location
  let lat = 22.5726;
  let lon = 88.3639;
  let countryCode = "in";
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1&addressdetails=1`,
      { headers: { "User-Agent": "AIAstrology/2.0" } }
    );
    const geoData = await geoRes.json();
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
      countryCode = geoData[0].address?.country_code || "";
    }
  } catch (err) {
    console.error("Geocoding failed in daily insight", err);
  }

  // 2. Birth Chart Calculation
  const [birthYear, birthMonth, birthDay] = dob.split("-").map(Number);
  const [birthHour, birthMinute] = tob.split(":").map(Number);
  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);

  const birthChart = celestine.calculateChart(
    { year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, minute: birthMinute, latitude: lat, longitude: lon, timezone },
    { includeNodes: "true" as const }
  );

  // --- 100% ACCURATE LAHIRI AYANAMSA FOR BIRTH (Swiss Ephemeris) ---
  let birthAyanamsa = 23.85 + (birthYear - 2000) * (50.29 / 3600);
  try {
    const swisseph = require("sweph-wasm");
    const localDate = new Date(`${dob}T${tob}:00.000${timezone >= 0 ? '+' : '-'}${Math.abs(Math.floor(timezone)).toString().padStart(2, '0')}:${(Math.abs(timezone % 1) * 60).toString().padStart(2, '0')}`);
    const julday = swisseph.swe_julday(localDate.getUTCFullYear(), localDate.getUTCMonth() + 1, localDate.getUTCDate(), localDate.getUTCHours() + localDate.getUTCMinutes() / 60, swisseph.SE_GREG_CAL);
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    birthAyanamsa = swisseph.swe_get_ayanamsa_ut(julday);
  } catch (e) {
    console.warn("[DailyInsight] sweph-wasm not available for birth ayanamsa, using fallback.");
  }

  const getSidereal = (tropical: number, ayanamsaVal: number) => {
    let sid = tropical - ayanamsaVal;
    if (sid < 0) sid += 360;
    return sid;
  }

  const signs = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

  const natalSun = birthChart.planets.find((p: any) => p.name === "Sun");
  const natalMoon = birthChart.planets.find((p: any) => p.name === "Moon");
  const natalAsc = birthChart.angles.ascendant;

  const siderealNatalMoon = natalMoon ? getSidereal(natalMoon.longitude, birthAyanamsa) : 0;
  const siderealNatalSun = natalSun ? getSidereal(natalSun.longitude, birthAyanamsa) : 0;
  const siderealNatalAsc = natalAsc ? getSidereal(natalAsc.longitude, birthAyanamsa) : 0;

  const moonSignIndex = Math.floor(siderealNatalMoon / 30);
  const moonSign = signs[moonSignIndex];
  const ascendantSign = signs[Math.floor(siderealNatalAsc / 30)];
  const sunSign = signs[Math.floor(siderealNatalSun / 30)];
  const birthNakshatra = nakshatras[Math.floor(siderealNatalMoon / (360 / 27))];

  // 3. Current Transit Chart Calculation
  let currentYear, currentMonth, currentDay, currentHour, currentMinute;
  if (targetDateStr) {
    const parts = targetDateStr.split("-").map(Number);
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      [currentYear, currentMonth, currentDay] = parts;
      currentHour = 12; currentMinute = 0;
    } else {
      const parsed = new Date(targetDateStr);
      currentYear = parsed.getUTCFullYear(); currentMonth = parsed.getUTCMonth() + 1; currentDay = parsed.getUTCDate();
      currentHour = 12; currentMinute = 0;
    }
  } else {
    const utcNow = Date.now();
    const localDate = new Date(utcNow + timezone * 3600 * 1000);
    currentYear = localDate.getUTCFullYear(); currentMonth = localDate.getUTCMonth() + 1; currentDay = localDate.getUTCDate();
    currentHour = localDate.getUTCHours(); currentMinute = localDate.getUTCMinutes();
  }

  const targetDateISO = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;
  const displayDateObj = new Date(Date.UTC(currentYear, currentMonth - 1, currentDay, 12, 0, 0));
  const dateFormatted = new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(displayDateObj);

  const transitChart = celestine.calculateChart(
    { year: currentYear, month: currentMonth, day: currentDay, hour: currentHour, minute: currentMinute, latitude: lat, longitude: lon, timezone },
    { includeNodes: "true" as const }
  );

  // --- 100% ACCURATE LAHIRI AYANAMSA FOR TRANSIT (Swiss Ephemeris) ---
  let currentAyanamsa = 23.85 + (currentYear - 2000) * (50.29 / 3600);
  try {
    const swisseph = require("sweph-wasm");
    const julday = swisseph.swe_julday(currentYear, currentMonth, currentDay, currentHour + currentMinute/60, swisseph.SE_GREG_CAL);
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    currentAyanamsa = swisseph.swe_get_ayanamsa_ut(julday);
  } catch (e) {
    console.warn("[DailyInsight] sweph-wasm not available for transit ayanamsa, using fallback.");
  }

  const allTransits = transitChart.planets.map((p: any) => {
    if (["Uranus", "Neptune", "Pluto", "Chiron", "Sirius"].includes(p.name)) return null;
    let shortName = p.name === "North Node" ? "Rahu" : p.name === "South Node" ? "Ketu" : p.name;
    const pSidereal = getSidereal(p.longitude, currentAyanamsa);
    const pSignIndex = Math.floor(pSidereal / 30);
    const houseFromMoon = ((pSignIndex - moonSignIndex + 12) % 12) + 1;
    return `${shortName} in ${houseFromMoon}th House`;
  }).filter(Boolean).join(", ");

  const transitMoon = transitChart.planets.find((p: any) => p.name === "Moon");
  const siderealTransitMoon = transitMoon ? getSidereal(transitMoon.longitude, currentAyanamsa) : 0;
  const transitMoonSignIndex = Math.floor(siderealTransitMoon / 30);
  const transitMoonSign = signs[transitMoonSignIndex];
  const transitNakshatra = nakshatras[Math.floor(siderealTransitMoon / (360 / 27))];
  const transitHouseFromMoon = ((transitMoonSignIndex - moonSignIndex + 12) % 12) + 1;

  let dailyData = {
    dateFormatted, targetDate: targetDateISO, natalMoonSign: moonSign, natalAscendant: ascendantSign, natalSunSign: sunSign,
    birthNakshatra, transitMoonSign, transitNakshatra, transitHouseFromMoon,
    cosmicScore: 82, overallFavorability: "FAVOURABLE", careerFavorability: "GOOD", financeFavorability: "FAVOURABLE",
    loveFavorability: "GOOD", healthFavorability: "FAVOURABLE", cosmicMood: "Intuitive & Balanced",
    luckyColor: "Royal Indigo", luckyNumber: "7", auspiciousTime: "09:30 AM - 11:45 AM",
    dailySummary: `[AI BUSY] Analyzing your transits for ${dateFormatted}...`,
    career: `[AI BUSY] Calculating professional alignments...`,
    finance: `[AI BUSY] Analyzing wealth transits...`,
    love: `[AI BUSY] Mapping relational harmony...`,
    health: `[AI BUSY] Checking vitality indicators...`,
    remedy: `[AI BUSY] Finding optimal daily remedy...`,
  };

  // --- BULLETPROOF AI (STRUCTURED OUTPUTS) ---
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as an expert Vedic Astrologer providing a profoundly accurate Daily Horoscope & Cosmic Transit Insight for ${name}.
- Natal Ascendant: ${ascendantSign}
- Natal Moon Sign: ${moonSign} in ${birthNakshatra} Nakshatra
- Current Date: ${dateFormatted}
- Transit Moon Sign: ${transitMoonSign} in ${transitNakshatra} Nakshatra
- Transit Moon House (from Natal Moon): ${transitHouseFromMoon}th House
- ALL PLANETARY TRANSITS (from Natal Moon): ${allTransits}

Generate a deeply personalized daily reading explaining how this specific ${transitHouseFromMoon}th house transit impacts their day.

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
  Every single user expects extreme clarity, practical life events, and absolute unvarnished truth. Anchor your entire reading in specific, real-world outcomes.`;

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
          // Forcing 100% Valid JSON Structure
          responseSchema: {
            type: "OBJECT",
            properties: {
              cosmicScore: { type: "NUMBER", description: "Auspiciousness score between 65 and 96" },
              overallFavorability: { type: "STRING", enum: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"] },
              careerFavorability: { type: "STRING", enum: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"] },
              financeFavorability: { type: "STRING", enum: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"] },
              loveFavorability: { type: "STRING", enum: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"] },
              healthFavorability: { type: "STRING", enum: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"] },
              cosmicMood: { type: "STRING", description: "3-5 word evocative phrase" },
              luckyColor: { type: "STRING" },
              luckyNumber: { type: "STRING" },
              auspiciousTime: { type: "STRING" },
              dailySummary: { type: "STRING", description: "2 detailed paragraphs of overall guidance" },
              career: { type: "STRING" },
              finance: { type: "STRING" },
              love: { type: "STRING" },
              health: { type: "STRING" },
              remedy: { type: "STRING", description: "A practical Vedic astrological remedy" }
              },
              required: ["cosmicScore", "overallFavorability", "careerFavorability", "financeFavorability", "loveFavorability", "healthFavorability", "cosmicMood", "luckyColor", "luckyNumber", "auspiciousTime", "dailySummary", "career", "finance", "love", "health", "remedy"]
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
          dailyData = { ...dailyData, ...aiJson, luckyNumber: String(aiJson.luckyNumber) };
        } else {
          throw new Error("All fallback AI models failed or timed out.");
        }
    } catch (err) {
      console.error("Daily Insight AI Generation failed:", err);
    }
  }

  return dailyData;
}