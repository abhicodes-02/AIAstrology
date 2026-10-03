import os
import re

def fix_way1(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r"\[WAY 1: CONTEXTUAL AGE PROFILING \(MANDATORY\)\]:.*?You will be heavily penalized if you predict a senior corporate promotion for a 20-year-old\."
    
    replacement = """[WAY 1: EXPLICIT CONTEXTUAL PROFILING (MANDATORY)]: The user explicitly states they are currently a ${lifeStage.toUpperCase()} and ${relationshipStatus.toUpperCase()}.
    - You MUST forcefully align all predictions to this reality.
    - If they are a STUDENT, career peaks mean Academic Success/Exams. NEVER predict corporate promotions.
    - If they are a FRESHER, career peaks mean First Job. NEVER predict senior leadership.
    - If they are SINGLE, relationship peaks mean finding a partner.
    - If they are MARRIED, relationship peaks mean marital milestones (childbirth, shared assets, harmony) or marital crisis (if afflicted)."""
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_way1('src/app/actions/generateKpKundli.ts')
fix_way1('src/app/actions/generateKundli.ts')
print("Updated Way 1 rules")
