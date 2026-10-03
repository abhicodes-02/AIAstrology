"use server";

import * as celestine from "celestine";
import { calculateVimshottariDasha, DASHA_ORDER } from "@/lib/dasha";
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


function getHotDates(cuspLongitude: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hotDates = [];
  const angles = [0, 120, 180, 240]; // Conjunct, Trine, Opposition
  
  for (const angle of angles) {
    let targetDegree = (cuspLongitude + angle) % 360;
    let d = new Date(2024, 3, 14); // Approx Aries Ingress (Lahiri)
    d.setDate(d.getDate() + Math.round(targetDegree * 1.0145));
    hotDates.push(`${months[d.getMonth()]} ${d.getDate()}`);
  }
  return hotDates.join(', ');
}

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIKpKundliData(name: string, dob: string, tob: string, pob: string, lifeStage: string = "student", relationshipStatus: string = "single") {
  let lat = 22.5726;
  let lon = 88.3639;
  let countryCode = "in";
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pob)}&format=json&limit=1&addressdetails=1`, { 
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
  const birthDateObj = new Date(year, month - 1, day);
  const monthName = birthDateObj.toLocaleString("en-US", { month: "long" });
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
      subLord: kpInfo.subLord, subSubLord: kpInfo.subSubLord
    });
  });
  cusps.sort((a, b) => a.houseNumber - b.houseNumber);

  // 3. Compute KP Planets
  const kpPlanets: KpPlanet[] = [];
  const planetNameMap: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
    Venus: "Ve", Saturn: "Sa", "North Node": "Ra", "South Node": "Ke"
  };

  
  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d10Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d24Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  
  const ascSidereal = getSidereal(chart.houses.cusps[0].longitude);
  const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;
  const ascD10Sign = getDasamsaSign(ascSidereal);
  const ascD24Sign = getD24Sign(ascSidereal);
  
chart.planets.forEach((p: any) => {
    if (planetNameMap[p.name]) {
      const siderealLon = getSidereal(p.longitude);
      const kpInfo = getKpDetailsForLongitude(siderealLon);
      const houseOccupied = getHouseForLongitude(siderealLon, cusps);
      
      const pSidereal = p.longitude;
      const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
      let d9House = pNavamsaSign - ascNavamsaSign + 1;
      if (d9House <= 0) d9House += 12;
      d9Houses[d9House].push(p.name);
      
      const pD10Sign = getDasamsaSign(pSidereal);
      let d10House = pD10Sign - ascD10Sign + 1;
      if (d10House <= 0) d10House += 12;
      d10Houses[d10House].push(p.name);

      const pD24Sign = getD24Sign(pSidereal);
      let d24House = pD24Sign - ascD24Sign + 1;
      if (d24House <= 0) d24House += 12;
      d24Houses[d24House].push(p.name);

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
        subLord: kpInfo.subLord, subSubLord: kpInfo.subSubLord,
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
        nakshatraPada: rahuInfo.nakshatraPada, starLord: rahuInfo.starLord, subLord: rahuInfo.subLord, subSubLord: rahuInfo.subSubLord,
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
        nakshatraPada: ketuInfo.nakshatraPada, starLord: ketuInfo.starLord, subLord: ketuInfo.subLord, subSubLord: ketuInfo.subSubLord,
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

  
    const careerHotDates = cusps[9] ? getHotDates(cusps[9].longitude) : "";
    const wealthHotDates = cusps[10] ? getHotDates(cusps[10].longitude) : "";
    const marriageHotDates = cusps[6] ? getHotDates(cusps[6].longitude) : "";

    const ascCusp = cusps[0];
  const moonPlanet = kpPlanets.find(p => p.name === "Moon");
  const sunPlanet = kpPlanets.find(p => p.name === "Sun");


  // MATHEMATICAL TITHI, YOGA, KARANA
  const siderealMoon = moonPlanet ? moonPlanet.longitude : 0;
  const siderealSun = sunPlanet ? sunPlanet.longitude : 0;
  
  let tithiDeg = siderealMoon - siderealSun;
  if (tithiDeg < 0) tithiDeg += 360;
  const tithiIndex = Math.floor(tithiDeg / 12) + 1;
  const paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
  const tithiNumber = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
  const tithi = `${paksha} Paksha, Tithi ${tithiNumber}`;

      let yogaDeg = siderealMoon + siderealSun;
    if (yogaDeg >= 360) yogaDeg -= 360;

    // --- VIMSHOTTARI DASHA (KP DBA TIMING) ---
    const dashaData = calculateVimshottariDasha(siderealMoon, dob);
    
        // Generate Full Life Pratyantardasha (PD) Timeline (Birth to Age 90)
    let futureTimelineStr = "";
    const dashaTimelineStart = new Date(dob);
    const dashaTimelineEnd = new Date(dob);
    dashaTimelineEnd.setFullYear(dashaTimelineStart.getFullYear() + 90);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < dashaTimelineStart || mdStart > dashaTimelineEnd) continue;

      const mdLordIndex = DASHA_ORDER.findIndex(d => d.planet === md.planet);
      let adIndex = mdLordIndex;
      let adStartDate = new Date(md.start);
      
      for (let i = 0; i < 9; i++) {
        const adPlanet = DASHA_ORDER[adIndex];
        const adDays = (md.duration * adPlanet.years * 365.25) / 120;
        let adEndDate = new Date(adStartDate);
        adEndDate.setDate(adEndDate.getDate() + adDays);

        if (adEndDate >= dashaTimelineStart && adStartDate <= dashaTimelineEnd) {
          // Calculate Pratyantardashas inside this AD
          let pdIndex = adIndex;
          let pdStartDate = new Date(adStartDate);
          
          for (let j = 0; j < 9; j++) {
            const pdPlanet = DASHA_ORDER[pdIndex];
            const pdDays = (md.duration * adPlanet.years * pdPlanet.years * 365.25) / (120 * 120);
            let pdEndDate = new Date(pdStartDate);
            pdEndDate.setDate(pdEndDate.getDate() + pdDays);
            
            if (pdEndDate >= dashaTimelineStart && pdStartDate <= dashaTimelineEnd) {
              const startMonthStr = pdStartDate.toLocaleString('default', { month: 'short' });
              const endMonthStr = pdEndDate.toLocaleString('default', { month: 'short' });
              futureTimelineStr += `- ${startMonthStr} ${pdStartDate.getFullYear()} to ${endMonthStr} ${pdEndDate.getFullYear()}: Pratyantardasha ${pdPlanet.planet} (under AD ${adPlanet.planet}, MD ${md.planet})
`;
            }
            
            pdStartDate = new Date(pdEndDate);
            pdIndex = (pdIndex + 1) % 9;
          }
        }

        adStartDate = new Date(adEndDate);
        adIndex = (adIndex + 1) % 9;
      }
    }

    const dashaContext = dashaData.currentMahadasha ? 
      `Current Dasha (DBA): Mahadasha Lord is ${dashaData.currentMahadasha.planet}, Antardasha (Bhukti) Lord is ${dashaData.currentAntardasha?.planet}. Use these Dasha lords along with their KP significators to predict current events.\n\nFULL LIFE PRATYANTARDASHA TIMELINE (BIRTH TO AGE 90) (PINPOINT TIMING):\n${futureTimelineStr}` : 
      'Dasha timeline completed.';

  const yogaIndex = Math.floor(yogaDeg / (360 / 27));
  const yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const yoga = yogas[yogaIndex];

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
    - USER CONTEXT: Currently a ${lifeStage} and is ${relationshipStatus}.
  - VIMSHOTTARI DBA TIMING (CURRENT): ${dashaContext}
    - Asc CSL: ${ascCusp.subLord}
  - Moon CSL: ${moonPlanet?.subLord}
  - 10th CSL (Career): ${cusps[9]?.subLord}
  - 7th CSL (Marriage): ${cusps[6]?.subLord}
  - 2nd/11th CSL (Wealth): ${cusps[1]?.subLord} / ${cusps[10]?.subLord}\n    
        - KP HOUSE SIGNIFICATORS (CRITICAL FOR TIMING): ${JSON.stringify(houseSignificators)}
    - TRANSIT (GOCHAR) EXACT TRIGGERS:
      Career/Job Activation Dates (Every Year): ${careerHotDates}
      Wealth Activation Dates (Every Year): ${wealthHotDates}
      Marriage Activation Dates (Every Year): ${marriageHotDates}
  
    
    - EXACT EVENT CONTEXT (PHASE 1 VARGAS):
      To deduce the exact *label* and *industry* of the events, use these Divisional Charts (Vargas):
      D-9 Navamsa (Exact Marriage/Spouse specifics): ${JSON.stringify(d9Houses)}
      D-10 Dasamsa (Exact Career Industry/Role specifics): ${JSON.stringify(d10Houses)}
      D-24 Chaturvimsamsa (Exact Education specifics): ${JSON.stringify(d24Houses)}
      If predicting a career event, look at the D-10 chart. If D-10's 10th house has Tech planets (Mars/Rahu), predict an exact IT/Tech job. If D-9 shows a strong Venus, predict a love marriage. Do not guess blindly, use these Vargas!

    CRITICAL REAL-WORLD CLARITY RULES (MANDATORY FOR EVERY SECTION):
    
    [WAY 1: EXPLICIT CONTEXTUAL PROFILING]: The user explicitly states they are currently a ${lifeStage.toUpperCase()} and ${relationshipStatus.toUpperCase()}.
    - You MUST forcefully align ALL predictions across ALL sections (Career, Wealth, Relationships, etc.) to this reality.
    - If they are a STUDENT, career peaks mean Academic Success/Exams. NEVER predict corporate promotions.
    - If they are a FRESHER, career peaks mean First Full-Time Job. NEVER predict senior leadership.
    - If they are SINGLE, relationship peaks mean finding a partner.
    - If they are MARRIED, relationship peaks mean marital milestones (childbirth, shared assets, harmony) or marital crisis (if afflicted).

    [WAY 2: SUN-TRIGGERED GOCHAR (EXACT DAY/WEEK PINPOINTING)]: 
    - Within your predicted Pratyantardasha window (e.g., May 2026 to Sep 2026), you MUST find which of the "TRANSIT (GOCHAR) EXACT TRIGGERS" falls inside it.
    - If you predict a career event, and one of the Career Hot Dates is 'Aug 12', you MUST forcefully declare: "This event will trigger exactly around the 2nd week of August." 
    - NEVER give a broad 5-month window without pinpointing the exact week/day using these Hot Dates. This applies to EVERY section.

        [WAY 3: K. BASKARAN SUB-SUB LORD (SSL) & IMMEDIATE RELEVANCE]: 
    - The user is checking this in ${new Date().getFullYear()}.
    - You MUST use the provided Sub-Sub Lord (SSL) for ultimate precision. 
    - You MUST heavily prioritize finding breakthroughs in the exact immediate years of 2024, 2025, 2026, and 2027. Do not skip these crucial years!
    - If the user is a Fresher, their First Job MUST happen in the active Pratyantardasha of these immediate years.

    
    [WAY 4: STRICT AGE & LOGICAL MILESTONE MAPPING (NO ABSURDITY)]: 
    - The user was born in ${year}. In ${new Date().getFullYear()}, they are ${new Date().getFullYear() - year} years old.
    - MARRIAGE LOGIC: If predicting marriage, it MUST logically occur between ages 25-35 (e.g., 2027-2037) for a currently single/committed user. NEVER predict a first marriage at age 50+ (e.g., 2056).
    - CAREER LOGIC: If they are a 24-year-old 'Working Professional', their first job likely happened very recently (2025/2026). Do NOT predict their first job was years ago at age 21 (2023). 
    - FUTURE PREDICTIONS: For distant future events (2040-2070), predict wealth accumulation, real estate, legacy, or senior executive roles. Do not predict first marriage or entry-level milestones in old age.

    [WAY 5: THE GOD-MODE LOGIC & SAFETY PROTOCOL (PREVENTING ABSURD HALLUCINATIONS)]:
    You MUST apply these logical filters to PREVENT absurd, illogical, or inappropriate predictions:
    1. FATAL/DEATH PREDICTIONS ARE BANNED: When Maraka (2nd/7th) or Badhaka houses activate, NEVER predict death, fatal accidents, or severe illness. Translate these to "focusing on immunity", "managing temporary stress", or "preventative health care".
    2. CHILDBIRTH & 5TH HOUSE: 
       - If user is under 20: 5th house means sports, hobbies, or exam success. 
       - If user is 20-45: It means parenthood/childbirth. Use gender-neutral terms like "welcoming a child into the family" (NEVER "you will get pregnant" as the user might be male).
       - If user is 50+: It means grandchildren, creative legacy, or spiritual growth.
    3. SEPARATION/DIVORCE: If the user explicitly selected "Single", NEVER predict a divorce or marital separation under 6th/8th/12th house transits. Frame it as "avoiding toxic connections" or "personal healing".
    4. REAL ESTATE & VEHICLES: If the user is under 21, 4th house activations mean "your family may upgrade their home" or "academic comfort", NOT "you will purchase commercial real estate".
    5. STRICT CHRONOLOGY FOR BREAKTHROUGHS: The 6 breakthroughs MUST be listed in PERFECT CHRONOLOGICAL ORDER (e.g., 2024, then 2026, then 2031). NEVER jumble the timeline (do not put 2035 before 2026).

    CRITICAL INSTRUCTIONS FOR ZERO HALLUCINATION:
    - Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional"). 
    - Translate EVERY placement into STRICT, CONCRETE, REAL-WORLD EVENTS (e.g., "securing a corporate job", "getting married").
    - INDEPENDENT HOUSES: If a house is empty and its lord is untenanted, it is extremely powerful.
    
    MANDATORY EXACT TIMING (ALL SECTIONS): 
    - You MUST use the "FULL LIFE PRATYANTARDASHA TIMELINE (BIRTH TO AGE 90)" to provide EXACT pinpoint dates for EVERY single prediction in the Education, Family, Career, Wealth, Health, and Relationships sections. NEVER say "soon" or "in the future".
    
    MASSIVE DETAIL & FORMATTING: 
    - Write at least 300 words for EVERY SINGLE FIELD. 
    - You MUST NOT use any HTML tags like <br>. Use standard newline characters for line breaks.
    
        CRITICAL BREAKTHROUGHS FORMATTING (EXACTLY 6 EVENTS): 
    - You must output exactly 6 breakthroughs. 
    - You MUST include at least one breakthrough from the immediate past (2024 or 2025) and at least one from the immediate present (2026 or 2027).
    - Pick the absolute strongest peaks based on the provided KP House Significators. Do NOT force specific events; predict purely based on what the exact Pratyantardasha planet signifies in the user's chart.
    - Each breakthrough MUST be structured in this EXACT order, with each item on a new line (no HTML tags):
      Exact Year: (e.g., 2026)
      Exact Month: (e.g., January to March)
      Initial Topic of Breakthrough: (e.g., Securing First Full-Time Job)
      Description: (Detailed explanation pinpointed with exact Transit Gochar Date)`;

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
              reading: { type: "STRING" },
              education: { type: "STRING" },
              family: { type: "STRING" },
              career: { type: "STRING" },
              wealth: { type: "STRING" },
              relationships: { type: "STRING" },
              health: { type: "STRING" },
              fullLife: { type: "STRING" },
              breakthroughs: { type: "STRING" },
              physicalAppearance: { type: "STRING", description: "Detailed physical appearance and bodily persona based on 1st CSL." }
              },
              required: ["reading", "education", "family", "career", "wealth", "relationships", "health", "fullLife", "breakthroughs", "physicalAppearance"]
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
          readingData = { ...readingData, ...aiJson };
        } else {
          throw new Error("All fallback AI models failed or timed out.");
        }
    } catch (err: any) {
      console.error("KP AI Generation completely failed:", err);
      readingData.reading = `[AI ERROR] AI generation failed: ${err?.message || 'Unknown error'}. Please refresh to try again.`;
    }
  }

  return {
    name, dob, tob, pob,
    houses: bpHouses, d1Houses: d1Houses,
    ascendant: `${ascCusp.signName} (${ascCusp.degFormatted})`, ascendantLord: ascCusp.signLord, ascendantSubLord: ascCusp.subLord,
    moonSign: `${moonPlanet?.signName} (${moonPlanet?.degFormatted})`, moonSignLord: moonPlanet?.signLord, moonSubLord: moonPlanet?.subLord,
    sunSign: `${sunPlanet?.signName} (${sunPlanet?.degFormatted})`, sunSignLord: sunPlanet?.signLord, sunSubLord: sunPlanet?.subLord,
    nakshatra: moonPlanet?.nakshatraName || "Rohini", nakshatraPada: moonPlanet?.nakshatraPada || 1, nakshatraLord: moonPlanet?.starLord || "Moon",
    tithi, yoga, karana,
    ayanamsaVal: `KP New (${formatDMS(kpAyanamsa)})`, kpAyanamsa: formatDMS(kpAyanamsa),
    ascendantCusp: ascCusp, dashaData, moonInfo: moonPlanet, cusps, planets: kpPlanets, planetSignificators, houseSignificators, rulingPlanets, bpHouses,
    ...readingData
  };
}


function getDasamsaSign(siderealLon: number): number {
  const sign = Math.floor(siderealLon / 30);
  const degree = siderealLon % 30;
  const dasamsaIdx = Math.floor(degree / 3);
  return sign % 2 === 0 ? (sign + dasamsaIdx) % 12 : (sign + 8 + dasamsaIdx) % 12;
}

function getD24Sign(siderealLon: number): number {
  const sign = Math.floor(siderealLon / 30);
  const degree = siderealLon % 30;
  const d24Idx = Math.floor(degree / 1.25);
  return sign % 2 === 0 ? (4 + d24Idx) % 12 : (3 + d24Idx) % 12;
}
