import { calculateChart } from "celestine";

const timesToTest = ["23:55", "23:58", "00:00", "00:03", "00:06", "00:10"];

function analyzeTime(timeStr: string) {
  let [h, m] = timeStr.split(":").map(Number);
  let d = 30; // Shimli DOB: 30/11/1998
  let mo = 11;
  let y = 1998;
  
  if (h === 23) {
    d = 29; // previous day if time is before midnight
  }

  const chart = calculateChart({
    year: y,
    month: mo,
    day: d,
    hour: h,
    minute: m,
    latitude: 22.7667, // Barrackpore
    longitude: 88.3667,
    timezone: 5.5,
  });

  // Basic Vimshottari from Celestine
  // Celestine's vimshottari contains the main periods.
  console.log(`\n=== Testing Time: ${timeStr} ===`);
  
  const ascCusp = chart.houses.cusps[0];
  console.log(`Ascendant Cusp: ${ascCusp.signName} at ${ascCusp.degFormatted}`);
  
  // Find Dashas for:
  // 1. Late 2025 (Date: 2025-11-01)
  // 2. Mid 2026 (Date: 2026-06-01)
  // 3. Early 2027 (Date: 2027-03-01)
  
  const targetDates = [
      { name: "Late 2025 (Job Exit/Study)", d: new Date(2025, 10, 1) },
      { name: "Mid 2026 (Temp Job)", d: new Date(2026, 5, 1) },
      { name: "Early 2027 (Permanent Job)", d: new Date(2027, 2, 1) },
  ];

  targetDates.forEach(td => {
      let activeMD = null;
      let activeAD = null;
      let activePD = null;
      
      chart.vimshottari.forEach((md: any) => {
          const mdStart = new Date(md.start);
          const mdEnd = new Date(md.end);
          if (td.d >= mdStart && td.d <= mdEnd) {
              activeMD = md.planet;
              md.subPeriods.forEach((ad: any) => {
                  const adStart = new Date(ad.start);
                  const adEnd = new Date(ad.end);
                  if (td.d >= adStart && td.d <= adEnd) {
                      activeAD = ad.planet;
                      ad.subPeriods.forEach((pd: any) => {
                          const pdStart = new Date(pd.start);
                          const pdEnd = new Date(pd.end);
                          if (td.d >= pdStart && td.d <= pdEnd) {
                              activePD = pd.planet;
                          }
                      });
                  }
              });
          }
      });
      console.log(`${td.name}: MD=${activeMD}, AD=${activeAD}, PD=${activePD}`);
  });
}

timesToTest.forEach(t => analyzeTime(t));
