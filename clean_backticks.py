import os

with open('src/app/actions/generateVarshaphal.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Pisces"];`r', 'Pisces"];')
content = content.replace('Pisces"];`n', 'Pisces"];')
content = content.replace('Pisces"];`', 'Pisces"];')

with open('src/app/actions/generateVarshaphal.ts', 'w', encoding='utf-8') as f:
    f.write(content)
