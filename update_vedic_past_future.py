import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the 20-year AD timeline block
old_timeline_block = """    // Generate Future Timeline for exactly 20 years from now
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
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). \\nCurrently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).\\n\\nFUTURE 20-YEAR TIMELINE (VIMSHOTTARI DASHA):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

new_timeline_block = """    // Generate Past and Future Pratyantardasha (PD) Timeline
    let futureTimelineStr = "";
    const now = new Date();
    const tenYearsAgo = new Date(now);
    tenYearsAgo.setFullYear(now.getFullYear() - 10);
    const tenYearsFromNow = new Date(now);
    tenYearsFromNow.setFullYear(now.getFullYear() + 10);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < tenYearsAgo || mdStart > tenYearsFromNow) continue;

      const mdLordIndex = DASHA_ORDER.findIndex(d => d.planet === md.planet);
      let adIndex = mdLordIndex;
      let adStartDate = new Date(md.start);
      
      for (let i = 0; i < 9; i++) {
        const adPlanet = DASHA_ORDER[adIndex];
        const adDays = (md.duration * adPlanet.years * 365.25) / 120;
        let adEndDate = new Date(adStartDate);
        adEndDate.setDate(adEndDate.getDate() + adDays);

        if (adEndDate >= tenYearsAgo && adStartDate <= tenYearsFromNow) {
          let pdIndex = adIndex;
          let pdStartDate = new Date(adStartDate);
          
          for (let j = 0; j < 9; j++) {
            const pdPlanet = DASHA_ORDER[pdIndex];
            const pdDays = (md.duration * adPlanet.years * pdPlanet.years * 365.25) / (120 * 120);
            let pdEndDate = new Date(pdStartDate);
            pdEndDate.setDate(pdEndDate.getDate() + pdDays);
            
            if (pdEndDate >= tenYearsAgo && pdStartDate <= tenYearsFromNow) {
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
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). \\nCurrently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).\\n\\nPAST 10-YEAR AND FUTURE 10-YEAR PRATYANTARDASHA TIMELINE (PINPOINT TIMING):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

# I need to use regex because the newlines might not match exactly.
# Let's match from "// Generate Future Timeline" to "'Dasha timeline completed.';"
pattern = r"// Generate Future Timeline for exactly 20 years from now.*?'Dasha timeline completed\.';"
content = re.sub(pattern, new_timeline_block, content, flags=re.DOTALL)

# Update Prompt
pattern_prompt = r'1\. MANDATORY EXACT TIMING:.*?If you predict a career peak, state exactly which Antardasha period from the timeline triggers it\.'
new_prompt = '1. MANDATORY EXACT TIMING: You MUST use the "PAST 10-YEAR AND FUTURE 10-YEAR PRATYANTARDASHA TIMELINE (PINPOINT TIMING)" provided above to give EXACT short-term pinpoint dates (Month-Year) for EVERY prediction (past or future) in the Career, fullLife, and Relationships sections. NEVER say "soon", "in the future", or invent your own years. If you predict a career peak, state exactly which short Pratyantardasha period (e.g., "Jan 2025 to Mar 2025") from the timeline triggers it. DO include Past/Present events.'
content = re.sub(pattern_prompt, new_prompt, content, flags=re.DOTALL)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Vedic Kundli with Past/Future PD logic")
