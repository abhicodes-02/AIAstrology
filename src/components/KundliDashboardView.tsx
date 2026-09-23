"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Star, Sun, Moon, MapPin, Clock, Calendar, Heart, Shield, Coins, Briefcase } from "lucide-react";
import Link from "next/link";
import KundliChart from "@/components/KundliChart";
import { Button } from "@/components/ui/button";

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
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-indigo-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Animated Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-indigo-100 rounded-full px-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 mr-2 text-purple-400" /> Download PDF
          </Button>
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

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-indigo-300/50 uppercase tracking-wider mb-1">Ascendant</p>
                  <p className="font-medium text-indigo-100">{chartData.ascendant}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-300/50 uppercase tracking-wider mb-1">Moon Sign</p>
                  <p className="font-medium text-indigo-100 flex items-center gap-2"><Moon className="w-3 h-3 text-blue-400" /> {chartData.moonSign}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-300/50 uppercase tracking-wider mb-1">Sun Sign</p>
                  <p className="font-medium text-indigo-100 flex items-center gap-2"><Sun className="w-3 h-3 text-yellow-500" /> {chartData.sunSign}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-300/50 uppercase tracking-wider mb-1">Nakshatra</p>
                  <p className="font-medium text-indigo-100">{chartData.nakshatra}</p>
                </div>
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
              <div className="aspect-square w-full opacity-90">
                <KundliChart planets={chartData.houses} />
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
              <div className="aspect-square w-full opacity-90">
                <KundliChart planets={chartData.d9Houses || chartData.houses} />
              </div>
            </motion.div>
          </div>

          {/* RIGHT CONTENT (AI Predictions Bento Grid) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Core Soul Urge (Hero Block) */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(79,70,229,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
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
                  {chartData.reading}
                </p>
              </div>
            </motion.div>

            {/* 2x2 Grid for Specifics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Career */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-blue-100">Career & Power</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.career}
                </p>
              </motion.div>

              {/* Wealth */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-semibold text-emerald-100">Wealth & Finance</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.wealth || "No wealth data available."}
                </p>
              </motion.div>

              {/* Love */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 hover:border-pink-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <h4 className="text-lg font-semibold text-pink-100">Love & Destiny</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.relationships}
                </p>
              </motion.div>

              {/* Health */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 hover:border-rose-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-rose-400" />
                  <h4 className="text-lg font-semibold text-rose-100">Health & Vitality</h4>
                </div>
                <p className="text-indigo-200/80 leading-relaxed text-sm md:text-base">
                  {chartData.health || "No health data available."}
                </p>
              </motion.div>
            </div>

            {/* Ultimate Life Path */}
            <motion.div variants={itemVariants} className="bg-white/[0.03] border border-purple-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-space font-bold text-purple-100">Ultimate Life Path</h3>
              </div>
              <p className="text-base md:text-lg text-indigo-100/80 leading-relaxed whitespace-pre-wrap">
                {chartData.fullLife || "Full life overview is not available."}
              </p>
            </motion.div>

            {/* Varshaphal CTA */}
            <motion.div variants={itemVariants} className="mt-8 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(234,179,8,0.15)] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 max-w-xl">
                <h3 className="text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400 flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Sun className="w-8 h-8 text-yellow-400" />
                  Your Year Ahead
                </h3>
                <p className="text-yellow-100/70 text-lg">
                  Generate a massive, deep-dive Annual Forecast (Varshaphal) and a detailed 12-month breakdown for your current solar year.
                </p>
              </div>
              
              <Link href={`/varshaphal?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`} className="relative z-10 w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold text-lg px-8 py-6 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] transition-all hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2" /> Generate Varshaphal
                </Button>
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

