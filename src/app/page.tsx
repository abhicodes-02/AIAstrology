import BirthDetailsForm from "@/components/BirthDetailsForm";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen relative overflow-hidden">
      {/* Mystical decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 pt-12 lg:pt-0">
        
        {/* Hero Section */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Astrological Insights
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-br from-indigo-100 via-purple-200 to-indigo-400 tracking-tight leading-tight">
            Discover Your <br className="hidden lg:block" /> Cosmic Blueprint
          </h1>
          <p className="text-lg md:text-xl text-indigo-200/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Enter your exact birth details to generate a mathematically perfect Vedic Kundli, paired with deep, AI-driven insights into your personality, career, and relationships.
          </p>
          <div className="pt-4 flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-indigo-300/60 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              100% Precise Math
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Vedic Astrology
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Personalized AI Reading
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 animate-pulse" />
          <BirthDetailsForm />
        </div>

      </div>
    </main>
  );
}
