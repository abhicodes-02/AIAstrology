import os
import re

filepath = 'src/app/actions/generateDailyInsight.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken required array
content = content.replace(
    'required: ["cosmicScore", "theme", "prediction", "career", "love", "health", "remedy"]',
    'required: ["cosmicScore", "overallFavorability", "careerFavorability", "financeFavorability", "loveFavorability", "healthFavorability", "cosmicMood", "luckyColor", "luckyNumber", "auspiciousTime", "dailySummary", "career", "finance", "love", "health", "remedy"]'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed Daily Insight required schema")
