import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const ascSidereal = getSidereal(chart.houses[0].degree);", "const ascSidereal = getSidereal(chart.houses.cusps[0].longitude);")

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ascCusp dependency again")

