import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const ascSidereal = ascCusp.longitude;", "const ascSidereal = getSidereal(chart.houses[0].degree);")

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ascCusp dependency")

