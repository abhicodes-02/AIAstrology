import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We will replace the entire Manglik calculation section with the deep cancellation logic.
start_marker = "// 1. Manglik Dosha"
end_marker = "doshasDetails.push({\n    name: \"Manglik Dosha\","

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    old_block = content[start_idx:end_idx]
    
    new_block = """// 1. Manglik Dosha (With Deep B.V. Raman Cancellation Rules)
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
      
      const marsObj = chart.planets.find((p: any) => p.name === "Mars");
      if (marsObj) {
        const marsSign = Math.floor(getSidereal(marsObj.longitude) / 30);
        
        // RULE 1: Own Sign or Exalted
        if (marsSign === 0 || marsSign === 7) {
          manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is in its own sign (Aries/Scorpio)."; break;
        } else if (marsSign === 9) {
          manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is exalted (Capricorn)."; break;
        }

        // RULE 2: House-Specific Sign Exemptions
        if (h === 2 && (marsSign === 2 || marsSign === 5)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 2nd House in Gemini/Virgo."; break; }
        if (h === 4 && (marsSign === 1 || marsSign === 6)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 4th House in Taurus/Libra."; break; }
        if (h === 7 && (marsSign === 3 || marsSign === 9)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 7th House in Cancer/Capricorn."; break; }
        if (h === 8 && (marsSign === 8 || marsSign === 11)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 8th House in Sagittarius/Pisces."; break; }
        if (h === 12 && (marsSign === 1 || marsSign === 6)) { manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars in 12th House in Taurus/Libra."; break; }

        // RULE 3: Moon Conjunction (Chandra-Mangala)
        const moonInSameHouse = planetsInHouse.find(p => p.startsWith("Moon"));
        if (moonInSameHouse) {
          manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is conjunct with Moon (Chandra-Mangala Yoga)."; break;
        }

        // RULE 4: Jupiter Aspect or Conjunction
        const jupObj = chart.planets.find((p: any) => p.name === "Jupiter");
        if (jupObj && marsObj) {
          const jupSign = Math.floor(getSidereal(jupObj.longitude) / 30);
          let dist = (marsSign - jupSign + 12) % 12; 
          if (dist === 0 || dist === 4 || dist === 6 || dist === 8) { // 1st, 5th, 7th, 9th aspect
            manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars receives Jupiter's divine aspect/conjunction."; break;
          }
        }

        // RULE 5: Saturn Aspect or Conjunction
        const satObj = chart.planets.find((p: any) => p.name === "Saturn");
        if (satObj && marsObj) {
          const satSign = Math.floor(getSidereal(satObj.longitude) / 30);
          let distSat = (marsSign - satSign + 12) % 12;
          if (distSat === 0 || distSat === 2 || distSat === 6 || distSat === 9) { // 1st, 3rd, 7th, 10th aspect
            manglikCancelled = true; manglikCancelReason = "Cancelled (Bhanga): Mars is controlled by Saturn's aspect/conjunction."; break;
          }
        }
      }
      break;
    }
  }

  """
    
    content = content.replace(old_block, new_block)
    
    with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Deep Dosha Rules applied")
else:
    print("Failed to find Manglik Dosha block")
