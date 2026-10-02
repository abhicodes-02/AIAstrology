import os
import re

filepath = 'src/components/KundliDashboardView.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove html-to-image and hidden charts
content = re.sub(r'import { toJpeg } from "html-to-image";\n', '', content)
content = re.sub(r'      {/\* Hidden Light Theme Charts for PDF Capture \*/}.*?</div>\n      </div>', '', content, flags=re.DOTALL)

# Remove d1Image and d9Image generation
content = re.sub(r'        const d1El = document.getElementById\("d1-chart-pdf"\);\n.*?if \(d9El\) d9Image = await toJpeg\(d9El, \{ quality: 1, backgroundColor: \'#FFFCF5\' \}\);\n', '', content, flags=re.DOTALL)

# Update PDF component props
content = content.replace('d1Image={d1Image} \n            d9Image={d9Image}', '')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed html-to-image dependency from KundliDashboardView")
