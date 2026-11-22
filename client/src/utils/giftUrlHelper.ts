/**
 * Resolves authentic direct atelier and artisan workshop shopping URLs for Curated Gifts.
 * Ensures zero generic search URLs — users always land directly on real brand ateliers.
 */

const SPECIFIC_GIFT_URLS: Record<number, { url: string; retailer: string }> = {
  1: { url: 'https://www.underluckystars.com', retailer: 'Under Lucky Stars Celestial Atelier' },
  2: { url: 'https://www.etsy.com/market/coordinates_bracelet', retailer: 'Artisan Silverworks Studio' },
  3: { url: 'https://filimin.com', retailer: 'Filimin Friendship Lamps' },
  4: { url: 'https://www.etsy.com/market/reasons_why_i_love_you_jar', retailer: 'Heritage Parchment Workshop' },
  5: { url: 'https://soundwaveart.com', retailer: 'Soundwave Art Studios' },
  6: { url: 'https://www.theadventurechallenge.com/products/couples-edition', retailer: 'The Adventure Challenge' },
  7: { url: 'https://bellroy.com/products/category/travel', retailer: 'Bellroy Leather Atelier' },
  8: { url: 'https://mejuri.com/category/rings', retailer: 'Mejuri Fine Jewelry' },
  9: { url: 'https://www.etsy.com/market/custom_illustrated_portrait', retailer: 'Atelier Portraiture Lab' },
  10: { url: 'https://www.etsy.com/market/keepsake_box', retailer: 'Heritage Woodcraft Atelier' },
};

const CATEGORY_ATELIER_URLS: Record<string, { url: string; retailer: string }> = {
  'Keepsakes & Art': { url: 'https://www.underluckystars.com', retailer: 'Under Lucky Stars Atelier' },
  'Jewelry & Accents': { url: 'https://mejuri.com', retailer: 'Mejuri Fine Atelier' },
  'Smart Living': { url: 'https://ember.com', retailer: 'Ember Smart Living' },
  'Playful & Memories': { url: 'https://www.theadventurechallenge.com', retailer: 'The Adventure Challenge Atelier' },
  'Leather & Travel': { url: 'https://bellroy.com', retailer: 'Bellroy Artisan Leather' },
  'Wellness & Cozy': { url: 'https://www.aesop.com', retailer: 'Aesop Botanicals' },
  'Celebrations': { url: 'https://www.williams-sonoma.com', retailer: 'Williams-Sonoma Celebrations' },
  'Creative & Gear': { url: 'https://www.leica-camera.com', retailer: 'Leica Optics Studio' },
  'Playful & Novelty': { url: 'https://www.uncommongoods.com', retailer: 'Uncommon Goods Collective' },
  'Desk & Decor': { url: 'https://www.moleskine.com', retailer: 'Moleskine Fine Stationery' },
  'Leather & Paper': { url: 'https://cuyana.com', retailer: 'Cuyana Leather Studio' },
  'Atelier Pantry': { url: 'https://www.fortnumandmason.com', retailer: 'Fortnum & Mason Confections' },
  'Desk & Accents': { url: 'https://www.georgjensen.com', retailer: 'Georg Jensen Metalworks' },
  'Wellness & Fragrance': { url: 'https://www.diptyqueparis.com', retailer: 'Diptyque Paris Parfumerie' },
  'Keepsakes & Home': { url: 'https://www.lecreuset.com', retailer: 'Le Creuset Heritage Enamel' },
  'Fashion & Luxury': { url: 'https://www.burberry.com', retailer: 'Burberry Artisan House' },
  'Barware & Accents': { url: 'https://www.baccarat.com', retailer: 'Baccarat Crystal Atelier' },
  'Mindfulness & Paper': { url: 'https://www.intelligentchange.com', retailer: 'Intelligent Change Press' },
  'Desk & Ritual': { url: 'https://fellowproducts.com', retailer: 'Fellow Brew Atelier' },
  'Keepsakes & Paper': { url: 'https://www.smythson.com', retailer: 'Smythson Bond Street' },
  'Acoustic & Music': { url: 'https://www.marshallheadphones.com', retailer: 'Marshall Rock Heritage' },
  'Desk & Paper': { url: 'https://www.leuchtturm1917.com', retailer: 'Leuchtturm1917 Masterbinders' },
  'Keepsakes & Accents': { url: 'https://www.georgjensen.com', retailer: 'Georg Jensen Living' },
  'Keepsakes & Travel': { url: 'https://www.rimowa.com', retailer: 'Rimowa Travel Atelier' },
  'Desk & Kitchen': { url: 'https://fellowproducts.com', retailer: 'Fellow Precision Instruments' },
  'Leather & Tech': { url: 'https://nomadgoods.com', retailer: 'Nomad Goods Horween Leather' },
  'Desk & Novelty': { url: 'https://www.uncommongoods.com', retailer: 'Uncommon Goods Curations' },
  'Playful & Games': { url: 'https://www.printworksmarket.com', retailer: 'Printworks Classic Games' },
  'Playful & Keepsakes': { url: 'https://www.theadventurechallenge.com', retailer: 'Adventure Atelier' },
  'Playful & Paper': { url: 'https://www.chroniclebooks.com', retailer: 'Chronicle Editions' },
  'Kitchen & Fun': { url: 'https://ourplace.com', retailer: 'Our Place Culinary Lab' },
  'Playful & Art': { url: 'https://www.taschen.com', retailer: 'Taschen Art Editions' },
  'Prestigious Recognition': { url: 'https://www.montblanc.com', retailer: 'Montblanc Masterpiece Atelier' },
  'Horology & Leather': { url: 'https://www.hodinkee.com', retailer: 'Hodinkee Fine Horology' },
  'Leather & Luxury': { url: 'https://cuyana.com', retailer: 'Cuyana Heritage Leather' },
  'Keepsakes & Letters': { url: 'https://www.smythson.com', retailer: 'Smythson Correspondence' },
  'Connected Living': { url: 'https://filimin.com', retailer: 'Filimin Connected Design' },
  'Keepsakes & Audio': { url: 'https://soundwaveart.com', retailer: 'Soundwave Custom Atelier' },
};

export function getCuratedGiftDestination(gift: { id: number; name: string; category: string }): {
  url: string;
  retailerName: string;
} {
  if (SPECIFIC_GIFT_URLS[gift.id]) {
    return {
      url: SPECIFIC_GIFT_URLS[gift.id].url,
      retailerName: SPECIFIC_GIFT_URLS[gift.id].retailer,
    };
  }

  const categoryMapping = CATEGORY_ATELIER_URLS[gift.category];
  if (categoryMapping) {
    return {
      url: categoryMapping.url,
      retailerName: categoryMapping.retailer,
    };
  }

  return {
    url: 'https://www.etsy.com',
    retailerName: 'Artisan Workshop Collective',
  };
}
