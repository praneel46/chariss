import type { Product, OccasionItem, CardTemplate } from '../types';

export const CURATED_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Wildflower Amber Honey & Brass Dipper Set',
    slug: 'wildflower-amber-honey-brass-dipper',
    tagline: 'Raw forest honey with handcrafted spun-brass server',
    description: 'Harvested in small batches from high-altitude wild flora. Accompanied by a bespoke solid brass dipper cast by master metal smiths.',
    categoryId: 'wellness_gourmet',
    categoryName: 'Gourmet & Wellness',
    price: 1850,
    originalPrice: 2200,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    retailer: {
      id: 'ret-01',
      name: 'Forest Botanica',
      website: 'https://forestbotanica.com',
      verified: true
    },
    productUrl: 'https://example.com/p/forest-honey',
    tags: ['organic', 'handcrafted', 'artisanal', 'wellness'],
    interests: ['culinary', 'wellness', 'nature', 'tea'],
    occasions: ['birthday', 'thank_you', 'housewarming', 'just_because'],
    relationships: ['friend', 'colleague', 'mother', 'mentor'],
    personalities: ['thoughtful', 'epicurean', 'calm'],
    source: 'internal',
    availability: 'in_stock',
    lastVerifiedAt: '2026-11-08',
    rating: 4.9,
    reviewCount: 142,
    badge: '20% OFF',
    serialNumber: '01'
  },
  {
    id: 'prod-02',
    name: 'Hand-Poured Sandalwood & Fig Beeswax Vessel',
    slug: 'sandalwood-fig-beeswax-candle',
    tagline: 'Pure golden beeswax with double cotton wick',
    description: 'Naturally filtered beeswax that purifies the air as it glows. Scented with wild Mysore sandalwood and sun-ripened Mediterranean fig leaves.',
    categoryId: 'home_decor',
    categoryName: 'Home Ambiance',
    price: 1450,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    retailer: {
      id: 'ret-02',
      name: 'Maison Lumens',
      website: 'https://maisonlumens.com',
      verified: true
    },
    productUrl: 'https://example.com/p/beeswax-candle',
    tags: ['beeswax', 'aromatherapy', 'sustainable', 'minimalist'],
    interests: ['interior_design', 'reading', 'relaxation', 'meditation'],
    occasions: ['anniversary', 'housewarming', 'birthday', 'celebration'],
    relationships: ['partner', 'best_friend', 'sibling'],
    personalities: ['aesthetic', 'calm', 'cozy'],
    source: 'internal',
    availability: 'in_stock',
    lastVerifiedAt: '2026-11-08',
    rating: 4.8,
    reviewCount: 98,
    badge: 'LIMITED EDITION',
    serialNumber: '02'
  },
  {
    id: 'prod-03',
    name: 'Linen Bound Journal & Brass Rollerball',
    slug: 'linen-bound-journal-brass-pen',
    tagline: '160gsm bamboo paper bound in undyed raw Belgian linen',
    description: 'Designed for daily reflections and keepsake thoughts. Lies completely flat with ribbon marker and includes a heavyweight solid raw brass rollerball pen.',
    categoryId: 'stationery',
    categoryName: 'Fine Stationery',
    price: 2100,
    originalPrice: 2450,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    retailer: {
      id: 'ret-03',
      name: 'Paper & Tone',
      website: 'https://paperandtone.co',
      verified: true
    },
    productUrl: 'https://example.com/p/linen-journal',
    tags: ['stationery', 'journaling', 'keepsake', 'heirloom'],
    interests: ['writing', 'creativity', 'poetry', 'planning'],
    occasions: ['new_beginnings', 'birthday', 'graduation', 'milestone'],
    relationships: ['best_friend', 'daughter', 'self', 'colleague'],
    personalities: ['introspective', 'creative', 'organized'],
    source: 'internal',
    availability: 'in_stock',
    lastVerifiedAt: '2026-11-08',
    rating: 5.0,
    reviewCount: 76,
    badge: 'STAFF PICK',
    serialNumber: '03'
  },
  {
    id: 'prod-04',
    name: 'Ceramic Pour-Over & Kinfolk Slow Coffee Dripper',
    slug: 'ceramic-pour-over-slow-coffee',
    tagline: 'Stoneware matte glaze with Japanese ribbed interior',
    description: 'Hand-thrown speckled stoneware dripper with micro-grooves that extract the subtle floral notes of single-origin beans.',
    categoryId: 'lifestyle',
    categoryName: 'Slow Living',
    price: 2600,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    retailer: {
      id: 'ret-04',
      name: 'Kanso Ceramics',
      website: 'https://kansoceramics.com',
      verified: true
    },
    productUrl: 'https://example.com/p/pour-over',
    tags: ['coffee', 'ceramics', 'slow_morning', 'artisan'],
    interests: ['coffee', 'design', 'craft', 'culinary'],
    occasions: ['birthday', 'wedding', 'housewarming', 'thank_you'],
    relationships: ['partner', 'brother', 'friend', 'father'],
    personalities: ['methodical', 'epicurean', 'design_lover'],
    source: 'internal',
    availability: 'in_stock',
    lastVerifiedAt: '2026-11-08',
    rating: 4.9,
    reviewCount: 114,
    badge: 'POPULAR',
    serialNumber: '04'
  },
  {
    id: 'prod-05',
    name: 'Botanical Lip Balm Trio in Wooden Casket',
    slug: 'botanical-lip-balm-trio',
    tagline: 'Shea butter, meadowfoam & cold-pressed bergamot',
    description: 'Three nourishing salves crafted with wild golden beeswax, organic sweet almond oil, and sun-dried herb infusions in pocket brass pots.',
    categoryId: 'wellness_gourmet',
    categoryName: 'Personal Care',
    price: 950,
    originalPrice: 1200,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    retailer: {
      id: 'ret-01',
      name: 'Forest Botanica',
      website: 'https://forestbotanica.com',
      verified: true
    },
    productUrl: 'https://example.com/p/balm-trio',
    tags: ['skincare', 'clean_beauty', 'pocket_luxury', 'natural'],
    interests: ['beauty', 'wellness', 'self_care'],
    occasions: ['just_because', 'birthday', 'thank_you'],
    relationships: ['sister', 'best_friend', 'colleague'],
    personalities: ['gentle', 'caring', 'naturalist'],
    source: 'internal',
    availability: 'in_stock',
    lastVerifiedAt: '2026-11-08',
    rating: 4.7,
    reviewCount: 63,
    badge: 'BESTSELLER',
    serialNumber: '05'
  },
  {
    id: 'prod-06',
    name: 'The Keepsake Curated Box Set',
    slug: 'the-keepsake-curated-box-set',
    tagline: 'Ribboned rigid gift box with honey, votive & linen card',
    description: 'Our signature gifting ensemble. Includes the wild honey jar, brass dipper, beeswax mini-vessel, and an embossed letterpress card hand-written by our studio.',
    categoryId: 'gift_sets',
    categoryName: 'Signature Bundles',
    price: 3850,
    originalPrice: 4400,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    retailer: {
      id: 'ret-05',
      name: 'CHARIS Private Reserve',
      website: 'https://charisgifts.in',
      verified: true
    },
    productUrl: 'https://charisgifts.in/box/keepsake',
    tags: ['gift_box', 'complete_experience', 'signature', 'heirloom'],
    interests: ['lifestyle', 'elegance', 'celebration'],
    occasions: ['anniversary', 'wedding', 'milestone', 'deep_gratitude'],
    relationships: ['partner', 'parents', 'cherished_friend'],
    personalities: ['sentimental', 'refined', 'generous'],
    source: 'internal',
    availability: 'in_stock',
    lastVerifiedAt: '2026-11-08',
    rating: 5.0,
    reviewCount: 205,
    badge: 'EDITOR FAVORITE',
    serialNumber: '06'
  }
];

export const OCCASIONS_DATA: OccasionItem[] = [
  {
    id: 'occ-01',
    slug: 'birthday',
    title: 'Thoughtful Birthdays',
    subtitle: 'Celebrate the individual',
    description: 'Gifts tailored to unique quirks, cherished passions, and the year ahead.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    popularCategories: ['Fine Stationery', 'Slow Living', 'Personalized'],
    colorAccent: '#FAF9F6',
    tag: 'Celebration'
  },
  {
    id: 'occ-02',
    slug: 'anniversary',
    title: 'Cherished Anniversaries',
    subtitle: 'Honoring shared memories',
    description: 'Heirloom keepsakes, sensory vessels, and intimate notes that mark another year of partnership.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
    popularCategories: ['Signature Bundles', 'Home Ambiance'],
    colorAccent: '#EDE5DA',
    tag: 'Romance'
  },
  {
    id: 'occ-03',
    slug: 'thank-you',
    title: 'Quiet Gratitude',
    subtitle: 'When words need tangible weight',
    description: 'A genuine gesture of thanks that honors the favor, support, and presence of someone special.',
    imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    popularCategories: ['Gourmet & Wellness', 'Botanical'],
    colorAccent: '#DDE7DD',
    tag: 'Gratitude'
  },
  {
    id: 'occ-04',
    slug: 'just-because',
    title: 'Just Because',
    subtitle: 'The best surprise is unprompted',
    description: 'Delightful surprises that require no special date — simply a reminder that they are in your thoughts.',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    popularCategories: ['Sweet Luxuries', 'Tea & Coffee'],
    colorAccent: '#E9D9DD',
    tag: 'Spontaneous'
  },
  {
    id: 'occ-05',
    slug: 'housewarming',
    title: 'Warm Welcomes',
    subtitle: 'Sanctuary foundations',
    description: 'Objects that turn four walls into a peaceful, sensory sanctuary for friends stepping into new chapters.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    popularCategories: ['Home Ambiance', 'Ceramics'],
    colorAccent: '#DCCFC1',
    tag: 'Home'
  }
];

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'tmpl-01',
    name: 'Minimal Warm Botanical',
    theme: 'minimal_floral',
    bgClass: 'bg-[#FAF9F6] border-[#DCCFC1]',
    borderColor: '#DCCFC1',
    textColor: '#292820',
    accentColor: '#B69A78',
    fontFamily: 'serif',
    stampIcon: '🌿',
    previewNote: 'Delicate floral accents with ample quiet whitespace for heartfelt sentiments.'
  },
  {
    id: 'tmpl-02',
    name: 'Modern Editorial Sans',
    theme: 'modern_typography',
    bgClass: 'bg-[#EDE5DA] border-[#292820]',
    borderColor: '#292820',
    textColor: '#151419',
    accentColor: '#D4A359',
    fontFamily: 'sans',
    stampIcon: '✦',
    previewNote: 'Contemporary high-fashion aesthetic with bold numbering and crisp margins.'
  },
  {
    id: 'tmpl-03',
    name: 'Warm Rose Sentiment',
    theme: 'warm_editorial',
    bgClass: 'bg-[#F6EEED] border-[#E9D9DD]',
    borderColor: '#E9D9DD',
    textColor: '#292820',
    accentColor: '#B69A78',
    fontFamily: 'handwriting',
    stampIcon: '💌',
    previewNote: 'Soft pastel rose paper tone created specifically for intimate personal expressions.'
  },
  {
    id: 'tmpl-04',
    name: 'Dark Noir Keepsake',
    theme: 'quiet_luxury',
    bgClass: 'bg-[#151419] border-[#B69A78] text-[#FAF9F6]',
    borderColor: '#B69A78',
    textColor: '#FAF9F6',
    accentColor: '#E5A93C',
    fontFamily: 'serif',
    stampIcon: '⚜',
    previewNote: 'Dramatic high-contrast black & champagne gold palette for milestone moments.'
  }
];

export const TRUST_PILLARS = [
  {
    icon: 'Sparkles',
    title: 'Explainable AI Match',
    description: 'Every recommendation is backed by transparent emotional and personality rationale.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Verified Retailer Direct',
    description: 'Real products from vetted independent artisans and verified merchants with live pricing.'
  },
  {
    icon: 'Lock',
    title: 'Strict Privacy Sandbox',
    description: 'Consultation reflections are confidential. We never monetize or leak personal sentiments.'
  },
  {
    icon: 'HeartHandshake',
    title: 'Zero Pressure Gifting',
    description: 'No deceptive counters, fake timers, or dark patterns. Thoughtfulness comes first.'
  }
];

export const FAQS = [
  {
    question: 'How does CHARIS find the right gift?',
    answer: 'CHARIS uses an AI consultation engine to understand the recipient’s emotional connection to you, their personality traits, daily rituals, and your budget. It then filters and ranks verified inventory using a 4-factor scoring algorithm (interests, personality, occasion, and budget suitability).'
  },
  {
    question: 'Are the products and prices real?',
    answer: 'Yes, 100%. CHARIS does not invent products. All catalog items are real products from curated artisan shops and vetted merchants, with verified pricing and outbound direct checkout links.'
  },
  {
    question: 'Can I design a custom gift card?',
    answer: 'Yes! The CHARIS Create Studio lets you pick from bespoke editorial card templates, generate a tone-tailored message using AI (or write your own), customize typography, and export it as high-resolution PNG or PDF.'
  },
  {
    question: 'Can I use CHARIS anonymously without creating an account?',
    answer: 'Absolutely. You can complete the full AI consultation and explore recommendations as a guest. An account is only required when you want to save consultations, keep a permanent wishlist, or store card designs.'
  },
  {
    question: 'Do you scrape retailer sites or charge checkout fees?',
    answer: 'Never. We link directly out to approved partner merchants for checkout, with zero hidden markups or transaction fees.'
  }
];
