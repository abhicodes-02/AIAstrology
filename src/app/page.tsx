"use client";

import BirthDetailsForm from "@/components/BirthDetailsForm";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen relative overflow-hidden bg-transparent">
      {/* Mystical decorative elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[150px] pointer-events-none" 
      />
      
      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 pt-12 lg:pt-0">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI-Powered Astrological Insights
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-br from-indigo-100 via-purple-200 to-indigo-400 tracking-tight leading-tight"
          >
            Discover Your <br className="hidden lg:block" /> Cosmic Blueprint
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-indigo-200/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Enter your exact birth details to generate a mathematically perfect Vedic Kundli, paired with deep, AI-driven insights into your personality, career, and relationships.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-4 flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-indigo-300/60 font-medium"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              100% Precise Math
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              Vedic Astrology
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              Personalized AI Reading
            </div>
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
          className="flex-1 w-full relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
          <div className="relative z-10 bg-transparent/80 backdrop-blur-xl border border-indigo-500/30 p-1 rounded-2xl shadow-2xl">
            <BirthDetailsForm />
          </div>
        </motion.div>

      </div>
    </main>
  );
}
