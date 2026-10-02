import os
import re

with open('src/components/KpKundliDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

looks_accordion = """

                <AccordionItem value="appearance" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] overflow-hidden data-[state=open]:bg-white/[0.03] data-[state=open]:border-emerald-500/30 transition-all duration-300">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold font-space tracking-wide">Physical Appearance</h4>
                        <p className="text-xs text-emerald-300/60 font-medium">1st Cusp Sub-Lord Persona</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="text-indigo-100/80 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
                      {renderSafe(chartData.physicalAppearance, "No appearance data available.")}
                    </div>
                  </AccordionContent>
                </AccordionItem>
"""

# Inject before fullLife
content = content.replace('<AccordionItem value="fullLife"', looks_accordion + '\n                <AccordionItem value="fullLife"')

with open('src/components/KpKundliDashboardView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Physical appearance UI injected")
