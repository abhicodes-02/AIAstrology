"use client";

import React from "react";
import { motion } from "framer-motion";


export interface ChartPlanet {
  name: string;
  signIndex: number;
  isRetrograde?: boolean;
  degreeStr?: string;
}

export interface ChartCusp {
  houseNumber: number;
  signIndex: number; // 1 to 12
  degreeStr?: string;
}

interface EastIndianChartProps {
  planets: ChartPlanet[];
  cusps: ChartCusp[];
  width?: number;
  height?: number;
  centerTitle?: string;
  centerSubtitle?: string;
  showOm?: boolean;
  isKp?: boolean;
  theme?: 'dark' | 'light';
}

const EastIndianChart: React.FC<EastIndianChartProps> = ({ 
  planets, 
  cusps, 
  width = 400, 
  height = 400,
  centerTitle,
  centerSubtitle,
  showOm = false,
  isKp = false,
  theme = 'dark'
}) => {
  const u = 100;
  const size = 300;

  // Sign indices: 1 = Aries, 2 = Taurus ... 12 = Pisces
  const signPolygons = [
    { id: 1, name: "Aries", points: `${u},0 ${2*u},0 ${2*u},${u} ${u},${u}`, cx: 1.5*u, cy: 0.5*u },
    { id: 2, name: "Taurus", points: `0,0 ${u},0 ${u},${u}`, cx: 0.67*u, cy: 0.33*u },
    { id: 3, name: "Gemini", points: `0,0 ${u},${u} 0,${u}`, cx: 0.33*u, cy: 0.67*u },
    { id: 4, name: "Cancer", points: `0,${u} ${u},${u} ${u},${2*u} 0,${2*u}`, cx: 0.5*u, cy: 1.5*u },
    { id: 5, name: "Leo", points: `0,${u} ${u},${2*u} 0,${2*u}`, cx: 0.33*u, cy: 2.33*u }, // Wait, Leo is bottom-left, Left triangle: 0,2u 0,3u u,2u 
    // Let me correct Leo, Virgo, Scorpio, Sagittarius, Aquarius, Pisces based on standard geometry:
    { id: 6, name: "Virgo", points: `0,${3*u} ${u},${2*u} ${u},${3*u}`, cx: 0.67*u, cy: 2.67*u },
    { id: 7, name: "Libra", points: `${u},${2*u} ${2*u},${2*u} ${2*u},${3*u} ${u},${3*u}`, cx: 1.5*u, cy: 2.5*u },
    { id: 8, name: "Scorpio", points: `${2*u},${2*u} ${2*u},${3*u} ${3*u},${3*u}`, cx: 2.33*u, cy: 2.67*u },
    { id: 9, name: "Sagittarius", points: `${2*u},${2*u} ${3*u},${3*u} ${3*u},${2*u}`, cx: 2.67*u, cy: 2.33*u },
    { id: 10, name: "Capricorn", points: `${2*u},${u} ${3*u},${u} ${3*u},${2*u} ${2*u},${2*u}`, cx: 2.5*u, cy: 1.5*u },
    { id: 11, name: "Aquarius", points: `${2*u},${u} ${3*u},${u} ${3*u},0`, cx: 2.67*u, cy: 0.67*u },
    { id: 12, name: "Pisces", points: `${2*u},0 ${3*u},0 ${2*u},${u}`, cx: 2.33*u, cy: 0.33*u }
  ];

  // Fix Leo polygon: 0,2u to u,2u to 0,3u
  signPolygons[4].points = `0,${2*u} ${u},${2*u} 0,${3*u}`;

  // Get ascendant sign
  const lagnaCusp = cusps.find(c => c.houseNumber === 1);
  const lagnaSignIndex = lagnaCusp ? lagnaCusp.signIndex : 1;

  return (
    <div className="w-full flex justify-center items-center font-sans">
      <motion.svg initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}  
        viewBox={`0 0 ${size} ${size}`} 
        width={width} 
        height={height} 
        className="drop-shadow-md" 
      >
        {/* Fill Polygons (No stroke, used for hover and hit testing) */}
        {signPolygons.map(sign => {
          const signPlanets = planets.filter(p => p.signIndex === sign.id);
          const signCusps = cusps.filter(c => c.signIndex === sign.id);
          
          const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

          return (
            <g key={sign.id} className="fill-transparent hover:fill-amber-900/40 transition-colors duration-200 cursor-pointer">
              <motion.polygon initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.2 }} points={sign.points} stroke="none" />
              
              {/* Ascendant Marker (Vedic) */}
              {!isKp && sign.id === lagnaSignIndex && (
                <text x={sign.cx} y={sign.cy - 16} textAnchor="middle" className={theme === "light" ? "fill-red-700 text-[12px] font-bold" : "fill-amber-400 text-[12px] font-bold"} stroke="none">
                  Asc
                </text>
              )}
              
              {/* KP Cusps */}
              {isKp && signCusps.map((cusp, idx) => (
                <text key={`cusp-${idx}`} x={sign.cx} y={sign.cy - 12 + (idx * 10)} textAnchor="middle" className={theme === "light" ? "fill-red-600 text-[10px] font-bold tracking-wider" : "fill-red-400/80 text-[10px] font-bold tracking-wider"} stroke="none">
                  {romanNumerals[cusp.houseNumber]}
                </text>
              ))}
              
              {/* Planets */}
              {signPlanets.length > 0 && (
                <text x={sign.cx} y={sign.cy + ((!isKp && sign.id === lagnaSignIndex) || (isKp && signCusps.length > 0) ? 6 : -4)} textAnchor="middle" className={theme === "light" ? "fill-black text-[14px] font-bold tracking-wide" : `${isKp ? "fill-blue-300" : "fill-indigo-100"} text-[14px] font-bold tracking-wide`} stroke="none">
                  {signPlanets.map(p => `${p.name.substring(0,2)}${p.isRetrograde ? "(R)" : ""}`.trim()).join(" ")}
                </text>
              )}

              {/* Sign Number */}
              <text x={sign.cx} y={sign.cy + 22} textAnchor="middle" className={theme === "light" ? "fill-red-800/60 text-[9px]" : "fill-amber-600/50 text-[9px]"} stroke="none">
                {sign.id}
              </text>
            </g>
          );
        })}

        {/* Explicit Grid Lines for perfectly even stroke width */}
        <g className="stroke-amber-500/60" style={{ strokeWidth: 1.5 }}>
          <rect x={0} y={0} width={size} height={size} fill="none" />
          <line x1={u} y1={0} x2={u} y2={size} />
          <line x1={2*u} y1={0} x2={2*u} y2={size} />
          <line x1={0} y1={u} x2={size} y2={u} />
          <line x1={0} y1={2*u} x2={size} y2={2*u} />
          <line x1={0} y1={0} x2={u} y2={u} />
          <line x1={size} y1={0} x2={2*u} y2={u} />
          <line x1={0} y1={size} x2={u} y2={2*u} />
          <line x1={size} y1={size} x2={2*u} y2={2*u} />
        </g>

        {/* Center Box Info */}
        {showOm && (
          <text x={1.5*u} y={1.45*u} textAnchor="middle" className={theme === "light" ? "fill-red-700 text-[32px] font-serif" : "fill-amber-600 text-[32px] font-serif"} stroke="none">ॐ</text>
        )}
        {centerTitle && (
          <text x={1.5*u} y={showOm ? 1.7*u : 1.45*u} textAnchor="middle" className={theme === "light" ? "fill-red-800 text-[12px] font-bold uppercase" : "fill-amber-300 text-[12px] font-bold uppercase"} stroke="none">{centerTitle}</text>
        )}
        {centerSubtitle && (
          <text x={1.5*u} y={showOm ? 1.85*u : 1.65*u} textAnchor="middle" className={theme === "light" ? "fill-black text-[10px] font-medium uppercase" : "fill-indigo-300 text-[10px] font-medium uppercase"} stroke="none">{centerSubtitle}</text>
        )}
      </motion.svg>
    </div>
  );
};

export default EastIndianChart;
