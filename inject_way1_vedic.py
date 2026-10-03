import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement_context = """CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):
    [WAY 1: CONTEXTUAL AGE PROFILING (MANDATORY)]: You MUST calculate the user's exact age during the predicted year (Predicted Year - Birth Year ${year}). 
    - Age 0-22: They are a STUDENT. Any career/wealth peaks during this time MUST be predicted as Academic Success, passing competitive exams, or college admissions. NEVER predict corporate jobs, marriages, or real estate purchases here.
    - Age 23-26: They are a FRESHER. A career peak here MUST be predicted as their "First Corporate Job" or early career struggle/breakthrough. NEVER predict "Senior Executive Promotion".
    - Age 27-35: They are establishing themselves. Predict marriages, promotions, or first real estate.
    - Age 35+: Predict senior leadership, major wealth, or business scale-up.
    You will be heavily penalized if you predict a senior corporate promotion for a 20-year-old."""

content = content.replace("CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):", replacement_context)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected Contextual Profiling into Vedic Kundli")
