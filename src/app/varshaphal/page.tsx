import { Sparkles, ArrowLeft, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAIVarshaphalData } from "@/app/actions/generateVarshaphal";
import VarshaphalDashboardView from "@/components/VarshaphalDashboardView";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function VarshaphalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const name = typeof params.name === 'string' ? params.name : 'Seeker';
  const dob = typeof params.dob === 'string' ? params.dob : '2000-01-01';
  const tob = typeof params.tob === 'string' ? params.tob : '12:00';
  const pob = typeof params.pob === 'string' ? params.pob : 'New York';
  const lifeStage = typeof params.lifeStage === 'string' ? params.lifeStage : 'student';
  const relationshipStatus = typeof params.relationshipStatus === 'string' ? params.relationshipStatus : 'single';
  
  const currentYear = new Date().getFullYear();
  const targetYearStr = typeof params.targetYear === 'string' ? params.targetYear : String(currentYear);
  const targetYear = parseInt(targetYearStr, 10) || currentYear;

  let data;
  try {
    data = await fetchAIVarshaphalData(name, dob, tob, pob, lifeStage, relationshipStatus, targetYear);
  } catch (error) {
    console.error("Failed to load varshaphal data:", error);
    data = {
      varshaphal: "[AI ERROR] Failed to generate AI reading. Please ensure your Gemini API key is correct.",
      monthlyPredictions: "[AI ERROR] Failed to generate AI reading."
    };
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-yellow-500">Loading Solar Return...</p></div>}>
      <VarshaphalDashboardView 
        data={data} 
        name={name} 
        dob={dob} 
        tob={tob} 
        pob={pob} 
        targetYear={targetYear}
      />
    </Suspense>
  );
}

