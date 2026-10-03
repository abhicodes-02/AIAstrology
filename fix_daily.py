import os

with open('src/app/daily-insight/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix literal backtick-n
content = content.replace(
    'pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";`n  const lifeStage = typeof params.lifeStage === "string" ? params.lifeStage : "student";`n  const relationshipStatus = typeof params.relationshipStatus === "string" ? params.relationshipStatus : "single";',
    'pob = typeof params.pob === "string" ? params.pob : "Kolkata, India";\n  const lifeStage = typeof params.lifeStage === "string" ? params.lifeStage : "student";\n  const relationshipStatus = typeof params.relationshipStatus === "string" ? params.relationshipStatus : "single";'
)

# Update fetch to correctly include date and the new fields
# First let's check what signature I gave to fetchAIDailyInsightData in update_actions_context.py
# Wait, `update_actions_context.py` updated ALL actions matching `fetchAI[A-Za-z]+Data`.
# Let's check `generateDailyInsight.ts` signature.
