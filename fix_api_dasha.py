import os
import re

filepath = 'src/app/actions/generateKundli.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add dasha calculation right before chatData object
if "const dashaData =" not in content:
    dasha_calc = """
    const dashaData = calculateVimshottariDasha(moonSidereal, dob);
    const dashaContext = dashaData.currentMahadasha ? 
      `Currently running Mahadasha: ${dashaData.currentMahadasha.planet} (Ends: ${dashaData.currentMahadasha.end}). Currently running Antardasha: ${dashaData.currentAntardasha?.planet} (Ends: ${dashaData.currentAntardasha?.end}).` : 
      'Dasha timeline completed.';
      
    const chartData = {"""
    content = content.replace("const chartData = {", dasha_calc)

# 2. Add dashaData to chartData object
if "dashaData: dashaData," not in content:
    content = content.replace("planetsData: processedPlanetsData,", "planetsData: processedPlanetsData,\n      dashaData: dashaData,")

# 3. Add to Prompt
if "- VIMSHOTTARI DASHA:" not in content:
    prompt_start = r"const prompt = `Act as an expert Vedic Astrologer.*?(?=Here is their exact Natal Chart)"
    new_prompt = r"const prompt = `Act as an expert Vedic Astrologer. A user named ${name} was born on ${dob} in ${pob}. \n    - VIMSHOTTARI DASHA: ${dashaContext}\n    "
    content = re.sub(prompt_start, new_prompt, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed generateKundli.ts")

# For generateKpKundli.ts
filepath_kp = 'src/app/actions/generateKpKundli.ts'
with open(filepath_kp, 'r', encoding='utf-8') as f:
    content_kp = f.read()

# Add to Prompt
if "- VIMSHOTTARI DBA" not in content_kp:
    prompt_start_kp = r"const prompt = `Act as a world-renowned Grand Master of Krishnamurti Paddhati \(KP\) Astrology\."
    new_prompt_kp = "const prompt = `Act as a world-renowned Grand Master of Krishnamurti Paddhati (KP) Astrology.\n    - VIMSHOTTARI DBA (TIMING): ${dashaContext}"
    content_kp = content_kp.replace(prompt_start_kp, new_prompt_kp)

with open(filepath_kp, 'w', encoding='utf-8') as f:
    f.write(content_kp)
print("Fixed generateKpKundli.ts")
