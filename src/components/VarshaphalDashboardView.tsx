"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Sun, Moon, CalendarDays, Briefcase, Heart, Star, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";


export default function VarshaphalDashboardView({ 
  data, 
  name, 
  dob, 
  tob, 
  pob 
}: { 
  data: any; 
  name: string; 
  dob: string; 
  tob: string; 
  pob: string; 
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamically import react-pdf to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { VarshaphalPDF } = await import('@/components/VarshaphalPDF');

      const blob = await pdf(
        <VarshaphalPDF 
          data={data} 
          name={name} 
          dob={dob} 
          tob={tob} 
          pob={pob} 
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Varshaphal_${name.replace(/\s+/g, '_')}.pdf`;
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
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const monthlyData = Array.isArray(data.monthlyPredictions) 
    ? data.monthlyPredictions 
    : [{ month: "Overview", prediction: typeof data.monthlyPredictions === 'string' ? data.monthlyPredictions : "Data unavailable." }];

  return (
    <div className="min-h-screen bg-[#020205] text-indigo-100 font-sans relative overflow-x-hidden selection:bg-yellow-500/30">
      {/* Animated Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-yellow-900/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-900/10 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" ref={printRef}>
        {/* Navigation & Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/5 pb-8"
        >
          <div>
            <Link href={`/kundli?name=${encodeURIComponent(name)}&dob=${dob}&tob=${encodeURIComponent(tob)}&pob=${encodeURIComponent(pob)}`} className="group inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all text-sm font-medium mb-6 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20 hover:border-yellow-500/40">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-orange-300 to-yellow-500 tracking-tight drop-shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              Solar Return
            </h1>
            <p className="text-yellow-200/60 mt-2 text-lg">
              {name} • Varshaphal Annual Forecast
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/5 border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-100 rounded-full px-6 backdrop-blur-md transition-all"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-yellow-400" /> Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2 text-yellow-400" /> Download PDF
              </>
            )}
          </Button>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-12"
        >
          {/* Main Varshaphal Hero Card */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-yellow-950/40 to-orange-950/20 border border-yellow-500/20 rounded-3xl p-6 md:p-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-500/10 rounded-full blur-[100px] group-hover:bg-yellow-500/20 transition-all duration-1000 translate-x-1/3 -translate-y-1/3" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center border border-yellow-400/40 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                  <Sun className="w-8 h-8 text-yellow-300 drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400">
                    The Year Ahead
                  </h3>
                  <p className="text-yellow-200/70 text-lg mt-1">Deep overarching themes for your upcoming solar cycle</p>
                </div>
              </div>
              
              <div className="prose prose-invert prose-yellow max-w-none">
                <p className="text-lg md:text-xl text-yellow-50/90 leading-relaxed font-light whitespace-pre-wrap">
                  {data.varshaphal}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Monthly Breakdown Grid */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <CalendarDays className="w-8 h-8 text-indigo-400" />
              <div>
                <h3 className="text-3xl font-space font-bold text-indigo-100">12-Month Breakdown</h3>
                <p className="text-indigo-300/60">How your Varshaphal manifests dynamically</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {monthlyData.map((monthData: any, index: number) => (
                <motion.div 
                  key={index}
                  variants={itemVariants} 
                  className="bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-colors duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full space-y-6">
                    {/* Header: Month & Theme */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-lg shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                          {index + 1}
                        </div>
                        <h4 className="text-2xl font-space font-bold text-indigo-100">{monthData.month}</h4>
                      </div>
                      {monthData.theme && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-medium uppercase tracking-wider self-start sm:self-auto">
                          <Star className="w-3 h-3" />
                          {monthData.theme}
                        </div>
                      )}
                    </div>
                    
                    {/* Main Overview */}
                    <div className="flex-grow">
                      <p className="text-indigo-100/90 leading-relaxed text-base font-light">
                        {monthData.prediction}
                      </p>
                    </div>

                    {/* Specifics: Career & Love */}
                    {(monthData.career || monthData.relationships) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        {monthData.career && (
                          <div className="bg-blue-950/20 rounded-2xl p-4 border border-blue-500/10">
                            <div className="flex items-center gap-2 mb-2 text-blue-300 font-medium text-sm">
                              <Briefcase className="w-4 h-4" /> Career
                            </div>
                            <p className="text-blue-100/70 text-sm leading-relaxed">{monthData.career}</p>
                          </div>
                        )}
                        {monthData.relationships && (
                          <div className="bg-pink-950/20 rounded-2xl p-4 border border-pink-500/10">
                            <div className="flex items-center gap-2 mb-2 text-pink-300 font-medium text-sm">
                              <Heart className="w-4 h-4" /> Relationships
                            </div>
                            <p className="text-pink-100/70 text-sm leading-relaxed">{monthData.relationships}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}

