"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Heart,
  Briefcase,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KpDailyInsightViewProps {
  dailyData: any;
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

export default function KpDailyInsightView({
  dailyData,
  name,
  dob,
  tob,
  pob,
}: KpDailyInsightViewProps) {
  const router = useRouter();
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const queryParams = new URLSearchParams({ name, dob, tob, pob }).toString();

  const handleDateChange = (daysOffset: number) => {
    const current = new Date(targetDate);
    current.setDate(current.getDate() + daysOffset);
    const newDateStr = current.toISOString().split("T")[0];
    setTargetDate(newDateStr);

    const params = new URLSearchParams({
      name,
      dob,
      tob,
      pob,
      date: newDateStr,
    });
    router.push(`/kp-daily-insight?${params.toString()}`);
  };

  const FavorabilityBadge = ({
    level,
    size = "sm",
  }: {
    level: "WORST" | "BAD" | "GOOD" | "FAVOURABLE" | "HIGHLY FAVOURABLE";
    size?: "sm" | "md";
  }) => {
    const getBadgeStyle = (lvl: string) => {
      switch (lvl) {
        case "HIGHLY FAVOURABLE":
          return "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]";
        case "FAVOURABLE":
          return "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.35)]";
        case "GOOD":
          return "bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-[0_0_8px_rgba(59,130,246,0.25)]";
        case "BAD":
          return "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]";
        case "WORST":
          return "bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.35)]";
        default:
          return "bg-slate-700/50 text-slate-300 border-slate-600";
      }
    };

    const isLarge = size === "md";
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-full border transition-all ${getBadgeStyle(
          level
        )} ${isLarge ? "px-3.5 py-1 text-sm tracking-wider" : "px-2.5 py-0.5 text-xs tracking-wide"}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {level}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-cyan-500/20 pb-6">
        <div>
          <Link
            href={`/kp-kundli?${queryParams}`}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to KP Master Kundli
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
              KP Daily Cosmic Rhythm
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
              SUB-LORD TRANSITS
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time KP Transit Moon, Active Star Lord & Sub-Lord Trigger Analysis
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-xl border border-cyan-500/30 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateChange(-1)}
            className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900/40 h-8 px-2"
          >
            <ChevronLeft className="w-4 h-4" /> Prev Day
          </Button>
          <span className="text-xs font-semibold text-slate-200 px-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            {dailyData.dateFormatted}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateChange(1)}
            className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900/40 h-8 px-2"
          >
            Next Day <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Core Daily Highlight Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/40 border-cyan-500/30 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-cyan-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" /> Today&apos;s Active KP Sub-Lord
                </CardTitle>
                <FavorabilityBadge level={dailyData.overallFavorability || "FAVOURABLE"} size="md" />
              </div>
              <CardDescription className="text-slate-400 text-xs">
                {dailyData.kpSubLordTrigger}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed">
                {dailyData.dailySummary}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Transit Moon:</span>
                  <span className="font-semibold text-cyan-300">{dailyData.transitMoonSign}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Transit Star Lord:</span>
                  <span className="font-semibold text-teal-300">{dailyData.transitStarLord}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Transit Sub-Lord:</span>
                  <span className="font-bold text-amber-300">{dailyData.transitSubLord}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Activated House:</span>
                  <span className="font-bold text-indigo-300">House {dailyData.transitHouseOccupied}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Timing & KP Remedial Advice */}
          <Card className="bg-slate-900/60 border-teal-500/20 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-teal-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" /> Auspicious KP Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="bg-teal-950/30 p-3 rounded-lg border border-teal-500/30">
                <span className="text-slate-400 block text-[11px]">Sub-Lord Auspicious Window:</span>
                <span className="font-bold text-teal-300 text-sm">{dailyData.auspiciousKpTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Harmonic Remedy:</span>
                <p className="text-slate-300 leading-normal text-xs">{dailyData.remedy}</p>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Link href={`/daily-insight?${queryParams}`}>
                <Button variant="outline" size="sm" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 text-xs">
                  View Vedic Daily Insight
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* 4 Pillars with KP Sub-Lord Evaluation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Career & Duty */}
          <Card className="bg-slate-900/60 border-indigo-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-indigo-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Career & Professional Execution
              </CardTitle>
              <FavorabilityBadge level={dailyData.careerFavorability || "GOOD"} />
            </CardHeader>
            <CardContent className="text-sm text-slate-300 leading-relaxed">
              {dailyData.career}
            </CardContent>
          </Card>

          {/* Wealth & Finance */}
          <Card className="bg-slate-900/60 border-emerald-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-emerald-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Wealth, Assets & Expenditures
              </CardTitle>
              <FavorabilityBadge level={dailyData.financeFavorability || "FAVOURABLE"} />
            </CardHeader>
            <CardContent className="text-sm text-slate-300 leading-relaxed">
              {dailyData.finance}
            </CardContent>
          </Card>

          {/* Relationships & Love */}
          <Card className="bg-slate-900/60 border-rose-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-rose-200 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" /> Emotional Ties & Partnerships
              </CardTitle>
              <FavorabilityBadge level={dailyData.loveFavorability || "GOOD"} />
            </CardHeader>
            <CardContent className="text-sm text-slate-300 leading-relaxed">
              {dailyData.love}
            </CardContent>
          </Card>

          {/* Health & Vitality */}
          <Card className="bg-slate-900/60 border-teal-500/20 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-teal-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> Physical Vitality & Mind
              </CardTitle>
              <FavorabilityBadge level={dailyData.healthFavorability || "FAVOURABLE"} />
            </CardHeader>
            <CardContent className="text-sm text-slate-300 leading-relaxed">
              {dailyData.health}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
