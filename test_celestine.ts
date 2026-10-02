import * as celestine from 'celestine';

const birth = { year: 2000, month: 1, day: 1, hour: 12, minute: 0, latitude: 22.5, longitude: 88.3, timezone: 5.5 };
const chartOptions = { includeNodes: "true" as const, houseSystem: "placidus" as const };
const chart = celestine.calculateChart(birth, chartOptions);

console.log("chart.houses type:", Array.isArray(chart.houses));
if (Array.isArray(chart.houses)) {
    console.log("chart.houses[0]:", chart.houses[0]);
} else {
    console.log("chart.houses:", chart.houses);
}
