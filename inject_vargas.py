import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add D10 and D24 house objects
old_house_init = """  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };"""
new_house_init = """  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d10Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d24Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  
  function getDasamsaSign(siderealLon: number): number {
    const sign = Math.floor(siderealLon / 30);
    const degree = siderealLon % 30;
    const dasamsaIdx = Math.floor(degree / 3);
    return sign % 2 === 0 ? (sign + dasamsaIdx) % 12 : (sign + 8 + dasamsaIdx) % 12;
  }
  
  function getD24Sign(siderealLon: number): number {
    const sign = Math.floor(siderealLon / 30);
    const degree = siderealLon % 30;
    const d24Idx = Math.floor(degree / 1.25);
    return sign % 2 === 0 ? (4 + d24Idx) % 12 : (3 + d24Idx) % 12;
  }
"""
content = content.replace(old_house_init, new_house_init)

# 2. Add Ascendant calculations
old_asc_navamsa = """const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;"""
new_asc_navamsa = """const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;
  const ascD10Sign = getDasamsaSign(ascSidereal);
  const ascD24Sign = getD24Sign(ascSidereal);
"""
content = content.replace(old_asc_navamsa, new_asc_navamsa)

# 3. Add Planet calculations inside the loop
old_planet_navamsa = """      const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
      let d9House = pNavamsaSign - ascNavamsaSign + 1;
      if (d9House <= 0) d9House += 12;
      d9Houses[d9House].push(shortName + (planet.isRetrograde ? "Rx" : ""));"""
      
new_planet_navamsa = """      const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
      let d9House = pNavamsaSign - ascNavamsaSign + 1;
      if (d9House <= 0) d9House += 12;
      d9Houses[d9House].push(shortName + (planet.isRetrograde ? "Rx" : ""));
      
      const pD10Sign = getDasamsaSign(pSidereal);
      let d10House = pD10Sign - ascD10Sign + 1;
      if (d10House <= 0) d10House += 12;
      d10Houses[d10House].push(shortName + (planet.isRetrograde ? "Rx" : ""));
      
      const pD24Sign = getD24Sign(pSidereal);
      let d24House = pD24Sign - ascD24Sign + 1;
      if (d24House <= 0) d24House += 12;
      d24Houses[d24House].push(shortName + (planet.isRetrograde ? "Rx" : ""));"""
content = content.replace(old_planet_navamsa, new_planet_navamsa)

# 4. Add to chartData export
old_export = """      d9Houses: d9Houses,"""
new_export = """      d9Houses: d9Houses,
      d10Houses: d10Houses,
      d24Houses: d24Houses,"""
content = content.replace(old_export, new_export)

# 5. Add to prompt
old_prompt = """    - D-9 Navamsa Houses: ${JSON.stringify(d9Houses)}"""
new_prompt = """    - D-9 Navamsa Houses (Marriage/Soul): ${JSON.stringify(d9Houses)}
    - D-10 Dasamsa Houses (Career/Profession): ${JSON.stringify(d10Houses)}
    - D-24 Chaturvimsamsa Houses (Education/Intellect): ${JSON.stringify(d24Houses)}
    
    IMPORTANT VARGA RULES FOR AI:
    - For Career/Power predictions, STRICTLY prioritize D-10 Dasamsa over D-1.
    - For Education/Learning predictions, STRICTLY prioritize D-24 Chaturvimsamsa over D-1."""
content = content.replace(old_prompt, new_prompt)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("D10 and D24 integration completed!")
