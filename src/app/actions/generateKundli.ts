"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";

export async function fetchAIKundliData(name: string, dob: string, tob: string, pob: string) {
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

  // Exact Lahiri Ayanamsa calculation approximation for the epoch
  const ayanamsa = 23.85 + (year - 2000) * (50.29 / 3600);

  function getSidereal(tropical: number) {
    let sidereal = tropical - ayanamsa;
    if (sidereal < 0) sidereal += 360;
    return sidereal;
  }

  const signs = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
  
  // Panchang Elements Calculations
  const sunData = chart.planets.find((p: any) => p.name === "Sun");
  const moonData = chart.planets.find((p: any) => p.name === "Moon");
  const siderealSun = sunData ? getSidereal(sunData.longitude) : 0;
  const siderealMoon = moonData ? getSidereal(moonData.longitude) : 0;
  
  // Tithi: (Moon - Sun) / 12
  let tithiDeg = siderealMoon - siderealSun;
  if (tithiDeg < 0) tithiDeg += 360;
  const tithiIndex = Math.floor(tithiDeg / 12) + 1;
  const paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
  const tithiNumber = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;

  // Nakshatra: Moon / 13°20'
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const nakshatra = nakshatras[nakshatraIndex];

  // Yoga: (Moon + Sun) / 13°20'
  let yogaDeg = siderealMoon + siderealSun;
  if (yogaDeg >= 360) yogaDeg -= 360;
  const yogaIndex = Math.floor(yogaDeg / (360 / 27));
  const yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const yoga = yogas[yogaIndex];

  // Ascendant Calculation
  const ascSidereal = getSidereal(chart.angles.ascendant.longitude);
  const ascSign = Math.floor(ascSidereal / 30);
  const ascendantName = signs[ascSign];

  // Map Planets to D-1 (Lagna) and D-9 (Navamsa) Houses
  const d1Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };

  const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;

  // Combine standard planets and True Nodes (Rahu/Ketu)
  const planetaryBodies: any[] = [...chart.planets];
  if (chart.nodes && chart.nodes.length >= 2) {
    planetaryBodies.push({ name: "Rahu", longitude: chart.nodes[0].longitude });
    planetaryBodies.push({ name: "Ketu", longitude: chart.nodes[1].longitude });
  } else {
    // If celestine nodes aren't properly exported in this version, estimate Rahu/Ketu
    // Usually, we'd use true node. As a fallback, we'll skip if not available, but celestine has nodes.
  }

  planetaryBodies.forEach((planet: any) => {
    // Only map the 9 traditional Vedic planets (Navagraha)
    if (!["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "North Node", "South Node", "Rahu", "Ketu"].includes(planet.name)) return;
    
    let name = planet.name;
    if (name === "North Node") name = "Rahu";
    if (name === "South Node") name = "Ketu";
    const shortName = name.substring(0, 4);

    const pSidereal = getSidereal(planet.longitude);
    const pSign = Math.floor(pSidereal / 30);
    
    // D-1 House (Whole Sign from Lagna)
    let d1House = pSign - ascSign + 1;
    if (d1House <= 0) d1House += 12;
    d1Houses[d1House].push(shortName);

    // D-9 Navamsa
    const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
    let d9House = pNavamsaSign - ascNavamsaSign + 1;
    if (d9House <= 0) d9House += 12;
    d9Houses[d9House].push(shortName);
  });

  const chartData = {
    houses: d1Houses,
    d9Houses: d9Houses,
    ascendant: ascendantName,
    sunSign: signs[Math.floor(siderealSun / 30)],
    moonSign: signs[Math.floor(siderealMoon / 30)],
    nakshatra,
    tithi: `${paksha} Paksha, Tithi ${tithiNumber}`,
    yoga,
    reading: `[AI BUSY] Welcome ${name}. The AI is currently experiencing high demand. Please wait a moment and try again.`,
    career: `[AI BUSY] The AI is currently experiencing high demand. Please try again.`,
    relationships: `[AI BUSY] The AI is currently experiencing high demand. Please try again.`,
    health: `[AI BUSY] The AI is currently experiencing high demand. Please try again.`,
    wealth: `[AI BUSY] The AI is currently experiencing high demand. Please try again.`,
    fullLife: `[AI BUSY] The AI is currently experiencing high demand. Please try again.`
  };

  // AI Augmentation (if API key provided)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as a master traditional Vedic Astrologer (Jyotishi) renowned for unvarnished truth, psychological depth, and karmic realism. (IMPORTANT: Write the entire response in English).
A seeker named ${name} has:
- Lagna (Ascendant): ${ascendantName}
- Moon (Janma Rashi): ${signs[Math.floor(siderealMoon / 30)]} in ${nakshatra} Nakshatra
- Sun (Surya): ${signs[Math.floor(siderealSun / 30)]}
- D-1 Rashi Houses: ${JSON.stringify(d1Houses)}
- D-9 Navamsa Houses: ${JSON.stringify(d9Houses)}

CRITICAL INSTRUCTIONS FOR AUTHENTICITY & ACCURACY:
1. STRICTLY AVOID SUGARCOATING OR FLATTERY: Do NOT write a generic, purely positive horoscope. Real human lives are full of struggle, mental anguish, delays, karmic blockages, and personal flaws. Speak the unfiltered astrological truth with dignity and precision.
2. ANALYZE BOTH BLESSINGS & HARSH REALITIES (DUAL BALANCE): In every single domain, explicitly reveal the shadow side, malefic afflictions, doshas, difficult house placements (6th, 8th, 12th houses, Saturn/Mars/Rahu/Ketu pressures), internal conflicts, and periods of breakdown or vulnerability alongside the strengths.
3. GROUNDED PERSONALITY: Point out their real psychological blindspots, emotional defense mechanisms, fears, and internal contradictions (e.g. Scorpio Moon's intense brooding/distrust, Aquarius detachment, Mars aggression, Rahu illusions).
4. FINANCIAL & CAREER STRUGGLES: Discuss career bottlenecks, periods of aimlessness, workplace politics or severe competition, and financial drains/bad decisions before any lasting stability.
5. RELATIONSHIP FRICTION: Discuss actual romantic disillusionment, ego clashes, emotional misunderstandings, potential delays, or tests of patience in marriage/partnerships.
6. HEALTH VULNERABILITIES: Explicitly pinpoint physical sensitivities, psychosomatic stress manifestations, digestive/nervous weak points according to classical Vedic rules.

Return ONLY a valid JSON object with these exact keys:
{
  "reading": "A deeply realistic opening analysis of their core personality, psychological contradictions, emotional struggles, and underlying soul urge—balancing their gifts with their real shadow self.",
  "career": "A grounded, deep-dive evaluation of their professional journey. Detail both their peaks AND their major career roadblocks, professional rivalries, periods of stagnation, and lessons in humility.",
  "relationships": "An authentic, penetrating reading of their romantic and marital fate based on the 7th house, Venus, and D-9 Navamsa. Address emotional challenges, high expectations, conflicts, spouse personality quirks/friction, and lessons in love.",
  "health": "Specific, unvarnished health prognosis. Identify organ vulnerabilities, stress triggers, nervous system strain, and physical habits that must be guarded against.",
  "wealth": "A realistic financial blueprint based on the 2nd, 8th, and 11th houses. Detail wealth-building capability alongside periods of financial losses, wasteful expenditures, impulse risks, and karmic monetary tests.",
  "fullLife": "A grand, mature Vedic synthesis of their ultimate life path. Discuss the heavy karmic baggage, pivotal crisis points/turning moments, the major Dasha struggles, and the profound wisdom forged through hardship."
}`;
      
      let aiJson = null;
      const fallbackModels = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
      
      for (const modelName of fallbackModels) {
        if (aiJson) break; // Stop if we already got successful data
        
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          if (response.text) {
            const cleanedText = response.text.replace(/```json\n?|```/g, '').trim();
            aiJson = JSON.parse(cleanedText);
            break; // Success, break the loop
          }
        } catch (err: any) {
          console.warn(`[Model: ${modelName}] AI generation failed. Error:`, err.message);
          // Wait 1.5 seconds before trying the next model to avoid spamming the API
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (aiJson) {
        chartData.reading = aiJson.reading;
        chartData.career = aiJson.career;
        chartData.relationships = aiJson.relationships;
        chartData.health = aiJson.health || "";
        chartData.wealth = aiJson.wealth || "";
        chartData.fullLife = aiJson.fullLife || "Full life overview is not available.";
      } else {
        throw new Error("All fallback models failed due to rate limits or API errors.");
      }
    } catch (err: any) {
      console.error("All AI retries failed, using standard Bengali ephemeris response. Error:", err);
      chartData.reading = `[AI ERROR] The AI generation failed during API call: ${err?.message || 'Unknown error'}. Please try again later.`;
      chartData.career = `[AI ERROR] Failed during API call.`;
      chartData.relationships = `[AI ERROR] Failed during API call.`;
    }
  } else {
    chartData.reading = `[KEY MISSING] GEMINI_API_KEY is not configured or missing in Vercel. Please check Vercel Environment Variables.`;
    chartData.career = `[KEY MISSING] GEMINI_API_KEY missing.`;
    chartData.relationships = `[KEY MISSING] GEMINI_API_KEY missing.`;
  }

  return chartData;
}
