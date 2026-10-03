import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Dasha timeline bounds
pattern_timeline = r"""    const now = new Date\(\);
    const tenYearsFromNow = new Date\(now\);
    tenYearsFromNow\.setFullYear\(now\.getFullYear\(\) \+ 10\);

    for \(const md of dashaData\.mahadashas\) \{
      const mdStart = new Date\(md\.start\);
      const mdEnd = new Date\(md\.end\);
      if \(mdEnd < now \|\| mdStart > tenYearsFromNow\) continue;"""

replacement_timeline = """    const now = new Date();
    const tenYearsAgo = new Date(now);
    tenYearsAgo.setFullYear(now.getFullYear() - 10);
    const tenYearsFromNow = new Date(now);
    tenYearsFromNow.setFullYear(now.getFullYear() + 10);

    for (const md of dashaData.mahadashas) {
      const mdStart = new Date(md.start);
      const mdEnd = new Date(md.end);
      if (mdEnd < tenYearsAgo || mdStart > tenYearsFromNow) continue;"""

content = re.sub(pattern_timeline, replacement_timeline, content, flags=re.DOTALL)

# Update bounds check inside the loop
pattern_bounds_1 = r"if \(adEndDate >= now && adStartDate <= tenYearsFromNow\) \{"
replacement_bounds_1 = "if (adEndDate >= tenYearsAgo && adStartDate <= tenYearsFromNow) {"
content = content.replace(pattern_bounds_1, replacement_bounds_1)

pattern_bounds_2 = r"if \(pdEndDate >= now && pdStartDate <= tenYearsFromNow\) \{"
replacement_bounds_2 = "if (pdEndDate >= tenYearsAgo && pdStartDate <= tenYearsFromNow) {"
content = content.replace(pattern_bounds_2, replacement_bounds_2)

# Update the context string name
content = content.replace("FUTURE 10-YEAR PRATYANTARDASHA TIMELINE", "PAST 10-YEAR AND FUTURE 10-YEAR PRATYANTARDASHA TIMELINE")
content = content.replace("Identify the 3 most powerful future Pratyantardasha periods", "Identify the 4 most powerful Pratyantardasha periods across the past and future (must include past/present events like education/first job)")
content = content.replace("EVERY future prediction", "EVERY prediction (past or future)")

# Update formatting instructions
pattern_format = r"4\. MASSIVE DETAIL & FORMATTING:.*?Description: \(Detailed explanation of what will happen\)"
replacement_format = """4. MASSIVE DETAIL & FORMATTING: Write at least 300 words for EVERY SINGLE FIELD. For breakthroughs, format strictly as a numbered list. You MUST use `<br><br>` tags for double line breaks between breakthroughs and `<br>` for single line breaks within a breakthrough so it renders cleanly on the UI.
       CRITICAL BREAKTHROUGHS FORMATTING: Each breakthrough MUST be structured in this EXACT order:
       Exact Year: (e.g., 2025) <br>
       Exact Month: (e.g., January to March) <br>
       Initial Topic of Breakthrough: (e.g., Major Career Promotion) <br>
       Description: (Detailed explanation of what will happen) <br><br>"""
content = re.sub(pattern_format, replacement_format, content, flags=re.DOTALL)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KP Kundli logic and prompt")
