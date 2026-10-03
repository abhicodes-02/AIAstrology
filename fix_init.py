import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the incorrectly placed arrays and ascendant math
broken_block = """
    const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    const d10Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    const d24Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    
    const ascSidereal = ascCusp.longitude;
    const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;
    const ascD10Sign = getDasamsaSign(ascSidereal);
    const ascD24Sign = getD24Sign(ascSidereal);
"""
content = content.replace(broken_block, "")

# Insert it BEFORE `chart.planets.forEach`
target = "chart.planets.forEach((p: any) => {"

correct_block = """
  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d10Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d24Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  
  const ascSidereal = ascCusp.longitude;
  const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;
  const ascD10Sign = getDasamsaSign(ascSidereal);
  const ascD24Sign = getD24Sign(ascSidereal);
  
"""

content = content.replace(target, correct_block + target)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Moved initialization to before loop")

