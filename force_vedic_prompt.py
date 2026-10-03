import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

prompt_old = """    CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
    Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional", "Jupiter brings expansion", "You will feel a shift in energy"). 
    You MUST translate every single astrological placement into STRICT, CONCRETE, REAL-WORLD EVENTS."""

prompt_new = """    CRITICAL TIMING AND REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
    1. MANDATORY EXACT TIMING: You MUST use the "FUTURE 20-YEAR TIMELINE (VIMSHOTTARI DASHA)" provided above to give EXACT YEAR-MONTH date ranges for EVERY future prediction in the Career, fullLife, and Relationships sections. NEVER say "soon", "in the future", or invent your own years. If you predict a career peak, state exactly which Antardasha period from the timeline triggers it.
    2. NO GENERIC TRAITS: Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional", "Jupiter brings expansion"). 
    You MUST translate every single astrological placement into STRICT, CONCRETE, REAL-WORLD EVENTS."""

content = content.replace(prompt_old, prompt_new)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Vedic prompt updated")
