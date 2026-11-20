const fs = require('fs');
const path = require('path');

const mockPath = path.resolve(__dirname, '../../client/src/data/mockData.ts');
let content = fs.readFileSync(mockPath, 'utf8');

const { NEW_AUDIO_PRODUCTS } = require('./enrich_and_update_products_data');

if (!content.includes('apple-airpods-max-space-gray')) {
  // Format the 10 products for TypeScript
  const tsItems = NEW_AUDIO_PRODUCTS.map(p => {
    return `  {\n` +
      `    id: '${p.slug}',\n` +
      `    name: '${p.name}',\n` +
      `    slug: '${p.slug}',\n` +
      `    tagline: '${p.tagline}',\n` +
      `    description: '${p.description.replace(/'/g, "\\'")}',\n` +
      `    categoryId: '${p.categoryId}',\n` +
      `    categoryName: '${p.categoryName}',\n` +
      `    price: ${p.price},\n` +
      `    originalPrice: ${p.originalPrice},\n` +
      `    currency: '${p.currency}',\n` +
      `    imageUrl: '${p.imageUrl}',\n` +
      `    retailer: {\n` +
      `      id: '${p.retailer.id}',\n` +
      `      name: '${p.retailer.name}',\n` +
      `      website: '${p.retailer.website}',\n` +
      `      verified: true\n` +
      `    },\n` +
      `    productUrl: '${p.productUrl}',\n` +
      `    tags: ${JSON.stringify(p.tags)},\n` +
      `    interests: ${JSON.stringify(p.interests)},\n` +
      `    occasions: ${JSON.stringify(p.occasions)},\n` +
      `    relationships: ${JSON.stringify(p.relationships)},\n` +
      `    personalities: ${JSON.stringify(p.personalities)},\n` +
      `    source: 'internal',\n` +
      `    availability: 'in_stock',\n` +
      `    lastVerifiedAt: '${p.lastVerifiedAt}',\n` +
      `    rating: ${p.rating},\n` +
      `    reviewCount: ${p.reviewCount},\n` +
      `    badge: '${p.badge}',\n` +
      `    serialNumber: '${p.serialNumber}',\n` +
      `    active: true\n` +
      `  }`;
  }).join(',\n');

  // Insert before the closing bracket of CURATED_PRODUCTS array
  // Find "export const CURATED_CATEGORIES"
  const catIdx = content.indexOf('export const CURATED_CATEGORIES');
  if (catIdx !== -1) {
    const beforeCat = content.slice(0, catIdx);
    const lastBracket = beforeCat.lastIndexOf('];');
    if (lastBracket !== -1) {
      content = content.slice(0, lastBracket) + ',\n' + tsItems + '\n];\n\n' + content.slice(catIdx);
    }
  }
}

// Replace any leftover '#' productUrl in mockData
content = content.replace(/productUrl:\s*'#'/g, "productUrl: 'https://www.google.com/search?q=luxury+gifting+artisan+official'");

fs.writeFileSync(mockPath, content, 'utf8');
console.log('Successfully updated client/src/data/mockData.ts!');
