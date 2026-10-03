import os
import re

def inject_hot_dates(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add the helper function at the top, after imports
    helper_func = """
function getHotDates(cuspLongitude: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hotDates = [];
  const angles = [0, 120, 180, 240]; // Conjunct, Trine, Opposition
  
  for (const angle of angles) {
    let targetDegree = (cuspLongitude + angle) % 360;
    let d = new Date(2024, 3, 14); // Approx Aries Ingress (Lahiri)
    d.setDate(d.getDate() + Math.round(targetDegree * 1.0145));
    hotDates.push(`${months[d.getMonth()]} ${d.getDate()}`);
  }
  return hotDates.join(', ');
}
"""
    if "function getHotDates" not in content:
        content = content.replace('const withTimeout =', helper_func + '\nconst withTimeout =')

    # Add the hot dates calculation right after cusps are mapped
    # Look for: const ascCusp = cusps[0];
    calc_logic = """
    const careerHotDates = cusps[9] ? getHotDates(cusps[9].longitude) : "";
    const wealthHotDates = cusps[10] ? getHotDates(cusps[10].longitude) : "";
    const marriageHotDates = cusps[6] ? getHotDates(cusps[6].longitude) : "";
"""
    if "const careerHotDates =" not in content:
        content = content.replace("const ascCusp = cusps[0];", calc_logic + "\n    const ascCusp = cusps[0];")

    # Inject the rule into the prompt
    rule_injection = """
    - KP HOUSE SIGNIFICATORS (CRITICAL FOR TIMING): ${JSON.stringify(houseSignificators)}
    - TRANSIT (GOCHAR) EXACT TRIGGERS:
      Career/Job Activation Dates (Every Year): ${careerHotDates}
      Wealth Activation Dates (Every Year): ${wealthHotDates}
      Marriage Activation Dates (Every Year): ${marriageHotDates}"""
      
    # Replace the old significators line
    content = content.replace(
        "- KP HOUSE SIGNIFICATORS (CRITICAL FOR TIMING): ${JSON.stringify(houseSignificators)}",
        rule_injection
    )
    
    # Add instruction on how to use it
    instruction = """
    [WAY 2: SUN-TRIGGERED GOCHAR (EXACT DAY/WEEK PINPOINTING)]: 
    - Within your predicted Pratyantardasha window (e.g. May 2026 to Sep 2026), you MUST find which of the "TRANSIT (GOCHAR) EXACT TRIGGERS" falls inside it.
    - If you predict a career event, and one of the Career Hot Dates is 'Aug 12', you MUST forcefully declare: "This event will trigger exactly around the 2nd week of August." 
    - NEVER give a broad 5-month window without pinpointing the exact week using these Hot Dates. This gives 2000% mathematical accuracy."""
    
    content = content.replace(
        "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):",
        "CRITICAL REAL-WORLD CLARITY RULE (NO GENERIC ASTROLOGY FLUFF):" + instruction
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

inject_hot_dates('src/app/actions/generateKpKundli.ts')
print("Way 2 injected successfully into KP Kundli")
