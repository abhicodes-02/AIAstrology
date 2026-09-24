"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Compass,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Heart,
  Briefcase,
  ShieldCheck,
  Zap,
  Grid,
  Layers,
  HelpCircle,
  Eye
} from "lucide-react";
import KundliChart from "@/components/KundliChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KpKundliDashboardProps {
  chartData: any;
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

export default function KpKundliDashboardView({
  chartData,
  name,
  dob,
  tob,
  pob
}: KpKundliDashboardProps) {
  const [activeTab, setActiveTab] = useState<"cusps" | "planets" | "significators" | "ruling">("cusps");

  const queryParams = new URLSearchParams({ name, dob, tob, pob }).toString();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-cyan-500/20 pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Astral Intake
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
              KP Astrology Master Chart
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
              KP STELLAR SYSTEM
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Krishnamurti Paddhati (Placidus Cusps, 249 Sub-Lords & 4-Fold Significators)
          </p>
        </div>

        {/* Quick Nav to Vedic & Other KP Modules */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/kundli?${queryParams}`}>
            <Button variant="outline" size="sm" className="border-indigo-500/30 hover:bg-indigo-950 text-indigo-300 text-xs">
              Switch to Vedic Mode
            </Button>
          </Link>
          <Link href={`/kp-daily-insight?${queryParams}`}>
            <Button size="sm" className="bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-3.5 h-3.5" /> KP Daily Insight
            </Button>
          </Link>
          <Link href={`/kp-varshaphal?${queryParams}`}>
            <Button size="sm" className="bg-teal-600/80 hover:bg-teal-500 text-white text-xs gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <Calendar className="w-3.5 h-3.5" /> KP Varshaphal
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Seeker Info + KP Bhava Chalit Chart */}
        <div className="xl:col-span-4 space-y-6">
          {/* Seeker Profile Card */}
          <Card className="bg-slate-900/60 border-cyan-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-cyan-200 flex items-center justify-between">
                <span>{name}</span>
                <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  KP Ayanamsa: {chartData.kpAyanamsa}
                </span>
              </CardTitle>
              <CardDescription className="text-slate-400 flex flex-col gap-1 text-xs">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {dob}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {tob}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {pob}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Lagna Cusp:</span>
                  <span className="font-semibold text-cyan-300">{chartData.ascendantCusp?.signName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lagna Sub-Lord:</span>
                  <span className="font-bold text-amber-300">{chartData.ascendantCusp?.subLord}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Moon Sign:</span>
                  <span className="font-semibold text-indigo-300">{chartData.moonInfo?.signName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Moon Sub-Lord:</span>
                  <span className="font-bold text-emerald-300">{chartData.moonInfo?.subLord}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KP Bhava Chalit Chart */}
          <Card className="bg-slate-900/60 border-cyan-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-cyan-200 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" /> KP Bhava Chart
                </CardTitle>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">
                  Placidus System
                </span>
              </div>
              <CardDescription className="text-xs text-slate-400">
                Planets positioned by actual Placidus house cusps (1 to 12)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KundliChart planets={chartData.bpHouses || {}} title="KP Bhava Chalit" />
            </CardContent>
          </Card>

          {/* Ruling Planets (RP) Quick Card */}
          <Card className="bg-slate-900/60 border-teal-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-teal-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" /> KP Ruling Planets (RP)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Asc Star Lord:</span>
                <span className="font-semibold text-teal-300">{chartData.rulingPlanets?.ascendantStarLord}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Asc Sub-Lord:</span>
                <span className="font-semibold text-amber-300">{chartData.rulingPlanets?.ascendantSubLord}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moon Star Lord:</span>
                <span className="font-semibold text-teal-300">{chartData.rulingPlanets?.moonStarLord}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moon Sign Lord:</span>
                <span className="font-semibold text-teal-300">{chartData.rulingPlanets?.moonSignLord}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Day Lord:</span>
                <span className="font-semibold text-teal-300">{chartData.rulingPlanets?.dayLord}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: KP Tables & AI Deep Readings */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* KP Core Table Tabs (Cusps, Planets, 4-Fold Significators) */}
          <Card className="bg-slate-900/60 border-cyan-500/20 shadow-xl backdrop-blur-md overflow-hidden">
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("cusps")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "cusps"
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                12 Placidus Cusps (CSL)
              </button>
              <button
                onClick={() => setActiveTab("planets")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "planets"
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                Planets & Sub-Lords
              </button>
              <button
                onClick={() => setActiveTab("significators")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "significators"
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                4-Fold Significators (A, B, C, D)
              </button>
            </div>

            <CardContent className="p-4 overflow-x-auto">
              {/* TAB 1: 12 Placidus Cusps */}
              {activeTab === "cusps" && (
                <div>
                  <div className="mb-3 text-xs text-slate-400 flex items-center justify-between">
                    <span>Exact Placidus starting degree, Sign Lord (RL), Star Lord (NL), and Cuspal Sub Lord (SL).</span>
                    <span className="text-cyan-400 font-medium">SL = Final Decider</span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                        <th className="py-2.5 px-3">Cusp</th>
                        <th className="py-2.5 px-3">Degree</th>
                        <th className="py-2.5 px-3">Sign</th>
                        <th className="py-2.5 px-3">Sign Lord</th>
                        <th className="py-2.5 px-3">Nakshatra</th>
                        <th className="py-2.5 px-3">Star Lord</th>
                        <th className="py-2.5 px-3 font-bold text-amber-300">Sub Lord (CSL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {chartData.cusps?.map((c: any) => (
                        <tr key={c.houseNumber} className="hover:bg-cyan-950/20 transition-colors">
                          <td className="py-2 px-3 font-bold text-cyan-300">Cusp {c.houseNumber}</td>
                          <td className="py-2 px-3 text-slate-300 font-mono">{c.degFormatted}</td>
                          <td className="py-2 px-3 text-slate-200">{c.signName}</td>
                          <td className="py-2 px-3 text-slate-300">{c.signLord}</td>
                          <td className="py-2 px-3 text-slate-400">{c.nakshatraName}</td>
                          <td className="py-2 px-3 text-teal-300">{c.starLord}</td>
                          <td className="py-2 px-3 font-bold text-amber-300 bg-amber-500/10 rounded">
                            {c.subLord}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 2: Planets & Sub-Lords */}
              {activeTab === "planets" && (
                <div>
                  <div className="mb-3 text-xs text-slate-400">
                    Planet coordinates in KP Sidereal zodiac with Star and Sub-Lord allocations according to the 249 table.
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                        <th className="py-2.5 px-3">Planet</th>
                        <th className="py-2.5 px-3">Longitude</th>
                        <th className="py-2.5 px-3">Sign</th>
                        <th className="py-2.5 px-3">House (KP)</th>
                        <th className="py-2.5 px-3">Star Lord (NL)</th>
                        <th className="py-2.5 px-3 font-bold text-emerald-300">Sub Lord (SL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {chartData.planets?.map((p: any) => (
                        <tr key={p.name} className="hover:bg-cyan-950/20 transition-colors">
                          <td className="py-2 px-3 font-bold text-slate-100 flex items-center gap-1.5">
                            {p.name} {p.isRetrograde && <span className="text-red-400 text-[10px]">(R)</span>}
                          </td>
                          <td className="py-2 px-3 text-slate-300 font-mono">{p.degFormatted}</td>
                          <td className="py-2 px-3 text-slate-200">{p.signName}</td>
                          <td className="py-2 px-3 text-cyan-300 font-bold">House {p.houseOccupied}</td>
                          <td className="py-2 px-3 text-teal-300">{p.starLord}</td>
                          <td className="py-2 px-3 font-bold text-emerald-300 bg-emerald-500/10 rounded">
                            {p.subLord}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: 4-Fold Significators */}
              {activeTab === "significators" && (
                <div>
                  <div className="mb-3 text-xs text-slate-400 space-y-1">
                    <p><strong className="text-cyan-300">Level A:</strong> Houses occupied by Star Lord | <strong className="text-cyan-300">Level B:</strong> House occupied by planet itself</p>
                    <p><strong className="text-cyan-300">Level C:</strong> Houses owned by Star Lord | <strong className="text-cyan-300">Level D:</strong> Houses owned by planet itself</p>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                        <th className="py-2.5 px-3">Planet</th>
                        <th className="py-2.5 px-3 text-teal-300">Level A (Strongest)</th>
                        <th className="py-2.5 px-3 text-cyan-300">Level B</th>
                        <th className="py-2.5 px-3 text-indigo-300">Level C</th>
                        <th className="py-2.5 px-3 text-slate-300">Level D</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {chartData.planetSignificators?.map((sig: any) => (
                        <tr key={sig.planet} className="hover:bg-cyan-950/20 transition-colors">
                          <td className="py-2 px-3 font-bold text-slate-100">{sig.planet}</td>
                          <td className="py-2 px-3 font-mono font-semibold text-teal-300">
                            {sig.levelA.join(", ") || "-"}
                          </td>
                          <td className="py-2 px-3 font-mono text-cyan-300">
                            {sig.levelB.join(", ") || "-"}
                          </td>
                          <td className="py-2 px-3 font-mono text-indigo-300">
                            {sig.levelC.join(", ") || "-"}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-400">
                            {sig.levelD.join(", ") || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI KP Stellar Readings */}
          <div className="space-y-5">
            {/* Overview / Blueprint */}
            <Card className="bg-slate-900/60 border-cyan-500/30 shadow-xl backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-cyan-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" /> KP Life Blueprint & Sub-Lord Destiny
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">
                {chartData.readings?.kpSummary}
              </CardContent>
            </Card>

            {/* Career & Profession (10th CSL) */}
            <Card className="bg-slate-900/60 border-indigo-500/20 shadow-xl backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-indigo-200 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" /> Career, Status & 10th Cuspal Sub-Lord
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  KP combinations for career success (Houses 2, 6, 10, 11)
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">
                {chartData.readings?.careerKp}
              </CardContent>
            </Card>

            {/* Wealth & Prosperity (2nd & 11th CSL) */}
            <Card className="bg-slate-900/60 border-emerald-500/20 shadow-xl backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-emerald-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Wealth, Assets & 2nd/11th CSL
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Financial gains, savings, and acquisition significations
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">
                {chartData.readings?.financeKp}
              </CardContent>
            </Card>

            {/* Relationships & Marriage (7th CSL) */}
            <Card className="bg-slate-900/60 border-rose-500/20 shadow-xl backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-rose-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" /> Partnership & 7th Cuspal Sub-Lord
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Harmony, spouse characteristics, and conjugal compatibility
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">
                {chartData.readings?.relationshipKp}
              </CardContent>
            </Card>

            {/* Health & Vitality */}
            <Card className="bg-slate-900/60 border-teal-500/20 shadow-xl backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-teal-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" /> Vitality, Wellness & Resistance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">
                {chartData.readings?.healthKp}
              </CardContent>
            </Card>

            {/* Timing of Events through Ruling Planets */}
            <Card className="bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-indigo-950/40 border-cyan-500/40 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-cyan-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Master Advice: Timing Events with Ruling Planets
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-200 leading-relaxed">
                {chartData.readings?.rulingPlanetsAdvice}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
