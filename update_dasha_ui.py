import os
import re

dasha_card_old = """                                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${isCurrent ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5'}`}>
                                  <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                      {md.planet.substring(0, 2)}
                                    </div>
                                    <div>
                                      <h5 className={`font-bold text-lg ${isCurrent ? 'text-indigo-200' : 'text-slate-200'}`}>{md.planet} Mahadasha</h5>
                                      <p className="text-xs text-slate-400">{md.duration} Years</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`} suppressHydrationWarning>
                                      {new Date(md.start).getFullYear()} - {new Date(md.end).getFullYear()}
                                    </p>
                                    <p className="text-xs text-slate-500" suppressHydrationWarning>{new Date(md.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                  </div>
                                </div>"""

dasha_card_new = """                                <details key={idx} className={`rounded-xl border ${isCurrent ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5'} group transition-all`}>
                                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isCurrent ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                                        {md.planet.substring(0, 2)}
                                      </div>
                                      <div>
                                        <h5 className={`font-bold text-lg ${isCurrent ? 'text-indigo-200' : 'text-slate-200'}`}>{md.planet} Mahadasha</h5>
                                        <p className="text-xs text-slate-400">{md.duration} Years</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`} suppressHydrationWarning>
                                          {new Date(md.start).getFullYear()} - {new Date(md.end).getFullYear()}
                                        </p>
                                        <p className="text-xs text-slate-500" suppressHydrationWarning>{new Date(md.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                      </div>
                                      <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </summary>
                                  <div className="p-4 pt-0 grid gap-2 mt-2">
                                    <div className="h-px w-full bg-white/10 mb-2"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {md.antardashas?.map((ad: any, i: number) => (
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
                                  </div>
                                </details>"""

def update_ui(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The exact spacing in the file might differ slightly, let's use regex to replace everything inside the map block
    pattern = r"<div key=\{idx\} className=\{\`flex items-center justify-between p-4 rounded-xl border \$\{isCurrent \? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5'\}\`\}>.*?</div>\s*</div>\s*</div>"
    
    # We will just replace it if we can find it
    content = re.sub(pattern, dasha_card_new.replace("                                <details", "<details"), content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_ui('src/components/KpKundliDashboardView.tsx')
update_ui('src/components/KundliDashboardView.tsx')
print("Updated Dashas UI with expanding Antardashas")
