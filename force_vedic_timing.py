import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Imports
import_old = """import { calculateVimshottariDasha } from "@/lib/dasha";"""
import_new = """import { calculateVimshottariDasha, DASHA_ORDER } from "@/lib/dasha";"""
if import_old in content:
    content = content.replace(import_old, import_new)
else:
    # If not there, let's inject it near the top
    content = content.replace('import { GoogleGenAI } from "@google/genai";', 'import { GoogleGenAI } from "@google/genai";\nimport { calculateVimshottariDasha, DASHA_ORDER } from "@/lib/dasha";')

# 2. Add 20-Year Timeline Logic
dasha_logic_old = """    // --- VIMSHOTTARI DASHA ---
    const dashaData = calculateVimshottariDasha(siderealMoon, dob);
    const dashaContext = dashaData.currentMahadasha ? 
      `Current Mahadasha Lord is ${dashaData.currentMahadasha.planet}, Antardasha Lord is ${dashaData.currentAntardasha?.planet}.` : 
      'Dasha timeline completed.';"""

dasha_logic_new = """    // --- VIMSHOTTARI DASHA ---
    const dashaData = calculateVimshottariDasha(siderealMoon, dob);
    
    // Generate Future Timeline for exactly 20 years from now
    let futureTimelineStr = "";
    const now = new Date();
    const twentyYearsFromNow = new Date(now);
    twentyYearsFromNow.setFullYear(now.getFullYear() + 20);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < now || mdStart > twentyYearsFromNow) continue;

      const mdLordIndex = DASHA_ORDER.findIndex(d => d.planet === md.planet);
      let adIndex = mdLordIndex;
      let adStartDate = new Date(md.start);
      
      for (let i = 0; i < 9; i++) {
        const adPlanet = DASHA_ORDER[adIndex];
        const adDays = (md.duration * adPlanet.years * 365.25) / 120;
        let adEndDate = new Date(adStartDate);
        adEndDate.setDate(adEndDate.getDate() + adDays);

        if (adEndDate >= now && adStartDate <= twentyYearsFromNow) {
          futureTimelineStr += `- ${adStartDate.getFullYear()}-${(adStartDate.getMonth()+1).toString().padStart(2, '0')} to ${adEndDate.getFullYear()}-${(adEndDate.getMonth()+1).toString().padStart(2, '0')}: Antardasha ${adPlanet.planet} (under Mahadasha ${md.planet})\\n`;
        }

        adStartDate = new Date(adEndDate);
        adIndex = (adIndex + 1) % 9;
      }
    }

    const dashaContext = dashaData.currentMahadasha ? 
      `Current Mahadasha Lord is ${dashaData.currentMahadasha.planet}, Antardasha Lord is ${dashaData.currentAntardasha?.planet}.\\n\\nFUTURE 20-YEAR TIMELINE (VIMSHOTTARI DASHA):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

if dasha_logic_old in content:
    content = content.replace(dasha_logic_old, dasha_logic_new)
else:
    print("WARNING: Could not find dasha_logic_old in generateKundli.ts")

# 3. Update Prompt to force usage
prompt_old = """    CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
    Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional", "Jupiter brings expansion", "You will feel a shift in energy")."""

prompt_new = """    CRITICAL TIMING AND REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
    1. MANDATORY EXACT TIMING: You MUST use the "FUTURE 20-YEAR TIMELINE (VIMSHOTTARI DASHA)" provided above to give EXACT YEAR-MONTH dates for EVERY future prediction in the Career, fullLife, and Relationships sections. NEVER say "soon", "in the future", or invent your own years. If you predict a career peak, state exactly which Antardasha period from the timeline triggers it.
    2. NO GENERIC TRAITS: Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional", "Jupiter brings expansion", "You will feel a shift in energy")."""

content = content.replace(prompt_old, prompt_new)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Vedic Kundli with 20-year timeline and strict timing rules")
