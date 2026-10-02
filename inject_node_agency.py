import os

with open('src/lib/kpAstrology.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# I will completely rewrite the buildKpSignificators function.
old_func = """export function buildKpSignificators(
  planets: KpPlanet[],
  cusps: KpCusp[]
): {
  planetSignificators: KpSignificatorRow[];
  houseSignificators: KpHouseSignificator[];
} {"""

new_func = """export function buildKpSignificators(
  planets: KpPlanet[],
  cusps: KpCusp[]
): {
  planetSignificators: KpSignificatorRow[];
  houseSignificators: KpHouseSignificator[];
} {
  const housesOwnedByPlanet: Record<string, number[]> = {
    Sun: [], Moon: [], Mars: [], Mercury: [], Jupiter: [], Venus: [], Saturn: [], Rahu: [], Ketu: []
  };

  cusps.forEach(cusp => {
    const lord = cusp.signLord;
    if (housesOwnedByPlanet[lord]) {
      housesOwnedByPlanet[lord].push(cusp.houseNumber);
    }
  });

  const planetMap = new Map<string, KpPlanet>();
  planets.forEach(p => planetMap.set(p.name, p));

  // --- KP NODE AGENCY LOGIC ---
  // Rahu and Ketu steal the house ownership (Level C/D) of their Sign Lord and conjunct planets
  const getAgentHouses = (nodeName: string): number[] => {
    const node = planetMap.get(nodeName);
    if (!node) return [];
    let stolenHouses = new Set<number>();
    
    // 1. Sign Lord Agency
    if (node.signLord && housesOwnedByPlanet[node.signLord]) {
      housesOwnedByPlanet[node.signLord].forEach(h => stolenHouses.add(h));
    }
    
    // 2. Conjunction Agency (Planets in same sign)
    planets.forEach(p => {
      if (p.name !== nodeName && p.name !== "Rahu" && p.name !== "Ketu" && p.signIndex === node.signIndex) {
        if (housesOwnedByPlanet[p.name]) {
          housesOwnedByPlanet[p.name].forEach(h => stolenHouses.add(h));
        }
      }
    });
    
    return Array.from(stolenHouses).sort((a, b) => a - b);
  };

  housesOwnedByPlanet["Rahu"] = getAgentHouses("Rahu");
  housesOwnedByPlanet["Ketu"] = getAgentHouses("Ketu");
  // -----------------------------

  const planetSignificators: KpSignificatorRow[] = [];

  for (const p of planets) {
    const starLordPlanet = planetMap.get(p.starLord);

    const levelA: number[] = starLordPlanet ? [starLordPlanet.houseOccupied] : [];
    const levelB: number[] = [p.houseOccupied];
    const levelC: number[] = housesOwnedByPlanet[p.starLord] ? [...housesOwnedByPlanet[p.starLord]] : [];
    const levelD: number[] = housesOwnedByPlanet[p.name] ? [...housesOwnedByPlanet[p.name]] : [];

    planetSignificators.push({
      planet: p.name,
      levelA: Array.from(new Set(levelA)),
      levelB: Array.from(new Set(levelB)),
      levelC: Array.from(new Set(levelC)),
      levelD: Array.from(new Set(levelD))
    });
  }

  const houseSignificators: KpHouseSignificator[] = [];
  for (let i = 1; i <= 12; i++) {
    const sigForHouse: KpHouseSignificator = {
      house: i, levelA: [], levelB: [], levelC: [], levelD: []
    };

    planetSignificators.forEach(ps => {
      if (ps.levelA.includes(i)) sigForHouse.levelA.push(ps.planet);
      if (ps.levelB.includes(i)) sigForHouse.levelB.push(ps.planet);
      if (ps.levelC.includes(i)) sigForHouse.levelC.push(ps.planet);
      if (ps.levelD.includes(i)) sigForHouse.levelD.push(ps.planet);
    });

    houseSignificators.push(sigForHouse);
  }

  return { planetSignificators, houseSignificators };
}

// END OF FUNCTION REPLACE
/*"""

# We need a robust way to replace the entire function in the ts file.
import re
pattern = r"export function buildKpSignificators[\s\S]*?return \{ planetSignificators, houseSignificators \};\n\}"
content = re.sub(pattern, new_func.replace("// END OF FUNCTION REPLACE\n/*", ""), content)

with open('src/lib/kpAstrology.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Node Agency integrated")
