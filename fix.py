import sys

with open("src/components/EastIndianChart.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the specific planet mapping logic
target = '{signPlanets.map(p => `${p.name.substring(0,2)}${p.isRetrograde ? "Ar" : ""} ${p.degreeStr || \'\'}`.trim()).join(" ")}'
# It might have a weird character in it, so we'll do a partial match
import re
content = re.sub(r'\{signPlanets\.map\(p => `\$\{p\.name\.substring\(0,2\)\}\$\{p\.isRetrograde \? "Ar" : ""\}[^`]*`\.trim\(\)\)\.join\(" "\)\}', '{signPlanets.map(p => `${p.name.substring(0,2)}${p.isRetrograde ? "(R)" : ""}`.trim()).join(" ")}', content)
content = re.sub(r'text-\[11px\] font-semibold', 'text-[14px] font-bold', content)
content = re.sub(r'fill-amber-400 text-\[10px\] font-bold', 'fill-amber-400 text-[12px] font-bold', content)

# Remove corrupted degrees from Lagna
content = re.sub(r'Lagna \{cusps\.find[^\}]+\}\?.degreeStr \|\| ""\}', 'Asc', content)

with open("src/components/EastIndianChart.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
