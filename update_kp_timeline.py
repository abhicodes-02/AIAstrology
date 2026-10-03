import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
import_old = """import { calculateVimshottariDasha } from "@/lib/dasha";"""
import_new = """import { calculateVimshottariDasha, DASHA_ORDER } from "@/lib/dasha";"""
content = content.replace(import_old, import_new)

dasha_logic_old = """    // --- VIMSHOTTARI DASHA (KP DBA TIMING) ---
    const dashaData = calculateVimshottariDasha(siderealMoon, dob);
    const dashaContext = dashaData.currentMahadasha ? 
      `Current Dasha (DBA): Mahadasha Lord is ${dashaData.currentMahadasha.planet}, Antardasha (Bhukti) Lord is ${dashaData.currentAntardasha?.planet}. Use these Dasha lords along with their KP significators to predict current events.` : 
      'Dasha timeline completed.';"""

dasha_logic_new = """    // --- VIMSHOTTARI DASHA (KP DBA TIMING) ---
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
      `Current Dasha (DBA): Mahadasha Lord is ${dashaData.currentMahadasha.planet}, Antardasha (Bhukti) Lord is ${dashaData.currentAntardasha?.planet}. Use these Dasha lords along with their KP significators to predict current events.\\n\\nFUTURE 20-YEAR TIMELINE (VIMSHOTTARI DASHA):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

content = content.replace(dasha_logic_old, dasha_logic_new)

# Remove Planetary Maturity Table from Prompt
prompt_old = """    2. STRICT BREAKTHROUGHS MATHEMATICS: You MUST NOT perform any math or calculations yourself. Breakthroughs ONLY happen at the exact Vedic Planetary Maturity Age of the CSLs (Sub-Lords). 
       You MUST use EXACTLY this pre-calculated table for the breakthrough years based on the birth year:
       - Jupiter: ${monthName} ${year + 15} to ${monthName} ${year + 16} (Age 15-16)
       - Sun: ${monthName} ${year + 21} to ${monthName} ${year + 22} (Age 21-22)
       - Moon: ${monthName} ${year + 23} to ${monthName} ${year + 24} (Age 23-24)
       - Venus: ${monthName} ${year + 24} to ${monthName} ${year + 25} (Age 24-25)
       - Mars: ${monthName} ${year + 27} to ${monthName} ${year + 28} (Age 27-28)
       - Mercury: ${monthName} ${year + 31} to ${monthName} ${year + 32} (Age 31-32)
       - Saturn: ${monthName} ${year + 35} to ${monthName} ${year + 36} (Age 35-36)
       - Rahu: ${monthName} ${year + 41} to ${monthName} ${year + 42} (Age 41-42)
       - Ketu: ${monthName} ${year + 47} to ${monthName} ${year + 48} (Age 47-48)
       CRITICAL: Just copy the Exact Timeframe (Months & Years) from the table above. Do not show your math.
    3. PHYSICAL APPEARANCE (1ST CSL):"""

prompt_new = """    2. STRICT BREAKTHROUGHS TIMING (PURE KP): Abandon planetary maturity ages. KP Astrology timing relies STRICTLY on Vimshottari Dasha.
       You MUST find the EXACT date ranges from the "FUTURE 20-YEAR TIMELINE" provided above where the Antardasha planet is the 10th CSL, 11th CSL, 2nd CSL, or 7th CSL, or a very strong significator (Level 1/2) of these houses.
       Identify the 3 most powerful future Antardasha periods for career, wealth, or marriage.
       CRITICAL: Use the exact Year-Month format from the timeline. NEVER invent your own dates.
    3. PHYSICAL APPEARANCE (1ST CSL):"""

content = content.replace(prompt_old, prompt_new)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated generateKpKundli with Future Dasha Timeline")
