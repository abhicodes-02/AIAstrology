import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"CRITICAL BREAKTHROUGHS FORMATTING: You must output exactly 4 breakthroughs\. Breakthrough 1 MUST be a past/present event \(between 2020 and 2026\) such as education completion or first job\. Breakthroughs 2, 3, and 4 must be future events\."

replacement = """CRITICAL BREAKTHROUGHS FORMATTING: You must output exactly 4 breakthroughs. At least 1 breakthrough MUST be from the past/present timeline (if applicable), and the rest from the future. Do NOT force specific events; predict purely based on what the exact Pratyantardasha planet signifies in the user's chart."""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed hardcoded bias from prompt")
