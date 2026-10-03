import re

def inject_omni_check(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    omni_fusion = """
    [THE ULTIMATE OMNI-FUSION PROTOCOL (MANDATORY HOLISTIC CHECK)]:
    You are strictly FORBIDDEN from making predictions based on just one factor (like just looking at a chart or just looking at a Dasha). 
    Before writing ANY prediction, you MUST pass it through this 5-layer mathematical intersection:
    1. LAYER 1 (USER INPUTS): Who is the user today? (Age, Life Stage, Relationship Status).
    2. LAYER 2 (KP BOOLEAN PERMISSIONS): Is the event mathematically permitted (True/False)? If False, ABORT the prediction or frame it as delayed/denied.
    3. LAYER 3 (VIMSHOTTARI & GOCHAR): When exactly is the timeline window and exact trigger date?
    4. LAYER 4 (VARGA CHARTS - D10/D9): What is the specific industry or exact flavor of the event?
    5. LAYER 5 (PLANETARY POWER): What is the magnitude? (Only exaggerate if score is 80+, downplay if score is <40).
    Your final text MUST be the exact intersection of ALL 5 layers. If any layer contradicts (e.g., Transit is good but KP Permission is FALSE), the KP Permission OVERRULES the transit. NO GUESSWORK, NO EXAGGERATION.
"""

    target = "CRITICAL REAL-WORLD CLARITY RULES"
    if target in content:
        content = content.replace(target, omni_fusion + "\n    " + target)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Omni-Fusion Protocol")

inject_omni_check('src/app/actions/generateKpKundli.ts')

