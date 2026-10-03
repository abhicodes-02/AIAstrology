import re

def fix_timeline(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_rules = """
      - You must output exactly 6 breakthroughs. 
      - You MUST include at least one breakthrough from the immediate past (2024 or 2025) and at least one from the immediate present (2026 or 2027).
      - UNIVERSAL BALANCING RULE (1000% ACCURACY): You MUST distribute the 6 breakthroughs across the user's major life aspects. 
        1. At least ONE breakthrough MUST explicitly address their Career/Academic progression (based on their life stage).
        2. At least ONE breakthrough MUST explicitly address their Relationship/Marriage progression (based on whether they are Single or Committed). Do not ignore this, even if career planets are stronger!
        3. The remaining 4 breakthroughs should follow the absolute strongest peaks based on KP House Significators.
"""

    content = re.sub(r"- You must output exactly 6 breakthroughs\..*?predict purely based on what the exact Pratyantardasha planet signifies in the user's chart\.", new_rules.strip(), content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Universal Balancing Rule")

fix_timeline('src/app/actions/generateKpKundli.ts')
