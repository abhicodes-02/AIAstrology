import os
import re

# 1. Update generateKundli.ts
with open('src/app/actions/generateKundli.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Schema
old_schema = """            career: { type: SchemaType.STRING, description: "Career and professional life prediction." },
            wealth: { type: SchemaType.STRING, description: "Wealth and financial prediction." },
            relationships: { type: SchemaType.STRING, description: "Love, marriage, and relationship prediction." },
            health: { type: SchemaType.STRING, description: "Health and vitality prediction." },
            fullLife: { type: SchemaType.STRING, description: "A comprehensive summary of the ultimate life path and destiny." }"""

new_schema = """            career: { type: SchemaType.STRING, description: "Career and professional life prediction." },
            education: { type: SchemaType.STRING, description: "Education, intellect, and academic prediction." },
            wealth: { type: SchemaType.STRING, description: "Wealth and financial prediction." },
            relationships: { type: SchemaType.STRING, description: "Love, marriage, and relationship prediction." },
            health: { type: SchemaType.STRING, description: "Health and vitality prediction." },
            fullLife: { type: SchemaType.STRING, description: "A comprehensive summary of the ultimate life path and destiny." }"""

content = content.replace(old_schema, new_schema)

# Update Prompt Instructions
old_prompt_rules = """    IMPORTANT VARGA RULES FOR AI:
    - For Career/Power predictions, STRICTLY prioritize D-10 Dasamsa over D-1.
    - For Education/Learning predictions, STRICTLY prioritize D-24 Chaturvimsamsa over D-1."""

new_prompt_rules = """    IMPORTANT VARGA MAPPING RULES FOR AI SECTIONS:
    To ensure 1000% accurate pinpoint predictions, you MUST isolate your analysis for each JSON section based on its specialized chart:
    1. 'fullLife' (Ultimate Life Path): STRICTLY use the D-1 Lagna Chart.
    2. 'relationships' (Love & Destiny): STRICTLY use the D-9 Navamsa Chart.
    3. 'career' (Career & Power): STRICTLY use the D-10 Dasamsa Chart.
    4. 'education' (Education & Intellect): STRICTLY use the D-24 Chaturvimsamsa Chart.
    5. 'wealth' & 'health': Use D-1 focusing on 2nd/11th and 6th/8th houses respectively."""

content = content.replace(old_prompt_rules, new_prompt_rules)

with open('src/app/actions/generateKundli.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update KundliDashboardView.tsx to add Education accordion
with open('src/components/KundliDashboardView.tsx', 'r', encoding='utf-8') as f2:
    ui_content = f2.read()

# We will inject the new Education Accordion right after Career
career_accordion_end = """                      </div>
                    </AccordionContent>
                  </AccordionItem>"""

education_accordion = """
                  <AccordionItem value="education" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-amber-500/30 transition-all duration-300">
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-4 text-amber-100">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        </div>
                        <span className="text-xl font-space font-semibold tracking-wide">Education & Intellect</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pt-2">
                      <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                        {renderSafe(chartData.education, "No education data available.")}
                      </div>
                    </AccordionContent>
                  </AccordionItem>"""

# Using regex to insert it safely after the Career item
import re
ui_content = re.sub(r'(value="career".*?</AccordionContent>\n\s*</AccordionItem>)', r'\1\n' + education_accordion, ui_content, flags=re.DOTALL)

with open('src/components/KundliDashboardView.tsx', 'w', encoding='utf-8') as f2:
    f2.write(ui_content)

print("Varga mapping and UI tabs created!")
