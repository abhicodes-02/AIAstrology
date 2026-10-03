import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Force wipe the entire Formatting block up to the backtick
pattern = r"4\. MASSIVE DETAIL & FORMATTING:.*?`;"

replacement = """4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a numbered list. You MUST NOT use any HTML tags like <br>. Use standard newline characters (\\n) for line breaks so the UI renders it cleanly.
       CRITICAL BREAKTHROUGHS FORMATTING: You must output exactly 4 breakthroughs. Breakthrough 1 MUST be a past/present event (between 2020 and 2026) such as education completion or first job. Breakthroughs 2, 3, and 4 must be future events.
       Each breakthrough MUST be structured in this EXACT order, with each item on a new line (no HTML tags):
       Exact Year: (e.g., 2025)
       Exact Month: (e.g., January to March)
       Initial Topic of Breakthrough: (e.g., Major Career Promotion)
       Description: (Detailed explanation of what will happen)`;"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated formatting and past event rule")
