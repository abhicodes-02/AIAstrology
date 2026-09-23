"use client";

import React from "react";

interface KundliChartProps {
  planets: Record<number, string[]>;
  title?: string;
}

export default function KundliChart({ planets, title }: KundliChartProps) {
  // SVG points for a 400x400 standard North Indian Kundli chart
  const size = 400;
  const half = size / 2;

  // Render houses and the planets inside them
  const renderPlanets = (houseNumber: number, x: number, y: number) => {
    const housePlanets = planets[houseNumber] || [];
    return (
      <g key={houseNumber}>
        <text
          x={x}
          y={y - 15}
          textAnchor="middle"
          className="text-xs fill-indigo-500 font-bold opacity-60"
        >
          {houseNumber}
        </text>
        {housePlanets.map((p, i) => (
          <text
            key={i}
            x={x}
            y={y + i * 15}
            textAnchor="middle"
            className="text-sm fill-indigo-100 font-medium"
          >
            {p}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div className="w-full max-w-[400px] aspect-square mx-auto relative bg-black/20 rounded-lg p-2 border border-indigo-500/20 backdrop-blur-sm">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full stroke-indigo-500/50 fill-transparent"
        style={{ strokeWidth: 2 }}
      >
        {/* Outer Box */}
        <rect x="0" y="0" width={size} height={size} />

        {/* Diagonals */}
        <line x1="0" y1="0" x2={size} y2={size} />
        <line x1={size} y1="0" x2="0" y2={size} />

        {/* Diamond (Midpoints) */}
        <polygon points={`${half},0 ${size},${half} ${half},${size} 0,${half}`} />

        {/* Planet Placements in 12 Houses (North Indian Style) */}
        {/* 1st House (Top middle diamond) */}
        {renderPlanets(1, half, half / 2)}
        {/* 2nd House (Top left triangle) */}
        {renderPlanets(2, half / 2, half / 4)}
        {/* 3rd House (Left top triangle) */}
        {renderPlanets(3, half / 4, half / 2)}
        {/* 4th House (Left middle diamond) */}
        {renderPlanets(4, half / 2, half)}
        {/* 5th House (Left bottom triangle) */}
        {renderPlanets(5, half / 4, half + half / 2)}
        {/* 6th House (Bottom left triangle) */}
        {renderPlanets(6, half / 2, size - half / 4)}
        {/* 7th House (Bottom middle diamond) */}
        {renderPlanets(7, half, size - half / 2)}
        {/* 8th House (Bottom right triangle) */}
        {renderPlanets(8, half + half / 2, size - half / 4)}
        {/* 9th House (Right bottom triangle) */}
        {renderPlanets(9, size - half / 4, half + half / 2)}
        {/* 10th House (Right middle diamond) */}
        {renderPlanets(10, half + half / 2, half)}
        {/* 11th House (Right top triangle) */}
        {renderPlanets(11, size - half / 4, half / 2)}
        {/* 12th House (Top right triangle) */}
        {renderPlanets(12, half + half / 2, half / 4)}
      </svg>
    </div>
  );
}

