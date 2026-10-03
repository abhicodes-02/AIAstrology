import os

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the failed powershell replace
content = content.replace("`n    - KP HOUSE SIGNIFICATORS", "\\n    - KP HOUSE SIGNIFICATORS")

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed Powershell literal backtick")
