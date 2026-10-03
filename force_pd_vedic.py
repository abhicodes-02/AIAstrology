import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace logic via regex
pattern_logic = r"// Generate Future Timeline for exactly 20 years from now.*?FUTURE 20-YEAR TIMELINE \(VIMSHOTTARI DASHA\):\\n\$\{futureTimelineStr\}` :\s+'Dasha timeline completed\.';"

new_logic = """// Generate Future Pratyantardasha (PD) Timeline for exactly 10 years from now for PINPOINT accuracy
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
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). \\nCurrently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).\\n\\nFUTURE 10-YEAR PRATYANTARDASHA TIMELINE (PINPOINT TIMING):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

content = re.sub(pattern_logic, new_logic, content, flags=re.DOTALL)

pattern_prompt = r'1\. MANDATORY EXACT TIMING:.*?If you predict a career peak, state exactly which Antardasha period from the timeline triggers it\.'

new_prompt = '1. MANDATORY EXACT TIMING: You MUST use the "FUTURE 10-YEAR PRATYANTARDASHA TIMELINE (PINPOINT TIMING)" provided above to give EXACT short-term pinpoint dates (Month-Year) for EVERY future prediction in the Career, fullLife, and Relationships sections. NEVER say "soon", "in the future", or invent your own years. If you predict a career peak, state exactly which short Pratyantardasha period (e.g., "Jan 2025 to Mar 2025") from the timeline triggers it.'

content = re.sub(pattern_prompt, new_prompt, content, flags=re.DOTALL)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replace for Vedic PD executed")
