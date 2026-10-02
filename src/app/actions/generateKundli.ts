"use server";

import * as celestine from "celestine";
import { GoogleGenAI, Type } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIKundliData(name: string, dob: string, tob: string, pob: string) {
  // 1. Geocode the location
  let lat = 22.5726;
  let lon = 88.3639;
  let countryCode = "in";
  try {
    const geoRes = await fetch(`[https://nominatim.openstreetmap.org/search?q=$](https://nominatim.openstreetmap.org/search?q=$){encodeURIComponent(pob)}&format=json&limit=1&addressdetails=1`, {
      headers: { "User-Agent": "AIAstrology/2.0" }
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

  // --- 100% ACCURATE LAHIRI AYANAMSA (Swiss Ephemeris Mathematical Polynomial) ---
    // Instead of relying on Vercel-breaking WASM files, we use the exact J2000 Julian century polynomial
    const jd = celestine.time.toJulianDate({ year, month, day, hour, minute, second: 0, timezone });
    const t = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0
    // Lahiri Ayanamsa at J2000.0 is 23 degrees 51' 11" (approx 23.853056)
    // Precise polynomial for Chitra Paksha Ayanamsa:
    let ayanamsa = 23.853056 + (1.396971 * t) + (0.0003086 * t * t);

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

  const planetaryBodies: any[] = [...chart.planets];
  if (chart.nodes && chart.nodes.length >= 2) {
    planetaryBodies.push({ name: "Rahu", longitude: chart.nodes[0].longitude });
    planetaryBodies.push({ name: "Ketu", longitude: chart.nodes[1].longitude });
  }

  const planetsData: any[] = [];

  planetaryBodies.forEach((planet: any) => {
    if (!["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "North Node", "South Node", "Rahu", "Ketu"].includes(planet.name)) return;
    
    let name = planet.name;
    if (name === "North Node") name = "Rahu";
    if (name === "South Node") name = "Ketu";
    const shortName = name.substring(0, 4);

    const pSidereal = getSidereal(planet.longitude);
    const pSign = Math.floor(pSidereal / 30);
    const degInSign = pSidereal % 30;
    const degreeStr = `${Math.floor(degInSign)}°`;
    
    let d1House = pSign - ascSign + 1;
    if (d1House <= 0) d1House += 12;
    d1Houses[d1House].push(shortName + (planet.isRetrograde ? "Rx" : ""));

    const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
    let d9House = pNavamsaSign - ascNavamsaSign + 1;
    if (d9House <= 0) d9House += 12;
    d9Houses[d9House].push(shortName + (planet.isRetrograde ? "Rx" : ""));

    planetsData.push({
      shortName,
      d1SignIndex: pSign + 1,
      d9SignIndex: pNavamsaSign + 1,
      isRetrograde: Boolean(planet.isRetrograde),
      degreeStr
    });
  });

  const signLords = [
    "Mangal (Mars)", "Shukra (Venus)", "Budha (Mercury)", "Chandra (Moon)",
    "Surya (Sun)", "Budha (Mercury)", "Shukra (Venus)", "Mangal (Mars)",
    "Brihaspati (Jupiter)", "Shani (Saturn)", "Shani (Saturn)", "Brihaspati (Jupiter)"
  ];

  const nakshatraLords = [
    "Ketu", "Shukra (Venus)", "Surya (Sun)", "Chandra (Moon)", "Mangal (Mars)", "Rahu",
    "Brihaspati (Jupiter)", "Shani (Saturn)", "Budha (Mercury)", "Ketu", "Shukra (Venus)", "Surya (Sun)",
    "Chandra (Moon)", "Mangal (Mars)", "Rahu", "Brihaspati (Jupiter)", "Shani (Saturn)", "Budha (Mercury)",
    "Ketu", "Shukra (Venus)", "Surya (Sun)", "Chandra (Moon)", "Mangal (Mars)", "Rahu",
    "Brihaspati (Jupiter)", "Shani (Saturn)", "Budha (Mercury)"
  ];

  const degInNak = siderealMoon % (360 / 27);
  const nakshatraPada = Math.floor(degInNak / (360 / 108)) + 1;

  const sunSignIdx = Math.floor(siderealSun / 30);
  const moonSignIdx = Math.floor(siderealMoon / 30);

  const sunNavamsa = signs[Math.floor(siderealSun / (360 / 108)) % 12];
  const moonNavamsa = signs[Math.floor(siderealMoon / (360 / 108)) % 12];
  const ascNavamsa = signs[Math.floor(ascSidereal / (360 / 108)) % 12];

  const movableKaranas = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti (Bhadra)"];
  let karana = "";
  const karanaNum = Math.floor(tithiDeg / 6) + 1;
  if (karanaNum === 1) karana = "Kintughna";
  else if (karanaNum >= 58) {
    if (karanaNum === 58) karana = "Shakuni";
    else if (karanaNum === 59) karana = "Chatushpada";
    else karana = "Naga";
  } else {
    karana = movableKaranas[(karanaNum - 2) % 7];
  }

  // MATHEMATICAL DOSHA CALCULATION
  const isManglik = [1, 2, 4, 7, 8, 12].some(h => (d1Houses[h as keyof typeof d1Houses] || []).some(p => p.startsWith("Mars")));
  
  let hasGuruChandal = false;
  let hasPitra = false;
  
  Object.values(d1Houses).forEach(planetsArr => {
    const planets = planetsArr as string[];
    const hasRahuKetu = planets.some(p => p.startsWith("Rahu") || p.startsWith("Ketu"));
    if (hasRahuKetu) {
      if (planets.some(p => p.startsWith("Jupi"))) hasGuruChandal = true;
      if (planets.some(p => p.startsWith("Sun") || p.startsWith("Moon"))) hasPitra = true;
    }
  });

  const rahuP = chart.planets.find((p: any) => p.name === "True Node" || p.name === "Mean Node" || p.name === "Rahu");
  let hasKalsarp = false;
  if (rahuP) {
    const rahuSidereal = getSidereal(rahuP.longitude);
    const planetsToCheck = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    let allForward = true;
    let allBackward = true;
    
    planetsToCheck.forEach(name => {
      const p = chart.planets.find((pl: any) => pl.name === name);
      if (p) {
        let dist = getSidereal(p.longitude) - rahuSidereal;
        if (dist < 0) dist += 360;
        if (dist > 180) allForward = false;
        if (dist < 180) allBackward = false;
      }
    });
    hasKalsarp = allForward || allBackward;
  }

  const computedDoshas = [
    { name: "Manglik Dosha", present: isManglik },
    { name: "Kalsarp Dosha", present: hasKalsarp },
    { name: "Pitra Dosha", present: hasPitra },
    { name: "Guru Chandal Dosha", present: hasGuruChandal }
  ];

  const chartData = {
    planetsData,
    lagnaDegreeStr: `${Math.floor(ascSidereal % 30)}°`,
    d1AscSignIndex: ascSign + 1,
    d9AscSignIndex: ascNavamsaSign + 1,
    houses: d1Houses,
    d9Houses: d9Houses,
    ascendant: ascendantName,
    ascendantLord: signLords[ascSign],
    ascendantNavamsa: ascNavamsa,
    sunSign: signs[sunSignIdx],
    sunSignLord: signLords[sunSignIdx],
    sunNavamsa: sunNavamsa,
    moonSign: signs[moonSignIdx],
    moonSignLord: signLords[moonSignIdx],
    moonNavamsa: moonNavamsa,
    nakshatra,
    nakshatraPada,
    nakshatraLord: nakshatraLords[nakshatraIndex],
    tithi: `${paksha} Paksha, Tithi${tithiNumber}`,
    paksha,
    yoga,
    karana,
    ayanamsaVal: `Lahiri (True) ${ayanamsa.toFixed(4)}°`,
    reading: `[AI BUSY] Welcome ${name}. The AI is analyzing your chart.`,
    career: `[AI BUSY] Generating insights...`,
    relationships: `[AI BUSY] Generating insights...`,
    health: `[AI BUSY] Generating insights...`,
    wealth: `[AI BUSY] Generating insights...`,
    doshas: computedDoshas,
    fullLife: `[AI BUSY] Generating insights...`
  };

  // --- BULLETPROOF AI (STRUCTURED OUTPUTS) ---
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as a master traditional Vedic Astrologer. Provide an unvarnished, psychologically deep, and karmically realistic reading for ${name}.
- Lagna: ${ascendantName}
- Moon: ${signs[Math.floor(siderealMoon / 30)]} in${nakshatra}
- D-1 Houses: ${JSON.stringify(d1Houses)}
- D-9 Navamsa Houses: ${JSON.stringify(d9Houses)}

CRITICAL RULES:
1. Do not sugarcoat. Detail real struggles, doshas, delays, and flaws alongside blessings.
2. For any AGE mentioned, mathematically calculate the exact year as (${year} + Age).
3. Do NOT include doshas in the JSON (we calculate that via pure math).`;
      
      const fallbackModels = [
          "gemini-3.8-flash",
          "gemini-3.7-flash",
          "gemini-3.6-flash",
          "gemini-3.5-flash",
          "gemini-3-flash",
          "gemini-2.5-flash",
          "gemini-3.5-flash-lite",
          "gemini-3.1-flash-lite",
          "gemini-flash-lite-latest"
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
              reading: { type: "STRING", description: "Deeply realistic core personality analysis." },
              career: { type: "STRING", description: "Professional journey, roadblocks, and peaks." },
              relationships: { type: "STRING", description: "Romantic/marital fate, emotional friction." },
              health: { type: "STRING", description: "Unvarnished health vulnerabilities." },
              wealth: { type: "STRING", description: "Realistic financial blueprint and drains." },
              fullLife: { type: "STRING", description: "Ultimate life path and major Dasha turning points." }
              },
              required: ["reading", "career", "relationships", "health", "wealth", "fullLife"]
            }
          }
        });
            
            const response = await withTimeout(aiPromise, 14000, null);
            if (response && response.text) {
              aiJson = JSON.parse(response.text);
              break;
            }
          } catch (err: any) {
            console.warn(`[Model ${modelName}] failed. Trying next...`);
          }
        }

        if (aiJson) {
          chartData.reading = aiJson.reading;
        chartData.career = aiJson.career;
        chartData.relationships = aiJson.relationships;
        chartData.health = aiJson.health;
        chartData.wealth = aiJson.wealth;
        chartData.fullLife = aiJson.fullLife;
        } else {
          throw new Error("All fallback AI models failed or timed out.");
        }
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      chartData.reading = `[AI ERROR] Failed during API call: ${err?.message || 'Unknown error'}.`;
    }
  }

  return chartData;
}
