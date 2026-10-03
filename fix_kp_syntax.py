import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to match the broken string in the file.
# The file currently has:
# You MUST use the exact literal characters `
# 
# ` (backslash n backslash n) for line breaks between items so they format correctly in JSON. DO NOT use HTML `<br>` tags.
# I'll just replace the whole block from "4. MASSIVE DETAIL" to "tags."
pattern = r"4\. MASSIVE DETAIL & FORMATTING:.*?tags\."

replacement = """4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a numbered list. DO NOT use any HTML tags like <br>. Use standard newlines.
       CRITICAL BREAKTHROUGHS FORMATTING: Each breakthrough MUST be structured in this EXACT order:
       Exact Year: (e.g., 2025)
       Exact Month: (e.g., January to March)
       Initial Topic of Breakthrough: (e.g., Major Career Promotion)
       Description: (Detailed explanation of what will happen)"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KP prompt formatting and fixed syntax error")
