import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Schema
old_schema = """              breakthroughs: { type: "STRING" }
              },
              required: ["reading", "education", "family", "career", "wealth", "relationships", "health", "fullLife", "breakthroughs"]"""

new_schema = """              breakthroughs: { type: "STRING" },
              physicalAppearance: { type: "STRING", description: "Detailed physical appearance and bodily persona based on 1st CSL." }
              },
              required: ["reading", "education", "family", "career", "wealth", "relationships", "health", "fullLife", "breakthroughs", "physicalAppearance"]"""

content = content.replace(old_schema, new_schema)

# Update Prompt
old_prompt = """       CRITICAL: Just copy the Exact Year from the table above. Do not show your math.
    3. SPECIFIC HOUSE MANIFESTATION"""

new_prompt = """       CRITICAL: Just copy the Exact Year from the table above. Do not show your math.
    3. PHYSICAL APPEARANCE (1ST CSL): You MUST predict the user's exact physical appearance, body structure, height, complexion, and facial features purely based on the 1st Cusp Sub-Lord (Asc CSL) and planets in the 1st house. Also predict how their appearance changes during their current Mahadasha (e.g. weight gain during Jupiter, thinning during Saturn).
    4. SPECIFIC HOUSE MANIFESTATION"""

content = content.replace(old_prompt, new_prompt)

# Update initial readingData map
old_reading_data = """    let readingData = {
      reading: `[AI BUSY] Generating KP Analysis...`, education: ``, family: ``, career: ``, wealth: ``, relationships: ``, health: ``, fullLife: ``, breakthroughs: ``
    };"""

new_reading_data = """    let readingData = {
      reading: `[AI BUSY] Generating KP Analysis...`, education: ``, family: ``, career: ``, wealth: ``, relationships: ``, health: ``, fullLife: ``, breakthroughs: ``, physicalAppearance: ``
    };"""

content = content.replace(old_reading_data, new_reading_data)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated generateKpKundli prompt and schema")
