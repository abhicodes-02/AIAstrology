import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

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

pattern_bounds_1 = r"if \(adEndDate >= tenYearsAgo && adStartDate <= tenYearsFromNow\) \{"
replacement_bounds_1 = "if (adEndDate >= birthDateObj && adStartDate <= endOfLifeObj) {"
content = content.replace(pattern_bounds_1, replacement_bounds_1)

pattern_bounds_2 = r"if \(pdEndDate >= tenYearsAgo && pdStartDate <= tenYearsFromNow\) \{"
replacement_bounds_2 = "if (pdEndDate >= birthDateObj && pdStartDate <= endOfLifeObj) {"
content = content.replace(pattern_bounds_2, replacement_bounds_2)

content = content.replace("PAST 10-YEAR AND FUTURE 10-YEAR PRATYANTARDASHA TIMELINE", "FULL LIFE PRATYANTARDASHA TIMELINE (BIRTH TO AGE 90)")

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Vedic Kundli to Full Life Timeline")
