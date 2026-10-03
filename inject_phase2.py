import re

def inject_phase2(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject the Dignity Function
    dignity_func = """
export function getPlanetaryDignityScore(planet: string, sign: number): { score: number, status: string } {
  // Signs: 0=Aries, 1=Taurus, 2=Gemini, 3=Cancer, 4=Leo, 5=Virgo, 6=Libra, 7=Scorpio, 8=Sagittarius, 9=Capricorn, 10=Aquarius, 11=Pisces
  if (planet === "Sun") {
    if (sign === 0) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 4) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 6) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([1,2,5,8,11].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Moon") {
    if (sign === 1) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 3) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 7) return { score: 10, status: "Debilitated (Very Weak)" };
    return { score: 50, status: "Neutral/Friendly (Average)" };
  }
  if (planet === "Mars") {
    if (sign === 9) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 0 || sign === 7) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 3) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([4,8,11].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Mercury") {
    if (sign === 5) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 2) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 11) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([0,1,3,4,6].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Jupiter") {
    if (sign === 3) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 8 || sign === 11) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 9) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([0,4,7].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Venus") {
    if (sign === 11) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 1 || sign === 6) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 5) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([2,9,10].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Saturn") {
    if (sign === 6) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 9 || sign === 10) return { score: 85, status: "Own Sign (Strong)" };
    if (sign === 0) return { score: 10, status: "Debilitated (Very Weak)" };
    if ([1,2,5].includes(sign)) return { score: 60, status: "Friendly Sign (Good)" };
    return { score: 40, status: "Neutral/Enemy Sign (Average/Weak)" };
  }
  if (planet === "Rahu" || planet === "North Node") {
    if (sign === 1 || sign === 2) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 7 || sign === 8) return { score: 10, status: "Debilitated (Very Weak)" };
    return { score: 50, status: "Neutral (Average)" };
  }
  if (planet === "Ketu" || planet === "South Node") {
    if (sign === 7 || sign === 8) return { score: 100, status: "Exalted (Massive Power)" };
    if (sign === 1 || sign === 2) return { score: 10, status: "Debilitated (Very Weak)" };
    return { score: 50, status: "Neutral (Average)" };
  }
  return { score: 50, status: "Neutral" };
}
"""
    if "function getPlanetaryDignityScore" not in content:
        content = content + "\n" + dignity_func
        # Remove export keyword to avoid Next.js server actions error
        content = content.replace("export function getPlanetaryDignityScore", "function getPlanetaryDignityScore")

    # 2. Inject Planetary Power map
    power_map_init = """
  const planetaryPower: Record<string, {score: number, status: string}> = {};
"""
    content = content.replace("const planetSignificators: any[] = [];", power_map_init + "\n  const planetSignificators: any[] = [];")

    # 3. Populate Power Map in the planet loop
    power_map_populate = """
      const pSignIndex = Math.floor(pSidereal / 30);
      planetaryPower[p.name] = getPlanetaryDignityScore(p.name, pSignIndex);
"""
    target_loop = "const pSidereal = p.longitude;"
    content = content.replace(target_loop, target_loop + "\n" + power_map_populate)

    # 4. Inject Phase 2 into Prompt
    prompt_injection = """
    - EXACT EVENT MAGNITUDE (PHASE 2 POWER SCORING):
      You MUST read the exact power score of the planets before predicting an event: ${JSON.stringify(planetaryPower)}
      - If a planet's score is < 30 (Weak/Debilitated), NEVER predict a massive success (e.g., "Huge Promotion", "Grand Marriage"). Predict delays, minor milestones, or internal learning.
      - If a planet's score is > 80 (Strong/Exalted), you MUST predict a massive, life-changing peak event (e.g., "Top Executive Role", "Massive Wealth Influx", "Grand Marital Union").
      - Only predict what the math allows!
"""
    target_prompt = "EXACT EVENT CONTEXT (PHASE 1 VARGAS):"
    content = content.replace(target_prompt, prompt_injection + "\n    - " + target_prompt)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Phase 2 (Power Scoring)!")

inject_phase2('src/app/actions/generateKpKundli.ts')

