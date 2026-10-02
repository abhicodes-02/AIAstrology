import os
import re

with open('src/lib/kpAstrology.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_house_sig_loop = """  const houseSignificators: KpHouseSignificator[] = [];
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
  }"""

new_house_sig_loop = """  const houseSignificators: KpHouseSignificator[] = [];
  for (let i = 1; i <= 12; i++) {
    const sigForHouse: KpHouseSignificator = {
      house: i, planetsInStarOfOccupants: [], occupants: [], planetsInStarOfLords: [], houseLord: []
    };

    planetSignificators.forEach(ps => {
      if (ps.levelA.includes(i)) sigForHouse.planetsInStarOfOccupants.push(ps.planet);
      if (ps.levelB.includes(i)) sigForHouse.occupants.push(ps.planet);
      if (ps.levelC.includes(i)) sigForHouse.planetsInStarOfLords.push(ps.planet);
      if (ps.levelD.includes(i)) sigForHouse.houseLord.push(ps.planet);
    });

    houseSignificators.push(sigForHouse);
  }"""

content = content.replace(old_house_sig_loop, new_house_sig_loop)

with open('src/lib/kpAstrology.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("House significators fixed!")
