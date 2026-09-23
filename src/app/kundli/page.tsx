import { fetchAIKundliData } from "@/app/actions/generateKundli";
import KundliDashboardView from "@/components/KundliDashboardView";

export const dynamic = "force-dynamic";

export default async function KundliPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const name = typeof params.name === 'string' ? params.name : 'Seeker';
  const dob = typeof params.dob === 'string' ? params.dob : '2000-01-01';
  const tob = typeof params.tob === 'string' ? params.tob : '12:00';
  const pob = typeof params.pob === 'string' ? params.pob : 'New York';

  let chartData;
  try {
    chartData = await fetchAIKundliData(name, dob, tob, pob);
    // Ensure houses uses numbers
    const cleanHouses: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) {
      cleanHouses[i] = (chartData.houses as any)[i.toString()] || [];
    }
    chartData.houses = cleanHouses;
  } catch (error) {
    console.error("Failed to load chart data:", error);
    // Ultimate fallback if something completely crashes
    chartData = {
      houses: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] },
      d9Houses: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] },
      ascendant: "Unknown", sunSign: "Unknown", moonSign: "Unknown", nakshatra: "Unknown",
      tithi: "Unknown", yoga: "Unknown",
      reading: "[AI ERROR] Failed to generate AI reading. Please ensure your Gemini API key is correct.", 
      career: "[AI ERROR] Failed to generate AI reading.", 
      relationships: "[AI ERROR] Failed to generate AI reading.",
      health: "[AI ERROR] Failed to generate AI reading.",
      wealth: "[AI ERROR] Failed to generate AI reading.",
      fullLife: "[AI ERROR] Failed to generate AI reading."
    };
  }

  return (
    <KundliDashboardView 
      chartData={chartData} 
      name={name} 
      dob={dob} 
      tob={tob} 
      pob={pob} 
    />
  );
}
