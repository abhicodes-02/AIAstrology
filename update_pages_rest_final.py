import os
import re

def update_page(filepath, fetch_func_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern_pob = r'const pob = typeof params\.pob === "string" \? params\.pob : "[^"]+";'
    replacement_pob = r'const pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";\n  const lifeStage = typeof params.lifeStage === "string" ? params.lifeStage : "student";\n  const relationshipStatus = typeof params.relationshipStatus === "string" ? params.relationshipStatus : "single";'
    content = re.sub(pattern_pob, replacement_pob, content)

    if fetch_func_name == 'fetchAIDailyInsightData':
        content = content.replace(
            "fetchAIDailyInsightData(name, dob, tob, pob, date)",
            "fetchAIDailyInsightData(name, dob, tob, pob, lifeStage, relationshipStatus, date)"
        )
    elif fetch_func_name == 'fetchAIVarshaphalData':
        content = content.replace(
            "fetchAIVarshaphalData(name, dob, tob, pob, year)",
            "fetchAIVarshaphalData(name, dob, tob, pob, lifeStage, relationshipStatus, year)"
        )
        content = content.replace(
            "fetchAIVarshaphalData(name, dob, tob, pob)",
            "fetchAIVarshaphalData(name, dob, tob, pob, lifeStage, relationshipStatus)"
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_page('src/app/daily-insight/page.tsx', 'fetchAIDailyInsightData')
update_page('src/app/varshaphal/page.tsx', 'fetchAIVarshaphalData')
print("Successfully updated Daily and Varshaphal pages")
