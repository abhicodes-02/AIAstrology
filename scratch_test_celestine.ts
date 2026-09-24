import * as celestine from "celestine";

// Let's inspect celestine outputs
const birth = {
  year: 1966,
  month: 9,
  day: 9,
  hour: 10,
  minute: 34,
  latitude: 22.8277,
  longitude: 88.3756,
  timezone: 5.5
};

const chart = celestine.calculateChart(birth, { includeNodes: "true" as const });
console.log("Celestine full planets:");
chart.planets.forEach((p: any) => {
  console.log(`${p.name}: tropical=${p.longitude}`);
});
