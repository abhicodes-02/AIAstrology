import { Sparkles, ArrowLeft, Star, Sun, Moon } from "lucide-react";
import Link from "next/link";
import KundliChart from "@/components/KundliChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { fetchAIKundliData } from "@/app/actions/generateKundli";

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
      reading: "Error generating chart.", career: "", relationships: ""
    };
  }

  return (
    <main className="flex-1 flex flex-col p-4 md:p-8 min-h-screen relative overflow-hidden">
      {/* Mystical decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-indigo-500/20 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to details
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400">
              Cosmic Blueprint
            </h1>
            <p className="text-indigo-200/60 mt-1">
              {name} • {dob} • {tob} • {pob}
            </p>
          </div>
          <Button className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40">
            <Sparkles className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chart */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card/40 border-indigo-500/20 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-indigo-100">Lagna Chart (D-1)</CardTitle>
                <CardDescription className="text-indigo-300/60">North Indian Style</CardDescription>
              </CardHeader>
              <CardContent>
                <KundliChart planets={chartData.houses} />
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-indigo-500/20 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-indigo-100">Navamsa Chart (D-9)</CardTitle>
                <CardDescription className="text-indigo-300/60">Destiny & Marriage</CardDescription>
              </CardHeader>
              <CardContent>
                <KundliChart planets={chartData.d9Houses || chartData.houses} />
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-indigo-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-100">Panchang & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                  <span className="flex items-center gap-2 text-indigo-200/80"><Star className="w-4 h-4 text-purple-400"/> Lagna</span>
                  <span className="font-medium text-indigo-100">{chartData.ascendant}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                  <span className="flex items-center gap-2 text-indigo-200/80"><Moon className="w-4 h-4 text-blue-400"/> Rashi (Moon)</span>
                  <span className="font-medium text-indigo-100">{chartData.moonSign}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                  <span className="flex items-center gap-2 text-indigo-200/80"><Sun className="w-4 h-4 text-yellow-500"/> Sun Sign</span>
                  <span className="font-medium text-indigo-100">{chartData.sunSign}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                  <span className="flex items-center gap-2 text-indigo-200/80"><Sparkles className="w-4 h-4 text-indigo-400"/> Nakshatra</span>
                  <span className="font-medium text-indigo-100">{chartData.nakshatra}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                  <span className="flex items-center gap-2 text-indigo-200/80"><Moon className="w-4 h-4 text-gray-400"/> Tithi</span>
                  <span className="font-medium text-indigo-100">{chartData.tithi || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-indigo-200/80"><Star className="w-4 h-4 text-pink-400"/> Yoga</span>
                  <span className="font-medium text-indigo-100">{chartData.yoga || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reading & Insights */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/40 border-indigo-500/20 backdrop-blur-sm h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-indigo-100 font-space">AI Astrological Reading</CardTitle>
                    <CardDescription className="text-indigo-300/60 mt-1">Deep analysis of your planetary alignments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-lg text-indigo-100/80 leading-relaxed pt-4">
                <p>
                  {chartData.reading}
                </p>
                <div className="p-6 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                  <h4 className="text-indigo-200 font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" /> Career & Purpose
                  </h4>
                  <p className="text-base text-indigo-200/70">
                    {chartData.career}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-purple-900/20 border border-purple-500/20">
                  <h4 className="text-purple-200 font-medium mb-2 flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Inner Self & Relationships
                  </h4>
                  <p className="text-base text-purple-200/70">
                    {chartData.relationships}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </main>
  );
}

