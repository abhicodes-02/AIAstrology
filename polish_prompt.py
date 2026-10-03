import re

def polish_prompt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the new, flawless prompt body
    new_prompt_body = """    - KP HOUSE SIGNIFICATORS (CRITICAL FOR TIMING): ${JSON.stringify(houseSignificators)}
    - TRANSIT (GOCHAR) EXACT TRIGGERS:
      Career/Job Activation Dates (Every Year): ${careerHotDates}
      Wealth Activation Dates (Every Year): ${wealthHotDates}
      Marriage Activation Dates (Every Year): ${marriageHotDates}
  
    CRITICAL REAL-WORLD CLARITY RULES (MANDATORY FOR EVERY SECTION):
    
    [WAY 1: EXPLICIT CONTEXTUAL PROFILING]: The user explicitly states they are currently a ${lifeStage.toUpperCase()} and ${relationshipStatus.toUpperCase()}.
    - You MUST forcefully align ALL predictions across ALL sections (Career, Wealth, Relationships, etc.) to this reality.
    - If they are a STUDENT, career peaks mean Academic Success/Exams. NEVER predict corporate promotions.
    - If they are a FRESHER, career peaks mean First Job/Internship. NEVER predict senior leadership.
    - If they are SINGLE, relationship peaks mean finding a partner.
    - If they are MARRIED, relationship peaks mean marital milestones (childbirth, shared assets, harmony) or marital crisis (if afflicted).

    [WAY 2: SUN-TRIGGERED GOCHAR (EXACT DAY/WEEK PINPOINTING)]: 
    - Within your predicted Pratyantardasha window (e.g., May 2026 to Sep 2026), you MUST find which of the "TRANSIT (GOCHAR) EXACT TRIGGERS" falls inside it.
    - If you predict a career event, and one of the Career Hot Dates is 'Aug 12', you MUST forcefully declare: "This event will trigger exactly around the 2nd week of August." 
    - NEVER give a broad 5-month window without pinpointing the exact week/day using these Hot Dates. This applies to EVERY section.

    [WAY 3: K. BASKARAN SUB-SUB LORD (SSL) & IMMEDIATE RELEVANCE]: 
    - The user is checking this in ${new Date().getFullYear()}.
    - You MUST use the provided Sub-Sub Lord (SSL) for ultimate precision. 
    - You MUST prioritize finding breakthroughs in the immediate present and near future (2025-2028). 
    - Do not skip the present years. If the user is a Fresher, their First Job MUST happen in the immediate upcoming active Pratyantardasha (e.g. 2026 or 2027), do not delay it to 2030.

    CRITICAL INSTRUCTIONS FOR ZERO HALLUCINATION:
    - Do NOT give generic, philosophical, or purely psychological planetary traits (e.g., "The Moon makes you emotional"). 
    - Translate EVERY placement into STRICT, CONCRETE, REAL-WORLD EVENTS (e.g., "securing a corporate job", "getting married").
    - INDEPENDENT HOUSES: If a house is empty and its lord is untenanted, it is extremely powerful.
    
    MANDATORY EXACT TIMING (ALL SECTIONS): 
    - You MUST use the "FULL LIFE PRATYANTARDASHA TIMELINE (BIRTH TO AGE 90)" to provide EXACT pinpoint dates for EVERY single prediction in the Education, Family, Career, Wealth, Health, and Relationships sections. NEVER say "soon" or "in the future".
    
    MASSIVE DETAIL & FORMATTING: 
    - Write at least 300 words for EVERY SINGLE FIELD. 
    - You MUST NOT use any HTML tags like <br>. Use standard newline characters for line breaks.
    
    CRITICAL BREAKTHROUGHS FORMATTING (EXACTLY 6 EVENTS): 
    - You must output exactly 6 breakthroughs spanning the user's ENTIRE life (1 past, 2 immediate present/future, 3 distant future). 
    - Pick the absolute strongest peaks based on the provided KP House Significators. Do NOT force specific events; predict purely based on what the exact Pratyantardasha planet signifies in the user's chart.
    - Each breakthrough MUST be structured in this EXACT order, with each item on a new line (no HTML tags):
      Exact Year: (e.g., 2026)
      Exact Month: (e.g., January to March)
      Initial Topic of Breakthrough: (e.g., Securing First Full-Time Job)
      Description: (Detailed explanation pinpointed with exact Transit Gochar Date)"""

    # We will replace everything from "- KP HOUSE SIGNIFICATORS" to "       Description: (Detailed explanation of what will happen)"
    
    start_str = "- KP HOUSE SIGNIFICATORS (CRITICAL FOR TIMING):"
    end_str = "Description: (Detailed explanation of what will happen)"
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx != -1 and end_idx != -1:
        end_idx += len(end_str)
        content = content[:start_idx] + new_prompt_body + content[end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully polished KP AI Prompt!")
    else:
        print("Could not find start/end string in prompt.")

polish_prompt('src/app/actions/generateKpKundli.ts')
