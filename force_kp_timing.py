import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update KP Prompt to FORCE timeline usage across ALL sections
prompt_old = """    4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a bulleted or numbered list with double line breaks"""

prompt_new = """    4. MANDATORY EXACT TIMING (ALL SECTIONS): You MUST use the "FUTURE 20-YEAR TIMELINE" to provide EXACT YEAR-MONTH dates for EVERY single prediction in the Career, Wealth, and Relationships sections. NEVER say "soon" or "in the future". If the 10th CSL signifies a job, look at the timeline and state exactly which Antardasha will trigger it and write the date range. If you fail to provide exact date ranges from the timeline in every section, the prediction is useless.
    5. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a bulleted or numbered list with double line breaks"""

content = content.replace(prompt_old, prompt_new)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KP prompt to force exact timing in all sections")
