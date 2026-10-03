import os
import re

def update_page(filepath, fetch_func_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern_pob = r'const pob = typeof params\.pob === "string" \? params\.pob : "[^"]+";'
    replacement_pob = r'const pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";\n  const lifeStage = typeof params.lifeStage === "string" ? params.lifeStage : "student";\n  const relationshipStatus = typeof params.relationshipStatus === "string" ? params.relationshipStatus : "single";'
    
    content = re.sub(pattern_pob, replacement_pob, content)

    pattern_fetch = rf"await {fetch_func_name}\(name, dob, tob, pob\)"
    replacement_fetch = f"await {fetch_func_name}(name, dob, tob, pob, lifeStage, relationshipStatus)"
    
    content = re.sub(pattern_fetch, replacement_fetch, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_page('src/app/varshaphal/page.tsx', 'fetchAIVarshaphalData')
update_page('src/app/daily/page.tsx', 'fetchAIDailyInsightData')
print("Done")
