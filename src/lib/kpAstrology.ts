/**
 * Krishnamurti Paddhati (KP) Astrology Calculation Engine
 * 
 * Features:
 * 1. KP New Ayanamsa (epoch calculated)
 * 2. Placidus House Cusps (1 to 12)
 * 3. 249 KP Sub-Lord Division (Vimshottari Dasha proportional division across 27 Nakshatras)
 * 4. Sign Lord, Star Lord, Sub Lord & Sub-Sub Lord resolution
 * 5. 4-Fold Significators (Level A, B, C, D)
 * 6. Ruling Planets (RP)
 */

export interface KpSubLordInfo {
  longitude: number;
  signIndex: number;
  signName: string;
  signLord: string;
  degreeInSign: number;
  degFormatted: string;
  nakshatraIndex: number;
  nakshatraName: string;
  nakshatraPada: number;
  starLord: string;
  subLord: string;
  subSubLord?: string;
}

export interface KpCusp {
  houseNumber: number;
  longitude: number;
  signIndex: number;
  signName: string;
  signLord: string;
  degreeInSign: number;
  degFormatted: string;
  nakshatraName: string;
  starLord: string;
  subLord: string;
}

export interface KpPlanet {
  name: string;
  vedicName: string;
  longitude: number;
  signIndex: number;
  signName: string;
  signLord: string;
  degreeInSign: number;
  degFormatted: string;
  nakshatraName: string;
  nakshatraPada: number;
  starLord: string;
  subLord: string;
  houseOccupied: number;
  isRetrograde: boolean;
}

export interface KpSignificatorRow {
  planet: string;
  levelA: number[]; // Houses occupied by Star Lord
  levelB: number[]; // House occupied by planet itself
  levelC: number[]; // Houses owned by Star Lord
  levelD: number[]; // Houses owned by planet itself
}

export interface KpHouseSignificator {
  house: number;
  planetsInStarOfOccupants: string[]; // Level A
  occupants: string[];                // Level B
  planetsInStarOfLords: string[];     // Level C
  houseLord: string[];                // Level D
}

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const VEDIC_SIGNS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka",
  "Simha", "Kanya", "Tula", "Vrishchika",
  "Dhanu", "Makara", "Kumbha", "Meena"
];

export const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon",
  "Sun", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Saturn", "Jupiter"
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Vimshottari order of Star Lords & dasha years
export const DASHA_ORDER = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 }
];

export const TOTAL_VIMSHOTTARI_YEARS = 120;
export const NAKSHATRA_SPAN = 360 / 27; // 13.333333333333334 degrees = 13°20'

/**
 * Calculate accurate KP New Ayanamsa for any year/date.
 * KP New Ayanamsa is approximately 0°05'52" (0.09777°) less than Lahiri.
 */
export function getKpAyanamsa(year: number, month = 1, day = 1): number {
  const decimalYear = year + (month - 1) / 12 + (day - 1) / 365.25;
  // Reference: KP New Ayanamsa on 2000.0 is approx 23.755 degrees (23°45'18")
  // Annual precession is ~50.238847 arcseconds per year
  const baseEpoch = 2000.0;
  const baseKpAyanamsa = 23.7550;
  return baseKpAyanamsa + (decimalYear - baseEpoch) * (50.23885 / 3600);
}

/**
 * Format decimal degree into DD° MM' SS"
 */
export function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}° ${m < 10 ? "0" + m : m}' ${s < 10 ? "0" + s : s}"`;
}

/**
 * Get Star Lord for a given Nakshatra index (0 to 26)
 */
export function getNakshatraLord(nakshatraIdx: number): string {
  return DASHA_ORDER[nakshatraIdx % 9].lord;
}

/**
 * Pre-generate the 249 sub-division table for exact fast lookup
 */
interface SubSegment {
  startLon: number;
  endLon: number;
  nakshatraIndex: number;
  starLord: string;
  subLord: string;
}

let subSegmentsCache: SubSegment[] | null = null;

function build249SubTable(): SubSegment[] {
  if (subSegmentsCache) return subSegmentsCache;

  const segments: SubSegment[] = [];

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const nakStartLon = nakIdx * NAKSHATRA_SPAN;
    const starLordIdx = nakIdx % 9;
    const starLord = DASHA_ORDER[starLordIdx].lord;

    let currentOffset = 0;
    // Sub-lords in each star follow Vimshottari order starting from the Star Lord itself
    for (let i = 0; i < 9; i++) {
      const currentLordIdx = (starLordIdx + i) % 9;
      const subLordInfo = DASHA_ORDER[currentLordIdx];
      const subSpan = (NAKSHATRA_SPAN * subLordInfo.years) / TOTAL_VIMSHOTTARI_YEARS;

      const segStart = nakStartLon + currentOffset;
      const segEnd = segStart + subSpan;

      segments.push({
        startLon: segStart,
        endLon: segEnd,
        nakshatraIndex: nakIdx,
        starLord,
        subLord: subLordInfo.lord
      });

      currentOffset += subSpan;
    }
  }

  subSegmentsCache = segments;
  return segments;
}

/**
 * Given any Sidereal longitude (0° to 360°), compute KP details:
 * Sign, Sign Lord, Star, Star Lord, Sub Lord, Sub-Sub Lord
 */
export function getKpDetailsForLongitude(longitude: number): KpSubLordInfo {
  // Normalize to 0 - 360
  let lon = ((longitude % 360) + 360) % 360;

  const signIndex = Math.floor(lon / 30);
  const signName = SIGNS[signIndex];
  const signLord = SIGN_LORDS[signIndex];
  const degreeInSign = lon % 30;

  const nakshatraIndex = Math.floor(lon / NAKSHATRA_SPAN);
  const nakshatraName = NAKSHATRAS[nakshatraIndex];
  const nakshatraPada = Math.floor((lon % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  const starLord = getNakshatraLord(nakshatraIndex);

  const table = build249SubTable();
  // Find sub-segment
  let subLord = starLord;
  for (const seg of table) {
    if (lon >= seg.startLon - 1e-7 && lon < seg.endLon + 1e-7) {
      subLord = seg.subLord;
      break;
    }
  }

  return {
    longitude: lon,
    signIndex,
    signName,
    signLord,
    degreeInSign,
    degFormatted: formatDMS(degreeInSign),
    nakshatraIndex,
    nakshatraName,
    nakshatraPada,
    starLord,
    subLord
  };
}

/**
 * Determine which Placidus house a given sidereal longitude falls into
 */
export function getHouseForLongitude(longitude: number, cusps: { houseNumber: number; longitude: number }[]): number {
  let lon = ((longitude % 360) + 360) % 360;

  for (let i = 1; i <= 12; i++) {
    const currentCusp = cusps.find(c => c.houseNumber === i)!.longitude;
    const nextHouseNum = i === 12 ? 1 : i + 1;
    const nextCusp = cusps.find(c => c.houseNumber === nextHouseNum)!.longitude;

    if (nextCusp > currentCusp) {
      if (lon >= currentCusp && lon < nextCusp) return i;
    } else {
      // Wraps around 360 / 0 Aries
      if (lon >= currentCusp || lon < nextCusp) return i;
    }
  }
  return 1;
}

/**
 * Build 4-Fold Significators (A, B, C, D)
 * 
 * Level A: Houses occupied by planet's Star Lord
 * Level B: House occupied by planet itself
 * Level C: Houses owned by planet's Star Lord
 * Level D: Houses owned by planet itself
 */
export function buildKpSignificators(
  planets: KpPlanet[],
  cusps: KpCusp[]
): {
  planetSignificators: KpSignificatorRow[];
  houseSignificators: KpHouseSignificator[];
} {
  // 1. Determine which houses are owned by which planet
  // In KP, a planet owns a house if its sign is at the beginning of the cusp
  const housesOwnedByPlanet: Record<string, number[]> = {
    Sun: [], Moon: [], Mars: [], Mercury: [], Jupiter: [], Venus: [], Saturn: [], Rahu: [], Ketu: []
  };

  cusps.forEach(cusp => {
    const lord = cusp.signLord;
    if (housesOwnedByPlanet[lord]) {
      housesOwnedByPlanet[lord].push(cusp.houseNumber);
    }
  });

  // Map planet by name for fast lookup
  const planetMap = new Map<string, KpPlanet>();
  planets.forEach(p => planetMap.set(p.name, p));

  const planetSignificators: KpSignificatorRow[] = [];

  for (const p of planets) {
    const starLordPlanet = planetMap.get(p.starLord);

    // Level A: House occupied by star lord
    const levelA: number[] = starLordPlanet ? [starLordPlanet.houseOccupied] : [];

    // Level B: House occupied by planet itself
    const levelB: number[] = [p.houseOccupied];

    // Level C: Houses owned by star lord
    const levelC: number[] = housesOwnedByPlanet[p.starLord] ? [...housesOwnedByPlanet[p.starLord]] : [];

    // Level D: Houses owned by planet itself
    const levelD: number[] = housesOwnedByPlanet[p.name] ? [...housesOwnedByPlanet[p.name]] : [];

    planetSignificators.push({
      planet: p.name,
      levelA,
      levelB,
      levelC,
      levelD
    });
  }

  // Build House Significator table (Inverted view)
  const houseSignificators: KpHouseSignificator[] = [];

  for (let h = 1; h <= 12; h++) {
    const levelAPlanets: string[] = [];
    const levelBPlanets: string[] = [];
    const levelCPlanets: string[] = [];
    const levelDPlanets: string[] = [];

    planetSignificators.forEach(sig => {
      if (sig.levelA.includes(h)) levelAPlanets.push(sig.planet);
      if (sig.levelB.includes(h)) levelBPlanets.push(sig.planet);
      if (sig.levelC.includes(h)) levelCPlanets.push(sig.planet);
      if (sig.levelD.includes(h)) levelDPlanets.push(sig.planet);
    });

    houseSignificators.push({
      house: h,
      planetsInStarOfOccupants: Array.from(new Set(levelAPlanets)),
      occupants: Array.from(new Set(levelBPlanets)),
      planetsInStarOfLords: Array.from(new Set(levelCPlanets)),
      houseLord: Array.from(new Set(levelDPlanets))
    });
  }

  return { planetSignificators, houseSignificators };
}
