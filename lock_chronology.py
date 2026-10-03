import re

def lock_chronology(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    strict_chronology = """
      [WAY 4: THE MATHEMATICAL TIMELINE LOCK (1000% ACCURACY PROTOCOL)]: 
      - You are a deterministic mathematical engine. You DO NOT have creative freedom to skip years.
      - If the user is a "Fresher", you MUST mathematically lock their First Job / Internship into the VERY FIRST valid Sookshma window in 2024, 2025, or 2026. DO NOT push it to 2027 or 2028 under any circumstances.
      - If the user is "Student", map their academic graduation to the first valid window, and their job to the next valid window.
      - If the user is "Working Professional", map their job entry to a PAST year (e.g., 2023 or 2024), and map 2025/2026 to promotions/bonuses.
      - If the user is "Committed", you MUST map the deepening/start of their relationship to the VERY FIRST valid Sookshma window (e.g., 2024 or 2025). DO NOT push their relationship start to 2027.
      - If the user is "Single", push marriage/relationship to the future (2027+).
      - NEVER violate this chronological locking. Map the mathematically closest Dasha window to the user's current context.
"""

    content = re.sub(r"\[WAY 4: STRICT AGE & LOGICAL MILESTONE MAPPING \(NO ABSURDITY\)\].*?- INDEPENDENT HOUSES: If a house is empty and its lord is untenanted, it is extremely powerful\.\n", strict_chronology, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected strict chronological locking")

lock_chronology('src/app/actions/generateKpKundli.ts')
