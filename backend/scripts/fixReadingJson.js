const fs = require('fs');
const path = require('path');

const READING_DIR = path.join(__dirname, '../../Reading');

const files = fs.readdirSync(READING_DIR).filter(f => f.endsWith('.txt'));

files.forEach(file => {
    const filePath = path.join(READING_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Attempt to fix common "lazy JSON" issues:
    // 1. Newlines in strings: Find "property": "value" where value spans lines
    // This is tricky with regex. Let's try to match content blocks specifically.
    
    // Simplest approach: Replace raw newlines that occur between a colon-quote and a trailing quote-comma/bracket
    // Actually, let's just use a state-machine or a simpler heuristic for these specific files.
    
    // Heuristic for these files: 
    // Find strings like "content": "..." and replace internal newlines with \n
    content = content.replace(/"content":\s*"([^"]*)"/gs, (match, p1) => {
        const fixed = p1.replace(/\r?\n/g, '\\n').replace(/"/g, '\\"');
        return `"content": "${fixed}"`;
    });

    // Also fix internal quotes in other fields if any
    // But be careful not to break the JSON structure.
    
    // Let's try to parse it. if it fails, maybe we need to be more aggressive.
    try {
        JSON.parse(content);
        console.log(`${file} is now valid JSON.`);
        fs.writeFileSync(filePath, content);
    } catch (e) {
        console.log(`${file} still invalid after basic fix: ${e.message}`);
        // Partial fix: manually escape quotes in "text" and "title" if they cause issues
        // (This is a bit risky)
    }
});
