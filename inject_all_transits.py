import os

with open('src/app/actions/generateDailyInsight.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add all planets transits
logic_old = """  const transitMoon = transitChart.planets.find((p: any) => p.name === "Moon");"""
logic_new = """  const allTransits = transitChart.planets.map((p: any) => {
    if (["Uranus", "Neptune", "Pluto", "Chiron", "Sirius"].includes(p.name)) return null;
    let shortName = p.name === "North Node" ? "Rahu" : p.name === "South Node" ? "Ketu" : p.name;
    const pSidereal = getSidereal(p.longitude, currentAyanamsa);
    const pSignIndex = Math.floor(pSidereal / 30);
    const houseFromMoon = ((pSignIndex - moonSignIndex + 12) % 12) + 1;
    return `${shortName} in ${houseFromMoon}th House`;
  }).filter(Boolean).join(", ");

  const transitMoon = transitChart.planets.find((p: any) => p.name === "Moon");"""

content = content.replace(logic_old, logic_new)

prompt_old = """- Transit Moon House (from Natal Moon): ${transitHouseFromMoon}th House"""
prompt_new = """- Transit Moon House (from Natal Moon): ${transitHouseFromMoon}th House
- ALL PLANETARY TRANSITS (from Natal Moon): ${allTransits}"""

content = content.replace(prompt_old, prompt_new)

with open('src/app/actions/generateDailyInsight.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("All planet transits injected!")
