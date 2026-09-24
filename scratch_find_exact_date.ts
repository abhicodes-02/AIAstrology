import * as celestine from "celestine";

const ayanamsa1966 = 23.85 + (1966 - 2000) * (50.29 / 3600);
function getSidereal(tropical: number) {
  let s = tropical - ayanamsa1966;
  if (s < 0) s += 360;
  return s;
}

const signs = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

console.log("Searching for dates in 1966 where Sun is in Libra and Moon is in Rohini (Taurus)...");

// Search October and November 1966
for (let month = 10; month <= 11; month++) {
  const daysInMonth = month === 10 ? 31 : 30;
  for (let day = 1; day <= daysInMonth; day++) {
    for (let hour = 0; hour < 24; hour += 2) {
      const chart = celestine.calculateChart({
        year: 1966,
        month,
        day,
        hour,
        minute: 0,
        latitude: 22.8277,
        longitude: 88.3756,
        timezone: 5.5
      });
      const sun = chart.planets.find((p: any) => p.name === "Sun")!;
      const moon = chart.planets.find((p: any) => p.name === "Moon")!;
      const asc = chart.angles.ascendant;

      const sidSun = getSidereal(sun.longitude);
      const sidMoon = getSidereal(moon.longitude);
      const sidAsc = getSidereal(asc.longitude);

      const sunSign = signs[Math.floor(sidSun / 30)];
      const moonSign = signs[Math.floor(sidMoon / 30)];
      const nak = nakshatras[Math.floor(sidMoon / (360 / 27))];
      const ascSign = signs[Math.floor(sidAsc / 30)];

      if (sunSign.startsWith("Tula") && moonSign.startsWith("Vrishabha") && nak === "Rohini") {
        console.log(`MATCH FOUND: 1966-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} at ${hour}:00`);
        console.log(`   Sun: ${sunSign} (${(sidSun % 30).toFixed(2)}°)`);
        console.log(`   Moon: ${moonSign} (${(sidMoon % 30).toFixed(2)}°) Nakshatra: ${nak}`);
        console.log(`   Lagna at ${hour}:00: ${ascSign} (${(sidAsc % 30).toFixed(2)}°)`);
      }
    }
  }
}
