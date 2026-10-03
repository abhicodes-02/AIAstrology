import os

with open('src/lib/dasha.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("duration: number; // Years\n}", "duration: number; // Years\n  antardashas?: DashaPeriod[];\n}")

with open('src/lib/dasha.ts', 'w', encoding='utf-8') as f:
    f.write(content)
