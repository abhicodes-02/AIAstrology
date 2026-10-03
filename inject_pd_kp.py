import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to find the futureTimelineStr logic and replace it with Pratyantardasha logic.
# The current logic generates Antardashas for 20 years.
old_dasha_logic = """    // Generate Future Timeline for exactly 20 years from now
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

new_dasha_logic = """    // Generate Future Pratyantardasha (PD) Timeline for exactly 10 years from now for PINPOINT accuracy
    let futureTimelineStr = "";
    const now = new Date();
    const tenYearsFromNow = new Date(now);
    tenYearsFromNow.setFullYear(now.getFullYear() + 10);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < now || mdStart > tenYearsFromNow) continue;

      const mdLordIndex = DASHA_ORDER.findIndex(d => d.planet === md.planet);
      let adIndex = mdLordIndex;
      let adStartDate = new Date(md.start);
      
      for (let i = 0; i < 9; i++) {
        const adPlanet = DASHA_ORDER[adIndex];
        const adDays = (md.duration * adPlanet.years * 365.25) / 120;
        let adEndDate = new Date(adStartDate);
        adEndDate.setDate(adEndDate.getDate() + adDays);

        if (adEndDate >= now && adStartDate <= tenYearsFromNow) {
          // Calculate Pratyantardashas inside this AD
          let pdIndex = adIndex;
          let pdStartDate = new Date(adStartDate);
          
          for (let j = 0; j < 9; j++) {
            const pdPlanet = DASHA_ORDER[pdIndex];
            const pdDays = (md.duration * adPlanet.years * pdPlanet.years * 365.25) / (120 * 120);
            let pdEndDate = new Date(pdStartDate);
            pdEndDate.setDate(pdEndDate.getDate() + pdDays);
            
            if (pdEndDate >= now && pdStartDate <= tenYearsFromNow) {
              const startMonthStr = pdStartDate.toLocaleString('default', { month: 'short' });
              const endMonthStr = pdEndDate.toLocaleString('default', { month: 'short' });
              futureTimelineStr += `- ${startMonthStr} ${pdStartDate.getFullYear()} to ${endMonthStr} ${pdEndDate.getFullYear()}: Pratyantardasha ${pdPlanet.planet} (under AD ${adPlanet.planet}, MD ${md.planet})\\n`;
            }
            
            pdStartDate = new Date(pdEndDate);
            pdIndex = (pdIndex + 1) % 9;
          }
        }

        adStartDate = new Date(adEndDate);
        adIndex = (adIndex + 1) % 9;
      }
    }

    const dashaContext = dashaData.currentMahadasha ? 
      `Current Dasha (DBA): Mahadasha Lord is ${dashaData.currentMahadasha.planet}, Antardasha (Bhukti) Lord is ${dashaData.currentAntardasha?.planet}. Use these Dasha lords along with their KP significators to predict current events.\\n\\nFUTURE 10-YEAR PRATYANTARDASHA TIMELINE (PINPOINT TIMING):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

# We also need to update the Prompt to say 10-YEAR PRATYANTARDASHA TIMELINE
# Wait, let's just do regex replace for the logic block first.
content = content.replace(old_dasha_logic, new_dasha_logic)

# Update Prompt
prompt_old = """    2. STRICT TIMING (PURE KP VIMSHOTTARI): Abandon planetary maturity ages. KP Astrology timing relies STRICTLY on Vimshottari Dasha.
       You MUST find the EXACT date ranges from the "FUTURE 20-YEAR TIMELINE" provided above where the Antardasha planet is the 10th CSL, 11th CSL, 2nd CSL, or 7th CSL, or a very strong significator (Level 1/2) of these houses.
       Identify the 3 most powerful future Antardasha periods for career, wealth, or marriage.
       CRITICAL: Use the exact Year-Month format from the timeline for breakthroughs. NEVER invent your own dates.
    3. MANDATORY EXACT TIMING (ALL SECTIONS): You MUST use the "FUTURE 20-YEAR TIMELINE" to provide EXACT YEAR-MONTH dates for EVERY single prediction in the Career, Wealth, and Relationships sections. NEVER say "soon" or "in the future"."""

prompt_new = """    2. STRICT TIMING (PURE KP VIMSHOTTARI): Abandon planetary maturity ages. KP Astrology timing relies STRICTLY on Vimshottari Dasha.
       You MUST find the EXACT date ranges from the "FUTURE 10-YEAR PRATYANTARDASHA TIMELINE" provided above where the Pratyantardasha (PD) planet is the 10th CSL, 11th CSL, 2nd CSL, or 7th CSL, or a very strong significator (Level 1/2) of these houses.
       Identify the 3 most powerful future Pratyantardasha periods for career, wealth, or marriage.
       CRITICAL: Use the exact exact Month and Year format from the timeline for breakthroughs (e.g., "Jan 2025 to Mar 2025"). NEVER invent your own dates. NEVER give multi-year ranges.
    3. MANDATORY EXACT TIMING (ALL SECTIONS): You MUST use the "FUTURE 10-YEAR PRATYANTARDASHA TIMELINE" to provide EXACT short-term pinpoint dates for EVERY single prediction in the Career, Wealth, and Relationships sections. NEVER say "soon" or "in the future"."""

content = content.replace(prompt_old, prompt_new)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KP with Pratyantardasha logic")
