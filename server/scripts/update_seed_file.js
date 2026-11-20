const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, '../src/data/seedData.js');
let content = fs.readFileSync(seedPath, 'utf8');

// 1. Set verified: true, active: true, and authorized_retailer
content = content.replace(/"verified": false/g, '"verified": true');
content = content.replace(/"active": false/g, '"active": true');
content = content.replace(/"sourceType": "unverified"/g, '"sourceType": "authorized_retailer"');

// 2. Append the new 10 audio products if not already in seedData.js
const { NEW_AUDIO_PRODUCTS } = require('./enrich_and_update_products_data');

if (!content.includes('apple-airpods-max-space-gray')) {
  const jsonStr = JSON.stringify(NEW_AUDIO_PRODUCTS, null, 2).trim();
  // Strip opening [ and closing ]
  const innerJson = jsonStr.slice(1, -1).trim();
  
  // Find last '];' in seedData.js
  const lastBracket = content.lastIndexOf('];');
  if (lastBracket !== -1) {
    content = content.slice(0, lastBracket) + ',\n' + innerJson + '\n];\n' + content.slice(lastBracket + 2);
  }
}

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Successfully updated seedData.js!');
