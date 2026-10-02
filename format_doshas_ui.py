import os
import re

with open('src/components/KundliDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the boundaries of the AccordionContent to replace
start_marker = "<AccordionContent className=\"px-4 pb-4 pt-1 text-slate-300 border-t border-white/5\">"
end_marker = "</AccordionContent>"

if start_marker in content:
    start_idx = content.find(start_marker)
    # Find the matching closing tag
    end_idx = content.find(end_marker, start_idx) + len(end_marker)
    
    old_block = content[start_idx:end_idx]
    
    new_block = """<AccordionContent className="px-4 pb-4 pt-1 text-slate-300 border-t border-white/5">
                          <div className="space-y-4 mt-4">
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                              <div>
                                <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-0.5">1. Mathematical Status</span> 
                                <p className="text-sm text-slate-200 leading-relaxed">{dosha.reason}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                              <div>
                                <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-0.5">2. Level</span> 
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                  {dosha.present && !dosha.isCancelled ? <span className="text-red-400">High Intensity</span> : 
                                   dosha.present && dosha.isCancelled ? <span className="text-amber-400">Low / Cancelled</span> : 
                                   <span className="text-green-400">None</span>}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                              <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${dosha.isCancelled ? 'text-amber-400' : (dosha.present ? 'text-red-400' : 'text-green-400')}`} />
                              <div>
                                <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-0.5">3. Cancelled Out or Not</span> 
                                <p className="text-sm text-slate-200 leading-relaxed">
                                  {dosha.isCancelled ? (
                                    <span className="text-amber-300/90 font-medium">Yes, Cancelled (Bhanga): <span className="text-slate-300 font-normal">{dosha.cancelReason}</span></span>
                                  ) : dosha.present ? (
                                    <span className="text-red-300/90 font-medium">No, Active.</span>
                                  ) : (
                                    <span className="text-green-300/90 font-medium">Not Applicable.</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>"""
    
    content = content.replace(old_block, new_block)
    
    with open('src/components/KundliDashboardView.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("UI struct updated")
else:
    print("Could not find AccordionContent block")
