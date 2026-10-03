import re

def polish_prompt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_rule_1 = """    [WAY 3: K. BASKARAN SUB-SUB LORD (SSL) & IMMEDIATE RELEVANCE]: 
    - The user is checking this in ${new Date().getFullYear()}.
    - You MUST use the provided Sub-Sub Lord (SSL) for ultimate precision. 
    - You MUST heavily prioritize finding breakthroughs in the exact immediate years of 2024, 2025, 2026, and 2027. Do not skip these crucial years!
    - If the user is a Fresher, their First Job MUST happen in the active Pratyantardasha of these immediate years."""

    new_rule_2 = """    CRITICAL BREAKTHROUGHS FORMATTING (EXACTLY 6 EVENTS): 
    - You must output exactly 6 breakthroughs. 
    - You MUST include at least one breakthrough from the immediate past (2024 or 2025) and at least one from the immediate present (2026 or 2027).
    - Pick the absolute strongest peaks based on the provided KP House Significators. Do NOT force specific events; predict purely based on what the exact Pratyantardasha planet signifies in the user's chart.
    - Each breakthrough MUST be structured in this EXACT order, with each item on a new line (no HTML tags):"""

    # Replace Way 3
    pattern_way3 = r"\[WAY 3: K\. BASKARAN SUB-SUB LORD \(SSL\) & IMMEDIATE RELEVANCE\]:.*?delay it to 2030\."
    content = re.sub(pattern_way3, new_rule_1, content, flags=re.DOTALL)

    # Replace Breakthroughs formatting
    pattern_format = r"CRITICAL BREAKTHROUGHS FORMATTING \(EXACTLY 6 EVENTS\):.*?- Each breakthrough MUST be structured in this EXACT order, with each item on a new line \(no HTML tags\):"
    content = re.sub(pattern_format, new_rule_2, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed prompt distribution constraints!")

polish_prompt('src/app/actions/generateKpKundli.ts')
