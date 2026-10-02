import os
import re

with open('src/components/DailyInsightView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_nav = """              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                
                {/* Interactive Day Navigation Bar */}
                <div className="flex items-center gap-1.5 bg-indigo-950/40 p-1 rounded-full border border-indigo-500/20 backdrop-blur-md">
                  <button
                    onClick={() => navigateToDate(prevDateIso)}
                    className="p-1.5 rounded-full hover:bg-indigo-500/20 text-indigo-300 transition-colors cursor-pointer"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200 px-2.5 py-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {dailyData.dateFormatted}
                  </div>
                  <button
                    onClick={() => navigateToDate(nextDateIso)}
                    className="p-1.5 rounded-full hover:bg-indigo-500/20 text-indigo-300 transition-colors cursor-pointer"
                    title="Next Day"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateToDate(undefined)}
                    className="text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30 transition-all ml-1 cursor-pointer"
                    title="Jump to Present Date"
                  >
                    Today
                  </button>
                </div>
              </div>"""

new_nav = """              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                
                {/* Safe Navigation Bar (Yesterday | Today | Tomorrow) */}
                <div className="flex items-center gap-1 bg-indigo-950/40 p-1.5 rounded-full border border-indigo-500/20 backdrop-blur-md">
                  <button
                    onClick={() => navigateToDate(new Date(Date.now() - 86400000).toISOString().split('T')[0])}
                    className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all cursor-pointer ${dailyData.targetDate === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-500/20'}`}
                  >
                    Yesterday
                  </button>
                  
                  <button
                    onClick={() => navigateToDate(new Date().toISOString().split('T')[0])}
                    className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all cursor-pointer ${dailyData.targetDate === new Date().toISOString().split('T')[0] ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-500/20'}`}
                  >
                    Today
                  </button>

                  <button
                    onClick={() => navigateToDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])}
                    className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all cursor-pointer ${dailyData.targetDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-500/20'}`}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>"""

content = content.replace(old_nav, new_nav)

with open('src/components/DailyInsightView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("UI Navigation swapped to Yesterday/Today/Tomorrow")
