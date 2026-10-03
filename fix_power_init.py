import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = "chart.planets.forEach((p: any) => {"
if "const planetaryPower" not in content:
    content = content.replace(target, "const planetaryPower: Record<string, {score: number, status: string}> = {};\n  " + target)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed planetary power init")
