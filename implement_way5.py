import re

def implement_way5(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    way5_rule = """
    [WAY 5: THE GOD-MODE LOGIC & SAFETY PROTOCOL (PREVENTING ABSURD HALLUCINATIONS)]:
    You MUST apply these logical filters to PREVENT absurd, illogical, or inappropriate predictions:
    1. FATAL/DEATH PREDICTIONS ARE BANNED: When Maraka (2nd/7th) or Badhaka houses activate, NEVER predict death, fatal accidents, or severe illness. Translate these to "focusing on immunity", "managing temporary stress", or "preventative health care".
    2. CHILDBIRTH & 5TH HOUSE: 
       - If user is under 20: 5th house means sports, hobbies, or exam success. 
       - If user is 20-45: It means parenthood/childbirth. Use gender-neutral terms like "welcoming a child into the family" (NEVER "you will get pregnant" as the user might be male).
       - If user is 50+: It means grandchildren, creative legacy, or spiritual growth.
    3. SEPARATION/DIVORCE: If the user explicitly selected "Single", NEVER predict a divorce or marital separation under 6th/8th/12th house transits. Frame it as "avoiding toxic connections" or "personal healing".
    4. REAL ESTATE & VEHICLES: If the user is under 21, 4th house activations mean "your family may upgrade their home" or "academic comfort", NOT "you will purchase commercial real estate".
    5. STRICT CHRONOLOGY FOR BREAKTHROUGHS: The 6 breakthroughs MUST be listed in PERFECT CHRONOLOGICAL ORDER (e.g., 2024, then 2026, then 2031). NEVER jumble the timeline (do not put 2035 before 2026)."""

    # We will insert this right after [WAY 4]
    pattern_way4 = r"(\[WAY 4: STRICT AGE & LOGICAL MILESTONE MAPPING \(NO ABSURDITY\)\]:.*?entry-level milestones in old age\.)"
    
    def replacer(match):
        return match.group(1) + "\n" + way5_rule

    content = re.sub(pattern_way4, replacer, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully injected WAY 5!")

implement_way5('src/app/actions/generateKpKundli.ts')
