import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify the critical rules in generateKundli.ts
old_rules = """    CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):"""
new_rules = """    LANGUAGE & TONE RULE (CRITICAL):
    You MUST write the entire reading in VERY SIMPLE, EVERYDAY, EASY-TO-UNDERSTAND ENGLISH (6th-grade reading level). 
    - DO NOT use complex vocabulary, Shakespearean words, or heavy astrological jargon (e.g., avoid words like "portends", "auspicious", "malefic", "beneficence", "trajectory", "amalgamation").
    - Talk to the user like a friendly, modern mentor explaining things over coffee.
    - Keep sentences short and direct.
    
    CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):"""

content = content.replace(old_rules, new_rules)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f2:
    kp_content = f2.read()

kp_content = kp_content.replace(old_rules, new_rules)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f2:
    f2.write(kp_content)

print("Simplified language rules added to both prompts")
