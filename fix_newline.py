import os

with open('src/app/actions/generateVarshaphal.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '`nconst signLords' in line:
        lines[i] = line.replace('`nconst signLords', '\nconst signLords')

with open('src/app/actions/generateVarshaphal.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)
