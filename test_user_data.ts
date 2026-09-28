import * as celestine from 'celestine';
import { getAccurateTimezone } from './src/lib/geoUtils.ts';

async function test() {
  const name = "S";
  const year = 1998;
  const month = 11;
  const day = 30;
  const hour = 0;
  const minute = 3;
  const pob = "Shyamnagar,Bhatpara,WB,India";

  // Shyamnagar coordinates roughly
  let lat = 22.8277;
  let lon = 88.3756;
  let countryCode = "in";

  const timezone = await getAccurateTimezone(lat, lon, countryCode, pob);
  console.log("Timezone:", timezone);

  const birth = { year, month, day, hour, minute, latitude: lat, longitude: lon, timezone };
  const chartOptions = { includeNodes: "true" as const };
  const chart = celestine.calculateChart(birth, chartOptions);

  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  // Exact Lahiri Ayanamsa calculation approximation for the epoch
  const ayanamsa = 23.85 + (year - 2000) * (50.29 / 3600);

  function getSidereal(tropical: number) {
    let sidereal = tropical - ayanamsa;
    if (sidereal < 0) sidereal += 360;
    return sidereal;
  }

  const ascSidereal = getSidereal(chart.angles.ascendant.longitude);
  const ascSign = Math.floor(ascSidereal / 30);
  const ascendantName = signs[ascSign];

  console.log("Calculated Lagna:", ascendantName);
  console.log("Ascendant Degree:", ascSidereal % 30);
}

test();
