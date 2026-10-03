import os

def update_ui(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the MahadashaCard component and update it to show a fallback if antardashas are missing
    block_to_replace = """        {isOpen && md.antardashas && (
          <div className="p-4 pt-0 grid gap-2 mt-2">
            <div className="h-px w-full bg-white/10 mb-2"></div>
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
          </div>
        )}"""

    new_block = """        {isOpen && (
          <div className="p-4 pt-0 grid gap-2 mt-2">
            <div className="h-px w-full bg-white/10 mb-2"></div>
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
          </div>
        )}"""

    content = content.replace(block_to_replace, new_block)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_ui('src/components/KpKundliDashboardView.tsx')
update_ui('src/components/KundliDashboardView.tsx')
