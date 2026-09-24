"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Layers,
  Zap,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface KpVarshaphalDashboardProps {
  data: any;
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

export default function KpVarshaphalDashboardView({
  data,
  name,
  dob,
  tob,
  pob,
}: KpVarshaphalDashboardProps) {
  const queryParams = new URLSearchParams({ name, dob, tob, pob }).toString();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-teal-500 selection:text-black">
      {/* Header Bar */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-teal-500/20 pb-6">
        <div>
          <Link
            href={`/kp-kundli?${queryParams}`}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to KP Master Kundli
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
              KP Annual Varshaphal
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 tracking-wider">
              SOLAR SUB-LORD CYCLE
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Annual Solar Return & Sub-Lord Progression for Age {data.age || "Current Year"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/varshaphal?${queryParams}`}>
            <Button variant="outline" size="sm" className="border-teal-500/30 hover:bg-teal-950 text-teal-300 text-xs">
              View Vedic Varshaphal
            </Button>
          </Link>
          <Link href={`/kp-daily-insight?${queryParams}`}>
            <Button size="sm" className="bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-3.5 h-3.5" /> KP Daily Insight
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Annual Solar Blueprint Card */}
        <Card className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border-teal-500/30 shadow-xl backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-teal-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" /> Solar Return Arc & Sub-Lord Fructification
              </CardTitle>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Age Cycle: {data.age} Years
              </span>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              Seeker: {name} | Natal Sun: {data.solarReturnSign} (Star: {data.solarReturnStarLord}, Sub: {data.solarReturnSubLord})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-200 leading-relaxed">
              {data.varshaphal}
            </p>
          </CardContent>
        </Card>

        {/* 4 Quarterly KP Milestones */}
        <div>
          <h2 className="text-lg font-bold text-teal-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" /> Quarterly Sub-Lord Milestone Progression
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.monthlyPredictions?.map((item: any, idx: number) => (
              <Card key={idx} className="bg-slate-900/60 border-teal-500/20 shadow-lg backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-cyan-200 flex items-center justify-between">
                    <span>{item.month}</span>
                    <span className="text-[10px] font-mono text-teal-400 px-2 py-0.5 rounded bg-teal-950/60 border border-teal-500/30">
                      Phase {idx + 1}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300 leading-relaxed">
                  {item.prediction}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
