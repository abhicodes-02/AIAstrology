import os

def update_prompt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_rule = """
    [WAY 3: IMMEDIATE TIMELINE RELEVANCE]: 
    - The user is checking this in ${new Date().getFullYear()}.
    - You MUST prioritize finding breakthroughs in the immediate present and near future (2025-2028). 
    - Do not skip the present years. If the user is a Fresher, their First Job MUST happen in the immediate upcoming active Pratyantardasha (e.g. 2026 or 2027), do not delay it to 2030.
    """

    content = content.replace(
        "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):",
        "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):" + new_rule
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_prompt('src/app/actions/generateKpKundli.ts')
