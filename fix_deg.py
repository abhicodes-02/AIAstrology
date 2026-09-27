import sys

with open("src/app/actions/generateKundli.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "const degreeStr =" in lines[i]:
        lines[i] = '    const degreeStr = `${Math.floor(degInSign)}°`;\n'
    if "lagnaDegreeStr:" in lines[i]:
        lines[i] = '    lagnaDegreeStr: `${Math.floor(ascSidereal % 30)}°`,\n'
    if "ayanamsaVal:" in lines[i]:
        lines[i] = '    ayanamsaVal: `Lahiri ${ayanamsa.toFixed(2)}°`,\n'

with open("src/app/actions/generateKundli.ts", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Done")
