"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";
import {
  getKpAyanamsa,
  getKpDetailsForLongitude,
  getHouseForLongitude,
  KpCusp,
  formatDMS
} from "@/lib/kpAstrology";

export async function fetchAIKpDailyInsightData(
  name: string,
  dob: string,
  tob: string,
  pob: string,
  targetDateStr?: string
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
    console.error("Geocoding failed for KP Daily Insight:", err);
  }

  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);

  // 1. Birth Chart (KP)
  const birthAyanamsa = getKpAyanamsa(year, month, day);
  const birthChart = celestine.calculateChart(
    { year, month, day, hour, minute, latitude: lat, longitude: lon, timezone },
    { includeNodes: "true", houseSystem: "placidus" }
  );

  const natalMoon = birthChart.planets.find((p: any) => p.name === "Moon");
  const natalAsc = birthChart.houses.cusps.find((c: any) => c.house === 1);
  const natalSun = birthChart.planets.find((p: any) => p.name === "Sun");

  const siderealNatalMoonLon = natalMoon ? ((natalMoon.longitude - birthAyanamsa + 360) % 360) : 0;
  const natalMoonKp = getKpDetailsForLongitude(siderealNatalMoonLon);

  const siderealNatalAscLon = natalAsc ? ((natalAsc.longitude - birthAyanamsa + 360) % 360) : 0;
  const natalAscKp = getKpDetailsForLongitude(siderealNatalAscLon);

  const siderealNatalSunLon = natalSun ? ((natalSun.longitude - birthAyanamsa + 360) % 360) : 0;
  const natalSunKp = getKpDetailsForLongitude(siderealNatalSunLon);

  // 2. Target Day Transit Chart (KP)
  let currentYear: number;
  let currentMonth: number;
  let currentDay: number;
  let currentHour: number;
  let currentMinute: number;

  if (targetDateStr) {
    const parts = targetDateStr.split("-").map(Number);
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      currentYear = parts[0];
      currentMonth = parts[1];
      currentDay = parts[2];
      currentHour = 12; // Noon snapshot for target day
      currentMinute = 0;
    } else {
      const parsed = new Date(targetDateStr);
      currentYear = parsed.getUTCFullYear();
      currentMonth = parsed.getUTCMonth() + 1;
      currentDay = parsed.getUTCDate();
      currentHour = 12;
      currentMinute = 0;
    }
  } else {
    // Current live time converted to native's local timezone (offset in hours)
    const utcNow = Date.now();
    const localTimestamp = utcNow + timezone * 3600 * 1000;
    const localDate = new Date(localTimestamp);
    currentYear = localDate.getUTCFullYear();
    currentMonth = localDate.getUTCMonth() + 1;
    currentDay = localDate.getUTCDate();
    currentHour = localDate.getUTCHours();
    currentMinute = localDate.getUTCMinutes();
  }

  const targetDateISO = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;
  const displayDateObj = new Date(Date.UTC(currentYear, currentMonth - 1, currentDay, 12, 0, 0));
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(displayDateObj);

  const transitAyanamsa = getKpAyanamsa(currentYear, currentMonth, currentDay);
  const transitChart = celestine.calculateChart(
    {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      hour: currentHour,
      minute: currentMinute,
      latitude: lat,
      longitude: lon,
      timezone
    },
    { includeNodes: "true", houseSystem: "placidus" }
  );

  const transitMoon = transitChart.planets.find((p: any) => p.name === "Moon");
  const siderealTransitMoonLon = transitMoon ? ((transitMoon.longitude - transitAyanamsa + 360) % 360) : 0;
  const transitMoonKp = getKpDetailsForLongitude(siderealTransitMoonLon);

  // Calculate Natal Placidus Cusps to determine transit Moon house
  const natalCusps: { houseNumber: number; longitude: number }[] = birthChart.houses.cusps.map((c: any) => ({
    houseNumber: c.house,
    longitude: ((c.longitude - birthAyanamsa + 360) % 360)
  }));
  const transitHouseOccupied = getHouseForLongitude(siderealTransitMoonLon, natalCusps);

  type FavorabilityLevel = "WORST" | "BAD" | "GOOD" | "FAVOURABLE" | "HIGHLY FAVOURABLE";

  function normalizeFavorability(val: any, defaultVal = "GOOD"): FavorabilityLevel {
    if (!val || typeof val !== "string") return defaultVal as FavorabilityLevel;
    const upper = val.toUpperCase().trim();
    if (upper.includes("HIGHLY") || upper.includes("EXCELLENT")) return "HIGHLY FAVOURABLE";
    if (upper.includes("FAVOURABLE") || upper.includes("FAVORABLE")) return "FAVOURABLE";
    if (upper.includes("WORST") || upper.includes("TERRIBLE")) return "WORST";
    if (upper.includes("BAD") || upper.includes("POOR") || upper.includes("CHALLENGING")) return "BAD";
    if (upper.includes("GOOD") || upper.includes("AVERAGE") || upper.includes("MODERATE")) return "GOOD";
    return defaultVal as FavorabilityLevel;
  }

  // Fallback data with all matching fields as Vedic Daily Insight
  let kpDailyData = {
    dateFormatted,
    targetDate: targetDateISO,
    natalMoonSign: natalMoonKp.signName,
    natalAscendant: natalAscKp.signName,
    natalSunSign: natalSunKp.signName,
    birthNakshatra: natalMoonKp.nakshatraName,
    transitMoonSign: transitMoonKp.signName,
    transitNakshatra: transitMoonKp.nakshatraName,
    transitHouseFromMoon: transitHouseOccupied,
    transitStarLord: transitMoonKp.starLord,
    transitSubLord: transitMoonKp.subLord,
    cosmicScore: 86,
    overallFavorability: "FAVOURABLE" as FavorabilityLevel,
    careerFavorability: "GOOD" as FavorabilityLevel,
    financeFavorability: "FAVOURABLE" as FavorabilityLevel,
    loveFavorability: "GOOD" as FavorabilityLevel,
    healthFavorability: "FAVOURABLE" as FavorabilityLevel,
    cosmicMood: `KP Sub-Lord ${transitMoonKp.subLord} Activation`,
    luckyColor: "Emerald Teal & Pearlescent Silver",
    luckyNumber: "5",
    auspiciousTime: "10:15 AM - 12:45 PM",
    dailySummary: `In KP Astrology, today's transit Moon enters ${transitMoonKp.signName} in ${transitMoonKp.nakshatraName} Nakshatra (${transitMoonKp.starLord} Star Lord), actively vibrating under ${transitMoonKp.subLord} Sub-Lord. This dynamically energizes your ${transitHouseOccupied}th Placidus house relative to your natal Ascendant. Because the Sub-Lord holds the ultimate decision key in Krishnamurti Paddhati, aligning your priorities with calm discernment and technical facts ensures outstanding fruition across all day-long undertakings.`,
    career: `Professionally, the active Cuspal Sub-Lord inspires strategic problem-solving and calm deliberation. The placement of the transit Moon in the ${transitHouseOccupied}th house encourages you to address pending responsibilities without succumbing to workplace urgency. It is an auspicious day for constructive communication with superiors, drafting high-impact proposals, and refining operational details. Let calculated patience showcase your innate leadership acumen.`,
    finance: `On the financial front, the KP planetary alignment encourages prudence and mindful resource allocation. Favorable alignments suggest steady cash flow, but caution is advised against impulsive speculative moves or spontaneous retail therapy. Reviewing investments, organizing budgets, and planning long-term security maneuvers will yield substantial dividends under this sub-lord.`,
    love: `Your emotional world is enveloped in warmth, tenderness, and mutual empathy. For partnered seekers, honest conversations and small gestures of affection will deepen your emotional bond effortlessly. If tensions have lingered in recent days, the harmonious Star Lord provides a soothing balm to resolve misunderstandings. Single seekers will radiate an authentic, magnetic charm today.`,
    health: `Your vitality remains strong, provided you stay attuned to your body's subtle rhythms. The energetic transits emphasize nervous system balance, hydration, and mindful breathing. Avoid excessive caffeine or late-night mental overstimulation. Engaging in light meditation will ground your vital prana and elevate your stamina across all daylight hours.`,
    remedy: `To harmonize the Sub-Lord vibration of ${transitMoonKp.subLord}, spend 5 minutes in peaceful meditation during the morning hours facing east, visualizing serene celestial light and affirming positive intent.`
  };

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an elite Krishnamurti Paddhati (KP) Astrology Master.
Analyze the daily transits for seeker ${name} born on ${dob} in ${pob}.

KP Chart Data for Today:
- Natal Ascendant: ${natalAscKp.signName} (Sub-Lord: ${natalAscKp.subLord})
- Natal Moon: ${natalMoonKp.signName} (Star: ${natalMoonKp.starLord}, Sub-Lord: ${natalMoonKp.subLord})
- Current Transit Moon: ${transitMoonKp.signName} at ${transitMoonKp.degFormatted}
- Transit Moon Star Lord: ${transitMoonKp.starLord}
- Transit Moon Sub-Lord: ${transitMoonKp.subLord}
- Placidus House Activated: ${transitHouseOccupied}th House
- Date: ${dateFormatted}

KP Daily Prediction Rules:
1. The Transit Moon Star Lord sets the atmosphere and primary event category.
2. The Transit Moon Sub-Lord decides whether the fruit is positive, neutral, or delayed.
3. Determine favorability tags strictly among: ["WORST", "BAD", "GOOD", "FAVOURABLE", "HIGHLY FAVOURABLE"].

Return ONLY a JSON object:
{
  "cosmicScore": 85,
  "overallFavorability": "FAVOURABLE",
  "careerFavorability": "GOOD",
  "financeFavorability": "FAVOURABLE",
  "loveFavorability": "GOOD",
  "healthFavorability": "FAVOURABLE",
  "cosmicMood": "Brief mood description mentioning active sub-lord",
  "luckyColor": "Color name",
  "luckyNumber": "7",
  "auspiciousTime": "Time range, e.g. 10:30 AM - 12:45 PM",
  "dailySummary": "Comprehensive KP daily analysis emphasizing Star Lord & Sub Lord operations.",
  "career": "Specific KP career forecast for today.",
  "finance": "Specific KP financial forecast for today.",
  "love": "Specific KP relationship forecast for today.",
  "health": "Specific KP health forecast for today.",
  "remedy": "Specific KP harmonic remedy aligning with the active Sub-Lord."
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
            kpDailyData = {
              ...kpDailyData,
              ...parsed,
              overallFavorability: normalizeFavorability(parsed.overallFavorability, "FAVOURABLE"),
              careerFavorability: normalizeFavorability(parsed.careerFavorability, "GOOD"),
              financeFavorability: normalizeFavorability(parsed.financeFavorability, "FAVOURABLE"),
              loveFavorability: normalizeFavorability(parsed.loveFavorability, "GOOD"),
              healthFavorability: normalizeFavorability(parsed.healthFavorability, "FAVOURABLE")
            };
            break;
          }
        } catch (e: any) {
          console.warn(`KP Daily AI ${m} failed:`, e.message);
        }
      }
    } catch (err) {
      console.error("KP Daily Insight AI generation failed:", err);
    }
  }

  return kpDailyData;
}
