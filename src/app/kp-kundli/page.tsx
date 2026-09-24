import { fetchAIKpKundliData } from "@/app/actions/generateKpKundli";
import KpKundliDashboardView from "@/components/KpKundliDashboardView";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function KpKundliPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const name = typeof params.name === "string" ? params.name : "Seeker";
  const dob = typeof params.dob === "string" ? params.dob : "2000-01-01";
  const tob = typeof params.tob === "string" ? params.tob : "12:00";
  const pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";

  let chartData;
  try {
    chartData = await fetchAIKpKundliData(name, dob, tob, pob);
  } catch (error) {
    console.error("Failed to load KP chart data:", error);
    chartData = {
      name,
      dob,
      tob,
      pob,
      kpAyanamsa: "23° 45' 00\"",
      ascendantCusp: { signName: "Aries", starLord: "Ketu", subLord: "Venus", degFormatted: "0° 00' 00\"" },
      moonInfo: { signName: "Taurus", starLord: "Moon", subLord: "Venus", degFormatted: "10° 00' 00\"" },
      cusps: [],
      planets: [],
      planetSignificators: [],
      houseSignificators: [],
      rulingPlanets: {
        ascendantStarLord: "Ketu",
        ascendantSubLord: "Venus",
        moonStarLord: "Moon",
        moonSignLord: "Venus",
        dayLord: "Thursday"
      },
      bpHouses: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] },
      readings: {
        kpSummary: "Analyzing KP cusps and sub-lords...",
        careerKp: "10th Cuspal Sub-Lord analysis...",
        financeKp: "2nd and 11th Cuspal Sub-Lord analysis...",
        relationshipKp: "7th Cuspal Sub-Lord analysis...",
        healthKp: "1st and 6th House analysis...",
        rulingPlanetsAdvice: "Ruling planets advice..."
      }
    };
  }

  return (
    <KpKundliDashboardView
      chartData={chartData}
      name={name}
      dob={dob}
      tob={tob}
      pob={pob}
    />
  );
}
