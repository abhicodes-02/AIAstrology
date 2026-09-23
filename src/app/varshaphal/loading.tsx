"use client";

import { motion } from "framer-motion";
import { Sun, Sparkles } from "lucide-react";

export default function VarshaphalLoading() {
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-900/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-900/20 rounded-full blur-[120px]"
      />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-yellow-500/50"
          />
          {/* Inner rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border-b-2 border-l-2 border-orange-400/50"
          />
          {/* Center Icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sun className="w-12 h-12 text-yellow-400" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Calculating Solar Return...
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-yellow-200/60 max-w-sm text-sm md:text-base mx-auto"
          >
            Charting your planetary transits and mapping your Varshaphal for the upcoming 12 months.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

