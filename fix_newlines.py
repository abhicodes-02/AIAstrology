import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the newline interpretation
pattern = r"exact literal characters `\n\n` \(backslash n backslash n\) for line breaks between items so they format correctly in JSON\. DO NOT use HTML `<br>` tags\."

replacement = r"exact literal characters `\n\n` (backslash n backslash n) for line breaks between items so they format correctly in JSON. DO NOT use HTML `<br>` tags."

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
