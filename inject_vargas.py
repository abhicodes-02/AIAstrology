import re

def migrate_vargas_to_kp(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject functions before we process planets
    functions_to_inject = """
  function getDasamsaSign(siderealLon: number): number {
    const sign = Math.floor(siderealLon / 30);
    const degree = siderealLon % 30;
    const dasamsaIdx = Math.floor(degree / 3);
    return sign % 2 === 0 ? (sign + dasamsaIdx) % 12 : (sign + 8 + dasamsaIdx) % 12;
  }
  
  function getD24Sign(siderealLon: number): number {
    const sign = Math.floor(siderealLon / 30);
    const degree = siderealLon % 30;
    const d24Idx = Math.floor(degree / 1.25);
    return sign % 2 === 0 ? (4 + d24Idx) % 12 : (3 + d24Idx) % 12;
  }
"""
    
    # Find where const kpPlanets = [] is defined and inject right above it
    target_1 = "const kpPlanets: any[] = [];"
    if target_1 in content:
        content = content.replace(target_1, functions_to_inject + "\n\n  " + target_1)

    # 2. Inject Varga house arrays
    arrays_to_inject = """
  const d9Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d10Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const d24Houses: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  
  const ascSidereal = ascLon;
  const ascNavamsaSign = Math.floor(ascSidereal / (30/9)) % 12;
  const ascD10Sign = getDasamsaSign(ascSidereal);
  const ascD24Sign = getD24Sign(ascSidereal);
"""
    # Find const planetSignificators
    target_2 = "const planetSignificators: any[] = [];"
    if target_2 in content:
        content = content.replace(target_2, arrays_to_inject + "\n  " + target_2)

    # 3. Inject planet mapping inside the planet loop
    mapping_logic = """
      // Varga mapping
      const pSidereal = p.longitude;
      const pNavamsaSign = Math.floor(pSidereal / (30/9)) % 12;
      let d9House = pNavamsaSign - ascNavamsaSign + 1;
      if (d9House <= 0) d9House += 12;
      d9Houses[d9House].push(name);
      
      const pD10Sign = getDasamsaSign(pSidereal);
      let d10House = pD10Sign - ascD10Sign + 1;
      if (d10House <= 0) d10House += 12;
      d10Houses[d10House].push(name);

      const pD24Sign = getD24Sign(pSidereal);
      let d24House = pD24Sign - ascD24Sign + 1;
      if (d24House <= 0) d24House += 12;
      d24Houses[d24House].push(name);
"""
    # Find where planets are pushed to kpPlanets
    target_3 = "kpPlanets.push({"
    if target_3 in content:
        content = content.replace(target_3, mapping_logic + "\n      " + target_3)

    # 4. Inject into the AI prompt
    prompt_injection = """
    - EXACT EVENT CONTEXT (PHASE 1 VARGAS):
      To deduce the exact *label* and *industry* of the events, use these Divisional Charts (Vargas):
      D-9 Navamsa (Exact Marriage/Spouse specifics): ${JSON.stringify(d9Houses)}
      D-10 Dasamsa (Exact Career Industry/Role specifics): ${JSON.stringify(d10Houses)}
      D-24 Chaturvimsamsa (Exact Education specifics): ${JSON.stringify(d24Houses)}
      If predicting a career event in August 2026, look at the D-10 chart. If D-10's 10th house has Tech planets (Mars/Rahu), predict an exact IT/Tech job. If D-9 shows a strong Venus, predict a love marriage. Do not guess blindly, use these Vargas!
"""
    target_4 = "CRITICAL REAL-WORLD CLARITY RULES"
    if target_4 in content:
        content = content.replace(target_4, prompt_injection + "\n    " + target_4)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Phase 1 Vargas into KP AI!")

migrate_vargas_to_kp('src/app/actions/generateKpKundli.ts')
