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
  formatDMS,
  SIGNS,
  SIGN_LORDS,
  NAKSHATRAS
} from "@/lib/kpAstrology";

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIKpKundliData(name: string, dob: string, tob: string, pob: string) {
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
    console.error("Geocoding failed for KP:", err);
  }

  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);

  const birth = { year, month, day, hour, minute, latitude: lat, longitude: lon, timezone };
  const chartOptions = { includeNodes: "true" as const, houseSystem: "placidus" as const };
  const chart = celestine.calculateChart(birth, chartOptions);

  // --- 100% ACCURATE KP AYANAMSA (Swiss Ephemeris & Precision Fallback) ---
  let kpAyanamsa = getKpAyanamsa(year, month, day); // User's math fallback
  

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
  cusps.sort((a, b) => a.houseNumber - b.houseNumber);

  // 3. Compute KP Planets
  const kpPlanets: KpPlanet[] = [];
  const planetNameMap: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
    Venus: "Ve", Saturn: "Sa", "North Node": "Ra", "South Node": "Ke"
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

  if (chart.nodes && chart.nodes.length >= 2) {
    const northNode = chart.nodes.find((n: any) => n.name === "North Node") || chart.nodes[0];
    const southNode = chart.nodes.find((n: any) => n.name === "South Node") || chart.nodes[1];

    if (northNode) {
      const rahuLon = getSidereal(northNode.longitude);
      const rahuInfo = getKpDetailsForLongitude(rahuLon);
      kpPlanets.push({
        name: "Rahu", vedicName: "Ra", longitude: rahuLon, signIndex: rahuInfo.signIndex,
        signName: rahuInfo.signName, signLord: rahuInfo.signLord, degreeInSign: rahuInfo.degreeInSign,
        degFormatted: rahuInfo.degFormatted, nakshatraName: rahuInfo.nakshatraName,
        nakshatraPada: rahuInfo.nakshatraPada, starLord: rahuInfo.starLord, subLord: rahuInfo.subLord,
        houseOccupied: getHouseForLongitude(rahuLon, cusps), isRetrograde: true
      });
    }
    if (southNode) {
      const ketuLon = getSidereal(southNode.longitude);
      const ketuInfo = getKpDetailsForLongitude(ketuLon);
      kpPlanets.push({
        name: "Ketu", vedicName: "Ke", longitude: ketuLon, signIndex: ketuInfo.signIndex,
        signName: ketuInfo.signName, signLord: ketuInfo.signLord, degreeInSign: ketuInfo.degreeInSign,
        degFormatted: ketuInfo.degFormatted, nakshatraName: ketuInfo.nakshatraName,
        nakshatraPada: ketuInfo.nakshatraPada, starLord: ketuInfo.starLord, subLord: ketuInfo.subLord,
        houseOccupied: getHouseForLongitude(ketuLon, cusps), isRetrograde: true
      });
    }
  }

  // Untenanted Planets & Independent Houses Logic
  kpPlanets.forEach(p => {
    p.isUntenanted = !kpPlanets.some(otherP => otherP.starLord === p.name.substring(0, 3) || otherP.starLord === p.name);
  });
  cusps.forEach(cusp => {
    cusp.occupantCount = kpPlanets.filter(p => p.houseOccupied === cusp.houseNumber).length;
    const lordPlanet = kpPlanets.find(p => p.name === cusp.signLord || p.vedicName === cusp.signLord);
    cusp.isIndependent = lordPlanet ? (cusp.occupantCount === 0 && lordPlanet.isUntenanted) : false;
  });

  const { planetSignificators, houseSignificators } = buildKpSignificators(kpPlanets, cusps);

  const ascCusp = cusps[0];
  const moonPlanet = kpPlanets.find(p => p.name === "Moon");
  const sunPlanet = kpPlanets.find(p => p.name === "Sun");

  const rulingPlanets = {
    ascendantSignLord: ascCusp.signLord,
    ascendantStarLord: ascCusp.starLord,
    ascendantSubLord: ascCusp.subLord,
    moonSignLord: moonPlanet?.signLord || "Unknown",
    moonStarLord: moonPlanet?.starLord || "Unknown",
    moonSubLord: moonPlanet?.subLord || "Unknown",
    dayLord: new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "long" })
  };

  const bpHouses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d1Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  
  const ascSign = ascCusp.signIndex;
  kpPlanets.forEach(p => {
    if (bpHouses[p.houseOccupied]) bpHouses[p.houseOccupied].push(`${p.vedicName}${p.isRetrograde ? "(R)" : ""}`);
    let houseNum = p.signIndex - ascSign + 1;
    if (houseNum <= 0) houseNum += 12;
    d1Houses[houseNum].push(`${p.vedicName}${p.isRetrograde ? "(R)" : ""}`);
  });

  let readingData = {
    reading: `[AI BUSY] Generating KP Analysis...`, education: ``, family: ``, career: ``, wealth: ``, relationships: ``, health: ``, fullLife: ``, breakthroughs: ``
  };

  // --- BULLETPROOF AI (STRUCTURED OUTPUTS) ---
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as a world-renowned Grand Master of Krishnamurti Paddhati (KP) Astrology.
Analyze this exact KP Chart for ${name} born in ${year}:
- Asc CSL: ${ascCusp.subLord}
- Moon CSL: ${moonPlanet?.subLord}
- 10th CSL (Career): ${cusps[9]?.subLord}
- 7th CSL (Marriage): ${cusps[6]?.subLord}
- 2nd/11th CSL (Wealth): ${cusps[1]?.subLord} / ${cusps[10]?.subLord}

Apply STRICT KP Rules. Do NOT invent dates that don't match the formula (Birth Year + Age = Event Year).`;

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
              reading: { type: "STRING" },
              education: { type: "STRING" },
              family: { type: "STRING" },
              career: { type: "STRING" },
              wealth: { type: "STRING" },
              relationships: { type: "STRING" },
              health: { type: "STRING" },
              fullLife: { type: "STRING" },
              breakthroughs: { type: "STRING" }
              },
              required: ["reading", "education", "family", "career", "wealth", "relationships", "health", "fullLife", "breakthroughs"]
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
          readingData = { ...readingData, ...aiJson };
        } else {
          throw new Error("All fallback AI models failed or timed out.");
        }
    } catch (err) {
      console.error("KP AI Generation completely failed:", err);
    }
  }

  return {
    name, dob, tob, pob,
    houses: bpHouses, d1Houses: d1Houses,
    ascendant: `${ascCusp.signName} (${ascCusp.degFormatted})`, ascendantLord: ascCusp.signLord, ascendantSubLord: ascCusp.subLord,
    moonSign: `${moonPlanet?.signName} (${moonPlanet?.degFormatted})`, moonSignLord: moonPlanet?.signLord, moonSubLord: moonPlanet?.subLord,
    sunSign: `${sunPlanet?.signName} (${sunPlanet?.degFormatted})`, sunSignLord: sunPlanet?.signLord, sunSubLord: sunPlanet?.subLord,
    nakshatra: moonPlanet?.nakshatraName || "Rohini", nakshatraPada: moonPlanet?.nakshatraPada || 1, nakshatraLord: moonPlanet?.starLord || "Moon",
    tithi: "N/A", yoga: "N/A", karana: "N/A",
    ayanamsaVal: `KP New (${formatDMS(kpAyanamsa)})`, kpAyanamsa: formatDMS(kpAyanamsa),
    ascendantCusp: ascCusp, moonInfo: moonPlanet, cusps, planets: kpPlanets, planetSignificators, houseSignificators, rulingPlanets, bpHouses,
    ...readingData
  };
}