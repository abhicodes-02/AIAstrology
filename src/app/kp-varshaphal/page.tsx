import { fetchAIKpVarshaphalData } from "@/app/actions/generateKpVarshaphal";
import KpVarshaphalDashboardView from "@/components/KpVarshaphalDashboardView";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function KpVarshaphalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const name = typeof params.name === "string" ? params.name : "Seeker";
  const dob = typeof params.dob === "string" ? params.dob : "2000-01-01";
  const tob = typeof params.tob === "string" ? params.tob : "12:00";
  const pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";

  let data;
  try {
    data = await fetchAIKpVarshaphalData(name, dob, tob, pob);
  } catch (error) {
    console.error("Failed to load KP varshaphal data:", error);
    data = {
      age: 26,
      solarReturnSign: "Sun",
      solarReturnStarLord: "Star",
      solarReturnSubLord: "Sub",
      varshaphal: "The KP Varshaphal system indicates favorable progressive outcomes for your current annual cycle.",
      monthlyPredictions: [
        { month: "Q1: Month 1-3", prediction: "Steady foundation and calculated beginnings." },
        { month: "Q2: Month 4-6", prediction: "Financial balance and operational focus." },
        { month: "Q3: Month 7-9", prediction: "Personal growth and rewarding collaborations." },
        { month: "Q4: Month 10-12", prediction: "Culmination and fructification of year-long goals." }
      ]
    };
  }

  return (
    <KpVarshaphalDashboardView
      data={data}
      name={name}
      dob={dob}
      tob={tob}
      pob={pob}
    />
  );
}
