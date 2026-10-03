import re

def inject_negation_logic(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    advanced_kp_logic = """
    // PHASE 3 (ADVANCED): KP BOOLEAN WITH NEGATION LOGIC
    const careerCSL = cusps[9]?.subLord;
    const marriageCSL = cusps[6]?.subLord;
    const propertyCSL = cusps[3]?.subLord;
    const foreignCSL = cusps[8]?.subLord;
    const businessCSL = cusps[6]?.subLord; 
    
    const careerSig = careerCSL ? (planetSignificators as any)[careerCSL] || [] : [];
    const marriageSig = marriageCSL ? (planetSignificators as any)[marriageCSL] || [] : [];
    const propertySig = propertyCSL ? (planetSignificators as any)[propertyCSL] || [] : [];
    const foreignSig = foreignCSL ? (planetSignificators as any)[foreignCSL] || [] : [];
    const businessSig = businessCSL ? (planetSignificators as any)[businessCSL] || [] : [];

    function evaluateKpStatus(sigs: string[], positive: string[], negative: string[]) {
      const hasPos = sigs.some((h: string) => positive.includes(h));
      const hasNeg = sigs.some((h: string) => negative.includes(h));
      if (hasPos && !hasNeg) return "PROMISED_AND_STRONG";
      if (hasPos && hasNeg) return "HAPPENS_BUT_WITH_STRUGGLES_AND_DELAYS";
      if (!hasPos && hasNeg) return "STRICTLY_DENIED";
      return "NEUTRAL_OR_DELAYED";
    }

    const kpPermissionsAdvanced = {
      careerStatus: evaluateKpStatus(careerSig, ["2", "6", "10", "11"], ["1", "5", "9"]),
      marriageStatus: evaluateKpStatus(marriageSig, ["2", "7", "11"], ["1", "6", "10"]),
      realEstateStatus: evaluateKpStatus(propertySig, ["4", "11", "12"], ["3", "10"]),
      foreignTravelStatus: evaluateKpStatus(foreignSig, ["3", "9", "12"], ["2", "8", "11"]),
      businessStatus: evaluateKpStatus(businessSig, ["2", "7", "10", "11"], ["1", "6"])
    };
"""

    advanced_prompt = """
    - EXACT KP BOOLEAN PERMISSIONS WITH NEGATION LOGIC (PHASE 3 NO-HALLUCINATION FILTER):
      You MUST strictly obey these KP status flags. They are calculated based on sub-lord negations.
      ${JSON.stringify(kpPermissionsAdvanced)}
      - If 'PROMISED_AND_STRONG': Predict the event confidently and highly successfully.
      - If 'HAPPENS_BUT_WITH_STRUGGLES_AND_DELAYS': Predict the event, but explicitly state that it will come with significant obstacles, delays, or internal struggles.
      - If 'STRICTLY_DENIED': NEVER predict this event. Frame it as "not supported in this phase of life."
      - If 'NEUTRAL_OR_DELAYED': Frame it as a low-priority area right now.
"""

    # Replace the old phase 3 logic block
    old_phase3_start = "// PHASE 3: EXACT KP BOOLEAN PERMISSIONS"
    old_phase3_end = "};\n"
    
    # We will just replace the specific strings
    # First, let's just find where it starts and replace the whole thing.
    # Actually, writing a reliable regex is safer.
    content = re.sub(r"// PHASE 3: EXACT KP BOOLEAN PERMISSIONS.*?};\n", advanced_kp_logic, content, flags=re.DOTALL)
    content = re.sub(r"- EXACT KP BOOLEAN PERMISSIONS.*?stick strictly to jobs\.\n", advanced_prompt, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Advanced KP Negation Logic")

inject_negation_logic('src/app/actions/generateKpKundli.ts')
