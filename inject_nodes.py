import re

def inject_nodes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    rahu_logic = """
      if (northNode) {
        const pSidereal = northNode.longitude;
        const rahuLon = getSidereal(pSidereal);
        const rahuInfo = getKpDetailsForLongitude(rahuLon);

        const pSignIndex = Math.floor(pSidereal / 30);
        planetaryPower["Rahu"] = getPlanetaryDignityScore("Rahu", pSignIndex);

        const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
        let d9House = pNavamsaSign - ascNavamsaSign + 1;
        if (d9House <= 0) d9House += 12;
        d9Houses[d9House].push("Rahu");
        
        const pD10Sign = getDasamsaSign(pSidereal);
        let d10House = pD10Sign - ascD10Sign + 1;
        if (d10House <= 0) d10House += 12;
        d10Houses[d10House].push("Rahu");

        const pD24Sign = getD24Sign(pSidereal);
        let d24House = pD24Sign - ascD24Sign + 1;
        if (d24House <= 0) d24House += 12;
        d24Houses[d24House].push("Rahu");

        kpPlanets.push({
"""
    
    ketu_logic = """
      if (southNode) {
        const pSidereal = southNode.longitude;
        const ketuLon = getSidereal(pSidereal);
        const ketuInfo = getKpDetailsForLongitude(ketuLon);

        const pSignIndex = Math.floor(pSidereal / 30);
        planetaryPower["Ketu"] = getPlanetaryDignityScore("Ketu", pSignIndex);

        const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
        let d9House = pNavamsaSign - ascNavamsaSign + 1;
        if (d9House <= 0) d9House += 12;
        d9Houses[d9House].push("Ketu");
        
        const pD10Sign = getDasamsaSign(pSidereal);
        let d10House = pD10Sign - ascD10Sign + 1;
        if (d10House <= 0) d10House += 12;
        d10Houses[d10House].push("Ketu");

        const pD24Sign = getD24Sign(pSidereal);
        let d24House = pD24Sign - ascD24Sign + 1;
        if (d24House <= 0) d24House += 12;
        d24Houses[d24House].push("Ketu");

        kpPlanets.push({
"""

    # First, replace the Rahu block
    rahu_pattern = r"if \(northNode\) \{\s+const rahuLon = getSidereal\(northNode\.longitude\);\s+const rahuInfo = getKpDetailsForLongitude\(rahuLon\);\s+kpPlanets\.push\(\{"
    content = re.sub(rahu_pattern, rahu_logic.strip(), content)

    # Replace the Ketu block
    ketu_pattern = r"if \(southNode\) \{\s+const ketuLon = getSidereal\(southNode\.longitude\);\s+const ketuInfo = getKpDetailsForLongitude\(ketuLon\);\s+kpPlanets\.push\(\{"
    content = re.sub(ketu_pattern, ketu_logic.strip(), content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected nodes successfully!")

inject_nodes('src/app/actions/generateKpKundli.ts')
