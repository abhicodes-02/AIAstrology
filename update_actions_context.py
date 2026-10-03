import os
import re

def update_action_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update function signature
    pattern_sig = r"export async function fetchAI.*?\(name: string, dob: string, tob: string, pob: string\)"
    
    # We don't know the exact function name, so let's match 'export async function fetchAI[A-Za-z]+Data(name: string, dob: string, tob: string, pob: string)'
    def replace_sig(match):
        return match.group(0).replace('pob: string', 'pob: string, lifeStage: string = "student", relationshipStatus: string = "single"')
    
    content = re.sub(r"export async function fetchAI[A-Za-z]+Data\(name: string, dob: string, tob: string, pob: string\)", replace_sig, content)

    # Inject variables into the prompt
    pattern_prompt = r"Act as a world-renowned Grand Master of Krishnamurti Paddhati \(KP\) Astrology\.\n\s*Analyze this exact KP Chart for \$\{name\} born in \$\{year\}:"
    if 'generateKundli' in filepath and 'Kp' not in filepath:
        pattern_prompt = r"Act as an expert Vedic Astrologer providing a profoundly accurate reading\.\n\s*Analyze this exact chart for \$\{name\} born in \$\{year\}:"
        
    def replace_prompt(match):
        return match.group(0) + f"\n    - USER CONTEXT: Currently a {'${lifeStage}'} and is {'${relationshipStatus}'}."
    
    content = re.sub(pattern_prompt, replace_prompt, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_action_file('src/app/actions/generateKpKundli.ts')
update_action_file('src/app/actions/generateKundli.ts')
print("Updated Actions with lifeStage and relationshipStatus")
