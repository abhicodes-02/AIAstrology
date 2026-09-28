const fs = require('fs');
const iconv = require('iconv-lite'); // Note: iconv-lite might not be installed. Let's just use Node's built-in Buffer if possible, or just read 'latin1'.

const files = [
    'src/app/actions/generateKundli.ts',
    'src/app/actions/generateKpKundli.ts',
    'src/app/actions/generateVarshaphal.ts'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        // Read raw buffer
        const buf = fs.readFileSync(file);
        
        // Try decoding as latin1 (which is what Windows-1252 ANSI roughly maps to in node for the • char)
        let content = buf.toString('latin1');
        
        // The bullet character '•' in Windows-1252 is 0x95. In latin1 it's \x95.
        // Let's just blindly replace 0x95 with '-' (a standard dash).
        // And also replace the weird 'â€¢' if it was double encoded.
        content = content.replace(/\x95/g, '-');
        content = content.replace(/â€¢/g, '-');
        content = content.replace(/•/g, '-');
        
        // Let's also make sure we rewrite it safely as UTF-8
        fs.writeFileSync(file, content, 'utf8');
        console.log("Fixed encoding for", file);
    }
}
