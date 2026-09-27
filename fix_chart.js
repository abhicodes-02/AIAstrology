const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'EastIndianChart.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/Lagna \{cusps\.find\(c => c\.houseNumber === 1\)\?\.degreeStr \|\| ""\}/g, 'Asc');
content = content.replace(/\{romanNumerals\[cusp\.houseNumber\]\} \{cusp\.degreeStr \? cusp\.degreeStr : ''\}/g, '{romanNumerals[cusp.houseNumber]}');
// Watch out for the weird 'Ar' or other corrupted things, let's just replace the whole planet map
content = content.replace(/\{signPlanets\.map\(p => \`\$\{p\.name\.substring\(0,2\)\}\$\{p\.isRetrograde \? "Ar" : ""\} \$\{p\.degreeStr \|\| ''\}\`\.trim\(\)\)\.join\(" "\)\}/g, '{signPlanets.map(p => `${p.name.substring(0,2)}${p.isRetrograde ? "(R)" : ""}`.trim()).join(" ")}');
// Another pass with wildcard for the corrupted 'Ar' and degreeStr
content = content.replace(/\{signPlanets\.map\(p => [^\}]+\}\)/g, '{signPlanets.map(p => `${p.name.substring(0,2)}${p.isRetrograde ? "(R)" : ""}`.trim()).join(" ")}');


fs.writeFileSync(filePath, content, 'utf8');
console.log("Done");
