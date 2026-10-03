"use server";

import * as celestine from "celestine";
import { GoogleGenAI, Type } from "@google/genai";
import { getAccurateTimezone } from "@/lib/geoUtils";
import { calculateVimshottariDasha, DASHA_ORDER } from "@/lib/dasha";

const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

export async function fetchAIKundliData(name: string, dob: string, tob: string, pob: string, lifeStage: string = "student", relationshipStatus: string = "single") {
  // 1. Geocode the location
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


  // Nakshatra Advanced Details (Ashtakoot)
  const ganas = ["Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Rakshasa", "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"];
  const yonis = ["Ashwa", "Gaja", "Mesha", "Sarpa", "Sarpa", "Shvan", "Marjara", "Mesha", "Marjara", "Mushaka", "Mushaka", "Gau", "Mahisha", "Vyaghra", "Mahisha", "Vyaghra", "Mriga", "Mriga", "Shvan", "Vanara", "Nakula", "Vanara", "Simha", "Ashwa", "Simha", "Gau", "Gaja"];
  const nadis = ["Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya"];
  
  // Varna based on Moon Sign
  const varnaArr = ["Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin"];
  const moonSignIdx = Math.floor(siderealMoon / 30);
  const varna = varnaArr[moonSignIdx];
  const vashyaArr = ["Chatushpada", "Chatushpada", "Dvipada", "Jalachar", "Chatushpada", "Dvipada", "Dvipada", "Keeta", "Chatushpada", "Jalachar", "Dvipada", "Jalachar"];
  const vashya = vashyaArr[moonSignIdx];
  const tatvaArr = ["Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water"];
  const tatva = tatvaArr[moonSignIdx];

  const gana = ganas[nakshatraIndex];
  const yoni = yonis[nakshatraIndex];
  const nadi = nadis[nakshatraIndex];
  
  // Paya (based on Moon placement from Ascendant)
  let moonHouseFromAsc = (moonSignIdx - ascSign) + 1;
  if (moonHouseFromAsc <= 0) moonHouseFromAsc += 12;
  let paya = "Silver";
  if ([1, 6, 11].includes(moonHouseFromAsc)) paya = "Gold";
  else if ([2, 5, 9].includes(moonHouseFromAsc)) paya = "Silver";
  else if ([3, 7, 10].includes(moonHouseFromAsc)) paya = "Copper";
  else paya = "Iron";

  // Map Planets to D-1 (Lagna) and D-9 (Navamsa) Houses
  const d1Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d10Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d24Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  
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


  const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;
  const ascD10Sign = getDasamsaSign(ascSidereal);
  const ascD24Sign = getD24Sign(ascSidereal);


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
    
    const pD10Sign = getDasamsaSign(pSidereal);
    let d10House = pD10Sign - ascD10Sign + 1;
    if (d10House <= 0) d10House += 12;
    d10Houses[d10House].push(shortName + (planet.isRetrograde ? "Rx" : ""));

    const pD24Sign = getD24Sign(pSidereal);
    let d24House = pD24Sign - ascD24Sign + 1;
    if (d24House <= 0) d24House += 12;
    d24Houses[d24House].push(shortName + (planet.isRetrograde ? "Rx" : ""));

    planetsData.push({
      name: name,
      longitude: planet.longitude,
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

  // ADVANCED MATHEMATICAL DOSHA CALCULATION WITH CANCELLATION (BHANGA)
  const doshasDetails: any[] = [];

  // 1. Manglik Dosha (Lagna, Chandra, Shukra & Amplifications)
  let isManglik = false;
  let manglikReason = "";
  let manglikCancelled = false;
  let manglikCancelReason = "";
  
  let marsHouse = -1, moonHouse = -1, venusHouse = -1, rahuHouse = -1;
  Object.entries(d1Houses).forEach(([h, pArr]) => {
    const planets = pArr as string[];
    if (planets.find(p => p.startsWith("Mars"))) marsHouse = parseInt(h);
    if (planets.find(p => p.startsWith("Moon"))) moonHouse = parseInt(h);
    if (planets.find(p => p.startsWith("Venus"))) venusHouse = parseInt(h);
    if (planets.find(p => p.startsWith("Rahu"))) rahuHouse = parseInt(h);
  });

  const mHouses = [1, 2, 4, 7, 8, 12];
  let isLagnaManglik = marsHouse !== -1 && mHouses.includes(marsHouse);
  let isChandraManglik = marsHouse !== -1 && moonHouse !== -1 && mHouses.includes(((marsHouse - moonHouse + 12) % 12) + 1);
  let isShukraManglik = marsHouse !== -1 && venusHouse !== -1 && mHouses.includes(((marsHouse - venusHouse + 12) % 12) + 1);
  
  if (isLagnaManglik || isChandraManglik || isShukraManglik) {
    isManglik = true;
    let reasons = [];
    if (isLagnaManglik) reasons.push(`Lagna (${marsHouse}th House)`);
    if (isChandraManglik) reasons.push(`Chandra (${((marsHouse - moonHouse + 12) % 12) + 1}th from Moon)`);
    if (isShukraManglik) reasons.push(`Shukra (${((marsHouse - venusHouse + 12) % 12) + 1}th from Venus)`);
    
    manglikReason = `Mars is afflicted from: ${reasons.join(', ')}.`;
    
    // Check for Angarak Amplification (Mars + Rahu)
    if (marsHouse === rahuHouse) {
      manglikReason += " [ANGARAK AMPLIFICATION: Rahu is conjunct Mars, dangerously amplifying the aggressive dosha intensity!]";
    }

    // Cancellation Rules (Bhanga)
    const marsObj = chart.planets.find((p: any) => p.name === "Mars");
    if (marsObj) {
      const marsSign = Math.floor(getSidereal(marsObj.longitude) / 30);
      
      // RULE 1: Own Sign or Exalted
      if (marsSign === 0 || marsSign === 7) {
        manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is in its own sign (Aries/Scorpio)."; 
      } else if (marsSign === 9) {
        manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is exalted (Capricorn)."; 
      }
      
      // RULE 2: House-Specific Exemptions
      if (!manglikCancelled && isLagnaManglik) {
        let h = marsHouse;
        if (h === 2 && (marsSign === 2 || marsSign === 5)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 2nd House in Gemini/Virgo."; }
        if (h === 4 && (marsSign === 1 || marsSign === 6)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 4th House in Taurus/Libra."; }
        if (h === 7 && (marsSign === 3 || marsSign === 9)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 7th House in Cancer/Capricorn."; }
        if (h === 8 && (marsSign === 8 || marsSign === 11)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 8th House in Sagittarius/Pisces."; }
        if (h === 12 && (marsSign === 1 || marsSign === 6)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 12th House in Taurus/Libra."; }
      }

      // RULE 3: Jupiter Aspect
      if (!manglikCancelled) {
        const jupObj = chart.planets.find((p: any) => p.name === "Jupiter");
        if (jupObj && marsObj) {
          const jupSign = Math.floor(getSidereal(jupObj.longitude) / 30);
          let dist = (marsSign - jupSign + 12) % 12; 
          if (dist === 0 || dist === 4 || dist === 6 || dist === 8) { 
            manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars receives Jupiter's divine aspect/conjunction."; 
          }
        }
      }

      // RULE 4: Saturn Aspect
      if (!manglikCancelled) {
        const satObj = chart.planets.find((p: any) => p.name === "Saturn");
        if (satObj && marsObj) {
          const satSign = Math.floor(getSidereal(satObj.longitude) / 30);
          let distSat = (marsSign - satSign + 12) % 12;
          if (distSat === 0 || distSat === 2 || distSat === 6 || distSat === 9) {
            manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is controlled by Saturn's aspect/conjunction."; 
          }
        }
      }
      
      // Amplification overrides Cancellation slightly (Double/Triple Manglik)
      if (manglikCancelled && (isLagnaManglik ? 1 : 0) + (isChandraManglik ? 1 : 0) + (isShukraManglik ? 1 : 0) > 1) {
        manglikCancelReason += " (Note: Multiple Manglik levels detected. Cancellation minimizes physical harm but mental/romantic friction remains).";
      }
    }
  }

  doshasDetails.push({
    name: "Manglik Dosha",
    present: isManglik,
    isCancelled: manglikCancelled,
    reason: isManglik ? manglikReason : "Mars is placed safely. No Manglik Dosha.",
    cancelReason: manglikCancelReason
  });

  // 2. Guru Chandal & Pitra Dosha
  let hasGuruChandal = false;
  let gcReason = "";
  let gcCancelled = false;
  let gcCancelReason = "";

  let hasPitra = false;
  let pitraReason = "";
  let pitraCancelled = false;
  let pitraCancelReason = "";

  Object.entries(d1Houses).forEach(([houseNum, planetsArr]) => {
    const planets = planetsArr as string[];
    const hasRahuKetu = planets.find(p => p.startsWith("Rahu") || p.startsWith("Ketu"));
    
    if (hasRahuKetu) {
      if (planets.some(p => p.startsWith("Jupi"))) {
        hasGuruChandal = true;
        gcReason = `Jupiter and ${hasRahuKetu.split(' ')[0]} are conjunct in House ${houseNum}.`;
        
        // Intensity check
        const jup = chart.planets.find((p: any) => p.name === "Jupiter");
        const node = chart.planets.find((p: any) => p.name === "Rahu" || p.name === "Mean Node" || p.name === "True Node" || p.name === "Ketu");
        if (jup && node) {
          const diff = Math.abs(getSidereal(jup.longitude) - getSidereal(node.longitude));
          if (diff > 15 && diff < 345) { // more than 15 degrees apart
            gcCancelled = true;
            gcCancelReason = `Weak Intensity (Cancelled) as they are ${Math.round(diff)} degrees apart.`;
          }
        }
      }
      
      const sun = planets.find(p => p.startsWith("Sun"));
      const moon = planets.find(p => p.startsWith("Moon"));
      if (sun || moon) {
        hasPitra = true;
        pitraReason = `${sun ? 'Sun' : 'Moon'} is afflicted by ${hasRahuKetu.split(' ')[0]} in House ${houseNum}.`;
      }
    }
  });

  doshasDetails.push({ name: "Guru Chandal Dosha", present: hasGuruChandal, isCancelled: gcCancelled, reason: hasGuruChandal ? gcReason : "Jupiter is free from Rahu/Ketu.", cancelReason: gcCancelReason });
  doshasDetails.push({ name: "Pitra Dosha", present: hasPitra, isCancelled: pitraCancelled, reason: hasPitra ? pitraReason : "Luminaries (Sun/Moon) are free from Node affliction.", cancelReason: pitraCancelReason });

  // 3. Kalsarp Dosha
  let hasKalsarp = false;
  let kalsarpReason = "";
  let ksCancelled = false;
  let ksCancelReason = "";

  const rahuP2 = chart.planets.find((p: any) => p.name === "True Node" || p.name === "Mean Node" || p.name === "Rahu");
  if (rahuP2) {
    const rahuSidereal = getSidereal(rahuP2.longitude);
    const planetsToCheck = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    let allForward = true;
    let allBackward = true;
    let outsidePlanets = 0;
    
    planetsToCheck.forEach(name => {
      const p = chart.planets.find((pl: any) => pl.name === name);
      if (p) {
        let dist = getSidereal(p.longitude) - rahuSidereal;
        if (dist < 0) dist += 360;
        if (dist > 180) allForward = false;
        if (dist < 180) allBackward = false;
        
        // Check if Moon is outside
        if (name === "Moon" && !allForward && !allBackward) {
           // just tracking
        }
      }
    });
    
    hasKalsarp = allForward || allBackward;
    if (hasKalsarp) {
       kalsarpReason = "All 7 planets are trapped on one side of the Rahu-Ketu axis.";
       // Partial check? We'll keep it simple: if Moon is exalted etc.
       const moonObj = chart.planets.find((p: any) => p.name === "Moon");
       if (moonObj) {
          const mSign = Math.floor(getSidereal(moonObj.longitude)/30);
          if(mSign === 1) { // Taurus
             ksCancelled = true;
             ksCancelReason = "Cancelled (Bhanga) because Moon is exalted, breaking the mental trap.";
          }
       }
    }
  }
  
  doshasDetails.push({ name: "Kalsarp Dosha", present: hasKalsarp, isCancelled: ksCancelled, reason: hasKalsarp ? kalsarpReason : "Planets are distributed freely outside the axis.", cancelReason: ksCancelReason });

  const computedDoshas = doshasDetails;

  const processedPlanetsData = planetsData.map((planet: any) => {
    const pSidereal = getSidereal(planet.longitude);
    const pSign = Math.floor(pSidereal / 30);
    const degInSign = pSidereal % 30;
    const degreeStr = `${Math.floor(degInSign)}° ${Math.floor((degInSign % 1) * 60)}'`;
    return {
      ...planet,
      signName: signs[pSign],
      degreeStr: degreeStr
    };
  });
  
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
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). 
Currently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).

FULL LIFE PRATYANTARDASHA TIMELINE (BIRTH TO AGE 90) (PINPOINT TIMING):
${futureTimelineStr}` : 
      'Dasha timeline completed.';
      
    const chartData = {
    planetsData: processedPlanetsData,
      dashaData: dashaData,
    lagnaDegreeStr: `${Math.floor(ascSidereal % 30)}°`,
    d1AscSignIndex: ascSign + 1,
    d9AscSignIndex: ascNavamsaSign + 1,
      d10AscSignIndex: ascD10Sign + 1,
      d24AscSignIndex: ascD24Sign + 1,
      houses: d1Houses,
      d10Houses: d10Houses,
      d24Houses: d24Houses,
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
    karana, gana, varna, yoni, nadi, vashya, tatva, paya,
    ayanamsaVal: `Lahiri (True) ${ayanamsa.toFixed(4)}°`,
    reading: `[AI BUSY] Welcome ${name}. The AI is analyzing your chart.`,
    education: `[AI BUSY] Generating insights...`,
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
  - VIMSHOTTARI DASHA TIMING (CURRENT): ${dashaContext}
    - Lagna: ${ascendantName}
  - Moon: ${signs[Math.floor(siderealMoon / 30)]} in ${nakshatra}
  - D-1 Houses: ${JSON.stringify(d1Houses)}
  - D-9 Navamsa Houses (Marriage/Soul): ${JSON.stringify(d9Houses)}
    - D-10 Dasamsa Houses (Career/Profession): ${JSON.stringify(d10Houses)}
    - D-24 Chaturvimsamsa Houses (Education/Intellect): ${JSON.stringify(d24Houses)}
    
    IMPORTANT VARGA MAPPING RULES FOR AI SECTIONS:
    To ensure 1000% accurate pinpoint predictions, you MUST isolate your analysis for each JSON section based on its specialized chart:
    1. 'fullLife' (Ultimate Life Path): STRICTLY use the D-1 Lagna Chart.
    2. 'relationships' (Love & Destiny): STRICTLY use the D-9 Navamsa Chart.
    3. 'career' (Career & Power): STRICTLY use the D-10 Dasamsa Chart.
    4. 'education' (Education & Intellect): STRICTLY use the D-24 Chaturvimsamsa Chart.
    5. 'wealth' & 'health': Use D-1 focusing on 2nd/11th and 6th/8th houses respectively.
  
  CRITICAL RULES:
  CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
    [WAY 1: EXPLICIT CONTEXTUAL PROFILING (MANDATORY)]: The user explicitly states they are currently a ${lifeStage.toUpperCase()} and ${relationshipStatus.toUpperCase()}.
    - You MUST forcefully align all predictions to this reality.
    - If they are a STUDENT, career peaks mean Academic Success/Exams. NEVER predict corporate promotions.
    - If they are a FRESHER, career peaks mean First Job. NEVER predict senior leadership.
    - If they are SINGLE, relationship peaks mean finding a partner.
    - If they are MARRIED, relationship peaks mean marital milestones (childbirth, shared assets, harmony) or marital crisis (if afflicted).
  Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional", "Jupiter brings expansion", "You will feel a shift in energy"). 
  You MUST translate every single astrological placement into STRICT, CONCRETE, REAL-WORLD EVENTS. 
  - Instead of "intellectual growth", specify "securing a corporate job, publishing a paper, or passing a competitive exam."
  - Instead of "relationship harmony", specify "getting married, finding a high-value business partner, or resolving a legal dispute."
  - Instead of "financial expansion", specify "buying real estate, getting a promotion, or starting a new business venture."
  Every single user expects extreme clarity, practical life events, and absolute unvarnished truth. Anchor your entire reading in specific, real-world outcomes.
  1. Do not sugarcoat. Detail real struggles, doshas, delays, and flaws alongside blessings.
  2. For any AGE mentioned, mathematically calculate the exact year as (${year} + Age).
  3. Do NOT include doshas in the JSON (we calculate that via pure math).
  4. MASSIVE DETAIL REQUIRED: For EVERY SINGLE FIELD, you MUST write at least 300-400 words. Dive incredibly deep into the psychological, astrological, and predictive specifics. Break down exactly how the D-1 and D-9 charts interact, predicting highly specific life outcomes.
  5. FORMATTING: You MUST use double line breaks (\n\n) between paragraphs to format your text beautifully. Avoid giant walls of text.`;
      
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
              reading: { type: "STRING", description: "Deeply realistic core personality analysis." },
                education: { type: "STRING", description: "Academic performance, intelligence, and higher studies based on D24 chart." },
              career: { type: "STRING", description: "Professional journey, roadblocks, and peaks." },
              relationships: { type: "STRING", description: "Romantic/marital fate, emotional friction." },
              health: { type: "STRING", description: "Unvarnished health vulnerabilities." },
              wealth: { type: "STRING", description: "Realistic financial blueprint and drains." },
              fullLife: { type: "STRING", description: "Ultimate life path and major Dasha turning points." }
              },
              required: ["reading", "education", "career", "relationships", "health", "wealth", "fullLife"]
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
          chartData.reading = aiJson.reading;
        chartData.education = aiJson.education;
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
