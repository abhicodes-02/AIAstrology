import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the loop that populates d1Houses and d9Houses
old_loop_logic = """    const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
    let d9House = pNavamsaSign - ascNavamsaSign + 1;
    if (d9House <= 0) d9House += 12;
    d9Houses[d9House].push(shortName + (planet.isRetrograde ? "Rx" : ""));"""

new_loop_logic = """    const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
    let d9House = pNavamsaSign - ascNavamsaSign + 1;
    if (d9House <= 0) d9House += 12;
    d9Houses[d9House].push(shortName + (planet.isRetrograde ? "Rx" : ""));
    
    const pD10Sign = getDasamsaSign(pSidereal);
    let d10House = pD10Sign - ascDasamsaSign + 1;
    if (d10House <= 0) d10House += 12;
    d10Houses[d10House].push(shortName + (planet.isRetrograde ? "Rx" : ""));

    const pD24Sign = getD24Sign(pSidereal);
    let d24House = pD24Sign - ascChaturvimsamsaSign + 1;
    if (d24House <= 0) d24House += 12;
    d24Houses[d24House].push(shortName + (planet.isRetrograde ? "Rx" : ""));"""

# Wait, `ascDasamsaSign` was renamed to `ascD10Sign` and `ascChaturvimsamsaSign` to `ascD24Sign` in an earlier script!
new_loop_logic = """    const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
    let d9House = pNavamsaSign - ascNavamsaSign + 1;
    if (d9House <= 0) d9House += 12;
    d9Houses[d9House].push(shortName + (planet.isRetrograde ? "Rx" : ""));
    
    const pD10Sign = getDasamsaSign(pSidereal);
    let d10House = pD10Sign - ascD10Sign + 1;
    if (d10House <= 0) d10House += 12;
    d10Houses[d10House].push(shortName + (planet.isRetrograde ? "Rx" : ""));

    const pD24Sign = getD24Sign(pSidereal);
    let d24House = pD24Sign - ascD24Sign + 1;
    if (d24House <= 0) d24House += 12;
    d24Houses[d24House].push(shortName + (planet.isRetrograde ? "Rx" : ""));"""

content = content.replace(old_loop_logic, new_loop_logic)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("D10 and D24 population logic injected")
