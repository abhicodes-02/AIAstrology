import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip out the broken injected functions if they exist inside
content = re.sub(r"function getDasamsaSign\(siderealLon.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"function getD24Sign\(siderealLon.*?\}", "", content, flags=re.DOTALL)

functions_to_inject = """
export function getDasamsaSign(siderealLon: number): number {
  const sign = Math.floor(siderealLon / 30);
  const degree = siderealLon % 30;
  const dasamsaIdx = Math.floor(degree / 3);
  return sign % 2 === 0 ? (sign + dasamsaIdx) % 12 : (sign + 8 + dasamsaIdx) % 12;
}

export function getD24Sign(siderealLon: number): number {
  const sign = Math.floor(siderealLon / 30);
  const degree = siderealLon % 30;
  const d24Idx = Math.floor(degree / 1.25);
  return sign % 2 === 0 ? (4 + d24Idx) % 12 : (3 + d24Idx) % 12;
}
"""

content = content + "\n" + functions_to_inject

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added functions at end of file")
