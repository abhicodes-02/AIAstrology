import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the word "Antardasha" to "Pratyantardasha" and fix the formatting instruction
pattern = r"You MUST find the EXACT date ranges from the \"FUTURE 20-YEAR TIMELINE\".*?in their career, wealth, and life\."

replacement = """You MUST find the EXACT date ranges from the "FUTURE 10-YEAR PRATYANTARDASHA TIMELINE" provided above where the Pratyantardasha (PD) planet is the 10th CSL, 11th CSL, 2nd CSL, or 7th CSL, or a very strong significator (Level 1/2) of these houses.
       Identify the 3 most powerful future Pratyantardasha periods for career, wealth, or marriage.
       CRITICAL: Use the exact short-term Month-Year format from the timeline for breakthroughs (e.g., "Jan 2025 to Mar 2025"). NEVER invent your own dates.
    3. MANDATORY EXACT TIMING (ALL SECTIONS): You MUST use the "FUTURE 10-YEAR PRATYANTARDASHA TIMELINE" to provide EXACT pinpoint dates for EVERY single prediction in the Career, Wealth, and Relationships sections. NEVER say "soon" or "in the future".
    4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a numbered list. You MUST use the exact literal characters `\\n\\n` (backslash n backslash n) for line breaks between items so they format correctly in JSON. DO NOT use HTML `<br>` tags."""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated formatting and Pratyantardasha prompt")
