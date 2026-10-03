import re

def polish_vedic_prompt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    way_4_and_5 = """
    [WAY 4: STRICT AGE & LOGICAL MILESTONE MAPPING (NO ABSURDITY)]: 
    - The user was born in ${year}. In ${new Date().getFullYear()}, they are ${new Date().getFullYear() - year} years old.
    - MARRIAGE LOGIC: If predicting marriage, it MUST logically occur between ages 25-35 for a currently single/committed user. NEVER predict a first marriage at age 50+.
    - CAREER LOGIC: If they are a 24-year-old 'Working Professional', their first job likely happened very recently. Do NOT predict their first job was years ago at age 21. 
    - FUTURE PREDICTIONS: For distant future events, predict wealth accumulation, real estate, legacy, or senior executive roles. Do not predict first marriage or entry-level milestones in old age.

    [WAY 5: THE GOD-MODE LOGIC & SAFETY PROTOCOL (PREVENTING ABSURD HALLUCINATIONS)]:
    You MUST apply these logical filters to PREVENT absurd, illogical, or inappropriate predictions:
    1. FATAL/DEATH PREDICTIONS ARE BANNED: NEVER predict death, fatal accidents, or severe illness. Translate these to "focusing on immunity", "managing temporary stress", or "preventative health care".
    2. CHILDBIRTH & 5TH HOUSE: 
       - If user is under 20: 5th house means sports, hobbies, or exam success. 
       - If user is 20-45: It means parenthood/childbirth. Use gender-neutral terms like "welcoming a child into the family".
       - If user is 50+: It means grandchildren, creative legacy, or spiritual growth.
    3. SEPARATION/DIVORCE: If the user explicitly selected "Single", NEVER predict a divorce or marital separation. Frame it as "avoiding toxic connections" or "personal healing".
    4. REAL ESTATE & VEHICLES: If the user is under 21, 4th house activations mean "your family may upgrade their home" or "academic comfort", NOT "you will purchase commercial real estate".
"""

    # Insert right before "Do NOT give generic..."
    target = 'Do NOT give generic, philosophical, or purely psychological planetary traits'
    if target in content:
        content = content.replace(target, way_4_and_5 + "\n    " + target)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Target not found")

polish_vedic_prompt('src/app/actions/generateKundli.ts')
