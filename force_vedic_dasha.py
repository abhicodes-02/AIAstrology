import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

dasha_logic_old = """    const dashaData = calculateVimshottariDasha(siderealMoon, dob);
    const dashaContext = dashaData.currentMahadasha ? 
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). \nCurrently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).` : 
      'Dasha timeline completed.';"""

dasha_logic_new = """    const dashaData = calculateVimshottariDasha(siderealMoon, dob);
    
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
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). \\nCurrently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).\\n\\nFUTURE 20-YEAR TIMELINE (VIMSHOTTARI DASHA):\\n${futureTimelineStr}` : 
      'Dasha timeline completed.';"""

# Try replacing without the \n since my previous regex might have missed it due to newlines
content = re.sub(r"const dashaData = calculateVimshottariDasha\(siderealMoon, dob\);\s+const dashaContext = dashaData\.currentMahadasha \?\s+`Currently running Mahadasha.*?Dasha timeline completed\.';", dasha_logic_new, content, flags=re.DOTALL)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Successfully replaced Vedic Dasha logic using regex")
