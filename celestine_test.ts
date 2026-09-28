import * as celestine from 'celestine-astrology';

const birthLocal = { year: 1990, month: 8, day: 15, hour: 14, minute: 30, latitude: 22.57, longitude: 88.36, timezone: 5.5 };
const chart = celestine.calculateChart(birthLocal, { includeNodes: "true" });

console.log("Local +5.5:", chart.ascendant);

// Try UTC directly
// UTC is 14:30 - 5.5 = 09:00
const birthUTC = { year: 1990, month: 8, day: 15, hour: 9, minute: 0, latitude: 22.57, longitude: 88.36, timezone: 0 };
const chartUTC = celestine.calculateChart(birthUTC, { includeNodes: "true" });
console.log("UTC:", chartUTC.ascendant);

// Try Local -5.5
const birthNeg = { year: 1990, month: 8, day: 15, hour: 14, minute: 30, latitude: 22.57, longitude: 88.36, timezone: -5.5 };
const chartNeg = celestine.calculateChart(birthNeg, { includeNodes: "true" });
console.log("Local -5.5:", chartNeg.ascendant);
