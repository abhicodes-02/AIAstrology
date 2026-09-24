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

export default function DailyInsightView({
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

  return (
    <div className="min-h-screen bg-transparent text-indigo-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background ambient glowing orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/15 rounded-full blur-[120px]"
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
                href={`/kundli?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`}
                className="group inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all text-sm font-medium bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 hover:border-indigo-500/40"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Kundli
              </Link>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                <Calendar className="w-3.5 h-3.5" />
                {dailyData.dateFormatted}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-indigo-200 to-purple-200 tracking-tight">
              Daily Cosmic Insight
            </h1>
            <p className="text-indigo-200/70 text-base md:text-lg mt-2">
              Personalized planetary transit alignment for{" "}
              <span className="text-indigo-100 font-semibold">{name}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/varshaphal?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`}
            >
              <Button
                variant="outline"
                className="bg-white/5 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-200 rounded-full px-5 backdrop-blur-md transition-all font-medium"
              >
                <Sun className="w-4 h-4 mr-2 text-yellow-400" /> View Varshaphal
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-8">
          {/* Quick Metrics & Cosmic Pulse Bar */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Cosmic Score */}
            <div className="bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-4 backdrop-blur-xl transition-all flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-indigo-300/70 font-medium flex items-center gap-1.5">
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
              <span className="text-xs uppercase tracking-wider text-indigo-300/70 font-medium flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-blue-400" /> Janma Rashi
              </span>
              <div className="mt-2 text-base font-semibold text-indigo-100 truncate">
                {dailyData.natalMoonSign?.split(" ")[0]}
              </div>
              <span className="text-xs text-indigo-300/60 truncate">{dailyData.birthNakshatra}</span>
            </div>

            {/* Transit Moon Sign */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-indigo-300/70 font-medium flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" /> Transit Moon
              </span>
              <div className="mt-2 text-base font-semibold text-purple-100 truncate">
                {dailyData.transitMoonSign?.split(" ")[0]}
              </div>
              <span className="text-xs text-purple-300/60">House {dailyData.transitHouseFromMoon} from Moon</span>
            </div>

            {/* Lucky Color */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-indigo-300/70 font-medium flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> Lucky Color
              </span>
              <div className="mt-2 text-base font-semibold text-amber-100 truncate">
                {dailyData.luckyColor}
              </div>
              <span className="text-xs text-amber-300/60">Harmonizing Energy</span>
            </div>

            {/* Lucky Number */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-indigo-300/70 font-medium flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-pink-400" /> Lucky Number
              </span>
              <div className="mt-2 text-2xl font-space font-bold text-pink-200">
                {dailyData.luckyNumber}
              </div>
              <span className="text-xs text-pink-300/60">Vibrational Anchor</span>
            </div>

            {/* Auspicious Time */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-indigo-300/70 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Shubh Muhurat
              </span>
              <div className="mt-2 text-sm font-semibold text-emerald-100 line-clamp-2">
                {dailyData.auspiciousTime}
              </div>
              <span className="text-xs text-emerald-300/60">Peak Cosmic Support</span>
            </div>
          </motion.div>

          {/* Overarching Daily Synthesis Hero Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-indigo-950/20 border border-indigo-500/25 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.12)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] group-hover:bg-indigo-500/15 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 text-indigo-300 shadow-inner">
                    <Flame className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-space font-bold text-indigo-100">
                      Overall Cosmic Rhythm
                    </h3>
                    <p className="text-sm text-indigo-300/70">
                      General mood: <span className="text-indigo-200 font-medium">{dailyData.cosmicMood}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-base md:text-lg text-indigo-100/90 leading-relaxed space-y-4 whitespace-pre-wrap font-normal">
                {dailyData.dailySummary}
              </div>
            </div>
          </motion.div>

          {/* 4 Pillars of Daily Life Grid (Career, Wealth, Love, Health) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Career & Work */}
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-space font-bold text-blue-100">Career & Ambition</h4>
                    <span className="text-xs text-blue-300/60 uppercase tracking-wider font-medium">Work, Deals & Leadership</span>
                  </div>
                </div>
                <p className="text-indigo-100/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
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
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-space font-bold text-emerald-100">Wealth & Cash Flow</h4>
                    <span className="text-xs text-emerald-300/60 uppercase tracking-wider font-medium">Finances, Purchases & Returns</span>
                  </div>
                </div>
                <p className="text-indigo-100/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
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
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 bg-pink-500/10 border border-pink-500/25 rounded-2xl flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-space font-bold text-pink-100">Love & Harmony</h4>
                    <span className="text-xs text-pink-300/60 uppercase tracking-wider font-medium">Partner, Family & Social Bonds</span>
                  </div>
                </div>
                <p className="text-indigo-100/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
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
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-space font-bold text-rose-100">Health & Vitality</h4>
                    <span className="text-xs text-rose-300/60 uppercase tracking-wider font-medium">Physical Stamina & Peace of Mind</span>
                  </div>
                </div>
                <p className="text-indigo-100/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {dailyData.health}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Daily Vedic Remedy & Sacred Practice */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-300 shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-space font-bold text-purple-100 mb-2">
                  Vedic Remedy of the Day
                </h3>
                <p className="text-indigo-100/85 text-sm md:text-base leading-relaxed">
                  {dailyData.remedy}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5"
          >
            <Link
              href={`/kundli?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white/5 border-white/10 hover:bg-white/10 text-indigo-100 rounded-full px-6 py-5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Complete Kundli
              </Button>
            </Link>

            <Link
              href={`/varshaphal?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-yellow-950 font-bold rounded-full px-6 py-5 shadow-lg">
                Explore Solar Varshaphal (Annual) <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
