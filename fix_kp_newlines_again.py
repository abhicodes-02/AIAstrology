import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"4\. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD\. For breakthroughs, format strictly as a numbered list\. You MUST use `<br><br>` tags for double line breaks between breakthroughs and `<br>` for single line breaks within a breakthrough so it renders cleanly on the UI\..*?Description: \(Detailed explanation of what will happen\) <br><br>"

replacement = """4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a numbered list. You MUST NOT use any HTML tags like <br>. Use standard newline characters (\\n) for line breaks.
       CRITICAL BREAKTHROUGHS FORMATTING: Each breakthrough MUST be structured in this EXACT order, with each item on a new line:
       Exact Year: (e.g., 2025)
       Exact Month: (e.g., January to March)
       Initial Topic of Breakthrough: (e.g., Major Career Promotion)
       Description: (Detailed explanation of what will happen)"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KP prompt to use newlines instead of <br>")
