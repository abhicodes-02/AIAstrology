const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');

async function testRender() {
    // We can't easily SSR a complex Next.js client component with Framer Motion and Lucide outside of Next.js.
    // Instead, I'll fetch the HTML from the dev server and look for the content!
    const response = await fetch('http://localhost:3000/kp-kundli?name=Test&dob=2000-01-01&tob=12:00&pob=Kolkata');
    const html = await response.text();
    fs.writeFileSync('kp_render.html', html);
    console.log("HTML length:", html.length);
    console.log("Has 'KP Cosmic Blueprint':", html.includes('KP Cosmic Blueprint'));
    console.log("Has 'Ascendant (Lagna)':", html.includes('Ascendant (Lagna)'));
    console.log("Has 'Vimshottari Dasha (DBA)':", html.includes('Vimshottari Dasha (DBA)'));
}
testRender();
