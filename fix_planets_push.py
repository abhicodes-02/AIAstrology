import os

filepath = 'src/app/actions/generateKundli.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix planetsData.push
old_push = """    planetsData.push({
      shortName,
      d1SignIndex: pSign + 1,
      d9SignIndex: pNavamsaSign + 1,
      isRetrograde: Boolean(planet.isRetrograde),
      degreeStr
    });"""

new_push = """    planetsData.push({
      name: name,
      longitude: planet.longitude,
      shortName,
      d1SignIndex: pSign + 1,
      d9SignIndex: pNavamsaSign + 1,
      isRetrograde: Boolean(planet.isRetrograde),
      degreeStr
    });"""

content = content.replace(old_push, new_push)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed planetsData push")
