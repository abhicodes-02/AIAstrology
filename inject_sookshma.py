import re

def inject_sookshma(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    sookshma_logic = """
              const pdPlanet = DASHA_ORDER[pdIndex];
              const pdDays = (md.duration * adPlanet.years * pdPlanet.years * 365.25) / (120 * 120);
              let pdEndDate = new Date(pdStartDate);
              pdEndDate.setDate(pdEndDate.getDate() + pdDays);
              
              // Calculate Sookshma Dashas only for immediate years (Current Year - 2 to Current Year + 5)
              const currentYear = new Date().getFullYear();
              const isImmediateYear = pdStartDate.getFullYear() >= (currentYear - 2) && pdEndDate.getFullYear() <= (currentYear + 5);
              
              let sdTimelineStr = "";
              if (isImmediateYear) {
                let sdIndex = pdIndex;
                let sdStartDate = new Date(pdStartDate);
                for (let k = 0; k < 9; k++) {
                  const sdPlanet = DASHA_ORDER[sdIndex];
                  const sdDays = (pdDays * sdPlanet.years) / 120;
                  const sdEndDate = new Date(sdStartDate.getTime() + sdDays * 24 * 60 * 60 * 1000);
                  
                  const sdStartStr = sdStartDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                  const sdEndStr = sdEndDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                  sdTimelineStr += `      * ${sdStartStr} to ${sdEndStr}: Sookshma ${sdPlanet.planet}\\n`;
                  
                  sdStartDate = new Date(sdEndDate);
                  sdIndex = (sdIndex + 1) % 9;
                }
              }

              if (pdEndDate >= dashaTimelineStart && pdStartDate <= dashaTimelineEnd) {
                const startMonthStr = pdStartDate.toLocaleString('default', { month: 'short' });
                const endMonthStr = pdEndDate.toLocaleString('default', { month: 'short' });
                futureTimelineStr += `- ${startMonthStr} ${pdStartDate.getFullYear()} to ${endMonthStr} ${pdEndDate.getFullYear()}: Pratyantardasha ${pdPlanet.planet} (under AD ${adPlanet.planet}, MD ${md.planet})\\n`;
                if (isImmediateYear) {
                   futureTimelineStr += sdTimelineStr;
                }
              }
              
              pdStartDate = new Date(pdEndDate);
              pdIndex = (pdIndex + 1) % 9;
"""
    
    # We will replace the block from "const pdPlanet = DASHA_ORDER[pdIndex];" to "pdIndex = (pdIndex + 1) % 9;"
    old_block_pattern = r"const pdPlanet = DASHA_ORDER\[pdIndex\];.*?pdIndex = \(pdIndex \+ 1\) % 9;"
    content = re.sub(old_block_pattern, sookshma_logic.strip(), content, flags=re.DOTALL)

    # We also need to update the prompt text to use Phase 4
    omni_fusion = """
    3. LAYER 3 (VIMSHOTTARI, SOOKSHMA & GOCHAR): When exactly is the timeline window? You MUST use the day-level Sookshma Dasha dates provided for the immediate years to pinpoint the EXACT WEEK of the event.
"""
    content = re.sub(r"3\. LAYER 3 \(VIMSHOTTARI & GOCHAR\).*?\n", omni_fusion, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Phase 4 Sookshma Logic")

inject_sookshma('src/app/actions/generateKpKundli.ts')
