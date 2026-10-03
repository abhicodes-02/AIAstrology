import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"2\. STRICT BREAKTHROUGHS MATHEMATICS:.*?(?=4\. MASSIVE DETAIL)"

replacement = """2. STRICT TIMING (PURE KP VIMSHOTTARI): Abandon planetary maturity ages. KP Astrology timing relies STRICTLY on Vimshottari Dasha.
       You MUST find the EXACT date ranges from the "FUTURE 20-YEAR TIMELINE" provided above where the Antardasha planet is the 10th CSL, 11th CSL, 2nd CSL, or 7th CSL, or a very strong significator (Level 1/2) of these houses.
       Identify the 3 most powerful future Antardasha periods for career, wealth, or marriage.
       CRITICAL: Use the exact Year-Month format from the timeline for breakthroughs. NEVER invent your own dates.
    3. MANDATORY EXACT TIMING (ALL SECTIONS): You MUST use the "FUTURE 20-YEAR TIMELINE" to provide EXACT YEAR-MONTH dates for EVERY single prediction in the Career, Wealth, and Relationships sections. NEVER say "soon" or "in the future".
    """

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replace executed")
