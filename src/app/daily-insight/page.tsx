import { fetchAIDailyInsightData } from "@/app/actions/generateDailyInsight";
import DailyInsightView from "@/components/DailyInsightView";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function DailyInsightPage({
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
    dailyData = await fetchAIDailyInsightData(name, dob, tob, pob, date);
  } catch (e) {
    console.error("Failed to load daily insight:", e);
    dailyData = {
      dateFormatted: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      natalMoonSign: "Vedic Rashi",
      natalAscendant: "Lagna",
      natalSunSign: "Surya",
      birthNakshatra: "Nakshatra",
      transitMoonSign: "Transit Moon",
      transitNakshatra: "Transit Star",
      cosmicScore: 80,
      overallFavorability: "FAVOURABLE",
      careerFavorability: "GOOD",
      financeFavorability: "FAVOURABLE",
      loveFavorability: "GOOD",
      healthFavorability: "FAVOURABLE",
      cosmicMood: "Calm & Reflective",
      luckyColor: "White & Gold",
      luckyNumber: "9",
      auspiciousTime: "10:00 AM - 12:00 PM",
      dailySummary: "The celestial transits today urge patience and alignment with your inner core. Focus on essential goals and maintain equanimity.",
      career: "Productivity will be steady if you avoid unnecessary multitasking. Collaborate respectfully with peers.",
      finance: "Maintain regular budgeting. Avoid large impulsive purchases or speculative deals today.",
      love: "Open communication clears any lingering doubts. Spend quality, uninterrupted time with loved ones.",
      health: "Prioritize restful sleep, hydration, and gentle physical movement to sustain your vitality.",
      remedy: "Practice 5 minutes of deep pranayama in the morning and offer gratitude for your current blessings.",
    };
  }

  return (
    <DailyInsightView
      dailyData={dailyData}
      name={name}
      dob={dob}
      tob={tob}
      pob={pob}
    />
  );
}
