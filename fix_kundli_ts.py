import os

filepath = 'src/app/actions/generateKundli.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix moonSidereal to siderealMoon
content = content.replace("calculateVimshottariDasha(moonSidereal, dob)", "calculateVimshottariDasha(siderealMoon, dob)")

# 2. Add import for calculateVimshottariDasha if missing
if "calculateVimshottariDasha" in content and 'import { calculateVimshottariDasha }' not in content:
    content = content.replace('import { getAccurateTimezone } from "@/lib/geoUtils";', 'import { getAccurateTimezone } from "@/lib/geoUtils";\nimport { calculateVimshottariDasha } from "@/lib/dasha";')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed generateKundli.ts TS errors")
