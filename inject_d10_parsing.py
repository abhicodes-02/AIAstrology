import os
import re

with open('src/components/KundliDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate d10Planets and d24Planets
d9_logic = """    const d9HousesData = chartData.d9Houses || chartData.houses || {};
    d9Planets = Object.keys(d9HousesData).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d9AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (d9HousesData[hNumStr] || []).map((p: string) => parsePlanet(p, signIdx));
    });
  }"""

d10_d24_logic = """    const d9HousesData = chartData.d9Houses || chartData.houses || {};
    d9Planets = Object.keys(d9HousesData).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d9AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (d9HousesData[hNumStr] || []).map((p: string) => parsePlanet(p, signIdx));
    });
    
    // Add D-10 and D-24 variables
  }

  const d10AscSignIndex = chartData.d10AscSignIndex || 1;
  const lagnaCuspD10 = [{ houseNumber: 1, signIndex: d10AscSignIndex, degreeStr: "" }];
  let d10Planets: any[] = [];
  if (chartData.d10Houses) {
    d10Planets = Object.keys(chartData.d10Houses).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d10AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (chartData.d10Houses[hNumStr] || []).map((p: string) => ({
        name: p, signIndex: signIdx, degreeStr: ""
      }));
    });
  }

  const d24AscSignIndex = chartData.d24AscSignIndex || 1;
  const lagnaCuspD24 = [{ houseNumber: 1, signIndex: d24AscSignIndex, degreeStr: "" }];
  let d24Planets: any[] = [];
  if (chartData.d24Houses) {
    d24Planets = Object.keys(chartData.d24Houses).flatMap(hNumStr => {
      const hNum = parseInt(hNumStr);
      const signIdx = ((d24AscSignIndex - 1 + hNum - 1) % 12) + 1;
      return (chartData.d24Houses[hNumStr] || []).map((p: string) => ({
        name: p, signIndex: signIdx, degreeStr: ""
      }));
    });
  }"""

content = content.replace(d9_logic, d10_d24_logic)

with open('src/components/KundliDashboardView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("D10 and D24 parsing logic added")
