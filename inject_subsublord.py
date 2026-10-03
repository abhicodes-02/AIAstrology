import os
import re

def update_kp_astrology(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the getKpDetailsForLongitude function
    pattern_func = r"(\s*)export function getKpDetailsForLongitude\(longitude: number\): KpSubLordInfo \{.*?return \{(.*?)\};\s*\}"

    def replacer(match):
        indent = match.group(1)
        body = match.group(0)
        
        # We need to extract the matching segment to calculate subSubLord
        # Let's replace the `for` loop that finds the subLord
        
        old_loop = """  let subLord = starLord;
  for (const seg of table) {
    if (lon >= seg.startLon - 1e-7 && lon < seg.endLon + 1e-7) {
      subLord = seg.subLord;
      break;
    }
  }"""
  
        new_loop = """  let subLord = starLord;
  let subSubLord = starLord;
  
  for (const seg of table) {
    if (lon >= seg.startLon - 1e-7 && lon < seg.endLon + 1e-7) {
      subLord = seg.subLord;
      
      // Calculate Sub-Sub Lord (K. Baskaran's Way 3)
      // The Sub Lord span is divided among 9 planets in Vimshottari proportion, starting from the Sub Lord
      const subSpan = seg.endLon - seg.startLon;
      const subLordIdx = DASHA_ORDER.findIndex(d => d.lord === subLord);
      let sslOffset = 0;
      let lonOffsetInsideSub = lon - seg.startLon;
      
      for (let i = 0; i < 9; i++) {
        const sslIdx = (subLordIdx + i) % 9;
        const sslInfo = DASHA_ORDER[sslIdx];
        const sslSpan = (subSpan * sslInfo.years) / 120;
        
        if (lonOffsetInsideSub >= sslOffset - 1e-7 && lonOffsetInsideSub < sslOffset + sslSpan + 1e-7) {
          subSubLord = sslInfo.lord;
          break;
        }
        sslOffset += sslSpan;
      }
      
      break;
    }
  }"""

        body = body.replace(old_loop, new_loop)
        
        # Now add subSubLord to the return object
        body = body.replace("subLord\n    };", "subLord,\n      subSubLord\n    };")
        
        return body

    content = re.sub(pattern_func, replacer, content, flags=re.DOTALL)
    
    # We also need to add subSubLord to KpCusp and KpPlanet interfaces so the frontend and backend actions can see it
    content = content.replace("subLord: string;\n  isIndependent?: boolean;", "subLord: string;\n  subSubLord?: string;\n  isIndependent?: boolean;")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_kp_astrology('src/lib/kpAstrology.ts')
print("Injected Sub-Sub Lord logic (Way 3) into KP Astrology engine")
