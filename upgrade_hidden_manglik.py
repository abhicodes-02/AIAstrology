import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Finding the boundaries
start_marker = "// 1. Manglik Dosha (With Deep B.V. Raman Cancellation Rules)"
end_marker = "doshasDetails.push({\n    name: \"Manglik Dosha\","

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    old_block = content[start_idx:end_idx]
    
    new_block = """// 1. Manglik Dosha (Lagna, Chandra, Shukra & Amplifications)
  let isManglik = false;
  let manglikReason = "";
  let manglikCancelled = false;
  let manglikCancelReason = "";
  
  let marsHouse = -1, moonHouse = -1, venusHouse = -1, rahuHouse = -1;
  Object.entries(d1Houses).forEach(([h, pArr]) => {
    const planets = pArr as string[];
    if (planets.find(p => p.startsWith("Mars"))) marsHouse = parseInt(h);
    if (planets.find(p => p.startsWith("Moon"))) moonHouse = parseInt(h);
    if (planets.find(p => p.startsWith("Venus"))) venusHouse = parseInt(h);
    if (planets.find(p => p.startsWith("Rahu"))) rahuHouse = parseInt(h);
  });

  const mHouses = [1, 2, 4, 7, 8, 12];
  let isLagnaManglik = marsHouse !== -1 && mHouses.includes(marsHouse);
  let isChandraManglik = marsHouse !== -1 && moonHouse !== -1 && mHouses.includes(((marsHouse - moonHouse + 12) % 12) + 1);
  let isShukraManglik = marsHouse !== -1 && venusHouse !== -1 && mHouses.includes(((marsHouse - venusHouse + 12) % 12) + 1);
  
  if (isLagnaManglik || isChandraManglik || isShukraManglik) {
    isManglik = true;
    let reasons = [];
    if (isLagnaManglik) reasons.push(`Lagna (${marsHouse}th House)`);
    if (isChandraManglik) reasons.push(`Chandra (${((marsHouse - moonHouse + 12) % 12) + 1}th from Moon)`);
    if (isShukraManglik) reasons.push(`Shukra (${((marsHouse - venusHouse + 12) % 12) + 1}th from Venus)`);
    
    manglikReason = `Mars is afflicted from: ${reasons.join(', ')}.`;
    
    // Check for Angarak Amplification (Mars + Rahu)
    if (marsHouse === rahuHouse) {
      manglikReason += " [ANGARAK AMPLIFICATION: Rahu is conjunct Mars, dangerously amplifying the aggressive dosha intensity!]";
    }

    // Cancellation Rules (Bhanga)
    const marsObj = chart.planets.find((p: any) => p.name === "Mars");
    if (marsObj) {
      const marsSign = Math.floor(getSidereal(marsObj.longitude) / 30);
      
      // RULE 1: Own Sign or Exalted
      if (marsSign === 0 || marsSign === 7) {
        manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is in its own sign (Aries/Scorpio)."; 
      } else if (marsSign === 9) {
        manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is exalted (Capricorn)."; 
      }
      
      // RULE 2: House-Specific Exemptions
      if (!manglikCancelled && isLagnaManglik) {
        let h = marsHouse;
        if (h === 2 && (marsSign === 2 || marsSign === 5)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 2nd House in Gemini/Virgo."; }
        if (h === 4 && (marsSign === 1 || marsSign === 6)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 4th House in Taurus/Libra."; }
        if (h === 7 && (marsSign === 3 || marsSign === 9)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 7th House in Cancer/Capricorn."; }
        if (h === 8 && (marsSign === 8 || marsSign === 11)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 8th House in Sagittarius/Pisces."; }
        if (h === 12 && (marsSign === 1 || marsSign === 6)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 12th House in Taurus/Libra."; }
      }

      // RULE 3: Jupiter Aspect
      if (!manglikCancelled) {
        const jupObj = chart.planets.find((p: any) => p.name === "Jupiter");
        if (jupObj && marsObj) {
          const jupSign = Math.floor(getSidereal(jupObj.longitude) / 30);
          let dist = (marsSign - jupSign + 12) % 12; 
          if (dist === 0 || dist === 4 || dist === 6 || dist === 8) { 
            manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars receives Jupiter's divine aspect/conjunction."; 
          }
        }
      }

      // RULE 4: Saturn Aspect
      if (!manglikCancelled) {
        const satObj = chart.planets.find((p: any) => p.name === "Saturn");
        if (satObj && marsObj) {
          const satSign = Math.floor(getSidereal(satObj.longitude) / 30);
          let distSat = (marsSign - satSign + 12) % 12;
          if (distSat === 0 || distSat === 2 || distSat === 6 || distSat === 9) {
            manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is controlled by Saturn's aspect/conjunction."; 
          }
        }
      }
      
      // Amplification overrides Cancellation slightly (Double/Triple Manglik)
      if (manglikCancelled && (isLagnaManglik ? 1 : 0) + (isChandraManglik ? 1 : 0) + (isShukraManglik ? 1 : 0) > 1) {
        manglikCancelReason += " (Note: Multiple Manglik levels detected. Cancellation minimizes physical harm but mental/romantic friction remains).";
      }
    }
  }

  """
    
    content = content.replace(old_block, new_block)
    
    with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Advanced Amplification & Hidden Manglik Rules applied")
else:
    print("Failed to find Manglik Dosha block")
