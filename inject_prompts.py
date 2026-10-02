import os
import re

# Kundli
with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    k_content = f.read()

k_content = re.sub(r'(- Lagna: \$\{ascendantName\})', r'- VIMSHOTTARI DASHA TIMING (CURRENT): ${dashaContext}\n    \1', k_content)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(k_content)

# KP Kundli
with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    kp_content = f.read()

kp_content = re.sub(r'(- Asc CSL: \$\{ascCusp\.subLord\})', r'- VIMSHOTTARI DBA TIMING (CURRENT): ${dashaContext}\n    \1', kp_content)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(kp_content)

print("Injected into prompts via regex")
