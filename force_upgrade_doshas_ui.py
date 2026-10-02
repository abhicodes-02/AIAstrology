import os
import re

with open('src/components/KundliDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the boundaries to replace
start_marker = "{Array.isArray(chartData.doshas) && chartData.doshas.length > 0 ? ("
end_marker = "No doshas detected.'}\n                  </div>\n                )}"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + len(end_marker)
    
    old_block = content[start_idx:end_idx]
    
    new_block = """{Array.isArray(chartData.doshas) && chartData.doshas.length > 0 ? (
                  <Accordion className="w-full space-y-3">
                    {chartData.doshas.map((dosha: any, idx: number) => (
                      <AccordionItem key={idx} value={`dosha-${idx}`} className="border-none bg-black/20 rounded-xl overflow-hidden group">
                        <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline data-[state=open]:bg-white/5 transition-colors">
                          <div className="flex flex-1 items-center justify-between pr-4">
                            <span className="text-sm font-medium text-red-100/90">{dosha.name}</span>
                            <div className="flex items-center gap-2">
                              {dosha.isCancelled && (
                                <span className="text-[10px] px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold uppercase tracking-widest hidden sm:block">
                                  Cancelled (Bhanga)
                                </span>
                              )}
                              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${dosha.present && !dosha.isCancelled ? 'bg-red-500/20 text-red-300' : dosha.present && dosha.isCancelled ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/10 text-green-400'}`}>
                                {dosha.present && !dosha.isCancelled ? 'Present' : dosha.present && dosha.isCancelled ? 'Weak / Cancelled' : 'Not Present'}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1 text-slate-300 border-t border-white/5">
                          <div className="space-y-2 mt-2">
                            <div className="flex items-start gap-2">
                              <span className="text-cyan-400/70 shrink-0 mt-0.5">●</span>
                              <p className="text-sm"><span className="text-white/60 text-xs uppercase tracking-wider block mb-1">Mathematical Status</span> {dosha.reason}</p>
                            </div>
                            {dosha.present && dosha.isCancelled && (
                              <div className="flex items-start gap-2 mt-3 bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
                                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-200/90"><span className="text-amber-500/60 text-[10px] uppercase font-bold tracking-wider block mb-1">Cancellation Rule</span> {dosha.cancelReason}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-sm text-indigo-300/50 italic p-4 text-center">
                    {typeof chartData.doshas === 'string' ? 'Dosha analysis needs regeneration for list format.' : 'No doshas detected.'}
                  </div>
                )}"""
    
    content = content.replace(old_block, new_block)
    
    with open('src/components/KundliDashboardView.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Markers not found!")
