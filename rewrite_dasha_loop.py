import os
import re

dasha_loop = """    // Generate Full Life Pratyantardasha (PD) Timeline (Birth to Age 90)
    let futureTimelineStr = "";
    const dashaTimelineStart = new Date(dob);
    const dashaTimelineEnd = new Date(dob);
    dashaTimelineEnd.setFullYear(dashaTimelineStart.getFullYear() + 90);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < dashaTimelineStart || mdStart > dashaTimelineEnd) continue;

      const mdLordIndex = DASHA_ORDER.findIndex(d => d.planet === md.planet);
      let adIndex = mdLordIndex;
      let adStartDate = new Date(md.start);
      
      for (let i = 0; i < 9; i++) {
        const adPlanet = DASHA_ORDER[adIndex];
        const adDays = (md.duration * adPlanet.years * 365.25) / 120;
        let adEndDate = new Date(adStartDate);
        adEndDate.setDate(adEndDate.getDate() + adDays);

        if (adEndDate >= dashaTimelineStart && adStartDate <= dashaTimelineEnd) {
          // Calculate Pratyantardashas inside this AD
          let pdIndex = adIndex;
          let pdStartDate = new Date(adStartDate);
          
          for (let j = 0; j < 9; j++) {
            const pdPlanet = DASHA_ORDER[pdIndex];
            const pdDays = (md.duration * adPlanet.years * pdPlanet.years * 365.25) / (120 * 120);
            let pdEndDate = new Date(pdStartDate);
            pdEndDate.setDate(pdEndDate.getDate() + pdDays);
            
            if (pdEndDate >= dashaTimelineStart && pdStartDate <= dashaTimelineEnd) {
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
    }"""

def replace_dasha_loop(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace everything from "// Generate" up to "    const dashaContext = "
    pattern = r"// Generate.*?    const dashaContext ="
    replacement = dasha_loop + "\n\n    const dashaContext ="
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_dasha_loop('src/app/actions/generateKpKundli.ts')
replace_dasha_loop('src/app/actions/generateKundli.ts')
print("Successfully wrote full life dasha loop to both files")
