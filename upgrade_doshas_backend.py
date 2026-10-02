import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# The new advanced dosha logic
new_dosha_logic = """
  // ADVANCED MATHEMATICAL DOSHA CALCULATION WITH CANCELLATION (BHANGA)
  const doshasDetails: any[] = [];

  // 1. Manglik Dosha
  let isManglik = false;
  let manglikReason = "";
  let manglikCancelled = false;
  let manglikCancelReason = "";

  const manglikHouses = [1, 2, 4, 7, 8, 12];
  for (const h of manglikHouses) {
    const planetsInHouse = d1Houses[h as keyof typeof d1Houses] || [];
    const mars = planetsInHouse.find(p => p.startsWith("Mars"));
    if (mars) {
      isManglik = true;
      manglikReason = `Mars is situated in the ${h}th House from Ascendant.`;
      
      // Cancellation rules
      // 1. Own sign (Aries, Scorpio) or Exalted (Capricorn)
      const marsObj = chart.planets.find((p: any) => p.name === "Mars");
      if (marsObj) {
        const marsSign = Math.floor(getSidereal(marsObj.longitude) / 30);
        if (marsSign === 0 || marsSign === 7) {
          manglikCancelled = true;
          manglikCancelReason = "Cancelled because Mars is in its own sign (Aries/Scorpio).";
        } else if (marsSign === 9) {
          manglikCancelled = true;
          manglikCancelReason = "Cancelled because Mars is exalted (Capricorn).";
        }
      }

      // 2. Jupiter aspect (simplification: if Jupiter is in same house, 5th, 7th, 9th from it)
      const jupObj = chart.planets.find((p: any) => p.name === "Jupiter");
      if (jupObj) {
        const jupSign = Math.floor(getSidereal(jupObj.longitude) / 30);
        const marsSign = Math.floor(getSidereal(marsObj.longitude) / 30);
        let dist = (marsSign - jupSign + 12) % 12; // distance in signs
        if (dist === 0 || dist === 4 || dist === 6 || dist === 8) { // 1st, 5th, 7th, 9th aspect
          manglikCancelled = true;
          manglikCancelReason = "Cancelled because Jupiter's divine aspect is on Mars.";
        }
      }
      break;
    }
  }

  doshasDetails.push({
    name: "Manglik Dosha",
    present: isManglik,
    isCancelled: manglikCancelled,
    reason: isManglik ? manglikReason : "Mars is placed safely. No Manglik Dosha.",
    cancelReason: manglikCancelReason
  });

  // 2. Guru Chandal & Pitra Dosha
  let hasGuruChandal = false;
  let gcReason = "";
  let gcCancelled = false;
  let gcCancelReason = "";

  let hasPitra = false;
  let pitraReason = "";
  let pitraCancelled = false;
  let pitraCancelReason = "";

  Object.entries(d1Houses).forEach(([houseNum, planetsArr]) => {
    const planets = planetsArr as string[];
    const hasRahuKetu = planets.find(p => p.startsWith("Rahu") || p.startsWith("Ketu"));
    
    if (hasRahuKetu) {
      if (planets.some(p => p.startsWith("Jupi"))) {
        hasGuruChandal = true;
        gcReason = `Jupiter and ${hasRahuKetu.split(' ')[0]} are conjunct in House ${houseNum}.`;
        
        // Intensity check
        const jup = chart.planets.find((p: any) => p.name === "Jupiter");
        const node = chart.planets.find((p: any) => p.name === "Rahu" || p.name === "Mean Node" || p.name === "True Node" || p.name === "Ketu");
        if (jup && node) {
          const diff = Math.abs(getSidereal(jup.longitude) - getSidereal(node.longitude));
          if (diff > 15 && diff < 345) { // more than 15 degrees apart
            gcCancelled = true;
            gcCancelReason = `Weak Intensity (Cancelled) as they are ${Math.round(diff)} degrees apart.`;
          }
        }
      }
      
      const sun = planets.find(p => p.startsWith("Sun"));
      const moon = planets.find(p => p.startsWith("Moon"));
      if (sun || moon) {
        hasPitra = true;
        pitraReason = `${sun ? 'Sun' : 'Moon'} is afflicted by ${hasRahuKetu.split(' ')[0]} in House ${houseNum}.`;
      }
    }
  });

  doshasDetails.push({ name: "Guru Chandal Dosha", present: hasGuruChandal, isCancelled: gcCancelled, reason: hasGuruChandal ? gcReason : "Jupiter is free from Rahu/Ketu.", cancelReason: gcCancelReason });
  doshasDetails.push({ name: "Pitra Dosha", present: hasPitra, isCancelled: pitraCancelled, reason: hasPitra ? pitraReason : "Luminaries (Sun/Moon) are free from Node affliction.", cancelReason: pitraCancelReason });

  // 3. Kalsarp Dosha
  let hasKalsarp = false;
  let kalsarpReason = "";
  let ksCancelled = false;
  let ksCancelReason = "";

  const rahuP2 = chart.planets.find((p: any) => p.name === "True Node" || p.name === "Mean Node" || p.name === "Rahu");
  if (rahuP2) {
    const rahuSidereal = getSidereal(rahuP2.longitude);
    const planetsToCheck = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    let allForward = true;
    let allBackward = true;
    let outsidePlanets = 0;
    
    planetsToCheck.forEach(name => {
      const p = chart.planets.find((pl: any) => pl.name === name);
      if (p) {
        let dist = getSidereal(p.longitude) - rahuSidereal;
        if (dist < 0) dist += 360;
        if (dist > 180) allForward = false;
        if (dist < 180) allBackward = false;
        
        // Check if Moon is outside
        if (name === "Moon" && !allForward && !allBackward) {
           // just tracking
        }
      }
    });
    
    hasKalsarp = allForward || allBackward;
    if (hasKalsarp) {
       kalsarpReason = "All 7 planets are trapped on one side of the Rahu-Ketu axis.";
       // Partial check? We'll keep it simple: if Moon is exalted etc.
       const moonObj = chart.planets.find((p: any) => p.name === "Moon");
       if (moonObj) {
          const mSign = Math.floor(getSidereal(moonObj.longitude)/30);
          if(mSign === 1) { // Taurus
             ksCancelled = true;
             ksCancelReason = "Cancelled (Bhanga) because Moon is exalted, breaking the mental trap.";
          }
       }
    }
  }
  
  doshasDetails.push({ name: "Kalsarp Dosha", present: hasKalsarp, isCancelled: ksCancelled, reason: hasKalsarp ? kalsarpReason : "Planets are distributed freely outside the axis.", cancelReason: ksCancelReason });

  const computedDoshas = doshasDetails;
"""

# Regex replacement
old_dosha_pattern = r"// MATHEMATICAL DOSHA CALCULATION.*?const computedDoshas = \[.*?\];"
content = re.sub(old_dosha_pattern, new_dosha_logic.strip(), content, flags=re.DOTALL)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dosha logic upgraded")
