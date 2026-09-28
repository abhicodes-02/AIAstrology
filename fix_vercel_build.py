import os
import re

files = [
    'src/components/KundliDashboardView.tsx',
    'src/components/VarshaphalDashboardView.tsx'
]

helper_func = """
  const renderSafe = (data: any, fallback: string) => {
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') return item;
        return Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(' | ');
      }).join('\\n\\n');
    }
    return JSON.stringify(data, null, 2);
  };
"""

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "const renderSafe = (" not in content:
        # Inject right after `const [isDownloading, setIsDownloading] = useState(false);` for Kundli
        # or `const printRef = useRef<HTMLDivElement>(null);` for Varshaphal
        content = re.sub(r'(const \[isDownloading, setIsDownloading\] = useState\(false\);)', 
                         r'\1\n' + helper_func, content)
        content = re.sub(r'(const printRef = useRef<HTMLDivElement>\(null\);)', 
                         r'\1\n' + helper_func, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
