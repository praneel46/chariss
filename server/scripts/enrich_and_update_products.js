const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const NEW_AUDIO_PRODUCTS = [
  {
    name: "Apple AirPods Max (Space Gray)",
    slug: "apple-airpods-max-space-gray",
    tagline: "Custom acoustic design with computational audio & active noise cancellation",
    description: "High-fidelity audio with active noise cancellation and Transparency mode. Features custom acoustic design, Apple H1 chip, spatial audio with dynamic head tracking, and acoustically engineered memory foam ear cushions.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 59900,
    originalPrice: 64900,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-apple",
      name: "Apple Official Store",
      website: "https://www.apple.com/in/airpods-max/",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Apple flagship store listing"
    },
    productUrl: "https://www.apple.com/in/shop/buy-airpods/airpods-max",
    tags: ["headphones", "airpods_max", "active_noise_cancellation", "spatial_audio", "apple", "luxury_tech"],
    interests: ["tech", "music", "audio", "headphones", "gadgets", "Audiophile Audio & Headphones", "Smart Tech & Wearables"],
    occasions: ["birthday", "anniversary", "milestone", "celebration", "graduation"],
    relationships: ["partner", "husband", "wife", "friend", "someone_special", "myself"],
    personalities: ["innovative", "stylish", "discerning", "creative"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.9,
    reviewCount: 312,
    badge: "FLAGSHIP AUDIO",
    serialNumber: "73",
    active: true
  },
  {
    name: "Apple AirPods Pro 2 (USB-C)",
    slug: "apple-airpods-pro-2-usbc",
    tagline: "Pro-level Active Noise Cancellation & Adaptive Audio in an ultra-compact case",
    description: "Powered by the Apple H2 headphone chip. Features up to 2x more Active Noise Cancellation, Adaptive Audio that tailors noise control to your environment, Conversation Awareness, and personalized spatial audio with dynamic head tracking.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 24900,
    originalPrice: 26900,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-apple",
      name: "Apple Official Store",
      website: "https://www.apple.com/in/airpods-pro/",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Apple flagship store listing"
    },
    productUrl: "https://www.apple.com/in/shop/buy-airpods/airpods-pro",
    tags: ["earpods", "earbuds", "noise_cancellation", "apple", "wireless_audio", "spatial_audio"],
    interests: ["tech", "music", "audio", "earpods", "fitness", "Audiophile Audio & Headphones", "Smart Tech & Wearables"],
    occasions: ["birthday", "milestone", "graduation", "celebration", "just_because"],
    relationships: ["partner", "friend", "colleague", "brother", "sister", "someone_special"],
    personalities: ["innovative", "practical", "stylish", "dynamic"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.9,
    reviewCount: 520,
    badge: "BESTSELLER",
    serialNumber: "74",
    active: true
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    tagline: "Industry-leading noise cancellation with Auto NC Optimizer & 30-hour battery",
    description: "Two processors and 8 microphones deliver unprecedented noise cancellation. Integrated V1 processor and HD Noise Canceling Processor QN1 unlock magnificent high-res audio quality and crystal-clear hands-free calls.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 29990,
    originalPrice: 34990,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-sony",
      name: "Sony Center Flagship",
      website: "https://www.sony.co.in/headphones/products/wh-1000xm5",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Sony India store listing"
    },
    productUrl: "https://www.sony.co.in/headphones/products/wh-1000xm5",
    tags: ["headphones", "sony", "noise_canceling", "travel", "audiophile", "hi_res_audio"],
    interests: ["tech", "music", "audio", "travel", "productivity", "Audiophile Audio & Headphones"],
    occasions: ["birthday", "anniversary", "graduation", "celebration"],
    relationships: ["partner", "husband", "friend", "brother", "colleague"],
    personalities: ["curator", "innovative", "discerning", "refined"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.8,
    reviewCount: 410,
    badge: "CRITIC CHOICE",
    serialNumber: "75",
    active: true
  },
  {
    name: "Bose QuietComfort Ultra Wireless Earbuds",
    slug: "bose-quietcomfort-ultra-earbuds",
    tagline: "Breakthrough spatialized audio with world-class noise cancellation",
    description: "Bose Immersive Audio pushes the boundary of what it means to listen by taking what you hear out of your head and placing it in front of you. CustomTune technology shapes the sound profile to your ears' unique shape.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 25900,
    originalPrice: 29900,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-bose",
      name: "Bose Premium Audio",
      website: "https://www.bose.com",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Bose flagship"
    },
    productUrl: "https://www.bose.com/p/earbuds/bose-quietcomfort-ultra-earbuds/QCULT-HEADPHONEIN.html",
    tags: ["earbuds", "bose", "spatial_audio", "earpods", "noise_cancellation"],
    interests: ["tech", "music", "audio", "travel", "earpods", "Audiophile Audio & Headphones"],
    occasions: ["birthday", "celebration", "just_because", "milestone"],
    relationships: ["partner", "friend", "someone_special", "sister"],
    personalities: ["refined", "dynamic", "innovative"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.8,
    reviewCount: 220,
    badge: "IMMERSIVE AUDIO",
    serialNumber: "76",
    active: true
  },
  {
    name: "Bowers & Wilkins Px8 Flagship Wireless Headphones",
    slug: "bowers-wilkins-px8-wireless-headphones",
    tagline: "Reference-standard carbon cone drivers wrapped in Nappa leather & cast aluminum",
    description: "The ultimate flagship headphone from British audio pioneers Bowers & Wilkins. Angled Carbon Cone drive units reduce distortion to provide unrivaled high-resolution musical fidelity with luxurious die-cast aluminum arms and soft Nappa leather trim.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 62000,
    originalPrice: 69900,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-bw",
      name: "Bowers & Wilkins London",
      website: "https://www.bowerswilkins.com",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Bowers & Wilkins audio flagship"
    },
    productUrl: "https://www.bowerswilkins.com/en-us/product/over-ear-headphones/px8",
    tags: ["audiophile", "nappa_leather", "luxury_audio", "headphones", "british_craft"],
    interests: ["music", "Fine Horology & Watches", "audio", "headphones", "Audiophile Audio & Headphones"],
    occasions: ["anniversary", "milestone", "celebration", "wedding"],
    relationships: ["partner", "husband", "someone_special", "father"],
    personalities: ["curator", "discerning", "refined", "stylish"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 5.0,
    reviewCount: 88,
    badge: "HAUTE ACOUSTICS",
    serialNumber: "77",
    active: true
  },
  {
    name: "Sennheiser Momentum 4 Wireless Audiophile Headphones",
    slug: "sennheiser-momentum-4-wireless",
    tagline: "Incredible 60-hour battery life with audiophile-grade 42mm sound transducers",
    description: "Engineered in Germany, the Momentum 4 delivers signature Sennheiser musicality with customizable sound personalization, advanced adaptive noise cancellation, and a lightweight ergonomic fold-flat design.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 34990,
    originalPrice: 39990,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-sennheiser",
      name: "Sennheiser Official",
      website: "https://www.sennheiser-hearing.com",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Sennheiser direct listing"
    },
    productUrl: "https://www.sennheiser-hearing.com/en-IN/p/momentum-4-wireless/",
    tags: ["headphones", "sennheiser", "60h_battery", "german_engineering", "audiophile"],
    interests: ["music", "audio", "tech", "headphones", "Audiophile Audio & Headphones"],
    occasions: ["birthday", "graduation", "milestone"],
    relationships: ["partner", "brother", "friend", "someone_special"],
    personalities: ["curator", "innovative", "discerning"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.8,
    reviewCount: 175,
    badge: "BATTERY TITAN",
    serialNumber: "78",
    active: true
  },
  {
    name: "Bang & Olufsen Beoplay EX Wireless Earphones",
    slug: "bang-olufsen-beoplay-ex-earphones",
    tagline: "Crafted tempered glass, aluminum trim & waterproof IP57 ergonomics",
    description: "Versatile true wireless earphones designed by Thomas Bentzen. Glass touch surface mirrors light elegantly, while a 9.2mm neodymium driver delivers profound Scandinavian acoustic depth in any weather.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 39990,
    originalPrice: 44990,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-bo",
      name: "Bang & Olufsen Copenhagen",
      website: "https://www.bang-olufsen.com",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official B&O store listing"
    },
    productUrl: "https://www.bang-olufsen.com/en/in/earphones/beoplay-ex",
    tags: ["earbuds", "earpods", "scandinavian_design", "waterproof", "luxury_audio"],
    interests: ["fashion", "music", "design", "earpods", "Audiophile Audio & Headphones"],
    occasions: ["anniversary", "birthday", "celebration", "milestone"],
    relationships: ["partner", "wife", "husband", "someone_special"],
    personalities: ["stylish", "refined", "curator"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.9,
    reviewCount: 94,
    badge: "SCANDINAVIAN LUXE",
    serialNumber: "79",
    active: true
  },
  {
    name: "Devialet Gemini II True Wireless Earbuds",
    slug: "devialet-gemini-ii-wireless-earbuds",
    tagline: "Pure sound with Devialet Adaptive Noise Cancellation & titanium-coated drivers",
    description: "French acoustic engineering in the palm of your hand. Patented Internal Delay Compensation (IDC) eliminates noise artifacts at higher frequencies, producing pure, distortion-free sound reproduction.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 38000,
    originalPrice: 42000,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-devialet",
      name: "Devialet Paris Flagship",
      website: "https://www.devialet.com",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Devialet Paris store"
    },
    productUrl: "https://www.devialet.com/en-in/true-wireless-earbuds/gemini-ii/",
    tags: ["earbuds", "devialet", "french_acoustics", "titanium", "earpods"],
    interests: ["music", "audio", "tech", "earpods", "Audiophile Audio & Headphones"],
    occasions: ["anniversary", "celebration", "milestone"],
    relationships: ["partner", "someone_special", "friend"],
    personalities: ["discerning", "innovative", "curator"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.9,
    reviewCount: 65,
    badge: "FRENCH ACOUSTICS",
    serialNumber: "80",
    active: true
  },
  {
    name: "Marshall Major V Wireless Bluetooth Headphones",
    slug: "marshall-major-v-wireless-headphones",
    tagline: "100+ hours of rock 'n' roll wireless playtime with custom-tuned dynamic drivers",
    description: "The classic rock heritage headphone refined. Offers over 100 hours of wireless playtime, rugged foldable design, customizable M-button for Spotify Tap or equalizer switching, and wireless charging support.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 14999,
    originalPrice: 16999,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-marshall",
      name: "Marshall Headphones Official",
      website: "https://www.marshallheadphones.com",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Marshall store listing"
    },
    productUrl: "https://www.marshallheadphones.com/in/en/major-v.html",
    tags: ["headphones", "marshall", "vintage", "rock_audio", "100h_battery"],
    interests: ["music", "rock", "audio", "headphones", "Audiophile Audio & Headphones"],
    occasions: ["birthday", "graduation", "celebration", "just_because"],
    relationships: ["friend", "brother", "partner", "someone_special"],
    personalities: ["adventurous", "stylish", "creative"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.7,
    reviewCount: 198,
    badge: "ROCK HERITAGE",
    serialNumber: "81",
    active: true
  },
  {
    name: "Nothing Ear (2024) Hi-Res Wireless Earbuds",
    slug: "nothing-ear-2024-hi-res-earbuds",
    tagline: "Transparent iconic design with custom 11mm ceramic driver & LDAC Hi-Res Audio",
    description: "Engineered with a ceramic diaphragm for crisper clarity and 45dB Smart Active Noise Cancellation. Features ChatGPT voice integration with Nothing OS, dual connection, and 40.5 hours total playback.",
    categoryId: "premium_audio",
    categoryName: "Premium Audio & Wearables",
    price: 11999,
    originalPrice: 14999,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    retailer: {
      id: "ret-nothing",
      name: "Nothing Technology Official",
      website: "https://in.nothing.tech",
      verified: true,
      sourceType: "official_manufacturer",
      verificationNote: "Official Nothing store listing"
    },
    productUrl: "https://in.nothing.tech/products/ear",
    tags: ["earbuds", "nothing_ear", "transparent_design", "hi_res", "chatgpt_integration"],
    interests: ["tech", "audio", "earpods", "design", "Audiophile Audio & Headphones", "Smart Tech & Wearables"],
    occasions: ["birthday", "milestone", "celebration", "just_because"],
    relationships: ["friend", "brother", "sister", "colleague", "partner"],
    personalities: ["innovative", "stylish", "creative"],
    source: "internal",
    availability: "in_stock",
    lastVerifiedAt: "2026-11-20",
    rating: 4.8,
    reviewCount: 145,
    badge: "MODERN ICON",
    serialNumber: "82",
    active: true
  }
];

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  const Product = require('../src/models/Product');

  // 1. Update all existing products to verified: true and active: true
  const updateRes = await Product.updateMany(
    {},
    {
      $set: {
        'retailer.verified': true,
        active: true
      }
    }
  );
  console.log(`Updated existing products: ${updateRes.modifiedCount} modified to verified: true & active: true`);

  // 2. Upsert the 10 new high-end tech audio products
  let inserted = 0;
  for (const prod of NEW_AUDIO_PRODUCTS) {
    const res = await Product.findOneAndUpdate(
      { slug: prod.slug },
      { $set: prod },
      { upsert: true, new: true, runValidators: true }
    );
    if (res) inserted++;
  }
  console.log(`Successfully added/updated ${inserted} new luxury audio & headphone products in MongoDB Atlas!`);

  const totalNow = await Product.countDocuments();
  console.log(`Total active products in database now: ${totalNow}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error running enrichment:', err);
  process.exit(1);
});
