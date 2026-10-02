import os
import re

with open('src/components/VarshaphalDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useEffect to reset isNavigating when targetYear changes
old_state = """  const [isNavigating, setIsNavigating] = useState(false);"""
new_state = """  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [targetYear, data]);"""

content = content.replace(old_state, new_state)

with open('src/components/VarshaphalDashboardView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("isNavigating bug fixed!")
