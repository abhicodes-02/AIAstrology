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
    Sun: "Su",
    Moon: "Mo",
    Mars: "Ma",
    Mercury: "Me",
    Jupiter: "Ju",
    Venus: "Ve",
    Saturn: "Sa",
    "North Node": "Ra",
    "South Node": "Ke"
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
        vedicName: "Ra",
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
        vedicName: "Ke",
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

  // 6. Map planets into KP Bhava Houses (1 to 12) for Chart Rendering
  const bpHouses: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };
  kpPlanets.forEach(p => {
    if (bpHouses[p.houseOccupied]) {
      const label = `${p.vedicName}${p.isRetrograde ? "(R)" : ""}`;
      bpHouses[p.houseOccupied].push(label);
    }
  });

  // Calculate D-1 Rashi Houses (Sign-based) for dual comparison like Vedic
  const ascSign = ascCusp.signIndex;
  const d1Houses: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };
  kpPlanets.forEach(p => {
    let houseNum = p.signIndex - ascSign + 1;
    if (houseNum <= 0) houseNum += 12;
    const label = `${p.vedicName}${p.isRetrograde ? "(R)" : ""}`;
    d1Houses[houseNum].push(label);
  });

  // Panchang calculations in KP
  const siderealMoon = moonPlanet ? moonPlanet.longitude : 0;
  const siderealSun = sunPlanet ? sunPlanet.longitude : 0;
  let tithiDeg = siderealMoon - siderealSun;
  if (tithiDeg < 0) tithiDeg += 360;
  const tithiIndex = Math.floor(tithiDeg / 12) + 1;
  const paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
  const tithiNumber = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
  const tithi = `${paksha} ${tithiNumber}`;

  let yogaDeg = siderealMoon + siderealSun;
  if (yogaDeg >= 360) yogaDeg -= 360;
  const yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const yoga = yogas[Math.floor(yogaDeg / (360 / 27))];

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

  // Default fallback KP Reading exactly structured with Vedic-matching depth
  let readingData = {
    reading: `In Krishnamurti Paddhati (KP) astrology, your cosmic blueprint is anchored by the 1st Cusp Sub-Lord (${ascCusp.subLord}) and Moon's Sub-Lord (${moonPlanet?.subLord || "N/A"}). While planetary sign placement represents the raw potential, the Cuspal Sub-Lord (CSL) serves as the ultimate gatekeeper that confirms the realization and quality of your life events. Your chart demonstrates strong analytical intuition, purposeful tenacity, and an ability to navigate life transitions with strategic patience.`,
    career: `Career matters are governed by the 10th Cuspal Sub-Lord (${cusps[9]?.subLord}) connecting through houses 2, 6, 10, and 11. Your primary career significators indicate calculated analytical execution and steady milestone realization. When transits trigger these ruling sub-lords, professional elevation, leadership acknowledgment, and impactful authority manifest without obstruction.`,
    wealth: `Wealth accumulation is dictated by the 2nd Cusp Sub-Lord (${cusps[1]?.subLord}) and 11th Cusp Sub-Lord (${cusps[10]?.subLord}). When transits activate these star lords, lucrative earning avenues and solid asset acquisition open seamlessly. Prudent, long-range diversification protects against unforced losses and guarantees lasting fiscal sovereignty.`,
    relationships: `Marriage and intimate partnerships are analyzed through the 7th Cusp Sub-Lord (${cusps[6]?.subLord}). The cosmic sub-lord indicates deep emotional bonds tempered by mutual respect, intellectual harmony, and pragmatic expectations. Navigating partnerships through clear, transparent communication ensures marital contentment and enduring trust.`,
    health: `Physical vitality is guided by the 1st Cusp Sub-Lord (${ascCusp.subLord}) resisting 6th and 8th house afflictions. A consistent lifestyle, mindful nervous system regulation, and disciplined dietary routine ensure enduring stamina, vibrant prana, and balanced wellness.`,
    fullLife: `Synthesizing your KP chart, your life journey demonstrates a continuous evolution from self-reliance to profound mastery. Your primary Ruling Planets (${rulingPlanets.ascendantStarLord}, ${rulingPlanets.moonStarLord}, ${rulingPlanets.moonSignLord}) serve as cosmic chronometers. Whenever major planetary transits and Dasha lords align with these exact Sub-Lords, transformative opportunities and life-defining milestones come to fruition with supreme certainty.`
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
  "reading": "A deeply inspiring and expansive Core Soul Urge reading synthesizing the Ascendant & Moon Cuspal Sub-Lords and the seeker's psychological & spiritual blueprint.",
  "career": "Detailed analysis of Career & Power through the 10th Cuspal Sub-Lord and connections to houses 2, 6, 10, 11.",
  "wealth": "Detailed analysis of Wealth & Finance through the 2nd and 11th Cuspal Sub-Lords.",
  "relationships": "Detailed analysis of Love & Destiny through the 7th Cuspal Sub-Lord.",
  "health": "Detailed analysis of Health & Vitality through the 1st CSL resisting 6th/8th houses.",
  "fullLife": "Comprehensive Ultimate Life Path narrative detailing the trajectory of destiny, peak periods, and timing milestones guided by the Ruling Planets."
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
    houses: bpHouses, // KP Placidus Bhava houses for Chart 1
    d1Houses: d1Houses, // KP Rashi houses for Chart 2
    ascendant: `${ascCusp.signName} (${ascCusp.degFormatted})`,
    ascendantLord: ascCusp.signLord,
    ascendantSubLord: ascCusp.subLord,
    moonSign: `${moonPlanet?.signName} (${moonPlanet?.degFormatted})`,
    moonSignLord: moonPlanet?.signLord,
    moonSubLord: moonPlanet?.subLord,
    sunSign: `${sunPlanet?.signName} (${sunPlanet?.degFormatted})`,
    sunSignLord: sunPlanet?.signLord,
    sunSubLord: sunPlanet?.subLord,
    nakshatra: moonPlanet?.nakshatraName || "Rohini",
    nakshatraPada: moonPlanet?.nakshatraPada || 1,
    nakshatraLord: moonPlanet?.starLord || "Moon",
    tithi,
    yoga,
    karana,
    ayanamsaVal: `KP New (${formatDMS(kpAyanamsa)})`,
    kpAyanamsa: formatDMS(kpAyanamsa),
    ascendantCusp: ascCusp,
    moonInfo: moonPlanet,
    cusps,
    planets: kpPlanets,
    planetSignificators,
    houseSignificators,
    rulingPlanets,
    bpHouses,
    reading: readingData.reading,
    career: readingData.career,
    wealth: readingData.wealth,
    relationships: readingData.relationships,
    health: readingData.health,
    fullLife: readingData.fullLife
  };
}
