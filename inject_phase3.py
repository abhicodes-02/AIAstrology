import re

def inject_phase3(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    phase3_logic = """
    // PHASE 3: EXACT KP BOOLEAN PERMISSIONS
    const careerCSL = cusps[9]?.subLord;
    const marriageCSL = cusps[6]?.subLord;
    const propertyCSL = cusps[3]?.subLord;
    const foreignCSL = cusps[8]?.subLord;
    const businessCSL = cusps[6]?.subLord; // 7th house for business
    
    const careerSig = careerCSL ? (planetSignificators as any)[careerCSL] || [] : [];
    const marriageSig = marriageCSL ? (planetSignificators as any)[marriageCSL] || [] : [];
    const propertySig = propertyCSL ? (planetSignificators as any)[propertyCSL] || [] : [];
    const foreignSig = foreignCSL ? (planetSignificators as any)[foreignCSL] || [] : [];
    const businessSig = businessCSL ? (planetSignificators as any)[businessCSL] || [] : [];

    const booleanPermissions = {
      isCareerPromising: careerSig.some((h: string) => ["2", "6", "10", "11"].includes(h)),
      isMarriagePromising: marriageSig.some((h: string) => ["2", "7", "11"].includes(h)),
      isRealEstatePromising: propertySig.some((h: string) => ["4", "11", "12"].includes(h)),
      isForeignTravelPromising: foreignSig.some((h: string) => ["3", "9", "12"].includes(h)),
      isBusinessPromising: businessSig.some((h: string) => ["2", "7", "10", "11"].includes(h)),
    };
"""

    # Inject logic right after buildKpSignificators
    target_1 = "const { planetSignificators, houseSignificators } = buildKpSignificators(kpPlanets, cusps);"
    if target_1 in content:
        content = content.replace(target_1, target_1 + "\n" + phase3_logic)

    # Inject into prompt
    phase3_prompt = """
    - EXACT KP BOOLEAN PERMISSIONS (PHASE 3 NO-HALLUCINATION FILTER):
      You MUST strictly obey these Boolean mathematical permissions. If an event is FALSE, it will NEVER happen, even if the user form says otherwise or a transit looks good.
      ${JSON.stringify(booleanPermissions)}
      - If 'isCareerPromising' is FALSE, NEVER predict a major corporate promotion. Frame it as "sustaining current role".
      - If 'isMarriagePromising' is FALSE, NEVER predict marriage even if they are 'Committed'. Frame it as "delays in formalization".
      - If 'isRealEstatePromising' is FALSE, NEVER predict buying a house/property.
      - If 'isBusinessPromising' is FALSE, NEVER predict entrepreneurship or business success. Stick strictly to jobs.
"""
    target_2 = "EXACT EVENT MAGNITUDE (PHASE 2 POWER SCORING):"
    if target_2 in content:
        content = content.replace(target_2, phase3_prompt + "\n    - " + target_2)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Phase 3 successfully!")

inject_phase3('src/app/actions/generateKpKundli.ts')

