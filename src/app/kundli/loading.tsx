"use client";

import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

export default function KundliLoading() {
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/30 rounded-full blur-[120px]"
      />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500/50"
          />
          {/* Inner rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-b-2 border-l-2 border-purple-400/50"
          />
          {/* Center Icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-10 h-10 text-indigo-300" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
            Consulting the Stars...
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-indigo-300/70 max-w-sm text-sm md:text-base"
          >
            Our AI is analyzing the exact cosmic geometry of your birth. This deep-dive reading may take 10-15 seconds.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

