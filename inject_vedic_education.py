import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix readingData
old_reading = """  let readingData = {
    reading: `[AI BUSY] Calculating deep planetary alignments...`,
    career: ``,
    relationships: ``,
    health: ``,
    wealth: ``,
    fullLife: ``
  };"""

new_reading = """  let readingData = {
    reading: `[AI BUSY] Calculating deep planetary alignments...`,
    education: ``,
    career: ``,
    relationships: ``,
    health: ``,
    wealth: ``,
    fullLife: ``
  };"""
content = content.replace(old_reading, new_reading)

# Fix Schema
old_schema = """              properties: {
                reading: { type: "STRING", description: "Deeply realistic core personality analysis." },
                career: { type: "STRING", description: "Professional journey, roadblocks, and peaks." },
                relationships: { type: "STRING", description: "Romantic/marital fate, emotional friction." },
                health: { type: "STRING", description: "Unvarnished health vulnerabilities." },
                wealth: { type: "STRING", description: "Realistic financial blueprint and drains." },
                fullLife: { type: "STRING", description: "Ultimate life path and major Dasha turning points." }
                },
                required: ["reading", "career", "relationships", "health", "wealth", "fullLife"]"""

new_schema = """              properties: {
                reading: { type: "STRING", description: "Deeply realistic core personality analysis." },
                education: { type: "STRING", description: "Academic performance, intelligence, and higher studies based on D24 chart." },
                career: { type: "STRING", description: "Professional journey, roadblocks, and peaks based on D10 chart." },
                relationships: { type: "STRING", description: "Romantic/marital fate, emotional friction based on D9 chart." },
                health: { type: "STRING", description: "Unvarnished health vulnerabilities." },
                wealth: { type: "STRING", description: "Realistic financial blueprint and drains." },
                fullLife: { type: "STRING", description: "Ultimate life path and major Dasha turning points." }
                },
                required: ["reading", "education", "career", "relationships", "health", "wealth", "fullLife"]"""

content = content.replace(old_schema, new_schema)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Education schema injected into generateKundli.ts")
