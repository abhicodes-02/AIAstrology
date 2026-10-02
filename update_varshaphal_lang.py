import os
import re

with open('src/app/actions/generateVarshaphal.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_rules = """  CRITICAL REAL-WORLD CLARITY RULE"""
new_rules = """  LANGUAGE & TONE RULE (CRITICAL):
  You MUST write the entire reading in VERY SIMPLE, EVERYDAY, EASY-TO-UNDERSTAND ENGLISH (6th-grade reading level). 
  - DO NOT use complex vocabulary, Shakespearean words, or heavy astrological jargon (e.g., avoid words like "portends", "auspicious", "malefic", "beneficence", "trajectory", "amalgamation").
  - Talk to the user like a friendly, modern mentor explaining things over coffee.
  - Keep sentences short and direct.
  
  CRITICAL REAL-WORLD CLARITY RULE"""

content = content.replace(old_rules, new_rules)

with open('src/app/actions/generateVarshaphal.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Varshaphal updated")
