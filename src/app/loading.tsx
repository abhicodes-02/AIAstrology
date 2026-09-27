"use client";

import { motion } from "framer-motion";
import { Loader2, Star, Sparkles } from "lucide-react";
import { CosmicBackground } from "@/components/CosmicBackground";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <CosmicBackground />
      
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Central Spinning Element */}
        <div className="relative w-32 h-32 mb-12">
          {/* Outer glow ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30"
          />
          
          {/* Inner solid ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500/80 border-b-cyan-500/80 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          />

          {/* Core star/loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Loader2 className="w-10 h-10 text-indigo-300 animate-spin" />
            </motion.div>
          </div>
          
          {/* Orbiting Star */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 origin-center"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
            </div>
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.h2 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl md:text-3xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200 mb-4"
        >
          Consulting the Cosmos
        </motion.h2>

        <p className="text-indigo-200/70 text-sm md:text-base font-light">
          Our AI is calculating planetary exactitudes and synthesizing your deep astrological timeline...
        </p>

        {/* Progress bar simulation */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mt-8 overflow-hidden relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "85%", "95%"] }}
            transition={{ duration: 15, ease: "circOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
          />
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-xs text-indigo-300/50">
          <Sparkles className="w-3 h-3" />
          <span>This may take 10-20 seconds for deep analysis</span>
        </div>
      </div>
    </div>
  );
}
