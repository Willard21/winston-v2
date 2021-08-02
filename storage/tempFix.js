const fs = require('fs');

// Load
let cotdData = JSON.parse(fs.readFileSync('./cotd.json', 'utf8'))

// Remove empty suggestions
cotdData.suggestions['485'] = cotdData.suggestions['485'].filter(s => s.content.length > 1)

// Save
fs.writeFileSync('./cotd.json', JSON.stringify(cotdData, null, 2));
console.log(`Fixed`);

