export interface DashaPeriod {
  planet: string;
  start: string; // ISO Date String
  end: string;
  duration: number; // Years
  antardashas?: DashaPeriod[];
}

export interface AntardashaPeriod {
  planet: string;
  start: string;
  end: string;
}

export interface DashaData {
  balance: {
    planet: string;
    yearsRemaining: number;
    monthsRemaining: number;
    daysRemaining: number;
  };
  mahadashas: DashaPeriod[];
  currentMahadasha: DashaPeriod | null;
  currentAntardashas: AntardashaPeriod[];
  currentAntardasha: AntardashaPeriod | null;
}

export const DASHA_ORDER = [
  { planet: "Ketu", years: 7 },
  { planet: "Venus", years: 20 },
  { planet: "Sun", years: 6 },
  { planet: "Moon", years: 10 },
  { planet: "Mars", years: 7 },
  { planet: "Rahu", years: 18 },
  { planet: "Jupiter", years: 16 },
  { planet: "Saturn", years: 19 },
  { planet: "Mercury", years: 17 },
];

function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


function getAntardashas(mdPlanet: string, mdStartDate: Date, mdDuration: number): DashaPeriod[] {
  const antardashas: DashaPeriod[] = [];
  const startIndex = DASHA_ORDER.findIndex(d => d.planet === mdPlanet);
  let currentStart = new Date(mdStartDate);
  
  for (let i = 0; i < 9; i++) {
    const adPlanet = DASHA_ORDER[(startIndex + i) % 9];
    const adYears = (mdDuration * adPlanet.years) / 120;
    const adDays = adYears * 365.25;
    const currentEnd = addDaysToDate(currentStart, adDays);
    
    antardashas.push({
      planet: adPlanet.planet,
      start: currentStart.toISOString().split('T')[0],
      end: currentEnd.toISOString().split('T')[0],
      duration: adYears
    });
    
    currentStart = new Date(currentEnd);
  }
  return antardashas;
}

export function calculateVimshottariDasha(moonLongitude: number, birthDateStr: string): DashaData {
  // Nakshatra span is 13°20' = 13.3333... degrees
  const NAKSHATRA_SPAN = 13 + 20 / 60; 
  
  // Find which Nakshatra the Moon is in (0 to 26)
  const nakshatraIndex = Math.floor(moonLongitude / NAKSHATRA_SPAN);
  
  // Find exact degree passed inside the Nakshatra
  const degreePassed = moonLongitude % NAKSHATRA_SPAN;
  const fractionPassed = degreePassed / NAKSHATRA_SPAN;
  const fractionRemaining = 1 - fractionPassed;

  // Each group of 9 Nakshatras maps to the 9 planets in order
  const dashaLordIndex = nakshatraIndex % 9;
  const firstDasha = DASHA_ORDER[dashaLordIndex];

  // Calculate Balance of Dasha at birth
  const totalDaysInFirstDasha = firstDasha.years * 365.25;
  const daysRemaining = Math.floor(totalDaysInFirstDasha * fractionRemaining);
  
  const yearsRem = Math.floor(daysRemaining / 365.25);
  const monthsRem = Math.floor((daysRemaining % 365.25) / 30.44);
  const daysRem = Math.floor((daysRemaining % 365.25) % 30.44);

  const birthDate = new Date(birthDateStr);
  const mahadashas: DashaPeriod[] = [];
  
  let currentStartDate = new Date(birthDate);
  let firstDashaEndDate = addDaysToDate(currentStartDate, daysRemaining);

  mahadashas.push({
    planet: firstDasha.planet,
    start: currentStartDate.toISOString().split('T')[0],
    end: firstDashaEndDate.toISOString().split('T')[0],
    duration: firstDasha.years,
    antardashas: getAntardashas(firstDasha.planet, currentStartDate, firstDasha.years)
  });

  currentStartDate = new Date(firstDashaEndDate);

  // Calculate the rest of the 120 years
  let nextIndex = (dashaLordIndex + 1) % 9;
  for (let i = 0; i < 8; i++) {
    const dasha = DASHA_ORDER[nextIndex];
    const daysInDasha = dasha.years * 365.25;
    const endDate = addDaysToDate(currentStartDate, daysInDasha);
    
    mahadashas.push({
      planet: dasha.planet,
      start: currentStartDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      duration: dasha.years,
      antardashas: getAntardashas(dasha.planet, currentStartDate, dasha.years)
    });

    currentStartDate = new Date(endDate);
    nextIndex = (nextIndex + 1) % 9;
  }

  // Find Current Mahadasha
  const now = new Date();
  const currentMahadasha = mahadashas.find(md => new Date(md.start) <= now && new Date(md.end) >= now) || null;

  // Calculate Antardashas for the Current Mahadasha
  const currentAntardashas: AntardashaPeriod[] = [];
  let currentAntardasha: AntardashaPeriod | null = null;

  if (currentMahadasha) {
    const mahadashaLordIndex = DASHA_ORDER.findIndex(d => d.planet === currentMahadasha.planet);
    let adIndex = mahadashaLordIndex; // Antardasha always starts with the Mahadasha lord
    
    let adStartDate = new Date(currentMahadasha.start);
    
    for (let i = 0; i < 9; i++) {
      const adPlanet = DASHA_ORDER[adIndex];
      // Formula for Antardasha: (MD Years * AD Years) / 120 = length in years
      // Length in days: (MD Years * AD Years * 365.25) / 120
      const adDays = (currentMahadasha.duration * adPlanet.years * 365.25) / 120;
      const adEndDate = addDaysToDate(adStartDate, adDays);

      const period = {
        planet: adPlanet.planet,
        start: adStartDate.toISOString().split('T')[0],
        end: adEndDate.toISOString().split('T')[0]
      };
      
      currentAntardashas.push(period);

      if (now >= adStartDate && now <= adEndDate) {
        currentAntardasha = period;
      }

      adStartDate = new Date(adEndDate);
      adIndex = (adIndex + 1) % 9;
    }
  }

  return {
    balance: {
      planet: firstDasha.planet,
      yearsRemaining: yearsRem,
      monthsRemaining: monthsRem,
      daysRemaining: daysRem
    },
    mahadashas,
    currentMahadasha,
    currentAntardashas,
    currentAntardasha
  };
}
