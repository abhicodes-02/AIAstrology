import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the prompt section safely with regex
pattern = r"- D-9 Navamsa Houses: \$\{JSON\.stringify\(d9Houses\)\}"
replacement = """- D-9 Navamsa Houses (Marriage/Soul): ${JSON.stringify(d9Houses)}
    - D-10 Dasamsa Houses (Career/Profession): ${JSON.stringify(d10Houses)}
    - D-24 Chaturvimsamsa Houses (Education/Intellect): ${JSON.stringify(d24Houses)}
    
    IMPORTANT VARGA RULES FOR AI:
    - For Career/Power predictions, STRICTLY prioritize D-10 Dasamsa over D-1.
    - For Education/Learning predictions, STRICTLY prioritize D-24 Chaturvimsamsa over D-1."""

content = re.sub(pattern, replacement, content)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replace completed")
