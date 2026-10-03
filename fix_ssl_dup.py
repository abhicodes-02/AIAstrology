import re

with open('src/lib/kpAstrology.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  subSubLord?: string;\n  isIndependent?: boolean;\n  occupantCount?: number;\n  subSubLord?: string;", "  subSubLord?: string;\n  isIndependent?: boolean;\n  occupantCount?: number;")
content = content.replace("  subSubLord?: string;\n  isIndependent?: boolean;\n  occupantCount?: number;\n  houseOccupied: number;\n  isRetrograde: boolean;\n  isUntenanted?: boolean;\n  subSubLord?: string;", "  subSubLord?: string;\n  isIndependent?: boolean;\n  occupantCount?: number;\n  houseOccupied: number;\n  isRetrograde: boolean;\n  isUntenanted?: boolean;")

with open('src/lib/kpAstrology.ts', 'w', encoding='utf-8') as f:
    f.write(content)
