import os
import re

with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject education into chartData initialization
chart_data_pattern = r"(reading: `\[AI BUSY\] Welcome \$\{name\}\. The AI is analyzing your chart\.`,)"
chart_data_replacement = r"\1\n    education: `[AI BUSY] Generating insights...`,"
content = re.sub(chart_data_pattern, chart_data_replacement, content)

# 2. Inject education into Gemini JSON Schema
schema_pattern = r"(reading: \{ type: \"STRING\", description: \"Deeply realistic core personality analysis\.\" \},)"
schema_replacement = r"\1\n                education: { type: \"STRING\", description: \"Academic performance, intelligence, and higher studies based on D24 chart.\" },"
content = re.sub(schema_pattern, schema_replacement, content)

# 3. Inject education into required array
required_pattern = r"(required: \[\"reading\", \"career\", \"relationships\", \"health\", \"wealth\", \"fullLife\"\])"
required_replacement = r'required: ["reading", "education", "career", "relationships", "health", "wealth", "fullLife"]'
content = re.sub(required_pattern, required_replacement, content)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected education safely via regex")
