"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  Heart,
  Shield,
  Coins,
  Briefcase,
  Compass,
  Calendar,
  Clock,
  Palette,
  Flame,
  Star,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function FavorabilityBadge({ status }: { status: string }) {
  const norm = (status || "GOOD").toUpperCase().trim();
  let badgeStyle = "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
  let dotColor = "bg-cyan-400";

  if (norm.includes("HIGHLY")) {
    badgeStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
    dotColor = "bg-emerald-400 animate-pulse";
  } else if (norm.includes("FAVOURABLE") || norm.includes("FAVORABLE")) {
    badgeStyle = "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]";
    dotColor = "bg-cyan-400";
  } else if (norm === "GOOD") {
    badgeStyle = "bg-blue-500/20 text-blue-300 border-blue-500/40";
    dotColor = "bg-blue-400";
  } else if (norm === "BAD") {
    badgeStyle = "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
    dotColor = "bg-amber-400";
  } else if (norm === "WORST") {
    badgeStyle = "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
    dotColor = "bg-rose-400 animate-pulse";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-md ${badgeStyle}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {norm}
    </span>
  );
}

export default function KpDailyInsightView({
  dailyData,
  name,
  dob,
  tob,
  pob,
}: {
  dailyData: any;
  name: string;
  dob: string;
  tob: string;
  pob: string;
}) {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  const queryParams = new URLSearchParams({ name, dob, tob, pob }).toString();

  return (
    <div className="min-h-screen bg-transparent text-indigo-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background ambient glowing orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-900/15 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation & Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/5 pb-8"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/kp-kundli?${queryParams}`}
                className="group inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all text-sm font-medium bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 hover:border-cyan-500/40"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to KP Kundli
              </Link>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                <Calendar className="w-3.5 h-3.5" />
                {dailyData.dateFormatted}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-teal-200 to-indigo-200 tracking-tight">
                KP Daily Cosmic Insight
              </h1>
              <span className="hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
                SUB-LORD TRANSITS
              </span>
            </div>
            <p className="text-cyan-200/70 text-base md:text-lg mt-2">
              Placidus planetary transit alignment for{" "}
              <span className="text-cyan-100 font-semibold">{name}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/daily-insight?${queryParams}`}
            >
              <Button
                variant="outline"
                className="bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-200 rounded-full px-5 backdrop-blur-md transition-all font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-2 text-indigo-400" /> Switch to Vedic Daily
              </Button>
            </Link>
            <Link
              href={`/kp-varshaphal?${queryParams}`}
            >
              <Button
                variant="outline"
                className="bg-white/5 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-200 rounded-full px-5 backdrop-blur-md transition-all font-medium"
              >
                <Sun className="w-4 h-4 mr-2 text-yellow-400" /> View KP Varshaphal
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-8">
          {/* Quick Metrics & Cosmic Pulse Bar (Identical 6-item layout) */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Cosmic Score */}
            <div className="bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-4 backdrop-blur-xl transition-all flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Auspicious Score
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">
                  {dailyData.cosmicScore}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                  style={{ width: `${dailyData.cosmicScore}%` }}
                />
              </div>
            </div>

            {/* Natal Moon Sign */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-medium flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-blue-400" /> Janma Rashi
              </span>
              <div className="mt-2 text-base font-semibold text-cyan-100 truncate">
                {dailyData.natalMoonSign?.split(" ")[0]}
              </div>
              <span className="text-xs text-cyan-300/60 truncate">{dailyData.birthNakshatra}</span>
            </div>

            {/* Transit Moon Sign */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-medium flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400" /> Transit Moon
              </span>
              <div className="mt-2 text-base font-semibold text-teal-100 truncate">
                {dailyData.transitMoonSign?.split(" ")[0]}
              </div>
              <span className="text-xs text-teal-300/60">House {dailyData.transitHouseFromMoon} (Placidus)</span>
            </div>

            {/* Lucky Color */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-medium flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> Lucky Color
              </span>
              <div className="mt-2 text-base font-semibold text-amber-100 truncate">
                {dailyData.luckyColor}
              </div>
              <span className="text-xs text-amber-300/60">Sub-Lord Harmonic</span>
            </div>

            {/* Lucky Number */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-medium flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-pink-400" /> Lucky Number
              </span>
              <div className="mt-2 text-2xl font-space font-bold text-pink-200">
                {dailyData.luckyNumber}
              </div>
              <span className="text-xs text-pink-300/60">Vibrational Key</span>
            </div>

            {/* Auspicious Time */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Auspicious KP Time
              </span>
              <div className="mt-2 text-sm font-semibold text-emerald-100 line-clamp-2">
                {dailyData.auspiciousTime}
              </div>
              <span className="text-xs text-emerald-300/60">Sub-Lord Window</span>
            </div>
          </motion.div>

          {/* Overarching Daily Synthesis Hero Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-cyan-950/40 via-teal-950/30 to-indigo-950/20 border border-cyan-500/25 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.12)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] group-hover:bg-cyan-500/15 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 text-cyan-300 shadow-inner">
                    <Flame className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-space font-bold text-cyan-100">
                      Overall KP Cosmic Rhythm
                    </h3>
                    <p className="text-sm text-cyan-300/70">
                      Sub-Lord mood: <span className="text-cyan-200 font-medium">{dailyData.cosmicMood}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/10 self-start sm:self-auto">
                  <span className="text-xs uppercase tracking-wider text-cyan-300/70 font-semibold">Day Favorability:</span>
                  <FavorabilityBadge status={dailyData.overallFavorability || "FAVOURABLE"} />
                </div>
              </div>

              <div className="text-base md:text-lg text-cyan-100/90 leading-relaxed space-y-4 whitespace-pre-wrap font-normal">
                {dailyData.dailySummary}
              </div>
            </div>
          </motion.div>

          {/* 4 Pillars of Daily Life (Career, Wealth, Love, Health) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Career & Purpose */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-blue-100">Career & Purpose</h4>
                      <p className="text-xs text-blue-300/60">Professional Execution & Status</p>
                    </div>
                  </div>
                  <FavorabilityBadge status={dailyData.careerFavorability || "GOOD"} />
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {dailyData.career}
                </p>
              </div>
            </motion.div>

            {/* Wealth & Finance */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Coins className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-100">Wealth & Finance</h4>
                      <p className="text-xs text-emerald-300/60">Asset Allocations & Expenditure</p>
                    </div>
                  </div>
                  <FavorabilityBadge status={dailyData.financeFavorability || "FAVOURABLE"} />
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {dailyData.finance}
                </p>
              </div>
            </motion.div>

            {/* Love & Relationships */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 hover:border-pink-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                      <Heart className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-pink-100">Love & Relationships</h4>
                      <p className="text-xs text-pink-300/60">Interpersonal & Emotional Bond</p>
                    </div>
                  </div>
                  <FavorabilityBadge status={dailyData.loveFavorability || "GOOD"} />
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {dailyData.love}
                </p>
              </div>
            </motion.div>

            {/* Health & Vitality */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 hover:border-rose-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                      <Shield className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-rose-100">Health & Vitality</h4>
                      <p className="text-xs text-rose-300/60">Energy Flow & Mind Balance</p>
                    </div>
                  </div>
                  <FavorabilityBadge status={dailyData.healthFavorability || "FAVOURABLE"} />
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {dailyData.health}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Daily Harmonizing Remedy */}
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.03] border border-teal-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30 shrink-0 text-teal-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-space font-bold text-teal-100">
                Daily KP Harmonic Upaya (Remedy)
              </h4>
              <p className="text-sm md:text-base text-cyan-100/80 mt-1 leading-relaxed">
                {dailyData.remedy}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
