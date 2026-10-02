import os
import re

with open('src/components/KundliDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_charts = """            {/* Chart Containers */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6 text-indigo-100 flex items-center justify-center gap-2">
                  <span className="text-indigo-400">D-1</span> Lagna Chart (Birth)
                </h3>
                <EastIndianChart houses={chartData.houses} />
              </div>
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-purple-500/20 shadow-2xl backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6 text-purple-100 flex items-center justify-center gap-2">
                  <span className="text-purple-400">D-9</span> Navamsa (Soul/Marriage)
                </h3>
                <EastIndianChart houses={chartData.d9Houses} />
              </div>
            </motion.div>"""

new_charts = """            {/* Chart Containers */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-6 text-indigo-100 flex items-center justify-center gap-2">
                  <span className="text-indigo-400">D-1</span> Lagna Chart (Birth)
                </h3>
                <EastIndianChart houses={chartData.houses} />
              </div>
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-purple-500/20 shadow-xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-6 text-purple-100 flex items-center justify-center gap-2">
                  <span className="text-purple-400">D-9</span> Navamsa (Marriage)
                </h3>
                <EastIndianChart houses={chartData.d9Houses} />
              </div>
              {chartData.d10Houses && (
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-amber-500/20 shadow-xl backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6 text-amber-100 flex items-center justify-center gap-2">
                    <span className="text-amber-400">D-10</span> Dasamsa (Career)
                  </h3>
                  <EastIndianChart houses={chartData.d10Houses} />
                </div>
              )}
              {chartData.d24Houses && (
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-emerald-500/20 shadow-xl backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6 text-emerald-100 flex items-center justify-center gap-2">
                    <span className="text-emerald-400">D-24</span> Chaturvimsamsa (Edu)
                  </h3>
                  <EastIndianChart houses={chartData.d24Houses} />
                </div>
              )}
            </motion.div>"""

content = content.replace(old_charts, new_charts)

with open('src/components/KundliDashboardView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("D10 and D24 charts added to UI!")
