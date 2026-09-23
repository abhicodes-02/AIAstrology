"use server";

import celestine from "celestine";
import { GoogleGenAI } from "@google/genai";

export async function fetchAIKundliData(name: string, dob: string, tob: string, pob: string) {
  // 1. Geocode the location
  let lat = 0;
  let lon = 0;
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1`, {
      headers: { "User-Agent": "AIAstrology/1.0" }
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

  const birth = { year, month, day, hour, minute, latitude: lat || 22.5726, longitude: lon || 88.3639, timezone }; // Default Kolkata

  // Force celestine options for traditional calculation (True Nodes)
  const chartOptions = { includeNodes: "true" };
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
  const siderealSun = getSidereal(chart.planets.find((p: any) => p.name === "Sun").longitude);
  const siderealMoon = getSidereal(chart.planets.find((p: any) => p.name === "Moon").longitude);
  
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
  const planetaryBodies = [...chart.planets];
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
    reading: `Welcome ${name}. This Kundli strictly follows the traditional Bengali/Vedic method. Your Lagna is ${ascendantName}. Your birth occurred during ${paksha} Paksha, Tithi ${tithiNumber}, under ${nakshatra} Nakshatra and ${yoga} Yoga.`,
    career: `Your Dasamsa (D-10) and Lagna's 10th house indicate your karmic path. The placement of your 10th lord will define your worldly success.`,
    relationships: `Your Navamsa (D-9) chart reveals your destiny and marriage. The 7th house in the Navamsa dictates the spiritual bond of your partnerships.`
  };

  // AI Augmentation (if API key provided)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as an expert Bengali Vedic Astrologer. A user named ${name} has Lagna: ${ascendantName}, Moon: ${signs[Math.floor(siderealMoon / 30)]} (${nakshatra} Nakshatra), Sun: ${signs[Math.floor(siderealSun / 30)]}. D-1 Houses: ${JSON.stringify(d1Houses)}. D-9 Navamsa Houses: ${JSON.stringify(d9Houses)}. 
      Provide a highly detailed astrological reading focusing on their core personality, career potential, and marital life. Return ONLY a JSON object with: {"reading": "...", "career": "...", "relationships": "..."}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        const aiJson = JSON.parse(response.text);
        chartData.reading = aiJson.reading;
        chartData.career = aiJson.career;
        chartData.relationships = aiJson.relationships;
      }
    } catch (err) {
      console.warn("AI generation failed, using standard Bengali ephemeris response.");
    }
  }

  return chartData;
}
