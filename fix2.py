import sys

with open("src/components/EastIndianChart.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "signPlanets.map(p =>" in lines[i]:
        lines[i] = '                  {signPlanets.map(p => `${p.name.substring(0,2)}${p.isRetrograde ? "(R)" : ""}`.trim()).join(" ")}\n'
    if "Lagna {cusps.find" in lines[i]:
        lines[i] = '                  Asc\n'

with open("src/components/EastIndianChart.tsx", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Done")
