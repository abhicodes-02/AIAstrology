import { calculateChart } from "celestine";
import { calculateVimshottariDasha, DASHA_ORDER } from "./src/lib/dasha";

const timesToTest = [
  { h: 23, m: 45, d: 29 },
  { h: 23, m: 50, d: 29 },
  { h: 23, m: 55, d: 29 },
  { h: 0, m: 0, d: 30 },
  { h: 0, m: 5, d: 30 },
  { h: 0, m: 10, d: 30 }
];

function analyzeTime(t: any) {
  const chart = calculateChart({
    year: 1998,
    month: 11,
    day: t.d,
    hour: t.h,
    minute: t.m,
    latitude: 22.7667, // Barrackpore
    longitude: 88.3667,
    timezone: 5.5,
  });

  const ascCusp = chart.houses.cusps[0];
  console.log(chart.planets.map(p => p.name)); const moon = chart.planets.find((p: any) => p.name === "Moon");
  const siderealMoon = (moon?.longitude || 0) - 23.85;
   const dashaData = calculateVimshottariDasha(siderealMoon < 0 ? siderealMoon + 360 : siderealMoon, "1998-11-30");

  console.log(`\n=== TIME: ${t.h}:${t.m < 10 ? '0'+t.m : t.m} (Moon: ${Math.floor(siderealMoon)} deg) ===`);
  
  if (dashaData.currentMahadasha && dashaData.currentAntardasha) {
      console.log(`Current MD: ${dashaData.currentMahadasha.planet}, AD: ${dashaData.currentAntardasha.planet}`);
      
      const currentAD = dashaData.currentAntardasha;
      const pdList = currentAD.pratyantardashas || [];
      
      pdList.forEach((pd: any) => {
          const pdStart = new Date(pd.startDate);
          const pdEnd = new Date(pd.endDate);
          
          if (pdStart.getFullYear() >= 2025 && pdEnd.getFullYear() <= 2027) {
              console.log(`  PD ${pd.planet}: ${pdStart.toISOString().split('T')[0]} to ${pdEnd.toISOString().split('T')[0]}`);
          }
      });
  }
}

timesToTest.forEach(analyzeTime);
