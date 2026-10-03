import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the remaining booleanPermissions reference
content = content.replace("${JSON.stringify(booleanPermissions)}", "${JSON.stringify(kpPermissionsAdvanced)}")

# Replace the old instructions
old_instructions = """
      - If 'isCareerPromising' is FALSE, NEVER predict a major corporate promotion. Frame it as "sustaining current role".
      - If 'isMarriagePromising' is FALSE, NEVER predict marriage even if they are 'Committed'. Frame it as "delays in formalization".
      - If 'isRealEstatePromising' is FALSE, NEVER predict buying a house/property.
      - If 'isBusinessPromising' is FALSE, NEVER predict entrepreneurship or business success. Stick strictly to jobs.
"""
new_instructions = """
      - If 'PROMISED_AND_STRONG': Predict the event confidently and highly successfully.
      - If 'HAPPENS_BUT_WITH_STRUGGLES_AND_DELAYS': Predict the event, but explicitly state that it will come with significant obstacles, delays, or internal struggles.
      - If 'STRICTLY_DENIED': NEVER predict this event. Frame it as "not supported in this phase of life."
      - If 'NEUTRAL_OR_DELAYED': Frame it as a low-priority area right now.
"""
content = content.replace(old_instructions, new_instructions)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed remaining booleanPermissions")
