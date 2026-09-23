"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CosmicBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate random stars, moons, and suns
    const newElements = Array.from({ length: 40 }).map((_, i) => {
      const type = Math.random() > 0.85 ? "moon" : Math.random() > 0.85 ? "sun" : "star";
      return {
        id: i,
        type,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: type === "star" ? Math.random() * 3 + 1 : Math.random() * 20 + 20,
        duration: Math.random() * 20 + 20, // 20-40s falling duration
        delay: Math.random() * -40, // random start time
        rotation: Math.random() * 360,
      };
    });
    setElements(newElements);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#060412]" />;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#060412] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/50 via-[#060412] to-purple-950/30">
      <div className="absolute inset-0 opacity-100">
        {elements.map((el) => {
          if (el.type === "star") {
            return (
              <motion.div
                key={el.id}
                initial={{ x: `${el.x}vw`, y: "-10vh", opacity: 0 }}
                animate={{
                  y: ["-10vh", "110vh"],
                  opacity: [0, 1, 1, 0],
                  x: [`${el.x}vw`, `${el.x - 5}vw`],
                }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: el.delay,
                }}
                className="absolute top-0 left-0 bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.9)]"
                style={{ width: el.size, height: el.size }}
              />
            );
          }

          if (el.type === "moon") {
            return (
              <motion.svg
                key={el.id}
                initial={{ x: `${el.x}vw`, y: "-10vh", rotate: el.rotation }}
                animate={{
                  y: ["-10vh", "110vh"],
                  rotate: el.rotation + 360,
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: el.duration * 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: el.delay,
                }}
                className="absolute top-0 left-0 text-blue-200 opacity-60"
                style={{ width: el.size, height: el.size }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </motion.svg>
            );
          }

          if (el.type === "sun") {
            return (
              <motion.svg
                key={el.id}
                initial={{ x: `${el.x}vw`, y: "-10vh", rotate: el.rotation }}
                animate={{
                  y: ["-10vh", "110vh"],
                  rotate: el.rotation - 360,
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: el.duration * 1.8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: el.delay,
                }}
                className="absolute top-0 left-0 text-amber-500 opacity-60"
                style={{ width: el.size, height: el.size }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </motion.svg>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

