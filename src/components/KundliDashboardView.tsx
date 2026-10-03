"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Star, Sun, Moon, MapPin, Clock, Calendar, Heart, Shield, Coins, Briefcase, Download, Loader2, Compass } from "lucide-react";
import Link from "next/link";
import EastIndianChart from "@/components/EastIndianChart";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRef, useState } from "react";




export default function KundliDashboardView({ 
  chartData, 
  name, 
  dob, 
  tob, 
  pob 
}: { 
  chartData: any; 
  name: string; 
  dob: string; 
  tob: string; 
  pob: string; 
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const renderSafe = (data: any, fallback: string) => {
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') return item;
        return Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(' | ');
      }).join('\n\n');
    }
    return JSON.stringify(data, null, 2);
  };


  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Capture charts as images
      const d1El = document.getElementById("d1-chart-pdf");
      const d9El = document.getElementById("d9-chart-pdf");
      let d1Image = null;
      let d9Image = null;


      // Dynamically import react-pdf to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { KundliPDF } = await import('@/components/KundliPDF');

      const blob = await pdf(
        <KundliPDF 
          chartData={chartData} 
          name={name} 
          dob={dob} 
          tob={tob} 
          pob={pob} 
          d1Image={d1Image} 
          d9Image={d9Image} 
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Kundli_${name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };
  const containerVariants: any = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const signsList = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  // Helper for Vedic Ascendant Cusp object
  // Find exact index from string like "Kumbha (Aquarius)" or fallback to passed index
  const getSignIdx = (signStr: string) => {
    const s = signStr.toLowerCase();
    const idx = signsList.findIndex(x => s.includes(x.toLowerCase()));
    return idx >= 0 ? idx + 1 : 1;
  };

  const ascSignIndex = chartData.d1AscSignIndex || getSignIdx(chartData.ascendant);
  const d9AscSignIndex = chartData.d9AscSignIndex || getSignIdx(chartData.ascendantNavamsa);

  const lagnaCuspD1 = [{ houseNumber: 1, signIndex: ascSignIndex, degreeStr: chartData.lagnaDegreeStr || "" }];
  // D9 lagna degree usually isn't shown directly on D9, but we can keep it blank
  const lagnaCuspD9 = [{ houseNumber: 1, signIndex: d9AscSignIndex, degreeStr: "" }];

  let d1Planets = [];
  let d9Planets = [];

  if (chartData.planetsData && chartData.planetsData.length > 0) {
    d1Planets = chartData.planetsData.map((p: any) => ({
      name: p.shortName,
      signIndex: p.d1SignIndex,
      isRetrograde: p.isRetrograde,
      degreeStr: p.degreeStr
    }));
    d9Planets = chartData.planetsData.map((p: any) => ({
      name: p.shortName,
      signIndex: p.d9SignIndex,
      isRetrograde: p.isRetrograde,
      degreeStr: ""
    }));
  } else {
    // Fallback if planetsData is missing but we have houses object (legacy cache)
    const parsePlanet = (pStr: string, signIdx: number) => {
      const isRx = pStr.includes("Rx");
      const name = pStr.replace("Rx", "");
      return { name, signIndex: signIdx, isRetrograde: isRx };
    };

    d1Planets = Object.keys(chartData.houses || {}).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((ascSignIndex - 1 + hNum - 1) % 12) + 1;
      return (chartData.houses[hNumStr] || []).map((p: string) => parsePlanet(p, signIdx));
    });

    const d9HousesData = chartData.d9Houses || chartData.houses || {};
    d9Planets = Object.keys(d9HousesData).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d9AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (d9HousesData[hNumStr] || []).map((p: string) => parsePlanet(p, signIdx));
    });
    
    // Add D-10 and D-24 variables
  }

  const d10AscSignIndex = chartData.d10AscSignIndex || 1;
  const lagnaCuspD10 = [{ houseNumber: 1, signIndex: d10AscSignIndex, degreeStr: "" }];
  let d10Planets: any[] = [];
  if (chartData.d10Houses) {
    d10Planets = Object.keys(chartData.d10Houses).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d10AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (chartData.d10Houses[hNumStr] || []).map((p: string) => ({
        name: p, signIndex: signIdx, degreeStr: ""
      }));
    });
  }

  const d24AscSignIndex = chartData.d24AscSignIndex || 1;
  const lagnaCuspD24 = [{ houseNumber: 1, signIndex: d24AscSignIndex, degreeStr: "" }];
  let d24Planets: any[] = [];
  if (chartData.d24Houses) {
    d24Planets = Object.keys(chartData.d24Houses).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d24AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (chartData.d24Houses[hNumStr] || []).map((p: string) => ({
        name: p, signIndex: signIdx, degreeStr: ""
      }));
    });
  }

  return (
    <div className="min-h-screen bg-transparent text-indigo-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Animated Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.12),transparent_60%)] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.12),transparent_60%)] rounded-full" 
        />
        
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" ref={printRef}>
        {/* Navigation & Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/5 pb-8"
        >
          <div>
            <Link href="/" className="group inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all text-sm font-medium mb-6 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 hover:border-indigo-500/40">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Details
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-300 tracking-tight drop-shadow-sm">
              Cosmic Blueprint
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/daily-insight?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`}>
              <Button 
                variant="outline" 
                className="bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-200 rounded-full px-5 backdrop-blur-md transition-all font-medium"
              >
                <Compass className="w-4 h-4 mr-2 text-indigo-400" /> Daily Insight
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10 text-indigo-100 rounded-full px-6 backdrop-blur-md transition-all"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" /> Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2 text-purple-400" /> Download PDF
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 xl:grid-cols-12 gap-8"
        >
          {/* LEFT SIDEBAR (Charts & Details) */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            
            {/* Native Profile Card */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-2xl font-space font-semibold text-indigo-50 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-500 rounded-full" />
                {name}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-indigo-200/70 text-sm">
                  <Calendar className="w-5 h-5 text-indigo-400/70" />
                  <span>{dob}</span>
                </div>
                <div className="flex items-center gap-4 text-indigo-200/70 text-sm">
                  <Clock className="w-5 h-5 text-indigo-400/70" />
                  <span>{tob}</span>
                </div>
                <div className="flex items-center gap-4 text-indigo-200/70 text-sm">
                  <MapPin className="w-5 h-5 text-indigo-400/70" />
                  <span>{pob}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
                {/* Ascendant */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Ascendant (Lagna)</p>
                  <p className="font-semibold text-sm text-indigo-100">{chartData.ascendant}</p>
                  {chartData.ascendantLord && (
                    <p className="text-[11px] text-indigo-300/70 mt-0.5">Lord: {chartData.ascendantLord}</p>
                  )}
                  {chartData.ascendantNavamsa && (
                    <p className="text-[10px] text-purple-300/60 mt-0.5">D-9: {chartData.ascendantNavamsa.split(" ")[0]}</p>
                  )}
                </div>

                {/* Moon Sign */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Moon Sign (Rashi)</p>
                  <p className="font-semibold text-sm text-indigo-100 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-blue-400" /> {chartData.moonSign}
                  </p>
                  {chartData.moonSignLord && (
                    <p className="text-[11px] text-indigo-300/70 mt-0.5">Lord: {chartData.moonSignLord}</p>
                  )}
                  {chartData.moonNavamsa && (
                    <p className="text-[10px] text-purple-300/60 mt-0.5">D-9: {chartData.moonNavamsa.split(" ")[0]}</p>
                  )}
                </div>

                {/* Sun Sign */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Sun Sign (Surya)</p>
                  <p className="font-semibold text-sm text-indigo-100 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-yellow-500" /> {chartData.sunSign}
                  </p>
                  {chartData.sunSignLord && (
                    <p className="text-[11px] text-indigo-300/70 mt-0.5">Lord: {chartData.sunSignLord}</p>
                  )}
                  {chartData.sunNavamsa && (
                    <p className="text-[10px] text-purple-300/60 mt-0.5">D-9: {chartData.sunNavamsa.split(" ")[0]}</p>
                  )}
                </div>

                {/* Nakshatra */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Nakshatra & Pada</p>
                  <p className="font-semibold text-sm text-indigo-100">
                    {chartData.nakshatra} {chartData.nakshatraPada ? `(Pada ${chartData.nakshatraPada})` : ""}
                  </p>
                  {chartData.nakshatraLord && (
                    <p className="text-[11px] text-indigo-300/70 mt-0.5">Lord: {chartData.nakshatraLord}</p>
                  )}
                </div>

                {/* Tithi */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Tithi</p>
                  <p className="font-medium text-xs text-indigo-100">{chartData.tithi || "N/A"}</p>
                </div>

                {/* Yoga */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Yoga</p>
                  <p className="font-medium text-xs text-indigo-100">{chartData.yoga || "N/A"}</p>
                </div>

                {/* Karana */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Karana</p>
                  <p className="font-medium text-xs text-indigo-100">{chartData.karana || "N/A"}</p>
                </div>

                {/* Ayanamsa */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider mb-0.5">Ayanamsa</p>
                  <p className="font-medium text-xs text-indigo-100">{chartData.ayanamsaVal || "Lahiri"}</p>
                </div>

                {chartData.gana && (
                  <>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-emerald-500/10">
                      <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider mb-0.5">Gana</p>
                      <p className="font-medium text-xs text-emerald-100">{chartData.gana}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-emerald-500/10">
                      <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider mb-0.5">Varna</p>
                      <p className="font-medium text-xs text-emerald-100">{chartData.varna}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-emerald-500/10">
                      <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider mb-0.5">Yoni</p>
                      <p className="font-medium text-xs text-emerald-100">{chartData.yoni}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-emerald-500/10">
                      <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider mb-0.5">Nadi</p>
                      <p className="font-medium text-xs text-emerald-100">{chartData.nadi}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-emerald-500/10">
                      <p className="text-[10px] text-emerald-300/50 uppercase tracking-wider mb-0.5">Vashya</p>
                      <p className="font-medium text-xs text-emerald-100">{chartData.vashya}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-teal-500/10">
                      <p className="text-[10px] text-teal-300/50 uppercase tracking-wider mb-0.5">Paya (Wealth Metal)</p>
                      <p className="font-medium text-xs text-teal-100">{chartData.paya}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-2xl border border-teal-500/10">
                      <p className="text-[10px] text-teal-300/50 uppercase tracking-wider mb-0.5">Tatva (Element)</p>
                      <p className="font-medium text-xs text-teal-100">{chartData.tatva}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Doshas Section */}
            <motion.div variants={itemVariants} className="bg-red-950/10 border border-red-500/20 rounded-3xl p-6 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-space font-semibold text-red-100">Doshas Analysis</h3>
              </div>
              <div className="space-y-3">
                {Array.isArray(chartData.doshas) && chartData.doshas.length > 0 ? (
                  <Accordion className="w-full space-y-3">
                    {chartData.doshas.map((dosha: any, idx: number) => (
                      <AccordionItem key={idx} value={`dosha-${idx}`} className="border-none bg-black/20 rounded-xl overflow-hidden group">
                        <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline data-[state=open]:bg-white/5 transition-colors">
                          <div className="flex flex-1 items-center justify-between pr-4">
                            <span className="text-sm font-medium text-red-100/90">{dosha.name}</span>
                            <div className="flex items-center gap-2">
                              {dosha.isCancelled && (
                                <span className="text-[10px] px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold uppercase tracking-widest hidden sm:block">
                                  Cancelled (Bhanga)
                                </span>
                              )}
                              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${dosha.present && !dosha.isCancelled ? 'bg-red-500/20 text-red-300' : dosha.present && dosha.isCancelled ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/10 text-green-400'}`}>
                                {dosha.present && !dosha.isCancelled ? 'Present' : dosha.present && dosha.isCancelled ? 'Weak / Cancelled' : 'Not Present'}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1 text-slate-300 border-t border-white/5">
                          <div className="space-y-4 mt-4">
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                              <div>
                                <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-0.5">1. Mathematical Status</span> 
                                <p className="text-sm text-slate-200 leading-relaxed">{dosha.reason}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                              <div>
                                <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-0.5">2. Level</span> 
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                  {dosha.present && !dosha.isCancelled ? <span className="text-red-400">High Intensity</span> : 
                                   dosha.present && dosha.isCancelled ? <span className="text-amber-400">Low / Cancelled</span> : 
                                   <span className="text-green-400">None</span>}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                              <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${dosha.isCancelled ? 'text-amber-400' : (dosha.present ? 'text-red-400' : 'text-green-400')}`} />
                              <div>
                                <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-0.5">3. Cancelled Out or Not</span> 
                                <p className="text-sm text-slate-200 leading-relaxed">
                                  {dosha.isCancelled ? (
                                    <span className="text-amber-300/90 font-medium">Yes, Cancelled (Bhanga): <span className="text-slate-300 font-normal">{dosha.cancelReason}</span></span>
                                  ) : dosha.present ? (
                                    <span className="text-red-300/90 font-medium">No, Active.</span>
                                  ) : (
                                    <span className="text-green-300/90 font-medium">Not Applicable.</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-sm text-indigo-300/50 italic p-4 text-center">
                    {typeof chartData.doshas === 'string' ? 'Dosha analysis needs regeneration for list format.' : 'No doshas detected.'}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Lagna Chart */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-space font-semibold text-indigo-50">Lagna Chart (D-1)</h3>
                  <p className="text-xs text-indigo-300/50 mt-1 uppercase tracking-widest">Physical Reality</p>
                </div>
              </div>
              <div id="d1-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                <EastIndianChart 
                  planets={d1Planets}
                  cusps={lagnaCuspD1}
                  width={350} height={350}
                  showOm={true}
                  centerTitle={`Lagna ${ascSignIndex}`}
                />
              </div>
            </motion.div>

            {/* Navamsa Chart */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-space font-semibold text-indigo-50">Navamsa (D-9)</h3>
                  <p className="text-xs text-indigo-300/50 mt-1 uppercase tracking-widest">Soul & Destiny</p>
                </div>
              </div>
              <div id="d9-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                <EastIndianChart 
                  planets={d9Planets}
                  cusps={lagnaCuspD9}
                  width={350} height={350}
                  showOm={true}
                  centerTitle={`Lagna ${d9AscSignIndex}`}
                />
              </div>
            </motion.div>

            {chartData.d10Houses && (
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-space font-semibold text-amber-100">Dasamsa (D-10)</h3>
                    <p className="text-xs text-amber-300/50 mt-1 uppercase tracking-widest">Career & Power</p>
                  </div>
                </div>
                <div id="d10-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                  <EastIndianChart 
                    planets={d10Planets}
                    cusps={lagnaCuspD10}
                    width={350} height={350}
                    showOm={false}
                    centerTitle={`Lagna ${d10AscSignIndex}`}
                  />
                </div>
              </motion.div>
            )}

            {chartData.d24Houses && (
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-space font-semibold text-emerald-100">Chaturvimsamsa (D-24)</h3>
                    <p className="text-xs text-emerald-300/50 mt-1 uppercase tracking-widest">Education & Intellect</p>
                  </div>
                </div>
                <div id="d24-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                  <EastIndianChart 
                    planets={d24Planets}
                    cusps={lagnaCuspD24}
                    width={350} height={350}
                    showOm={false}
                    centerTitle={`Lagna ${d24AscSignIndex}`}
                  />
                </div>
              </motion.div>
            )}

            {/* Daily Insight CTA (Side Card) */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(6,182,212,0.12)] relative overflow-hidden group flex flex-col justify-between gap-5">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-indigo-300 flex items-center gap-2.5 mb-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Today's Daily Insight
                </h3>
                <p className="text-cyan-100/70 text-xs md:text-sm leading-relaxed">
                  Personalized daily guidance on health, career, love & money based on current planetary transits.
                </p>
              </div>
              
              <Link href={`/daily-insight?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`} className="relative z-10 w-full">
                <Button size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm md:text-base py-5 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all hover:scale-[1.02]">
                  <Sparkles className="w-4 h-4 mr-2" /> View Today's Insight
                </Button>
              </Link>
            </motion.div>

            {/* Varshaphal CTA (Side Card) */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-yellow-950/40 via-orange-950/30 to-amber-950/20 border border-yellow-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(234,179,8,0.15)] relative overflow-hidden group flex flex-col justify-between gap-5">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.2),transparent_70%)] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400 flex items-center gap-2.5 mb-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Your Year Ahead
                </h3>
                <p className="text-yellow-100/70 text-xs md:text-sm leading-relaxed">
                  Generate an in-depth Annual Forecast (Varshaphal) with a month-by-month solar return breakdown.
                </p>
              </div>
              
              <Link href={`/varshaphal?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`} className="relative z-10 w-full">
                <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold text-sm md:text-base py-5 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:shadow-[0_0_40px_rgba(234,179,8,0.55)] transition-all hover:scale-[1.02]">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Varshaphal
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT CONTENT (AI Predictions Bento Grid) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Core Soul Urge (Hero Block) */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(79,70,229,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Star className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-300">
                    Core Soul Urge
                  </h3>
                </div>
                <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed font-light">
                  {renderSafe(chartData.reading, "Reading not available.")}
                </p>
              </div>
            </motion.div>
              {/* VIMSHOTTARI DASHA TIMELINE */}
              {chartData.dashaData && (
                <motion.div variants={itemVariants} className="mb-12 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <Calendar className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-space font-semibold tracking-wide text-indigo-100">Vimshottari Dasha</h3>
                      <p className="text-slate-400 mt-1">120-Year Planetary Timeline</p>
                    </div>
                  </div>

                  {chartData.dashaData.currentMahadasha ? (
                    <div className="bg-white/[0.03] rounded-2xl p-6 border border-indigo-500/20 mb-8 relative overflow-hidden">
                      <p className="text-sm text-indigo-300 font-medium tracking-wide uppercase mb-2">Currently Running</p>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {chartData.dashaData.currentMahadasha.planet} <span className="text-indigo-400 font-light">&</span> {chartData.dashaData.currentAntardasha?.planet || '...'}
                          </h4>
                          <p className="text-slate-300">
                            Mahadasha ends: <span className="text-white font-medium" suppressHydrationWarning>{new Date(chartData.dashaData.currentMahadasha.end).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-sm text-slate-400">Current Antardasha ends</p>
                          <p className="text-xl font-bold text-indigo-300" suppressHydrationWarning>
                            {chartData.dashaData.currentAntardasha ? new Date(chartData.dashaData.currentAntardasha.end).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <Accordion className="w-full space-y-4">
                    <AccordionItem value="timeline" className="border-white/10">
                      <AccordionTrigger className="text-indigo-200 hover:text-white hover:no-underline">
                        View Full 120-Year Mahadasha Timeline
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 grid gap-3">
                          <Accordion type="single" collapsible className="w-full space-y-3">
                              {chartData.dashaData.mahadashas.map((md: any, idx: number) => {
                                const isCurrent = chartData.dashaData.currentMahadasha?.planet === md.planet;
                                return (
                                  <AccordionItem key={idx} value={`md-${idx}`} className={`border rounded-xl px-2 ${isCurrent ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5'} transition-all`}>
                                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isCurrent ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                                            {md.planet.substring(0, 2)}
                                          </div>
                                          <div className="text-left">
                                            <h5 className={`font-bold text-lg ${isCurrent ? 'text-indigo-200' : 'text-slate-200'}`}>{md.planet} Mahadasha</h5>
                                            <p className="text-xs text-slate-400 font-normal">{md.duration} Years</p>
                                          </div>
                                        </div>
                                        <div className="text-right mr-4">
                                          <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`} suppressHydrationWarning>
                                            {new Date(md.start).getFullYear()} - {new Date(md.end).getFullYear()}
                                          </p>
                                          <p className="text-xs text-slate-500 font-normal" suppressHydrationWarning>{new Date(md.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                        </div>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 pb-4">
                                      <div className="h-px w-full bg-white/10 mb-4 mt-2"></div>
                                      {md.antardashas ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {md.antardashas.map((ad: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-black/20 hover:bg-white/5 border border-white/5 p-3 rounded-lg text-sm transition-colors">
                                              <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
                                                <span className="text-indigo-100 font-medium">{ad.planet} <span className="text-indigo-300/50 text-xs ml-1">AD</span></span>
                                              </div>
                                              <span className="text-slate-400 text-xs font-mono" suppressHydrationWarning>
                                                {new Date(ad.start).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })} - {new Date(ad.end).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-xs text-rose-400 italic">Please refresh the page to load Antardasha data.</div>
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              )}


            {/* Massive Collapsable Sections for Life Areas */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
              <Accordion className="w-full space-y-4">
                
                <AccordionItem value="career" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-blue-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-blue-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-space font-semibold tracking-wide">Career & Power</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.career, "No career data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                  <AccordionItem value="education" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-amber-500/30 transition-all duration-300">
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-4 text-amber-100">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        </div>
                        <span className="text-xl font-space font-semibold tracking-wide">Education & Intellect</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pt-2">
                      <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                        {renderSafe(chartData.education, "No education data available.")}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
  
                <AccordionItem value="wealth" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-emerald-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Coins className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-space font-semibold tracking-wide">Wealth & Finance</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.wealth, "No wealth data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>
  
                <AccordionItem value="love" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-pink-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-pink-100">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-space font-semibold tracking-wide">Love & Destiny</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.relationships, "No relationship data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>
  
                <AccordionItem value="health" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-rose-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-rose-100">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-space font-semibold tracking-wide">Health & Vitality</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.health, "No health data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>
  
                <AccordionItem value="fullLife" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-purple-950/40 data-[state=open]:border-purple-500/50 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-purple-100">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-space font-semibold tracking-wide">Ultimate Life Path</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-purple-50/90 leading-relaxed text-base md:text-lg space-y-6 whitespace-pre-wrap font-light">
                      {chartData.fullLife || "Full life overview is not available."}
                    </div>
                  </AccordionContent>
                </AccordionItem>
  
              </Accordion>
            </motion.div>
          </div>
        </motion.div>
      </div>


    </div>
  );
}

