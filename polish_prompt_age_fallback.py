import os

def fallback_polish(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    age_rule = """
    [WAY 4: STRICT AGE & LOGICAL MILESTONE MAPPING (NO ABSURDITY)]: 
    - The user was born in ${year}. In ${new Date().getFullYear()}, they are ${new Date().getFullYear() - year} years old.
    - MARRIAGE LOGIC: If predicting marriage, it MUST logically occur between ages 25-35 (e.g., 2027-2037) for a currently single/committed user. NEVER predict a first marriage at age 50+ (e.g., 2056).
    - CAREER LOGIC: If they are a 24-year-old 'Working Professional', their first job likely happened very recently (2025/2026). Do NOT predict their first job was years ago at age 21 (2023). 
    - FUTURE PREDICTIONS: For distant future events (2040-2070), predict wealth accumulation, real estate, legacy, or senior executive roles. Do not predict first marriage or entry-level milestones in old age."""

    target = "CRITICAL INSTRUCTIONS FOR ZERO HALLUCINATION:"
    
    if target in content:
        content = content.replace(target, age_rule + "\n\n    " + target)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Failed to find target")

fallback_polish('src/app/actions/generateKpKundli.ts')
