import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix motion variants to prevent invisible page on hydration crash
    content = content.replace("hidden: { opacity: 0 },", "hidden: { opacity: 1 },")
    content = content.replace("hidden: { opacity: 0, y: 20 },", "hidden: { opacity: 1, y: 0 },")
    
    # Add suppressHydrationWarning to dates
    content = content.replace("<span className=\"text-white font-medium\">{new Date", "<span className=\"text-white font-medium\" suppressHydrationWarning>{new Date")
    content = content.replace("<p className=\"text-xl font-bold text-indigo-300\">\n                            {chartData.dashaData.currentAntardasha ? new Date", "<p className=\"text-xl font-bold text-indigo-300\" suppressHydrationWarning>\n                            {chartData.dashaData.currentAntardasha ? new Date")
    content = content.replace("<p className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`}>\n                                    {new Date", "<p className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`} suppressHydrationWarning>\n                                    {new Date")
    content = content.replace("<p className=\"text-xs text-slate-500\">{new Date", "<p className=\"text-xs text-slate-500\" suppressHydrationWarning>{new Date")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/components/KundliDashboardView.tsx')
fix_file('src/components/KpKundliDashboardView.tsx')

print("Fixed hydration and motion variants")
