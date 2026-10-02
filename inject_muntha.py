import os
import re

with open('src/app/actions/generateVarshaphal.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Muntha calculation logic
muntha_logic = """      const yearToGenerate = targetYear || new Date().getFullYear();
      const ageInYears = yearToGenerate - year;
      
      // Calculate Muntha (Tajik Progressed Ascendant)
      const munthaSignIndex = (ascSign + ageInYears) % 12;
      const munthaSignName = signs[munthaSignIndex];
      const munthaLord = signLords[munthaSignIndex];
      
      // Calculate where Muntha falls in the Natal Chart (from Lagna)
      let munthaHouse = (munthaSignIndex - ascSign + 12) % 12 + 1;
"""
content = content.replace("const yearToGenerate = targetYear || new Date().getFullYear();", muntha_logic)

# 2. Inject into the prompt
old_prompt = """    CRITICAL TIME ANCHOR: The USER HAS EXPLICITLY REQUESTED THE VARSHAPHAL FOR THE YEAR ${yearToGenerate}."""
new_prompt = """    CRITICAL TAJIK MATHEMATICS (VARSHAPHAL/SOLAR RETURN):
    - Target Year: ${yearToGenerate} to ${nextYear}
    - Age this year: ${ageInYears}
    - MUNTHA SIGN: ${munthaSignName}
    - MUNTHA LORD: ${munthaLord}
    - MUNTHA PLACEMENT: House ${munthaHouse} from Natal Ascendant.

    TAJIK PREDICTION RULES (STRICT STRICT STRICT):
    - If Muntha falls in the 4th, 6th, 8th, or 12th house: Predict extreme challenges, health issues, losses, and struggles.
    - If Muntha falls in the 1st, 2nd, 3rd, 9th, 10th, or 11th house: Predict massive success, wealth, health, and career growth.
    - If Muntha Lord is afflicted or debilitated, the year will be difficult regardless of placement.
    - YOU MUST EXPLICITLY MENTION the Muntha Sign, Muntha Lord, and Muntha House in the 'overallTheme' section to prove mathematical accuracy to the user.

    CRITICAL TIME ANCHOR: The USER HAS EXPLICITLY REQUESTED THE VARSHAPHAL FOR THE YEAR ${yearToGenerate}."""

content = content.replace(old_prompt, new_prompt)

with open('src/app/actions/generateVarshaphal.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Muntha mathematics injected into Varshaphal!")
