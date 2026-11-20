const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ path: './server/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const count = await Product.countDocuments();
  console.log('Total products in MongoDB:', count);
  
  const all = await Product.find({}, { name: 1, productUrl: 1, retailer: 1, categoryName: 1, imageUrl: 1 }).lean();
  let unverifiedCount = 0;
  let invalidUrlCount = 0;
  let missingImageCount = 0;
  
  const broken = [];

  for (const p of all) {
    const isVerified = p.retailer?.verified === true;
    const url = p.productUrl || p.retailer?.website;
    const isValid = url && url.startsWith('https://') && url !== '#' && !url.includes('placeholder') && !url.includes('example.com');
    const hasImage = p.imageUrl && p.imageUrl.startsWith('http');
    
    if (!isVerified) unverifiedCount++;
    if (!isValid) invalidUrlCount++;
    if (!hasImage) missingImageCount++;
    
    if (!isVerified || !isValid || !hasImage) {
      broken.push({
        id: p._id,
        name: p.name,
        category: p.categoryName,
        url,
        verified: p.retailer?.verified,
        hasImage: !!hasImage
      });
    }
  }

  console.log('Unverified count:', unverifiedCount);
  console.log('Invalid/missing URL count:', invalidUrlCount);
  console.log('Missing/broken image count:', missingImageCount);
  console.log('First 10 broken/unverified products:');
  console.log(JSON.stringify(broken.slice(0, 10), null, 2));

  // Check categories present
  const categories = [...new Set(all.map(p => p.categoryName))];
  console.log('\nCategories in DB:', categories);

  await mongoose.disconnect();
}

check().catch(console.error);
