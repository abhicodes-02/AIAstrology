import os
import re

with open('src/app/actions/generateKpKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add monthName parsing
month_parse_old = """  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);"""

month_parse_new = """  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);
  const birthDateObj = new Date(year, month - 1, day);
  const monthName = birthDateObj.toLocaleString("en-US", { month: "long" });"""

content = content.replace(month_parse_old, month_parse_new)

# Update maturity table
table_old = """       - Jupiter: Year ${year + 16} (Age 16)
       - Sun: Year ${year + 22} (Age 22)
       - Moon: Year ${year + 24} (Age 24)
       - Venus: Year ${year + 25} (Age 25)
       - Mars: Year ${year + 28} (Age 28)
       - Mercury: Year ${year + 32} (Age 32)
       - Saturn: Year ${year + 36} (Age 36)
       - Rahu: Year ${year + 42} (Age 42)
       - Ketu: Year ${year + 48} (Age 48)
       CRITICAL: Just copy the Exact Year from the table above. Do not show your math."""

table_new = """       - Jupiter: ${monthName} ${year + 15} to ${monthName} ${year + 16} (Age 15-16)
       - Sun: ${monthName} ${year + 21} to ${monthName} ${year + 22} (Age 21-22)
       - Moon: ${monthName} ${year + 23} to ${monthName} ${year + 24} (Age 23-24)
       - Venus: ${monthName} ${year + 24} to ${monthName} ${year + 25} (Age 24-25)
       - Mars: ${monthName} ${year + 27} to ${monthName} ${year + 28} (Age 27-28)
       - Mercury: ${monthName} ${year + 31} to ${monthName} ${year + 32} (Age 31-32)
       - Saturn: ${monthName} ${year + 35} to ${monthName} ${year + 36} (Age 35-36)
       - Rahu: ${monthName} ${year + 41} to ${monthName} ${year + 42} (Age 41-42)
       - Ketu: ${monthName} ${year + 47} to ${monthName} ${year + 48} (Age 47-48)
       CRITICAL: Just copy the Exact Timeframe (Months & Years) from the table above. Do not show your math."""

content = content.replace(table_old, table_new)

with open('src/app/actions/generateKpKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Month precision added to breakthrough table")
