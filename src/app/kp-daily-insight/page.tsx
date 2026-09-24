import { fetchAIKpDailyInsightData } from "@/app/actions/generateKpDailyInsight";
import KpDailyInsightView from "@/components/KpDailyInsightView";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function KpDailyInsightPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const name = typeof params.name === "string" ? params.name : "Seeker";
  const dob = typeof params.dob === "string" ? params.dob : "2000-01-01";
  const tob = typeof params.tob === "string" ? params.tob : "12:00";
  const pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";
  const date = typeof params.date === "string" ? params.date : undefined;

  let dailyData;
  try {
    dailyData = await fetchAIKpDailyInsightData(name, dob, tob, pob, date);
  } catch (e) {
    console.error("Failed to load KP daily insight:", e);
    dailyData = {
      dateFormatted: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      natalMoonSign: "Taurus",
      natalStarLord: "Moon",
      natalSubLord: "Venus",
      natalAscendantSign: "Aries",
      natalAscSubLord: "Venus",
      transitMoonSign: "Transit Moon",
      transitStarLord: "Transit Star",
      transitSubLord: "Transit Sub",
      transitHouseOccupied: 1,
      cosmicScore: 82,
      overallFavorability: "FAVOURABLE",
      careerFavorability: "GOOD",
      financeFavorability: "FAVOURABLE",
      loveFavorability: "GOOD",
      healthFavorability: "FAVOURABLE",
      kpSubLordTrigger: "Transit Moon active",
      auspiciousKpTime: "10:00 AM - 12:00 PM",
      luckySubLord: "Venus",
      dailySummary: "The KP planetary sub-lords indicate steady progress and mental focus today.",
      career: "Methodical execution will overcome routine resistance. Check fine details.",
      finance: "Maintain budgetary discipline. Speculation is not advised.",
      love: "Open discussions bring mutual empathy and reassurance.",
      health: "Prioritize restful recovery and avoid excessive mental strain.",
      remedy: "Engage in peaceful contemplation and offer gratitude during the morning hours."
    };
  }

  return (
    <KpDailyInsightView
      dailyData={dailyData}
      name={name}
      dob={dob}
      tob={tob}
      pob={pob}
    />
  );
}
