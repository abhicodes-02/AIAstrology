import os

files = [
    'src/app/actions/generateKundli.ts',
    'src/app/actions/generateKpKundli.ts',
    'src/app/actions/generateVarshaphal.ts',
    'src/app/actions/generateDailyInsight.ts'
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        content = content.replace('45000', '14000')
        content = content.replace('timeout (504)', 'timeout') # Just in case
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Set 14s timeout in {filepath}")
