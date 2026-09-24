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
  Info
} from "lucide-react";
import Link from "next/link";
import KundliChart from "@/components/KundliChart";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";

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

  const queryParams = new URLSearchParams({ name, dob, tob, pob }).toString();

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const d1El = document.getElementById("kp-bhava-chart");
      const d9El = document.getElementById("kp-rashi-chart");
      let d1Image = null;
      let d9Image = null;

      if (d1El) d1Image = await toJpeg(d1El, { quality: 1, backgroundColor: "#0F1123" });
      if (d9El) d9Image = await toJpeg(d9El, { quality: 1, backgroundColor: "#0F1123" });

      const { pdf } = await import("@react-pdf/renderer");
      const { KundliPDF } = await import("@/components/KundliPDF");

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
      const link = document.createElement("a");
      link.href = url;
      link.download = `KP_Kundli_${name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating KP PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-transparent text-indigo-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      {/* Animated Glowing Ambient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-900/15 rounded-full blur-[120px]"
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
            <Link href={`/kp-daily-insight?${queryParams}`}>
              <Button
                variant="outline"
                className="bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-200 rounded-full px-5 backdrop-blur-md transition-all font-medium"
              >
                <Compass className="w-4 h-4 mr-2 text-cyan-400" /> Daily Insight
              </Button>
            </Link>
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

            {/* KP Bhava Chalit Chart (Chart 1) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-space font-semibold text-cyan-50">KP Bhava Chalit Chart</h3>
                  <p className="text-xs text-cyan-300/50 mt-1 uppercase tracking-widest">Placidus Unequal Cusps</p>
                </div>
              </div>
              <div id="kp-bhava-chart" className="aspect-square w-full opacity-90">
                <KundliChart planets={chartData.houses || {}} />
              </div>
            </motion.div>

            {/* KP Rashi Chart (Chart 2) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-space font-semibold text-cyan-50">KP Rashi Chart</h3>
                  <p className="text-xs text-cyan-300/50 mt-1 uppercase tracking-widest">Sidereal Sign Positions</p>
                </div>
              </div>
              <div id="kp-rashi-chart" className="aspect-square w-full opacity-90">
                <KundliChart planets={chartData.d1Houses || chartData.houses} />
              </div>
            </motion.div>

            {/* Daily Insight CTA (Side Card) */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(6,182,212,0.12)] relative overflow-hidden group flex flex-col justify-between gap-5"
            >
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-[70px] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-indigo-300 flex items-center gap-2.5 mb-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Today&apos;s KP Daily Insight
                </h3>
                <p className="text-cyan-100/70 text-xs md:text-sm leading-relaxed">
                  Real-time transit Moon analyzed through active KP Star Lords & Sub-Lords.
                </p>
              </div>
              
              <Link href={`/kp-daily-insight?${queryParams}`} className="relative z-10 w-full">
                <Button size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-bold text-sm md:text-base py-5 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all hover:scale-[1.02]">
                  <Sparkles className="w-4 h-4 mr-2" /> View KP Daily Insight
                </Button>
              </Link>
            </motion.div>

            {/* Varshaphal CTA (Side Card) */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-yellow-950/40 via-orange-950/30 to-amber-950/20 border border-yellow-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(234,179,8,0.15)] relative overflow-hidden group flex flex-col justify-between gap-5"
            >
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-yellow-500/20 rounded-full blur-[70px] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400 flex items-center gap-2.5 mb-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Your Year Ahead (KP)
                </h3>
                <p className="text-yellow-100/70 text-xs md:text-sm leading-relaxed">
                  Annual Solar Return & Sub-Lord Milestones for your current year of life.
                </p>
              </div>
              
              <Link href={`/kp-varshaphal?${queryParams}`} className="relative z-10 w-full">
                <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold text-sm md:text-base py-5 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:shadow-[0_0_40px_rgba(234,179,8,0.55)] transition-all hover:scale-[1.02]">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate KP Varshaphal
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT CONTENT (AI Predictions Bento Grid + KP Tabular Tables) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Core Soul Urge (Hero Block - Identical styling to Vedic) */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-cyan-950/30 via-indigo-950/20 to-purple-950/20 border border-cyan-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-700" />
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
                  {chartData.reading}
                </p>
              </div>
            </motion.div>

            {/* 2x2 Grid for Specifics (Career, Wealth, Love, Health) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Career */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.02] border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-blue-100">Career & 10th CSL</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.career}
                </p>
              </motion.div>

              {/* Wealth */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-semibold text-emerald-100">Wealth & 2nd/11th CSL</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.wealth || "No wealth data available."}
                </p>
              </motion.div>

              {/* Love */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.02] border border-white/5 hover:border-pink-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <h4 className="text-lg font-semibold text-pink-100">Love & 7th CSL</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.relationships}
                </p>
              </motion.div>

              {/* Health */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.02] border border-white/5 hover:border-rose-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-rose-400" />
                  <h4 className="text-lg font-semibold text-rose-100">Health & 1st CSL</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.health || "No health data available."}
                </p>
              </motion.div>
            </div>

            {/* Ultimate Life Path */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.03] border border-cyan-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-space font-bold text-cyan-100">Ultimate Life Path & Timing</h3>
              </div>
              <p className="text-base md:text-lg text-indigo-100/80 leading-relaxed whitespace-pre-wrap">
                {chartData.fullLife || "Full life overview is not available."}
              </p>
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
