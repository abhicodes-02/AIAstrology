import os
import re

with open('src/components/KundliDashboardView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to find the Navamsa Chart block and inject D10 and D24 right after it.
navamsa_block = """            {/* Navamsa Chart */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-space font-semibold text-indigo-50">Navamsa (D-9)</h3>
                  <p className="text-xs text-indigo-300/50 mt-1 uppercase tracking-widest">Soul & Destiny</p>
                </div>
              </div>
              <div id="d9-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                <EastIndianChart 
                  planets={d9Planets}
                  cusps={lagnaCuspD9}
                  width={350} height={350}
                  showOm={true}
                  centerTitle={`Lagna ${d9AscSignIndex}`}
                />
              </div>
            </motion.div>"""

d10_d24_blocks = """            {chartData.d10Houses && (
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-space font-semibold text-amber-100">Dasamsa (D-10)</h3>
                    <p className="text-xs text-amber-300/50 mt-1 uppercase tracking-widest">Career & Power</p>
                  </div>
                </div>
                <div id="d10-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                  <EastIndianChart 
                    planets={[]}
                    cusps={[
                      { houseNumber: 1, signName: "", signLord: "", degree: 0, signIndex: chartData.d10AscSignIndex || 1 },
                      { houseNumber: 2, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) % 12) + 1 },
                      { houseNumber: 3, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 1) % 12 + 1 },
                      { houseNumber: 4, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 2) % 12 + 1 },
                      { houseNumber: 5, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 3) % 12 + 1 },
                      { houseNumber: 6, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 4) % 12 + 1 },
                      { houseNumber: 7, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 5) % 12 + 1 },
                      { houseNumber: 8, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 6) % 12 + 1 },
                      { houseNumber: 9, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 7) % 12 + 1 },
                      { houseNumber: 10, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 8) % 12 + 1 },
                      { houseNumber: 11, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 9) % 12 + 1 },
                      { houseNumber: 12, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d10AscSignIndex || 1) + 10) % 12 + 1 },
                    ]}
                    vargaHouses={chartData.d10Houses}
                    width={350} height={350}
                    showOm={false}
                    centerTitle={`Lagna ${chartData.d10AscSignIndex || ''}`}
                  />
                </div>
              </motion.div>
            )}

            {chartData.d24Houses && (
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-space font-semibold text-emerald-100">Chaturvimsamsa (D-24)</h3>
                    <p className="text-xs text-emerald-300/50 mt-1 uppercase tracking-widest">Education & Intellect</p>
                  </div>
                </div>
                <div id="d24-chart" className="aspect-square w-full opacity-90 flex items-center justify-center">
                  <EastIndianChart 
                    planets={[]}
                    cusps={[
                      { houseNumber: 1, signName: "", signLord: "", degree: 0, signIndex: chartData.d24AscSignIndex || 1 },
                      { houseNumber: 2, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) % 12) + 1 },
                      { houseNumber: 3, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 1) % 12 + 1 },
                      { houseNumber: 4, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 2) % 12 + 1 },
                      { houseNumber: 5, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 3) % 12 + 1 },
                      { houseNumber: 6, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 4) % 12 + 1 },
                      { houseNumber: 7, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 5) % 12 + 1 },
                      { houseNumber: 8, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 6) % 12 + 1 },
                      { houseNumber: 9, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 7) % 12 + 1 },
                      { houseNumber: 10, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 8) % 12 + 1 },
                      { houseNumber: 11, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 9) % 12 + 1 },
                      { houseNumber: 12, signName: "", signLord: "", degree: 0, signIndex: ((chartData.d24AscSignIndex || 1) + 10) % 12 + 1 },
                    ]}
                    vargaHouses={chartData.d24Houses}
                    width={350} height={350}
                    showOm={false}
                    centerTitle={`Lagna ${chartData.d24AscSignIndex || ''}`}
                  />
                </div>
              </motion.div>
            )}"""

if navamsa_block in content:
    content = content.replace(navamsa_block, navamsa_block + "\n\n" + d10_d24_blocks)
else:
    print("Could not find exact Navamsa block to inject after.")

with open('src/components/KundliDashboardView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("D10 and D24 injected into correct Sidebar location.")
