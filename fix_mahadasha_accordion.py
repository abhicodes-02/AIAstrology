import os
import re

def fix_mahadasha_dropdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the MahadashaCard component entirely
    card_pattern = r"const MahadashaCard = \(\{ md, isCurrent \}: \{ md: any, isCurrent: boolean \}\) => \{.*?\};\n"
    content = re.sub(card_pattern, "", content, flags=re.DOTALL)

    # Now replace the map loop body
    map_body_pattern = r"\{chartData\.dashaData\.mahadashas\.map\(\(md: any, idx: number\) => \{\s*const isCurrent = chartData\.dashaData\.currentMahadasha\?\.planet === md\.planet;\s*return \(\s*<MahadashaCard key=\{idx\} md=\{md\} isCurrent=\{isCurrent\} />\s*\);\s*\}\)\}"
    
    new_map_body = """<Accordion type="single" collapsible className="w-full space-y-3">
                              {chartData.dashaData.mahadashas.map((md: any, idx: number) => {
                                const isCurrent = chartData.dashaData.currentMahadasha?.planet === md.planet;
                                return (
                                  <AccordionItem key={idx} value={`md-${idx}`} className={`border rounded-xl px-2 ${isCurrent ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5'} transition-all`}>
                                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isCurrent ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                                            {md.planet.substring(0, 2)}
                                          </div>
                                          <div className="text-left">
                                            <h5 className={`font-bold text-lg ${isCurrent ? 'text-indigo-200' : 'text-slate-200'}`}>{md.planet} Mahadasha</h5>
                                            <p className="text-xs text-slate-400 font-normal">{md.duration} Years</p>
                                          </div>
                                        </div>
                                        <div className="text-right mr-4">
                                          <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`} suppressHydrationWarning>
                                            {new Date(md.start).getFullYear()} - {new Date(md.end).getFullYear()}
                                          </p>
                                          <p className="text-xs text-slate-500 font-normal" suppressHydrationWarning>{new Date(md.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                        </div>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 pb-4">
                                      <div className="h-px w-full bg-white/10 mb-4 mt-2"></div>
                                      {md.antardashas ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {md.antardashas.map((ad: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-black/20 hover:bg-white/5 border border-white/5 p-3 rounded-lg text-sm transition-colors">
                                              <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
                                                <span className="text-indigo-100 font-medium">{ad.planet} <span className="text-indigo-300/50 text-xs ml-1">AD</span></span>
                                              </div>
                                              <span className="text-slate-400 text-xs font-mono" suppressHydrationWarning>
                                                {new Date(ad.start).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })} - {new Date(ad.end).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-xs text-rose-400 italic">Please refresh the page to load Antardasha data.</div>
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>"""

    content = re.sub(map_body_pattern, new_map_body, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_mahadasha_dropdown('src/components/KpKundliDashboardView.tsx')
fix_mahadasha_dropdown('src/components/KundliDashboardView.tsx')
print("Successfully replaced custom state with Radix nested Accordion")
