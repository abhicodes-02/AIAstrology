"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Star,
  Sun,
  Moon,
  MapPin,
  Clock,
  Calendar,
  Heart,
  Shield,
  Coins,
  Briefcase,
  Download,
  Loader2,
  Compass,
  Layers,
  Zap,
  Info,
  BookOpen,
  Users
} from "lucide-react";
import Link from "next/link";
import EastIndianChart from "@/components/EastIndianChart";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRef, useState } from "react";



export default function KpKundliDashboardView({
  chartData,
  name,
  dob,
  tob,
  pob,
}: {
  chartData: any;
  name: string;
  dob: string;
  tob: string;
  pob: string;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeKpTable, setActiveKpTable] = useState<"cusps" | "planets" | "significators">("cusps");

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


  const queryParams = new URLSearchParams({ name, dob, tob, pob }).toString();

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { KpKundliPDF } = await import("@/components/KpKundliPDF");

      const blob = await pdf(
        <KpKundliPDF
          chartData={chartData}
          name={name}
          dob={dob}
          tob={tob}
          pob={pob}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KpKundli_${name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-transparent text-indigo-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      {/* Animated Glowing Ambient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.15),transparent_60%)] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.15),transparent_60%)] rounded-full"
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
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all text-sm font-medium mb-6 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 hover:border-cyan-500/40"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Details
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-teal-200 to-indigo-200 tracking-tight drop-shadow-sm">
                KP Cosmic Blueprint
              </h1>
              <span className="hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
                KP STELLAR SYSTEM
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-cyan-100 rounded-full px-6 backdrop-blur-md transition-all"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-cyan-400" /> Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2 text-cyan-400" /> Download PDF
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
          {/* LEFT SIDEBAR (Charts & Details identical to Vedic Layout) */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            
            {/* Native Profile Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-2xl font-space font-semibold text-cyan-50 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-cyan-500 rounded-full" />
                {name}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-cyan-200/70 text-sm">
                  <Calendar className="w-5 h-5 text-cyan-400/70" />
                  <span>{dob}</span>
                </div>
                <div className="flex items-center gap-4 text-cyan-200/70 text-sm">
                  <Clock className="w-5 h-5 text-cyan-400/70" />
                  <span>{tob}</span>
                </div>
                <div className="flex items-center gap-4 text-cyan-200/70 text-sm">
                  <MapPin className="w-5 h-5 text-cyan-400/70" />
                  <span>{pob}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
                {/* Ascendant */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Ascendant (Lagna)</p>
                  <p className="font-semibold text-sm text-cyan-100">{chartData.ascendant?.split("(")[0]}</p>
                  <p className="text-[11px] text-cyan-300/70 mt-0.5">Lord: {chartData.ascendantLord}</p>
                  <p className="text-[10px] text-amber-300 font-semibold mt-0.5">Sub-Lord: {chartData.ascendantSubLord}</p>
                </div>

                {/* Moon Sign */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Moon Sign (Rashi)</p>
                  <p className="font-semibold text-sm text-cyan-100 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-blue-400" /> {chartData.moonSign?.split("(")[0]}
                  </p>
                  <p className="text-[11px] text-cyan-300/70 mt-0.5">Lord: {chartData.moonSignLord}</p>
                  <p className="text-[10px] text-emerald-300 font-semibold mt-0.5">Sub-Lord: {chartData.moonSubLord}</p>
                </div>

                {/* Sun Sign */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Sun Sign (Surya)</p>
                  <p className="font-semibold text-sm text-cyan-100 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-yellow-500" /> {chartData.sunSign?.split("(")[0]}
                  </p>
                  <p className="text-[11px] text-cyan-300/70 mt-0.5">Lord: {chartData.sunSignLord}</p>
                  <p className="text-[10px] text-amber-300 font-semibold mt-0.5">Sub-Lord: {chartData.sunSubLord}</p>
                </div>

                {/* Nakshatra */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Nakshatra & Pada</p>
                  <p className="font-semibold text-sm text-cyan-100">
                    {chartData.nakshatra} (Pada {chartData.nakshatraPada})
                  </p>
                  <p className="text-[11px] text-cyan-300/70 mt-0.5">Star Lord: {chartData.nakshatraLord}</p>
                </div>

                {/* Tithi */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Tithi</p>
                  <p className="font-medium text-xs text-cyan-100">{chartData.tithi || "N/A"}</p>
                </div>

                {/* Yoga */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Yoga</p>
                  <p className="font-medium text-xs text-cyan-100">{chartData.yoga || "N/A"}</p>
                </div>

                {/* Karana */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Karana</p>
                  <p className="font-medium text-xs text-cyan-100">{chartData.karana || "N/A"}</p>
                </div>

                {/* Ayanamsa */}
                <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-cyan-300/50 uppercase tracking-wider mb-0.5">Ayanamsa</p>
                  <p className="font-medium text-xs text-cyan-100">{chartData.ayanamsaVal || "KP New"}</p>
                </div>
              </div>
            </motion.div>

            {/* KP East Indian Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-space font-semibold text-cyan-50">KP East Indian Chart</h3>
                  <p className="text-xs text-cyan-300/50 mt-1 uppercase tracking-widest">Fixed Sign Layout</p>
                </div>
              </div>
              <div id="kp-bhava-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                <EastIndianChart 
                  planets={(chartData.planets || []).map((p: any) => ({ 
                    name: p.vedicName, 
                    signIndex: p.signIndex + 1, 
                    isRetrograde: p.isRetrograde,
                    degreeStr: p.degFormatted ? p.degFormatted.split("°")[0] + "°" : ""
                  }))} 
                  cusps={(chartData.cusps || []).map((c: any) => ({
                    houseNumber: c.houseNumber,
                    signIndex: c.signIndex + 1,
                    degreeStr: c.degFormatted ? c.degFormatted.split("°")[0] + "°" : ""
                  }))}
                  width={350}
                  height={350}
                  isKp={true}
                  centerTitle="K.P. Cusp Chart"
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT CONTENT (AI Predictions Bento Grid + KP Tabular Tables) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Core Soul Urge (Hero Block - Identical styling to Vedic) */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-cyan-950/30 via-indigo-950/20 to-purple-950/20 border border-cyan-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Star className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-indigo-300">
                      Core Soul Urge & KP Sub-Lord Destiny
                    </h3>
                    <p className="text-xs text-cyan-300/70 mt-0.5">
                      Ruled by Asc Sub-Lord: <strong className="text-amber-300">{chartData.ascendantSubLord}</strong> & Moon Sub-Lord: <strong className="text-emerald-300">{chartData.moonSubLord}</strong>
                    </p>
                  </div>
                </div>
                <p className="text-lg md:text-xl text-cyan-100/90 leading-relaxed font-light">
                  {renderSafe(chartData.reading, "Reading not available.")}
                </p>
              </div>
            </motion.div>

            {/* Massive Collapsable Sections for Life Areas */}
              {/* VIMSHOTTARI DASHA TIMELINE */}
              {chartData.dashaData && (
                <motion.div variants={itemVariants} className="mb-12 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <Calendar className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-space font-semibold tracking-wide text-indigo-100">Vimshottari Dasha (DBA)</h3>
                      <p className="text-slate-400 mt-1">Planetary Periods for Timing Events</p>
                    </div>
                  </div>

                  {chartData.dashaData.currentMahadasha ? (
                    <div className="bg-white/[0.03] rounded-2xl p-6 border border-indigo-500/20 mb-8 relative overflow-hidden">
                      <p className="text-sm text-indigo-300 font-medium tracking-wide uppercase mb-2">Current Operating Period</p>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {chartData.dashaData.currentMahadasha.planet} <span className="text-indigo-400 font-light">&</span> {chartData.dashaData.currentAntardasha?.planet || '...'}
                          </h4>
                          <p className="text-slate-300">
                            Mahadasha (Dasha) ends: <span className="text-white font-medium" suppressHydrationWarning>{new Date(chartData.dashaData.currentMahadasha.end).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-sm text-slate-400">Antardasha (Bhukti) ends</p>
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
                          <Accordion className="w-full space-y-3">
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

            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
              <Accordion className="w-full space-y-4">
                
                <AccordionItem value="education" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-violet-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-violet-100">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                        <BookOpen className="w-5 h-5 text-violet-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Education & Intellect</h4>
                        <p className="text-xs text-violet-300/60 font-medium">4th & 9th Cuspal Sub-Lord Analysis</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.education, "No education data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="family" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-orange-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-orange-100">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                        <Users className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Family & Lineage</h4>
                        <p className="text-xs text-orange-300/60 font-medium">2nd Cuspal Sub-Lord Analysis</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.family, "No family data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="career" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-blue-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-blue-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Briefcase className="w-5 h-5 text-blue-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Career & Power</h4>
                        <p className="text-xs text-blue-300/60 font-medium">10th Cuspal Sub-Lord Analysis</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.career, "No career data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="wealth" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-emerald-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Coins className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Wealth & Legacy</h4>
                        <p className="text-xs text-emerald-300/60 font-medium">2nd & 11th Cuspal Sub-Lord Analysis</p>
                      </div>
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
                        <Heart className="w-5 h-5 text-pink-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Love & Destiny</h4>
                        <p className="text-xs text-pink-300/60 font-medium">7th Cuspal Sub-Lord Analysis</p>
                      </div>
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
                        <Shield className="w-5 h-5 text-rose-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Health & Vitality</h4>
                        <p className="text-xs text-rose-300/60 font-medium">1st & 6th Cuspal Sub-Lord Analysis</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.health, "No health data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                

                <AccordionItem value="appearance" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-emerald-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Physical Appearance</h4>
                        <p className="text-xs text-emerald-300/60 font-medium">1st Cusp Sub-Lord Persona</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.physicalAppearance, "No appearance data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fullLife" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-cyan-950/40 data-[state=open]:border-cyan-500/50 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-cyan-100">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <Sparkles className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Ultimate Life Path & Timing</h4>
                        <p className="text-xs text-cyan-300/80 font-medium tracking-widest uppercase">Ruling Planets Synthesis</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-cyan-50/90 leading-relaxed text-base md:text-lg space-y-6 whitespace-pre-wrap font-light">
                      {renderSafe(chartData.fullLife, "Full life overview is not available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="breakthroughs" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-indigo-950/40 data-[state=open]:border-indigo-500/50 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-indigo-100">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Major Breakthroughs Timeline</h4>
                        <p className="text-xs text-indigo-300/80 font-medium tracking-widest uppercase">Exact Dates & Ages</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-50/90 leading-relaxed text-base md:text-lg space-y-6 whitespace-pre-wrap font-light">
                      {renderSafe(chartData.breakthroughs, "Timeline of major breakthroughs is not available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </motion.div>

            {/* Dedicated KP Mathematical Tables (Cusps, Planets, 4-Fold Significators) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-space font-semibold text-cyan-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" /> KP Technical Astrometry Tables
                  </h3>
                  <p className="text-xs text-cyan-300/60 mt-0.5">
                    Explore exact Placidus cuspal degrees, 249 sub-divisions, and planetary significators
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveKpTable("cusps")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeKpTable === "cusps"
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    12 Cusps
                  </button>
                  <button
                    onClick={() => setActiveKpTable("planets")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeKpTable === "planets"
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Planets
                  </button>
                  <button
                    onClick={() => setActiveKpTable("significators")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeKpTable === "significators"
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    4-Fold Matrix
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {activeKpTable === "cusps" && (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-cyan-300/70 bg-white/[0.02]">
                        <th className="py-2.5 px-3">Cusp</th>
                        <th className="py-2.5 px-3">Starting Degree</th>
                        <th className="py-2.5 px-3">Sign</th>
                        <th className="py-2.5 px-3">Sign Lord</th>
                        <th className="py-2.5 px-3">Star Lord (NL)</th>
                        <th className="py-2.5 px-3 font-bold text-amber-300">Sub Lord (CSL)</th>
                        <th className="py-2.5 px-3 text-pink-300">Independent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {chartData.cusps?.map((c: any) => (
                        <tr key={c.houseNumber} className="hover:bg-cyan-500/5 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-cyan-300">Cusp {c.houseNumber}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{c.degFormatted}</td>
                          <td className="py-2.5 px-3 text-slate-200">{c.signName}</td>
                          <td className="py-2.5 px-3 text-slate-400">{c.signLord}</td>
                          <td className="py-2.5 px-3 text-teal-300">{c.starLord}</td>
                          <td className="py-2.5 px-3 font-bold text-amber-300 bg-amber-500/10 rounded">
                            {c.subLord}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeKpTable === "planets" && (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-cyan-300/70 bg-white/[0.02]">
                        <th className="py-2.5 px-3">Planet</th>
                        <th className="py-2.5 px-3">Longitude</th>
                        <th className="py-2.5 px-3">Sign</th>
                        <th className="py-2.5 px-3">House (KP)</th>
                        <th className="py-2.5 px-3">Star Lord</th>
                        <th className="py-2.5 px-3 font-bold text-emerald-300">Sub Lord</th>
                        <th className="py-2.5 px-3 text-fuchsia-300">Untenanted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {chartData.planets?.map((p: any) => (
                        <tr key={p.name} className="hover:bg-cyan-500/5 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-cyan-100 flex items-center gap-1">
                            {p.name} {p.isRetrograde && <span className="text-red-400 text-[10px]">(R)</span>}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{p.degFormatted}</td>
                          <td className="py-2.5 px-3 text-slate-200">{p.signName}</td>
                          <td className="py-2.5 px-3 font-bold text-cyan-300">House {p.houseOccupied}</td>
                          <td className="py-2.5 px-3 text-teal-300">{p.starLord}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-300 bg-emerald-500/10 rounded">
                            {p.subLord}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeKpTable === "significators" && (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-cyan-300/70 bg-white/[0.02]">
                        <th className="py-2.5 px-3">Planet</th>
                        <th className="py-2.5 px-3 text-teal-300">Level A (Star Lord House)</th>
                        <th className="py-2.5 px-3 text-cyan-300">Level B (Occupied)</th>
                        <th className="py-2.5 px-3 text-indigo-300">Level C (Star Lord Houses)</th>
                        <th className="py-2.5 px-3 text-slate-300">Level D (Own Houses)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {chartData.planetSignificators?.map((sig: any) => (
                        <tr key={sig.planet} className="hover:bg-cyan-500/5 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-cyan-100">{sig.planet}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-teal-300">
                            {sig.levelA.join(", ") || "-"}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-cyan-300">
                            {sig.levelB.join(", ") || "-"}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-indigo-300">
                            {sig.levelC.join(", ") || "-"}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">
                            {sig.levelD.join(", ") || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
