"use server";

import * as celestine from "celestine";
import { GoogleGenAI } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";
import {
  getKpAyanamsa,
  getKpDetailsForLongitude,
  getHouseForLongitude,
  buildKpSignificators,
  KpPlanet,
  KpCusp,
  formatDMS
} from "@/lib/kpAstrology";

export async function fetchAIKpKundliData(name: string, dob: string, tob: string, pob: string) {
  // 1. Geocode location
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
    console.error("Geocoding failed for KP:", err);
  }

  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);

  const birth = { year, month, day, hour, minute, latitude: lat, longitude: lon, timezone };

  // Calculate Chart using celestine with Placidus house system & true nodes
  const chartOptions = { includeNodes: "true" as const, houseSystem: "placidus" as const };
  const chart = celestine.calculateChart(birth, chartOptions);

  // KP New Ayanamsa
  const kpAyanamsa = getKpAyanamsa(year, month, day);

  function getSidereal(tropical: number) {
    let sid = tropical - kpAyanamsa;
    if (sid < 0) sid += 360;
    return sid;
  }

  // 2. Compute 12 Placidus Cusps (Sidereal KP)
  const cusps: KpCusp[] = [];
  chart.houses.cusps.forEach((c: any) => {
    const siderealLon = getSidereal(c.longitude);
    const kpInfo = getKpDetailsForLongitude(siderealLon);
    cusps.push({
      houseNumber: c.house,
      longitude: siderealLon,
      signIndex: kpInfo.signIndex,
      signName: kpInfo.signName,
      signLord: kpInfo.signLord,
      degreeInSign: kpInfo.degreeInSign,
      degFormatted: kpInfo.degFormatted,
      nakshatraName: kpInfo.nakshatraName,
      starLord: kpInfo.starLord,
      subLord: kpInfo.subLord
    });
  });

  // Ensure cusps sorted 1 to 12
  cusps.sort((a, b) => a.houseNumber - b.houseNumber);

  // 3. Compute KP Planets (Sun to Ketu)
  const kpPlanets: KpPlanet[] = [];

  const planetNameMap: Record<string, string> = {
    Sun: "Surya",
    Moon: "Chandra",
    Mars: "Mangal",
    Mercury: "Budha",
    Jupiter: "Guru",
    Venus: "Shukra",
    Saturn: "Shani",
    "North Node": "Rahu",
    "South Node": "Ketu"
  };

  chart.planets.forEach((p: any) => {
    if (planetNameMap[p.name]) {
      const siderealLon = getSidereal(p.longitude);
      const kpInfo = getKpDetailsForLongitude(siderealLon);
      const houseOccupied = getHouseForLongitude(siderealLon, cusps);
      kpPlanets.push({
        name: p.name,
        vedicName: planetNameMap[p.name] || p.name,
        longitude: siderealLon,
        signIndex: kpInfo.signIndex,
        signName: kpInfo.signName,
        signLord: kpInfo.signLord,
        degreeInSign: kpInfo.degreeInSign,
        degFormatted: kpInfo.degFormatted,
        nakshatraName: kpInfo.nakshatraName,
        nakshatraPada: kpInfo.nakshatraPada,
        starLord: kpInfo.starLord,
        subLord: kpInfo.subLord,
        houseOccupied,
        isRetrograde: Boolean(p.isRetrograde)
      });
    }
  });

  // Rahu & Ketu from nodes
  if (chart.nodes && chart.nodes.length >= 2) {
    const northNode = chart.nodes.find((n: any) => n.name === "North Node") || chart.nodes[0];
    const southNode = chart.nodes.find((n: any) => n.name === "South Node") || chart.nodes[1];

    if (northNode) {
      const rahuLon = getSidereal(northNode.longitude);
      const rahuInfo = getKpDetailsForLongitude(rahuLon);
      kpPlanets.push({
        name: "Rahu",
        vedicName: "Rahu",
        longitude: rahuLon,
        signIndex: rahuInfo.signIndex,
        signName: rahuInfo.signName,
        signLord: rahuInfo.signLord,
        degreeInSign: rahuInfo.degreeInSign,
        degFormatted: rahuInfo.degFormatted,
        nakshatraName: rahuInfo.nakshatraName,
        nakshatraPada: rahuInfo.nakshatraPada,
        starLord: rahuInfo.starLord,
        subLord: rahuInfo.subLord,
        houseOccupied: getHouseForLongitude(rahuLon, cusps),
        isRetrograde: true
      });
    }

    if (southNode) {
      const ketuLon = getSidereal(southNode.longitude);
      const ketuInfo = getKpDetailsForLongitude(ketuLon);
      kpPlanets.push({
        name: "Ketu",
        vedicName: "Ketu",
        longitude: ketuLon,
        signIndex: ketuInfo.signIndex,
        signName: ketuInfo.signName,
        signLord: ketuInfo.signLord,
        degreeInSign: ketuInfo.degreeInSign,
        degFormatted: ketuInfo.degFormatted,
        nakshatraName: ketuInfo.nakshatraName,
        nakshatraPada: ketuInfo.nakshatraPada,
        starLord: ketuInfo.starLord,
        subLord: ketuInfo.subLord,
        houseOccupied: getHouseForLongitude(ketuLon, cusps),
        isRetrograde: true
      });
    }
  }

  // 4. Build 4-Fold Significators (A, B, C, D)
  const { planetSignificators, houseSignificators } = buildKpSignificators(kpPlanets, cusps);

  // 5. Ruling Planets (RP) at moment of birth/query
  const ascCusp = cusps[0];
  const moonPlanet = kpPlanets.find(p => p.name === "Moon");

  const rulingPlanets = {
    ascendantSignLord: ascCusp.signLord,
    ascendantStarLord: ascCusp.starLord,
    ascendantSubLord: ascCusp.subLord,
    moonSignLord: moonPlanet?.signLord || "Unknown",
    moonStarLord: moonPlanet?.starLord || "Unknown",
    moonSubLord: moonPlanet?.subLord || "Unknown",
    dayLord: new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "long" })
  };

  // 6. Map planets into KP Bhava Houses (1 to 12) for Chart Rendering
  const bpHouses: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };
  kpPlanets.forEach(p => {
    if (bpHouses[p.houseOccupied]) {
      bpHouses[p.houseOccupied].push(p.name + (p.isRetrograde ? " (R)" : ""));
    }
  });

  // Default fallback KP Reading
  let readingData = {
    kpSummary: `In Krishnamurti Paddhati (KP) astrology, your chart is anchored by the 1st Cusp Sub-Lord (${ascCusp.subLord}) and Moon's Sub-Lord (${moonPlanet?.subLord || "N/A"}). The sub-lords govern the ultimate fructification and timing of your life destiny.`,
    careerKp: `Career matters are governed by the 10th Cuspal Sub-Lord (${cusps[9]?.subLord}) connecting through houses 2, 6, 10, and 11. Your primary career significators indicate calculated analytical execution and steady milestone realization.`,
    financeKp: `Wealth accumulation is dictated by the 2nd Cusp Sub-Lord (${cusps[1]?.subLord}) and 11th Cusp Sub-Lord (${cusps[10]?.subLord}). When transits activate these star lords, lucrative earning avenues open seamlessly.`,
    relationshipKp: `Marriage and close partnerships are analyzed through the 7th Cusp Sub-Lord (${cusps[6]?.subLord}). The cosmic sub-lord indicates deep emotional bonds with pragmatic mutual respect.`,
    healthKp: `Vitality is guided by the 1st Cusp Sub-Lord (${ascCusp.subLord}) resisting 6th and 8th house afflictions. A consistent lifestyle and disciplined dietary routine ensure enduring stamina.`,
    rulingPlanetsAdvice: `Your key KP Ruling Planets (${rulingPlanets.ascendantStarLord}, ${rulingPlanets.moonStarLord}, ${rulingPlanets.moonSignLord}) serve as cosmic chronometers. Whenever major transits cross these stars, crucial life events manifest.`
  };

  // 7. Generate Deep KP AI Predictions with Gemini
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a world-renowned Grand Master of Krishnamurti Paddhati (KP) Astrology.
A seeker named ${name} has provided their exact birth chart details computed with KP New Ayanamsa and Placidus House Cusps:

- Ascendant Cusp (1st House): ${ascCusp.degFormatted} in ${ascCusp.signName} | Star Lord: ${ascCusp.starLord} | Sub-Lord: ${ascCusp.subLord}
- Moon: ${moonPlanet?.degFormatted} in ${moonPlanet?.signName} | Star Lord: ${moonPlanet?.starLord} | Sub-Lord: ${moonPlanet?.subLord}
- 2nd Cusp (Wealth): Sub-Lord is ${cusps[1]?.subLord}
- 7th Cusp (Marriage & Partnerships): Sub-Lord is ${cusps[6]?.subLord}
- 10th Cusp (Career & Status): Sub-Lord is ${cusps[9]?.subLord}
- 11th Cusp (Gains & Fulfillment): Sub-Lord is ${cusps[10]?.subLord}

Planet Positions and Sub-Lords:
${kpPlanets.map(p => `${p.name}: House ${p.houseOccupied} in ${p.signName} (${p.degFormatted}) | Star: ${p.starLord} | Sub: ${p.subLord}`).join("\n")}

KP Ruling Planets:
Asc Star Lord: ${rulingPlanets.ascendantStarLord}, Moon Star Lord: ${rulingPlanets.moonStarLord}, Moon Sign Lord: ${rulingPlanets.moonSignLord}, Day Lord: ${rulingPlanets.dayLord}.

Apply STRICT KP Astrology principles:
1. "The Planet represents the Source, the Star Lord represents the Nature of the Event, and the Sub-Lord decides the Final Fructification (Yes or No)."
2. Career: Analyze 10th Cuspal Sub-Lord (CSL) linking to houses 2, 6, 10, 11 (success) vs 5, 8, 12 (setbacks).
3. Finance: Analyze 2nd and 11th CSL.
4. Marriage/Relationships: Analyze 7th CSL linking to 2, 7, 11 (harmony) vs 1, 6, 10 (separation/delay).
5. Health: 1st CSL vs 6, 8, 12.
6. Ruling Planets guidance for timing events.

Return ONLY a valid JSON object matching this exact schema:
{
  "kpSummary": "Thorough KP assessment explaining the core Ascendant and Moon sub-lords and overall life blueprint.",
  "careerKp": "Deeply technical yet clear KP analysis of the 10th house cuspal sub lord and career trajectory.",
  "financeKp": "Deep KP analysis of the 2nd and 11th house cuspal sub lords and wealth prosperity.",
  "relationshipKp": "Clear KP evaluation of the 7th house cuspal sub lord and partnership dynamics.",
  "healthKp": "KP analysis of 1st and 6th houses for physical vitality and wellness guidance.",
  "rulingPlanetsAdvice": "Actionable timing advice on how to use their Ruling Planets (RP) for auspicious beginnings."
}`;

      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ];

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          });

          if (response.text) {
            const cleaned = response.text.replace(/```json\n?|```/g, "").trim();
            const parsed = JSON.parse(cleaned);
            readingData = { ...readingData, ...parsed };
            break;
          }
        } catch (err: any) {
          console.warn(`[Model: ${modelName}] KP AI failed:`, err.message);
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    } catch (err) {
      console.error("KP AI Generation completely failed:", err);
    }
  }

  return {
    name,
    dob,
    tob,
    pob,
    kpAyanamsa: formatDMS(kpAyanamsa),
    ascendantCusp: ascCusp,
    moonInfo: moonPlanet,
    cusps,
    planets: kpPlanets,
    planetSignificators,
    houseSignificators,
    rulingPlanets,
    bpHouses,
    readings: readingData
  };
}
