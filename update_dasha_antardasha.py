import os
import re

with open('src/lib/dasha.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update DashaPeriod interface
pattern_interface = r"export interface DashaPeriod \{\s*planet: string;\s*start: string;\s*end: string;\s*duration: number;\s*\}"
replacement_interface = """export interface DashaPeriod {
  planet: string;
  start: string;
  end: string;
  duration: number;
  antardashas?: DashaPeriod[];
}"""
content = re.sub(pattern_interface, replacement_interface, content)

# We need a function to calculate antardashas for a mahadasha
# Antardasha duration = (MD years * AD years) / 120 years
# We can just add this logic to the main loop!

helper = """
function getAntardashas(mdPlanet: string, mdStartDate: Date, mdDuration: number): DashaPeriod[] {
  const antardashas: DashaPeriod[] = [];
  const startIndex = DASHA_ORDER.findIndex(d => d.planet === mdPlanet);
  let currentStart = new Date(mdStartDate);
  
  for (let i = 0; i < 9; i++) {
    const adPlanet = DASHA_ORDER[(startIndex + i) % 9];
    const adYears = (mdDuration * adPlanet.years) / 120;
    const adDays = adYears * 365.25;
    const currentEnd = addDaysToDate(currentStart, adDays);
    
    antardashas.push({
      planet: adPlanet.planet,
      start: currentStart.toISOString().split('T')[0],
      end: currentEnd.toISOString().split('T')[0],
      duration: adYears
    });
    
    currentStart = new Date(currentEnd);
  }
  return antardashas;
}
"""

# Insert helper
content = content.replace("export function calculateVimshottariDasha", helper + "\nexport function calculateVimshottariDasha")

# Attach antardashas to first mahadasha
pattern_push_first = r"mahadashas\.push\(\{\s*planet: firstDasha\.planet,\s*start: currentStartDate\.toISOString\(\)\.split\('T'\)\[0\],\s*end: firstDashaEndDate\.toISOString\(\)\.split\('T'\)\[0\],\s*duration: firstDasha\.years\s*\}\);"
replacement_push_first = """mahadashas.push({
    planet: firstDasha.planet,
    start: currentStartDate.toISOString().split('T')[0],
    end: firstDashaEndDate.toISOString().split('T')[0],
    duration: firstDasha.years,
    antardashas: getAntardashas(firstDasha.planet, currentStartDate, firstDasha.years)
  });"""
content = re.sub(pattern_push_first, replacement_push_first, content)

# Attach antardashas to rest
pattern_push_rest = r"mahadashas\.push\(\{\s*planet: dasha\.planet,\s*start: currentStartDate\.toISOString\(\)\.split\('T'\)\[0\],\s*end: endDate\.toISOString\(\)\.split\('T'\)\[0\],\s*duration: dasha\.years\s*\}\);"
replacement_push_rest = """mahadashas.push({
      planet: dasha.planet,
      start: currentStartDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      duration: dasha.years,
      antardashas: getAntardashas(dasha.planet, currentStartDate, dasha.years)
    });"""
content = re.sub(pattern_push_rest, replacement_push_rest, content)

with open('src/lib/dasha.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated dasha.ts to calculate Antardashas")
