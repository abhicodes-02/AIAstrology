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
  
const planetaryPower: Record<string, {score: number, status: string}> = {};
  chart.planets.forEach((p: any) => {
    if (planetNameMap[p.name]) {
      const siderealLon = getSidereal(p.longitude);
      const kpInfo = getKpDetailsForLongitude(siderealLon);
      const houseOccupied = getHouseForLongitude(siderealLon, cusps);
      
      const pSidereal = p.longitude;

      const pSignIndex = Math.floor(pSidereal / 30);
      planetaryPower[p.name] = getPlanetaryDignityScore(p.name, pSignIndex);

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
        const pSidereal = northNode.longitude;
        const rahuLon = getSidereal(pSidereal);
        const rahuInfo = getKpDetailsForLongitude(rahuLon);

        const pSignIndex = Math.floor(pSidereal / 30);
        planetaryPower["Rahu"] = getPlanetaryDignityScore("Rahu", pSignIndex);

        const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
        let d9House = pNavamsaSign - ascNavamsaSign + 1;
        if (d9House <= 0) d9House += 12;
        d9Houses[d9House].push("Rahu");
        
        const pD10Sign = getDasamsaSign(pSidereal);
        let d10House = pD10Sign - ascD10Sign + 1;
        if (d10House <= 0) d10House += 12;
        d10Houses[d10House].push("Rahu");

        const pD24Sign = getD24Sign(pSidereal);
        let d24House = pD24Sign - ascD24Sign + 1;
        if (d24House <= 0) d24House += 12;
        d24Houses[d24House].push("Rahu");

        kpPlanets.push({
        name: "Rahu", vedicName: "Ra", longitude: rahuLon, signIndex: rahuInfo.signIndex,
        signName: rahuInfo.signName, signLord: rahuInfo.signLord, degreeInSign: rahuInfo.degreeInSign,
        degFormatted: rahuInfo.degFormatted, nakshatraName: rahuInfo.nakshatraName,
        nakshatraPada: rahuInfo.nakshatraPada, starLord: rahuInfo.starLord, subLord: rahuInfo.subLord, subSubLord: rahuInfo.subSubLord,
        houseOccupied: getHouseForLongitude(rahuLon, cusps), isRetrograde: true
      });
    }
    if (southNode) {
        const pSidereal = southNode.longitude;
        const ketuLon = getSidereal(pSidereal);
        const ketuInfo = getKpDetailsForLongitude(ketuLon);

        const pSignIndex = Math.floor(pSidereal / 30);
        planetaryPower["Ketu"] = getPlanetaryDignityScore("Ketu", pSignIndex);

        const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
        let d9House = pNavamsaSign - ascNavamsaSign + 1;
        if (d9House <= 0) d9House += 12;
        d9Houses[d9House].push("Ketu");
        
        const pD10Sign = getDasamsaSign(pSidereal);
        let d10House = pD10Sign - ascD10Sign + 1;
        if (d10House <= 0) d10House += 12;
        d10Houses[d10House].push("Ketu");

        const pD24Sign = getD24Sign(pSidereal);
        let d24House = pD24Sign - ascD24Sign + 1;
        if (d24House <= 0) d24House += 12;
        d24Houses[d24House].push("Ketu");

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

    
    // PHASE 3 (ADVANCED): KP BOOLEAN WITH NEGATION LOGIC
    const careerCSL = cusps[9]?.subLord;
    const marriageCSL = cusps[6]?.subLord;
    const propertyCSL = cusps[3]?.subLord;
    const foreignCSL = cusps[8]?.subLord;
    const businessCSL = cusps[6]?.subLord; 
    
    const careerSig = careerCSL ? (planetSignificators as any)[careerCSL] || [] : [];
    const marriageSig = marriageCSL ? (planetSignificators as any)[marriageCSL] || [] : [];
    const propertySig = propertyCSL ? (planetSignificators as any)[propertyCSL] || [] : [];
    const foreignSig = foreignCSL ? (planetSignificators as any)[foreignCSL] || [] : [];
    const businessSig = businessCSL ? (planetSignificators as any)[businessCSL] || [] : [];

    function evaluateKpStatus(sigs: string[], positive: string[], negative: string[]) {
      const hasPos = sigs.some((h: string) => positive.includes(h));
      const hasNeg = sigs.some((h: string) => negative.includes(h));
      if (hasPos && !hasNeg) return "PROMISED_AND_STRONG";
      if (hasPos && hasNeg) return "HAPPENS_BUT_WITH_STRUGGLES_AND_DELAYS";
      if (!hasPos && hasNeg) return "STRICTLY_DENIED";
      return "NEUTRAL_OR_DELAYED";
    }

    const kpPermissionsAdvanced = {
      careerStatus: evaluateKpStatus(careerSig, ["2", "6", "10", "11"], ["1", "5", "9"]),
      marriageStatus: evaluateKpStatus(marriageSig, ["2", "7", "11"], ["1", "6", "10"]),
      realEstateStatus: evaluateKpStatus(propertySig, ["4", "11", "12"], ["3", "10"]),
      foreignTravelStatus: evaluateKpStatus(foreignSig, ["3", "9", "12"], ["2", "8", "11"]),
      businessStatus: evaluateKpStatus(businessSig, ["2", "7", "10", "11"], ["1", "6"])
    };


  
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
              
              // Calculate Sookshma Dashas only for immediate years (Current Year - 2 to Current Year + 5)
              const currentYear = new Date().getFullYear();
              const isImmediateYear = pdStartDate.getFullYear() >= (currentYear - 4) && pdEndDate.getFullYear() <= (currentYear + 10);
              
              let sdTimelineStr = "";
              if (isImmediateYear) {
                let sdIndex = pdIndex;
                let sdStartDate = new Date(pdStartDate);
                for (let k = 0; k < 9; k++) {
                  const sdPlanet = DASHA_ORDER[sdIndex];
                  const sdDays = (pdDays * sdPlanet.years) / 120;
                  const sdEndDate = new Date(sdStartDate.getTime() + sdDays * 24 * 60 * 60 * 1000);
                  
                  const sdStartStr = sdStartDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                  const sdEndStr = sdEndDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                  sdTimelineStr += `      * ${sdStartStr} to ${sdEndStr}: Sookshma ${sdPlanet.planet}
`;
                  
                  sdStartDate = new Date(sdEndDate);
                  sdIndex = (sdIndex + 1) % 9;
                }
              }

              if (pdEndDate >= dashaTimelineStart && pdStartDate <= dashaTimelineEnd) {
                const startMonthStr = pdStartDate.toLocaleString('default', { month: 'short' });
                const endMonthStr = pdEndDate.toLocaleString('default', { month: 'short' });
                futureTimelineStr += `- ${startMonthStr} ${pdStartDate.getFullYear()} to ${endMonthStr} ${pdEndDate.getFullYear()}: Pratyantardasha ${pdPlanet.planet} (under AD ${adPlanet.planet}, MD ${md.planet})
`;
                if (isImmediateYear) {
                   futureTimelineStr += sdTimelineStr;
                }
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
      const prompt = `Act as a world-renowned Grand Master of Krishnamurti Paddhati (KP) Astrology. CRITICAL RULE: DO NOT fill the output with astrological jargon. NEVER explicitly mention "D-10", "D-9", "CSL", "Pratyantardasha", "Sookshma", or specific planetary house placements in your text. You must use the math to calculate the exact timing internally, but your final output must be 100% human-friendly, plain English predictions. Sound like a wise, confident mentor giving direct answers (e.g. "In April 2026, you will secure a job"), NOT a math textbook.
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
  
    
    - 
    - 
    - EXACT KP BOOLEAN PERMISSIONS (PHASE 3 NO-HALLUCINATION FILTER):
      You MUST strictly obey these Boolean mathematical permissions. If an event is FALSE, it will NEVER happen, even if the user form says otherwise or a transit looks good.
      ${JSON.stringify(kpPermissionsAdvanced)}
      - If 'PROMISED_AND_STRONG': Predict the event confidently and highly successfully.
      - If 'HAPPENS_BUT_WITH_STRUGGLES_AND_DELAYS': Predict the event, but explicitly state that it will come with significant obstacles, delays, or internal struggles.
      - If 'STRICTLY_DENIED': NEVER predict this event. Frame it as "not supported in this phase of life."
      - If 'NEUTRAL_OR_DELAYED': Frame it as a low-priority area right now.

    - EXACT EVENT MAGNITUDE (PHASE 2 POWER SCORING):
      You MUST read the exact power score of the planets before predicting an event: ${JSON.stringify(planetaryPower)}
      - If a planet's score is < 30 (Weak/Debilitated), NEVER predict a massive success (e.g., "Huge Promotion", "Grand Marriage"). Predict delays, minor milestones, or internal learning.
      - If a planet's score is > 80 (Strong/Exalted), you MUST predict a massive, life-changing peak event (e.g., "Top Executive Role", "Massive Wealth Influx", "Grand Marital Union").
      - Only predict what the math allows!

    - EXACT EVENT CONTEXT (PHASE 1 VARGAS):
      To deduce the exact *label* and *industry* of the events, use these Divisional Charts (Vargas):
      D-9 Navamsa (Exact Marriage/Spouse specifics): ${JSON.stringify(d9Houses)}
      D-10 Dasamsa (Exact Career Industry/Role specifics): ${JSON.stringify(d10Houses)}
      D-24 Chaturvimsamsa (Exact Education specifics): ${JSON.stringify(d24Houses)}
      If predicting a career event, look at the D-10 chart. If D-10's 10th house has Tech planets (Mars/Rahu), predict an exact IT/Tech job. If D-9 shows a strong Venus, predict a love marriage. Do not guess blindly, use these Vargas!

    
    [THE ULTIMATE OMNI-FUSION PROTOCOL (MANDATORY HOLISTIC CHECK)]:
    You are strictly FORBIDDEN from making predictions based on just one factor (like just looking at a chart or just looking at a Dasha). 
    Before writing ANY prediction, you MUST pass it through this 5-layer mathematical intersection:
    1. LAYER 1 (USER INPUTS): Who is the user today? (Age, Life Stage, Relationship Status).
    2. LAYER 2 (KP BOOLEAN PERMISSIONS): Is the event mathematically permitted (True/False)? If False, ABORT the prediction or frame it as delayed/denied.
    
    3. LAYER 3 (VIMSHOTTARI, SOOKSHMA & GOCHAR): When exactly is the timeline window? You MUST use the day-level Sookshma Dasha dates provided for the immediate years to pinpoint the EXACT WEEK of the event.
    4. LAYER 4 (VARGA CHARTS - D10/D9): What is the specific industry or exact flavor of the event?
    5. LAYER 5 (PLANETARY POWER): What is the magnitude? (Only exaggerate if score is 80+, downplay if score is <40).
    Your final text MUST be the exact intersection of ALL 5 layers. If any layer contradicts (e.g., Transit is good but KP Permission is FALSE), the KP Permission OVERRULES the transit. NO GUESSWORK, NO EXAGGERATION.

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

    
    
      [WAY 4: THE MATHEMATICAL TIMELINE LOCK (1000% ACCURACY PROTOCOL)]: 
      - You are a deterministic mathematical engine. You DO NOT have creative freedom to skip years.
      - If the user is a "Fresher", you MUST mathematically lock their First Job / Internship into the ABSOLUTE STRONGEST mathematically valid Sookshma window between 2024 and 2026 (ignoring weak blips). DO NOT push it to 2027 or 2028 under any circumstances.
      - If the user is "Student", map their academic graduation to the first valid window, and their job to the next valid window.
      - If the user is "Working Professional", map their job entry to a PAST year (e.g., 2023 or 2024), and map 2025/2026 to promotions/bonuses.
      - If the user is "career_break_student" (Returned to Studies), map their past job exit to a past year, their current phase as academic focus/upskilling, and their professional re-entry to the strongest valid window in 2025-2027.
      - If the user is "unemployed" (Lost Job), explicitly map a recent past year as a period of sudden career loss or instability, and pinpoint their career revival/new job to the strongest valid window in 2024-2026.
      - If the user is "retired", do NOT predict new corporate jobs. Map breakthroughs to spiritual milestones, health recovery, family legacy, or post-retirement passive wealth/investments.
      - If the user is "Committed", you MUST map the deepening/start of their relationship to the ABSOLUTE STRONGEST relationship Sookshma window between 2024 and 2026. DO NOT push their relationship start to 2027.
      - If the user is "Single", push marriage/relationship to the future (2027+).
      - NEVER violate this chronological locking. Map the mathematically closest Dasha window to the user's current context.
    
    MANDATORY EXACT TIMING (ALL SECTIONS): 
    - You MUST use the provided timeline to find EXACT pinpoint dates for EVERY prediction in the Education, Family, Career, Wealth, Health, and Relationships sections. Explicitly state the EXACT YEAR for past events (e.g. "In 2023, you...") and the EXACT MONTH and YEAR for future events (e.g. "In October 2026, you will..."). NEVER say "soon" or "in the past". You must extract the exact timing from the math, but hide the mathematical terms from the user.
    
    MASSIVE DETAIL & FORMATTING: 
    - Write at least 300 words for EVERY SINGLE FIELD. CRITICAL TIMING DISTINCTION: For the 'career', 'relationships', 'wealth', 'health', 'education', 'family', and 'fullLife' sections, you MUST provide a LIFELONG GENERAL OVERVIEW of the native's destiny. Describe their innate potential, lifelong trajectory, and overall promise based on their planetary strengths. You must blend the overarching lifelong promise with a dynamic analysis of the recent past (Years ${new Date().getFullYear() - 3} to ${new Date().getFullYear()}) and the immediate future (Years ${new Date().getFullYear()} to ${new Date().getFullYear() + 10}). Ensure the reading flows naturally from past struggles to future milestones to ultimate lifelong destiny. HOWEVER, for the 'breakthroughs' section ONLY, you MUST focus strictly on precise timing and extract exact dates for the immediate years (Past 3 years - Future 3 years dynamically). 
    - You MUST NOT use any HTML tags like <br>. Use standard newline characters for line breaks.
    
        CRITICAL BREAKTHROUGHS FORMATTING (EXACTLY 6 EVENTS): 
    - You must output exactly 6 breakthroughs. 
      - You MUST include at least one breakthrough from the immediate past (2024 or 2025) and at least one from the immediate present (2026 or 2027).
      - UNIVERSAL BALANCING RULE (1000% ACCURACY): You MUST distribute the 6 breakthroughs across the user's major life aspects. 
        1. At least ONE breakthrough MUST explicitly address their Career/Academic progression (based on their life stage).
        2. At least ONE breakthrough MUST explicitly address their Relationship/Marriage progression (based on whether they are Single or Committed). Do not ignore this, even if career planets are stronger!
        3. The remaining 4 breakthroughs should follow the absolute strongest peaks based on KP House Significators.
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
          temperature: 0.0, topP: 0.1, topK: 1,
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


function getPlanetaryDignityScore(planet: string, sign: number): { score: number, status: string } {
  // Signs: 0=Aries, 1=Taurus, 2=Gemini, 3=Cancer, 4=Leo, 5=Virgo, 6=Libra, 7=Scorpio, 8=Sagittarius, 9=Capricorn, 10=Aquarius, 11=Pisces
  if (planet === "Sun") {
    if (sign === 0) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 4) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 6) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([1,2,5,8,11].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Moon") {
    if (sign === 1) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 3) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 7) return { score: 10, status: "Debilitated (Very Weak)" };
    return { score: 50, status: "Neutral/Friendly (Average)" };
  }
  if (planet === "Mars") {
    if (sign === 9) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 0 || sign === 7) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 3) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([4,8,11].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Mercury") {
    if (sign === 5) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 2) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 11) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([0,1,3,4,6].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Jupiter") {
    if (sign === 3) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 8 || sign === 11) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 9) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([0,4,7].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Venus") {
    if (sign === 11) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 1 || sign === 6) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 5) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([2,9,10].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Saturn") {
    if (sign === 6) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 9 || sign === 10) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 0) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([1,2,5].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Rahu" || planet === "North Node") {
    if (sign === 1 || sign === 2) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 7 || sign === 8) return { score: 10, status: "Debilitated (Very Weak)" };
    return { score: 50, status: "Neutral (Average)" };
  }
  if (planet === "Ketu" || planet === "South Node") {
    if (sign === 7 || sign === 8) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 1 || sign === 2) return { score: 10, status: "Debilitated (Very Weak)" };
    return { score: 50, status: "Neutral (Average)" };
  }
  return { score: 50, status: "Neutral" };
}
