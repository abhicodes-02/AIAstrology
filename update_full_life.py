import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Expand timeline to Full Life (Birth to Age 90)
pattern_timeline = r"""    const tenYearsAgo = new Date\(now\);
    tenYearsAgo\.setFullYear\(now\.getFullYear\(\) - 10\);
    const tenYearsFromNow = new Date\(now\);
    tenYearsFromNow\.setFullYear\(now\.getFullYear\(\) \+ 10\);

    for \(const md of dashaData\.mahadashas\) \{
      const mdStart = new Date\(md\.start\);
      const mdEnd = new Date\(md\.end\);
      if \(mdEnd < tenYearsAgo \|\| mdStart > tenYearsFromNow\) continue;"""

replacement_timeline = """    const birthDateObj = new Date(dob);
    const endOfLifeObj = new Date(dob);
    endOfLifeObj.setFullYear(birthDateObj.getFullYear() + 90);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < birthDateObj || mdStart > endOfLifeObj) continue;"""
content = re.sub(pattern_timeline, replacement_timeline, content, flags=re.DOTALL)

# Update bounds check inside the loop
pattern_bounds_1 = r"if \(adEndDate >= tenYearsAgo && adStartDate <= tenYearsFromNow\) \{"
replacement_bounds_1 = "if (adEndDate >= birthDateObj && adStartDate <= endOfLifeObj) {"
content = content.replace(pattern_bounds_1, replacement_bounds_1)

pattern_bounds_2 = r"if \(pdEndDate >= tenYearsAgo && pdStartDate <= tenYearsFromNow\) \{"
replacement_bounds_2 = "if (pdEndDate >= birthDateObj && pdStartDate <= endOfLifeObj) {"
content = content.replace(pattern_bounds_2, replacement_bounds_2)

# Update the context string name
content = content.replace("PAST 10-YEAR AND FUTURE 10-YEAR PRATYANTARDASHA TIMELINE", "FULL LIFE PRATYANTARDASHA TIMELINE (BIRTH TO AGE 90)")

# 2. Inject House Significators into the prompt
pattern_prompt_injection = r"    - 7th CSL \(Marriage\): \$\{cusps\[6\]\?\.subLord\}\n    - 2nd/11th CSL \(Wealth\): \$\{cusps\[1\]\?\.subLord\} / \$\{cusps\[10\]\?\.subLord\}"

replacement_prompt_injection = """    - 7th CSL (Marriage): ${cusps[6]?.subLord}
    - 2nd/11th CSL (Wealth): ${cusps[1]?.subLord} / ${cusps[10]?.subLord}
    - KP HOUSE SIGNIFICATORS (CRITICAL FOR TIMING): ${JSON.stringify(houseSignificators)}"""
content = re.sub(pattern_prompt_injection, replacement_prompt_injection, content)

# 3. Update the Breakthrough instruction to pick 6 events across the whole life
pattern_breakthrough_rule = r"CRITICAL BREAKTHROUGHS FORMATTING: You must output exactly 4 breakthroughs\. At least 1 breakthrough MUST be from the past/present timeline \(if applicable\), and the rest from the future\."
replacement_breakthrough_rule = "CRITICAL BREAKTHROUGHS FORMATTING: You must output exactly 6 breakthroughs spanning the user's ENTIRE life (childhood, past, present, and future). Pick the absolute strongest peaks based on the provided KP House Significators."
content = re.sub(pattern_breakthrough_rule, replacement_breakthrough_rule, content)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KP Kundli for Full Life Timeline and injected Significators")
