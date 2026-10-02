import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_chart_data = """    const chartData = {
      planetsData: processedPlanetsData,
        dashaData: dashaData,
      lagnaDegreeStr: `${Math.floor(ascSidereal % 30)}°`,
      d1AscSignIndex: ascSign + 1,
      d9AscSignIndex: ascNavamsaSign + 1,
      houses: d1Houses,
      d9Houses: d9Houses,
      ascendant: ascendantName,"""

new_chart_data = """    const chartData = {
      planetsData: processedPlanetsData,
        dashaData: dashaData,
      lagnaDegreeStr: `${Math.floor(ascSidereal % 30)}°`,
      d1AscSignIndex: ascSign + 1,
      d9AscSignIndex: ascNavamsaSign + 1,
      d10AscSignIndex: ascDasamsaSign + 1,
      d24AscSignIndex: ascChaturvimsamsaSign + 1,
      houses: d1Houses,
      d9Houses: d9Houses,
      d10Houses: d10Houses,
      d24Houses: d24Houses,
      ascendant: ascendantName,"""

content = content.replace(old_chart_data, new_chart_data)

# Also need to make sure degree symbols match exactly. Let me use regex to be safe.
# Actually, the python string has "°" but powershell reading showed "A". Let's use regex.
with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated chartData in backend")
