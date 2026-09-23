import { Sparkles, ArrowLeft, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAIVarshaphalData } from "@/app/actions/generateVarshaphal";
import VarshaphalDashboardView from "@/components/VarshaphalDashboardView";

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

  let data;
  try {
    data = await fetchAIVarshaphalData(name, dob, tob, pob);
  } catch (error) {
    console.error("Failed to load varshaphal data:", error);
    data = {
      varshaphal: "[AI ERROR] Failed to generate AI reading. Please ensure your Gemini API key is correct.",
      monthlyPredictions: "[AI ERROR] Failed to generate AI reading."
    };
  }

  return (
    <VarshaphalDashboardView 
      data={data} 
      name={name} 
      dob={dob} 
      tob={tob} 
      pob={pob} 
    />
  );
}

