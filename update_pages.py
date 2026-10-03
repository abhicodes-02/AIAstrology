import os
import re

def update_page(filepath, fetch_func_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add extractors
    pattern_pob = r'const pob = typeof params\.pob === "string" \? params\.pob : "[^"]+";'
    replacement_pob = r'const pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";\n  const lifeStage = typeof params.lifeStage === "string" ? params.lifeStage : "student";\n  const relationshipStatus = typeof params.relationshipStatus === "string" ? params.relationshipStatus : "single";'
    
    content = re.sub(pattern_pob, replacement_pob, content)

    # Update fetch call
    pattern_fetch = rf"await {fetch_func_name}\(name, dob, tob, pob\)"
    replacement_fetch = f"await {fetch_func_name}(name, dob, tob, pob, lifeStage, relationshipStatus)"
    
    content = re.sub(pattern_fetch, replacement_fetch, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_page('src/app/kp-kundli/page.tsx', 'fetchAIKpKundliData')
update_page('src/app/kundli/page.tsx', 'fetchAIKundliData')
# Note: varshaphal and daily don't have the WAY 1 rule explicitly inside them right now, but we should update their fetch calls if we updated their function signatures.
# Actually my `update_actions_context.py` updated ALL files that had `export async function fetchAI[A-Za-z]+Data`.
# Let's verify which ones got updated.
