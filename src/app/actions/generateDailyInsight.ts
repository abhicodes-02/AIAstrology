"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";

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
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1`,
      { headers: { "User-Agent": "AIAstrology/1.0" } }
    );
    const geoData = await geoRes.json();
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
    }
  } catch (err) {
    console.error("Geocoding failed in daily insight", err);
  }

  // 2. Birth Chart Calculation
  const [birthYear, birthMonth, birthDay] = dob.split("-").map(Number);
  const [birthHour, birthMinute] = tob.split(":").map(Number);
  const timezone = Math.round(lon / 15);

  const birthChart = celestine.calculateChart(
    {
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      hour: birthHour,
      minute: birthMinute,
      latitude: lat,
      longitude: lon,
      timezone,
    },
    { includeNodes: "true" as const }
  );

  const birthAyanamsa = 23.85 + (birthYear - 2000) * (50.29 / 3600);
  const getSidereal = (tropical: number, ayanamsaVal: number) => {
    let sid = tropical - ayanamsaVal;
    if (sid < 0) sid += 360;
    return sid;
  };

  const signs = [
    "Mesha (Aries)",
    "Vrishabha (Taurus)",
    "Mithuna (Gemini)",
    "Karka (Cancer)",
    "Simha (Leo)",
    "Kanya (Virgo)",
    "Tula (Libra)",
    "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)",
    "Makara (Capricorn)",
    "Kumbha (Aquarius)",
    "Meena (Pisces)",
  ];

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
  ];

  const natalSun = birthChart.planets.find((p: any) => p.name === "Sun");
  const natalMoon = birthChart.planets.find((p: any) => p.name === "Moon");
  const natalAsc = birthChart.angles.ascendant;

  const siderealNatalMoon = natalMoon ? getSidereal(natalMoon.longitude, birthAyanamsa) : 0;
  const siderealNatalSun = natalSun ? getSidereal(natalSun.longitude, birthAyanamsa) : 0;
  const siderealNatalAsc = natalAsc ? getSidereal(natalAsc.longitude, birthAyanamsa) : 0;

  const moonSignIndex = Math.floor(siderealNatalMoon / 30);
  const moonSign = signs[moonSignIndex];
  const ascSignIndex = Math.floor(siderealNatalAsc / 30);
  const ascendantSign = signs[ascSignIndex];
  const sunSign = signs[Math.floor(siderealNatalSun / 30)];
  const nakshatraIndex = Math.floor(siderealNatalMoon / (360 / 27));
  const birthNakshatra = nakshatras[nakshatraIndex];

  // 3. Current Transit Chart Calculation
  const now = targetDateStr ? new Date(targetDateStr) : new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const transitChart = celestine.calculateChart(
    {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      hour: currentHour,
      minute: currentMinute,
      latitude: lat,
      longitude: lon,
      timezone,
    },
    { includeNodes: "true" as const }
  );

  const currentAyanamsa = 23.85 + (currentYear - 2000) * (50.29 / 3600);
  const transitMoon = transitChart.planets.find((p: any) => p.name === "Moon");
  const transitSun = transitChart.planets.find((p: any) => p.name === "Sun");
  const transitMars = transitChart.planets.find((p: any) => p.name === "Mars");
  const transitJupiter = transitChart.planets.find((p: any) => p.name === "Jupiter");
  const transitSaturn = transitChart.planets.find((p: any) => p.name === "Saturn");

  const siderealTransitMoon = transitMoon ? getSidereal(transitMoon.longitude, currentAyanamsa) : 0;
  const transitMoonSignIndex = Math.floor(siderealTransitMoon / 30);
  const transitMoonSign = signs[transitMoonSignIndex];
  const transitNakshatra = nakshatras[Math.floor(siderealTransitMoon / (360 / 27))];

  // House of Transit Moon relative to Natal Moon
  const transitHouseFromMoon = ((transitMoonSignIndex - moonSignIndex + 12) % 12) + 1;

  const dateFormatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function normalizeFavorability(val: any, defaultVal = "GOOD"): "WORST" | "BAD" | "GOOD" | "FAVOURABLE" | "HIGHLY FAVOURABLE" {
    if (!val || typeof val !== "string") return defaultVal as any;
    const upper = val.toUpperCase().trim();
    if (upper.includes("HIGHLY") || upper.includes("EXCELLENT")) return "HIGHLY FAVOURABLE";
    if (upper.includes("FAVOURABLE") || upper.includes("FAVORABLE")) return "FAVOURABLE";
    if (upper.includes("WORST") || upper.includes("TERRIBLE")) return "WORST";
    if (upper.includes("BAD") || upper.includes("POOR") || upper.includes("CHALLENGING")) return "BAD";
    if (upper.includes("GOOD") || upper.includes("AVERAGE") || upper.includes("MODERATE") || upper.includes("NEUTRAL")) return "GOOD";
    return defaultVal as any;
  }

  type FavorabilityLevel = "WORST" | "BAD" | "GOOD" | "FAVOURABLE" | "HIGHLY FAVOURABLE";

  // Default fallback data
  let dailyData = {
    dateFormatted,
    natalMoonSign: moonSign,
    natalAscendant: ascendantSign,
    natalSunSign: sunSign,
    birthNakshatra,
    transitMoonSign,
    transitNakshatra,
    transitHouseFromMoon,
    cosmicScore: 82,
    overallFavorability: "FAVOURABLE" as FavorabilityLevel,
    careerFavorability: "GOOD" as FavorabilityLevel,
    financeFavorability: "FAVOURABLE" as FavorabilityLevel,
    loveFavorability: "GOOD" as FavorabilityLevel,
    healthFavorability: "FAVOURABLE" as FavorabilityLevel,
    cosmicMood: "Intuitive, Balanced & Auspicious",
    luckyColor: "Royal Indigo & Pearl White",
    luckyNumber: "7",
    auspiciousTime: "09:30 AM - 11:45 AM",
    dailySummary: `Today the transit Moon journeys through ${transitMoonSign} in ${transitNakshatra} Nakshatra, activating the ${transitHouseFromMoon}th house relative to your natal Moon sign of ${moonSign}. This celestial alignment cultivates a heightened state of mental clarity, introspection, and thoughtful decision-making. You will find that balancing practical obligations with emotional wisdom brings the greatest harmony throughout the day.`,
    career: `Professionally, this transit inspires strategic problem-solving and calm deliberation. The placement of the transit Moon encourages you to address pending responsibilities without succumbing to unnecessary workplace urgency. It is an auspicious day for constructive communication with superiors, drafting high-impact proposals, and refining operational details. Avoid impulsive confrontations; instead, let calculated patience showcase your innate leadership acumen.`,
    finance: `On the financial front, the cosmic atmosphere encourages prudence and mindful resource allocation. Favorable alignments suggest steady cash flow, but caution is advised against impulsive speculative moves or spontaneous retail therapy. Reviewing investments, organizing budgets, and planning long-term security maneuvers will yield substantial dividends. If negotiating monetary matters or contracts today, ensure all fine print is vetted thoroughly.`,
    love: `Your emotional world is enveloped in warmth, tenderness, and mutual empathy. For partnered seekers, honest conversations and small gestures of affection will deepen your emotional bond effortlessly. If tensions have lingered in recent days, today provides a soothing balm to resolve misunderstandings. Single seekers will radiate an authentic, magnetic charm; remaining open to intellectual connections will open unexpected, heartfelt doors.`,
    health: `Your vitality remains strong, provided you stay attuned to your body's subtle rhythms. The energetic transits emphasize nervous system balance, hydration, and mindful breathing. Avoid excessive caffeine or late-night mental overstimulation. Engaging in a brisk morning walk, light yoga, or meditation will ground your vital prana and elevate your stamina across all daylight hours.`,
    remedy: `Begin your morning by offering a copper vessel of fresh water toward the rising sun with gratitude. Chanting 'Om Somaya Namah' 11 times or wearing silver/white will harmonize the Moon's gentle energies and protect your inner tranquility.`,
  };

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as an expert Vedic Astrologer providing a profoundly accurate, personalized Daily Horoscope & Cosmic Transit Insight. 
IMPORTANT: Write the entire response strictly in English.

Native Seeker Details:
- Name: ${name}
- Natal Ascendant (Lagna): ${ascendantSign}
- Natal Moon Sign (Janma Rashi): ${moonSign}
- Natal Nakshatra: ${birthNakshatra}
- Natal Sun Sign: ${sunSign}
- Place of Birth: ${pob}

Current Celestial Transit Date:
- Today's Date: ${dateFormatted}
- Transit Moon Sign: ${transitMoonSign}
- Transit Nakshatra: ${transitNakshatra}
- Transit Moon House relative to Natal Moon (Chandra Lagna): ${transitHouseFromMoon}th House

Task:
Generate a deeply detailed, authentic Daily Cosmic Reading for ${name} for today.
CRITICAL: Do NOT sugarcoat. Provide precise favorability ratings for the entire day overall, and for each of the 4 domains (Career, Finance, Love, Health).
Each favorability tag MUST be strictly one of: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"].

Return ONLY a valid JSON object with these exact keys:
{
  "cosmicScore": <number between 40 and 96 representing today's auspiciousness>,
  "overallFavorability": "<Exactly one of: 'WORST', 'BAD', 'GOOD', 'FAVOURABLE', 'HIGHLY FAVOURABLE'>",
  "cosmicMood": "<A 3-5 word evocative phrase describing today's overarching psychological and spiritual mood>",
  "luckyColor": "<1-2 auspicious colors for today based on transits>",
  "luckyNumber": "<lucky single or double digit number>",
  "auspiciousTime": "<auspicious time window today, e.g. '10:30 AM - 12:15 PM'>",
  "dailySummary": "<2 detailed, beautifully written paragraphs explaining the overall cosmic energy, transit Moon influence, and general life guidance for today>",
  "careerFavorability": "<Exactly one of: 'WORST', 'BAD', 'GOOD', 'FAVOURABLE', 'HIGHLY FAVOURABLE'>",
  "career": "<1-2 detailed paragraphs describing work, business, job focus, productivity, negotiations, and workplace dynamics today>",
  "financeFavorability": "<Exactly one of: 'WORST', 'BAD', 'GOOD', 'FAVOURABLE', 'HIGHLY FAVOURABLE'>",
  "finance": "<1-2 detailed paragraphs describing money flow, financial precautions, investment opportunities, and spending advice today>",
  "loveFavorability": "<Exactly one of: 'WORST', 'BAD', 'GOOD', 'FAVOURABLE', 'HIGHLY FAVOURABLE'>",
  "love": "<1-2 detailed paragraphs describing romantic connection, emotional harmony, partner dynamics, family bonding, or single prospects today>",
  "healthFavorability": "<Exactly one of: 'WORST', 'BAD', 'GOOD', 'FAVOURABLE', 'HIGHLY FAVOURABLE'>",
  "health": "<1-2 detailed paragraphs detailing energy levels, physical vitality, mental serenity, dietary precautions, and wellness practices for today>",
  "remedy": "<A practical, authentic Vedic astrological remedy, mantra, or auspicious daily practice for harmony and protection today>"
}`;

      let aiJson: any = null;
      const fallbackModels = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];

      for (const modelName of fallbackModels) {
        if (aiJson) break;

        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });
          if (response.text) {
            const cleanedText = response.text.replace(/```json\n?|```/g, "").trim();
            aiJson = JSON.parse(cleanedText);
            break;
          }
        } catch (err: any) {
          console.warn(`[Model: ${modelName}] Daily Insight AI failed. Error:`, err.message);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }

      if (aiJson) {
        dailyData = {
          ...dailyData,
          cosmicScore: typeof aiJson.cosmicScore === "number" ? aiJson.cosmicScore : 85,
          overallFavorability: normalizeFavorability(aiJson.overallFavorability, "FAVOURABLE"),
          careerFavorability: normalizeFavorability(aiJson.careerFavorability, "GOOD"),
          financeFavorability: normalizeFavorability(aiJson.financeFavorability, "FAVOURABLE"),
          loveFavorability: normalizeFavorability(aiJson.loveFavorability, "GOOD"),
          healthFavorability: normalizeFavorability(aiJson.healthFavorability, "FAVOURABLE"),
          cosmicMood: aiJson.cosmicMood || dailyData.cosmicMood,
          luckyColor: aiJson.luckyColor || dailyData.luckyColor,
          luckyNumber: String(aiJson.luckyNumber || dailyData.luckyNumber),
          auspiciousTime: aiJson.auspiciousTime || dailyData.auspiciousTime,
          dailySummary: aiJson.dailySummary || dailyData.dailySummary,
          career: aiJson.career || dailyData.career,
          finance: aiJson.finance || dailyData.finance,
          love: aiJson.love || dailyData.love,
          health: aiJson.health || dailyData.health,
          remedy: aiJson.remedy || dailyData.remedy,
        };
      }
    } catch (err: any) {
      console.error("All AI retries failed for Daily Insight.", err);
    }
  }

  return dailyData;
}
