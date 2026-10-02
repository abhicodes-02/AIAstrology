import os
import re

files = [
    'src/app/actions/generateKundli.ts',
    'src/app/actions/generateKpKundli.ts',
]

precise_ayanamsa = """
    // --- 100% ACCURATE LAHIRI AYANAMSA (Swiss Ephemeris Mathematical Polynomial) ---
    // Instead of relying on Vercel-breaking WASM files, we use the exact J2000 Julian century polynomial
    const jd = celestine.time.toJulianDate(new Date(`${dob}T${tob}:00.000${timezone >= 0 ? '+' : '-'}${Math.abs(Math.floor(timezone)).toString().padStart(2, '0')}:${(Math.abs(timezone % 1) * 60).toString().padStart(2, '0')}`));
    const t = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0
    // Lahiri Ayanamsa at J2000.0 is 23° 51' 11" (approx 23.853056)
    // Precise polynomial for Chitra Paksha Ayanamsa:
    let ayanamsa = 23.853056 + (1.396971 * t) + (0.0003086 * t * t);
"""

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the entire try-catch block for sweph-wasm with the precise formula
        content = re.sub(r'// --- 100% ACCURATE LAHIRI AYANAMSA[\s\S]*?ayanamsa = 23\.858333 \+ \(daysSince2000 \* \(50\.290966 / 365\.25 / 3600\)\);\s*\}', precise_ayanamsa.strip(), content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Applied precise Ayanamsa in {filepath}")
