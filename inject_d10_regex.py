import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(const chartData = \{\s*planetsData: processedPlanetsData,\s*dashaData: dashaData,\s*lagnaDegreeStr: `\$\{Math\.floor\(ascSidereal % 30\)\}.*?`,\s*d1AscSignIndex: ascSign \+ 1,\s*d9AscSignIndex: ascNavamsaSign \+ 1,)\s*(houses: d1Houses,)"

replacement = r"\1\n      d10AscSignIndex: ascDasamsaSign + 1,\n      d24AscSignIndex: ascChaturvimsamsaSign + 1,\n      \2\n      d10Houses: d10Houses,\n      d24Houses: d24Houses,"

content = re.sub(pattern, replacement, content)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated chartData in backend using regex")
