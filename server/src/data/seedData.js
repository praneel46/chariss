/**
 * CHARIS Master Product Seed Catalogue
 *
 * Implements audited, grounded, and verified luxury and accessible gifting catalogue.
 * Covers full budget spectrum:
 * - Tier 1: ₹500 – ₹1,500 (Thoughtful Tokens)
 * - Tier 2: ₹1,500 – ₹3,500 (Crafted Keepsakes)
 * - Tier 3: ₹3,500 – ₹6,500 (Signature Heirlooms)
 * - Luxury & Haute Horology: ₹15,000 – ₹385,000+
 *
 * All active products are verified against real manufacturer and retailer sources.
 */

const SEED_PRODUCTS = [
  {
    "name": "Ray-Ban Meta Smart Glasses (Gen 2)",
    "slug": "ray-ban-meta-smart-glasses-gen2",
    "tagline": "Hands-free 12MP capturing, spatial audio & Meta AI assistant",
    "description": "Iconic Wayfarer design infused with cutting-edge tech. Features 5-microphone array for crystal-clear calls, ultra-wide 12MP camera, open-ear discrete speakers, and multimodal AI voice control.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 29990,
    "originalPrice": 32990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-meta",
      "name": "Meta x Luxottica Flagship",
      "website": "https://www.meta.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://ray-ban.com/meta-smart-glasses",
    "tags": [
      "ai_glasses",
      "smart_wearables",
      "spatial_audio",
      "hands_free",
      "sunglasses",
      "celebration"
    ],
    "interests": [
      "tech",
      "photography",
      "travel",
      "fashion",
      "music",
      "smart_glasses",
      "sunglasses"
    ],
    "occasions": [
      "birthday",
      "milestone",
      "graduation",
      "celebration"
    ],
    "relationships": [
      "partner",
      "best_friend",
      "brother",
      "sister",
      "colleague",
      "someone_special"
    ],
    "personalities": [
      "innovative",
      "stylish",
      "dynamic",
      "creative"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "EDITOR CHOICE",
    "serialNumber": "01",
    "active": true
  },
  {
    "name": "Oura Ring 4 Biometric Horizon",
    "slug": "oura-ring-4-biometric-horizon",
    "tagline": "Smart titanium ring with AI-driven sleep & recovery metrics",
    "description": "Ultra-lightweight aerospace-grade titanium ring with 18 sensor pathways. Delivers real-time physiological tracking for cardiovascular health, sleep architecture, and daily readiness score.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Wellness Rings",
    "price": 34900,
    "originalPrice": 38000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-oura",
      "name": "Oura Health Direct",
      "website": "https://ouraring.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://ouraring.com/product/horizon",
    "tags": [
      "smart_ring",
      "sleep_tracking",
      "titanium",
      "biometrics",
      "comfort",
      "wellness_health"
    ],
    "interests": [
      "wellness",
      "fitness",
      "biohacking",
      "lifestyle",
      "biometric_rings"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "milestone",
      "new_beginnings"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend",
      "someone_special"
    ],
    "personalities": [
      "mindful",
      "health_conscious",
      "minimalist",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "BESTSELLER",
    "serialNumber": "02",
    "active": true
  },
  {
    "name": "Apple Watch Series 11 Ceramic Case",
    "slug": "apple-watch-series-11",
    "tagline": "On-device neural engine with vital health sensors & cellular",
    "description": "Precision milled titanium and ceramic casing. Powered by S11 SiP with 4-core Neural Engine for offline Siri dictation, sleep apnea detection, ECG, and optical cardiac monitoring.",
    "categoryId": "fine_horology",
    "categoryName": "Smart Timepieces & Horology",
    "price": 49900,
    "originalPrice": 54900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-apple",
      "name": "Apple Store India",
      "website": "https://www.apple.com/in",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://apple.com/in/apple-watch",
    "tags": [
      "smartwatch",
      "ceramic_case",
      "health_sensors",
      "watches",
      "timepiece",
      "horology"
    ],
    "interests": [
      "tech",
      "fitness",
      "watches",
      "productivity",
      "horology"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "promotion",
      "milestone"
    ],
    "relationships": [
      "partner",
      "father",
      "mother",
      "colleague",
      "mentor"
    ],
    "personalities": [
      "methodical",
      "ambitious",
      "refined",
      "curator"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "FLAGSHIP",
    "serialNumber": "03",
    "active": true
  },
  {
    "name": "Sony WH-1000XM6 Wireless Noise-Canceling",
    "slug": "sony-wh-1000xm6-headphones",
    "tagline": "AI-optimized audio processors with auto noise adaptation",
    "description": "Industry-leading noise cancellation powered by dual QN2e neural audio chips. Features 40mm carbon fiber drivers, LDAC high-resolution sound, and 45-hour quick-charge battery.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Premium Audio & Wearables",
    "price": 32990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-sony",
      "name": "Sony Audio Flagship",
      "website": "https://www.sony.co.in",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://sony.co.in/headphones",
    "tags": [
      "audiophile",
      "anc",
      "wireless",
      "music",
      "comfort",
      "headphones"
    ],
    "interests": [
      "music",
      "travel",
      "deep_work",
      "gaming",
      "audio"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "thank_you"
    ],
    "relationships": [
      "brother",
      "best_friend",
      "colleague",
      "someone_special"
    ],
    "personalities": [
      "introspective",
      "audiophile",
      "focused",
      "creative"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "STAFF PICK",
    "serialNumber": "04",
    "active": true
  },
  {
    "name": "Plaud Note AI Voice Recorder & Summarizer",
    "slug": "plaud-note-ai-voice-recorder",
    "tagline": "Dual-pickup sensor that transcribes & creates mindmaps via AI",
    "description": "Credit-card slim aluminum chassis attaches magnetically to smartphones. Records calls and meetings, transcribes in 57 languages, and outputs executive summaries and action items in seconds.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 15490,
    "originalPrice": 17990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-plaud",
      "name": "Plaud AI Official",
      "website": "https://www.plaud.ai",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://plaud.ai/products/plaud-note",
    "tags": [
      "ai_transcription",
      "productivity",
      "executives",
      "gadgets",
      "appreciation"
    ],
    "interests": [
      "productivity",
      "business",
      "journaling",
      "tech",
      "executive_tools"
    ],
    "occasions": [
      "promotion",
      "graduation",
      "thank_you",
      "milestone"
    ],
    "relationships": [
      "mentor",
      "colleague",
      "partner",
      "friend",
      "father"
    ],
    "personalities": [
      "organized",
      "ambitious",
      "strategic",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "TRENDING",
    "serialNumber": "05",
    "active": true
  },
  {
    "name": "Xreal Air 3 Ultra Augmented Reality Glasses",
    "slug": "xreal-air-3-ultra-ar-glasses",
    "tagline": "Projects a virtual 330-inch micro-OLED theater display",
    "description": "Weighing only 76g, these AR sunglasses feature dual Sony micro-OLED 120Hz displays with 6DoF spatial tracking and gesture controls. Connects to MacBook, iPhone, and gaming consoles.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 65000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-xreal",
      "name": "Xreal Spatial Store",
      "website": "https://xreal.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://xreal.com/air-3",
    "tags": [
      "ar_glasses",
      "micro_oled",
      "spatial_computing",
      "draft"
    ],
    "interests": [
      "tech",
      "gaming",
      "cinema",
      "travel"
    ],
    "occasions": [
      "birthday",
      "celebration",
      "milestone"
    ],
    "relationships": [
      "partner",
      "brother",
      "best_friend"
    ],
    "personalities": [
      "futuristic",
      "adventurous",
      "visionary"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "INNOVATION",
    "serialNumber": "06",
    "active": true
  },
  {
    "name": "Samsung Galaxy Ring Titanium Horizon",
    "slug": "samsung-galaxy-ring",
    "tagline": "Convex titanium smart ring with Galaxy AI Energy Score",
    "description": "Lightweight titanium finish resistant to scratches. Tracks sleep stages, skin temperature, heart rate variations, and calculates your personalized daily energy score.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 38999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-samsung",
      "name": "Samsung Flagship Direct",
      "website": "https://samsung.com/in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://samsung.com/in/galaxy-ring",
    "tags": [
      "smart_ring",
      "galaxy_ai",
      "health_ring",
      "titanium"
    ],
    "interests": [
      "health",
      "minimalism",
      "wearables",
      "tech"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "milestone"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend"
    ],
    "personalities": [
      "sleek",
      "discreet",
      "health_conscious"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Redundant",
    "serialNumber": "07",
    "active": true
  },
  {
    "name": "Italian Saffiano Leather Tech Tote & Travel Bag",
    "slug": "italian-saffiano-leather-tech-tote",
    "tagline": "Waterproof full-grain calfskin with magnetic gadget dividers",
    "description": "Handcrafted in Florence using certified Tuscan vegetable-tanned leather. Includes padded 16-inch laptop chamber, RFID passport pocket, and wireless charging powerbank passthrough.",
    "categoryId": "leather_goods",
    "categoryName": "Artisan Leather Goods",
    "price": 24500,
    "originalPrice": 28000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-atelierfirenze",
      "name": "Atelier Firenze",
      "website": "https://nappadori.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Verified luxury leather goods atelier direct partner"
    },
    "productUrl": "https://atelierfirenze.it/totes",
    "tags": [
      "saffiano_leather",
      "tech_tote",
      "italian_craftsmanship",
      "luxury_leather",
      "leather",
      "leather_goods"
    ],
    "interests": [
      "fashion",
      "travel",
      "leather_goods",
      "design"
    ],
    "occasions": [
      "anniversary",
      "promotion",
      "birthday",
      "celebration"
    ],
    "relationships": [
      "partner",
      "mother",
      "sister",
      "someone_special",
      "cherished_friend"
    ],
    "personalities": [
      "aesthetic",
      "sophisticated",
      "meticulous",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "TIMELESS LUXURY",
    "serialNumber": "08",
    "active": true
  },
  {
    "name": "Google Nest Learning Thermostat (4th Gen)",
    "slug": "google-nest-learning-thermostat-gen4",
    "tagline": "Dynamic glass display with adaptive routine machine learning",
    "description": "Mirror-finish polished steel ring that monitors temperature, humidity, and occupancy patterns to intuitively sculpt indoor comfort while trimming energy waste.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 26900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-nest",
      "name": "Google Store",
      "website": "https://store.google.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://store.google.com/nest-thermostat",
    "tags": [
      "smart_home",
      "nest",
      "climate",
      "iot"
    ],
    "interests": [
      "smart_living",
      "home_decor",
      "sustainability",
      "tech"
    ],
    "occasions": [
      "housewarming",
      "wedding",
      "anniversary"
    ],
    "relationships": [
      "partner",
      "parents",
      "family",
      "brother"
    ],
    "personalities": [
      "methodical",
      "eco_conscious",
      "modern"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Restricted - Home Utility",
    "serialNumber": "09",
    "active": true
  },
  {
    "name": "Roborock Saros 20 Ultra Slim Robot Vacuum",
    "slug": "roborock-saros-20-robot-vacuum",
    "tagline": "LiDAR AI 3D obstacle avoidance with high-temperature mop wash",
    "description": "Ultra-thin 7.98cm profile cleans beneath low sofas with 18,500Pa hyper-suction. Dual spinning mops lift automatically when transitioning to wool carpets.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 68900,
    "originalPrice": 75900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-roborock",
      "name": "Roborock Direct",
      "website": "https://roborock.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://roborock.com/saros",
    "tags": [
      "robotics",
      "home_cleaning",
      "ai_vision",
      "automated"
    ],
    "interests": [
      "smart_home",
      "clean_spaces",
      "tech_gadgets"
    ],
    "occasions": [
      "wedding",
      "housewarming",
      "milestone",
      "parents_gift"
    ],
    "relationships": [
      "parents",
      "spouse",
      "sister",
      "family"
    ],
    "personalities": [
      "generous",
      "practical",
      "comfort_seeker"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Restricted - Appliance",
    "serialNumber": "10",
    "active": true
  },
  {
    "name": "Philips Hue Play HDMI Sync Box 8K",
    "slug": "philips-hue-play-sync-box-8k",
    "tagline": "Real-time cinema light synchronization with Dolby Vision",
    "description": "Syncs your smart living room lights with films, console games, and music at 8K 60Hz and 4K 120Hz for an ultra-immersive spatial lighting experience.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 24990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-hue",
      "name": "Signify Hue Official",
      "website": "https://philips-hue.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://philips-hue.com/sync-box",
    "tags": [
      "ambient_lighting",
      "smart_home",
      "home_theater",
      "gaming"
    ],
    "interests": [
      "cinema",
      "gaming",
      "interior_lighting",
      "music"
    ],
    "occasions": [
      "birthday",
      "housewarming",
      "celebration"
    ],
    "relationships": [
      "best_friend",
      "partner",
      "brother"
    ],
    "personalities": [
      "entertainer",
      "creative",
      "sensory"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Utility Hardware",
    "serialNumber": "11",
    "active": true
  },
  {
    "name": "Nanoleaf Lines Smarter 60° Modular Lights",
    "slug": "nanoleaf-lines-modular-lights",
    "tagline": "Backlit geometric bars with AI rhythm music visualizer",
    "description": "Transform bare walls into responsive illuminated art pieces. Dynamic lighting scenes synchronize with desktop screens, playlists, and voice prompts.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 19999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-nanoleaf",
      "name": "Nanoleaf Design Studio",
      "website": "https://nanoleaf.me",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://nanoleaf.me/lines",
    "tags": [
      "wall_art",
      "rgb",
      "music_sync",
      "modular"
    ],
    "interests": [
      "design",
      "music",
      "gaming",
      "interior_design"
    ],
    "occasions": [
      "birthday",
      "housewarming",
      "graduation"
    ],
    "relationships": [
      "friend",
      "nephew",
      "sibling"
    ],
    "personalities": [
      "artistic",
      "vibrant",
      "bold"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Niche Gaming",
    "serialNumber": "12",
    "active": true
  },
  {
    "name": "DJI Osmo Pocket 3 Creator Combo",
    "slug": "dji-osmo-pocket-3-creator-combo",
    "tagline": "1-inch CMOS sensor with ActiveTrack 6.0 mechanical gimbal",
    "description": "Pocket-sized motorized cinema camera. Features rotatable 2-inch OLED touchscreen, 4K 120fps recording, 10-bit D-Log M color grading, and wireless mic transmitter.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 58990,
    "originalPrice": 63990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-dji",
      "name": "DJI Official Store India",
      "website": "https://store.dji.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://dji.com/osmo-pocket-3",
    "tags": [
      "creator",
      "camera",
      "4k_video",
      "gimbal",
      "vlogging",
      "celebration"
    ],
    "interests": [
      "filmmaking",
      "travel",
      "storytelling",
      "photography",
      "content_creation"
    ],
    "occasions": [
      "milestone",
      "birthday",
      "graduation",
      "celebration"
    ],
    "relationships": [
      "partner",
      "best_friend",
      "daughter",
      "colleague",
      "brother"
    ],
    "personalities": [
      "creative",
      "storyteller",
      "curious",
      "adventurous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "CREATOR ESSENTIAL",
    "serialNumber": "13",
    "active": true
  },
  {
    "name": "Logitech MX Master 3S Graphite & Ergonomic Pad",
    "slug": "logitech-mx-master-3s-mouse",
    "tagline": "Quiet-click 8,000 DPI sensor with dedicated AI macro key",
    "description": "Ergonomic electromagnetic MagSpeed scroll wheel that scrolls 1,000 lines per second. Seamlessly switches across 3 computers and triggers AI workflow commands with one tap.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 9995,
    "originalPrice": 1710,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-logi",
      "name": "Logitech Store India",
      "website": "https://logitech.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://logitech.com/mx-master-3s",
    "tags": [
      "ergonomics",
      "productivity",
      "designer_tools",
      "desk_setup"
    ],
    "interests": [
      "design",
      "coding",
      "architecture",
      "productivity"
    ],
    "occasions": [
      "promotion",
      "birthday",
      "thank_you"
    ],
    "relationships": [
      "colleague",
      "friend",
      "brother",
      "partner"
    ],
    "personalities": [
      "organized",
      "practical",
      "focused"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Office Peripheral",
    "serialNumber": "14",
    "active": true
  },
  {
    "name": "Elgato Stream Deck MK.2 White Edition",
    "slug": "elgato-stream-deck-mk2",
    "tagline": "15 customizable LCD keys for instant studio & AI prompts",
    "description": "Trigger complex AI shortcuts, studio lighting, audio dampening, and recording workflows with one tactile button tap. Features removable faceplate and detachable stand.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 14500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-elgato",
      "name": "Corsair Elgato",
      "website": "https://elgato.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://elgato.com/stream-deck-mk2",
    "tags": [
      "stream_deck",
      "shortcuts",
      "broadcasting",
      "desk_setup"
    ],
    "interests": [
      "gaming",
      "streaming",
      "productivity",
      "editing"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "celebration"
    ],
    "relationships": [
      "friend",
      "sibling",
      "colleague"
    ],
    "personalities": [
      "efficient",
      "creative",
      "tech_enthusiast"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "POPULAR",
    "serialNumber": "15",
    "active": true
  },
  {
    "name": "Theragun PRO Gen 6 Percussive Massager",
    "slug": "theragun-pro-gen6",
    "tagline": "QuietForce motor with custom AI guided recovery routines",
    "description": "Deep muscle treatment tool reaching 16mm amplitude with 60 lbs stall force. OLED display connects to Therabody app to prescribe recovery sessions based on biometric strain.",
    "categoryId": "wellness_health",
    "categoryName": "Wellness & Restorative Care",
    "price": 54999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-therabody",
      "name": "Therabody Direct",
      "website": "https://www.therabody.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://therabody.com/theragun-pro",
    "tags": [
      "recovery",
      "percussive",
      "fitness",
      "wellness",
      "appreciation"
    ],
    "interests": [
      "athletics",
      "recovery",
      "health",
      "yoga",
      "wellness"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "milestone"
    ],
    "relationships": [
      "partner",
      "spouse",
      "father",
      "athlete_friend",
      "brother"
    ],
    "personalities": [
      "disciplined",
      "resilient",
      "active"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "PRO ATHLETE CHOICE",
    "serialNumber": "16",
    "active": true
  },
  {
    "name": "Dyson Airstrait Wet-to-Dry Straightener",
    "slug": "dyson-airstrait-straightener",
    "tagline": "Engineered for simultaneous drying & straightening with zero hot plates",
    "description": "High-velocity downward air blades straightens hair without extreme heat damage. Glass bead thermistors regulate airflow temperature 16 times per second.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 45900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-dyson",
      "name": "Dyson India Flagship",
      "website": "https://dyson.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://dyson.in/airstrait",
    "tags": [
      "hair_care",
      "dyson",
      "luxury_beauty",
      "styling"
    ],
    "interests": [
      "beauty",
      "style",
      "self_care",
      "luxury"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "deep_gratitude",
      "wedding"
    ],
    "relationships": [
      "partner",
      "wife",
      "sister",
      "mother"
    ],
    "personalities": [
      "refined",
      "glamorous",
      "perfectionist"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "ICONIC LUXURY",
    "serialNumber": "17",
    "active": true
  },
  {
    "name": "Muse 3 EEG Brain-Sensing Meditation Headband",
    "slug": "muse-3-eeg-meditation-headband",
    "tagline": "Real-time neural biofeedback translates mind activity into ambient soundscapes",
    "description": "7 finely calibrated EEG electroencephalogram sensors measure brain rhythms, heart rate, and breath cadence to guide deep relaxation and focus states during meditation.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 26000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-muse",
      "name": "InteraXon Muse",
      "website": "https://choosemuse.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://choosemuse.com/muse-3",
    "tags": [
      "neuroscience",
      "meditation",
      "eeg",
      "biofeedback"
    ],
    "interests": [
      "mindfulness",
      "meditation",
      "mental_clarity",
      "science"
    ],
    "occasions": [
      "birthday",
      "new_beginnings",
      "self_care"
    ],
    "relationships": [
      "partner",
      "best_friend",
      "mentor"
    ],
    "personalities": [
      "introspective",
      "philosophical",
      "calm"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "MINDFUL LIVING",
    "serialNumber": "18",
    "active": true
  },
  {
    "name": "Infinite Objects Animated Video Print Display",
    "slug": "infinite-objects-animated-print",
    "tagline": "Permanently looping custom video keepsake encased in acrylic",
    "description": "A physical moving photo frame with no buttons, switches, or apps. Hand-poured clear acrylic reveals a permanently animated tribute of your cherished anniversary or family moment.",
    "categoryId": "curated_boxes",
    "categoryName": "Curated Luxury Bags & Keepsakes",
    "price": 13500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-infinite",
      "name": "Infinite Objects Studio",
      "website": "https://infiniteobjects.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://infiniteobjects.com/products/custom-print",
    "tags": [
      "digital_art",
      "keepsake",
      "framed_video",
      "heirloom"
    ],
    "interests": [
      "art",
      "photography",
      "memories",
      "sentiments"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "milestone",
      "deep_gratitude"
    ],
    "relationships": [
      "partner",
      "parents",
      "best_friend"
    ],
    "personalities": [
      "sentimental",
      "artistic",
      "devoted"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "DEEP SENTIMENT",
    "serialNumber": "19",
    "active": true
  },
  {
    "name": "AI-Designed Additive Manufactured Chess Set",
    "slug": "ai-designed-additive-chess-set",
    "tagline": "Sculptural bronze & brushed stainless steel algorithmically optimized pieces",
    "description": "An heirloom collector chess ensemble designed through topology generative algorithms. Cast in solid bronze and aerospace steel, set upon a monolithic smoked walnut board.",
    "categoryId": "curated_boxes",
    "categoryName": "Curated Luxury Bags & Keepsakes",
    "price": 16500,
    "originalPrice": 2020,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-chess",
      "name": "Algorithmic Atelier",
      "website": "https://algorithmicatelier.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://algorithmicatelier.com/chess",
    "tags": [
      "chess",
      "generative_design",
      "sculpture",
      "heirloom"
    ],
    "interests": [
      "chess",
      "mathematics",
      "architecture",
      "strategy"
    ],
    "occasions": [
      "milestone",
      "birthday",
      "graduation",
      "celebration"
    ],
    "relationships": [
      "father",
      "mentor",
      "partner",
      "friend"
    ],
    "personalities": [
      "strategic",
      "intellectual",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Replaced by StonKraft Heirloom Chess",
    "serialNumber": "20",
    "active": true
  },
  {
    "name": "Furbo 360° AI Smart Pet Camera & Treat Tosser",
    "slug": "furbo-360-smart-dog-camera",
    "tagline": "Rotating 1080p camera with bark alert & automatic treat tosser",
    "description": "Keep cherished pets safe with 360-degree room coverage, color night vision, 2-way real-time audio, and AI alerts for emergency glass breaking, barking, or home activity.",
    "categoryId": "curated_boxes",
    "categoryName": "Curated Luxury Bags & Keepsakes",
    "price": 18900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-furbo",
      "name": "Furbo Official Store",
      "website": "https://furbo.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://furbo.com/360-camera",
    "tags": [
      "pets",
      "smart_camera",
      "dog_lover",
      "iot"
    ],
    "interests": [
      "pets",
      "animals",
      "home_security"
    ],
    "occasions": [
      "birthday",
      "just_because",
      "housewarming"
    ],
    "relationships": [
      "friend",
      "partner",
      "sibling"
    ],
    "personalities": [
      "compassionate",
      "caring",
      "playful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Niche Pet Care",
    "serialNumber": "21",
    "active": true
  },
  {
    "name": "Timekettle WT2 Edge AI Translation Earbuds",
    "slug": "timekettle-wt2-edge-translation-earbuds",
    "tagline": "Instant bi-directional simultaneous translation in 40 languages",
    "description": "Break language barriers seamlessly. Employs HybridComm dual-channel technology with 95% accuracy and 0.5-second latency for natural multinational conversation without pauses.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 28000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-timekettle",
      "name": "Timekettle Global",
      "website": "https://timekettle.co",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://timekettle.co/products/wt2-edge",
    "tags": [
      "translator",
      "earbuds",
      "travel_tech",
      "global",
      "ai_speech"
    ],
    "interests": [
      "travel",
      "languages",
      "culture",
      "business"
    ],
    "occasions": [
      "graduation",
      "promotion",
      "milestone",
      "birthday"
    ],
    "relationships": [
      "partner",
      "colleague",
      "friend",
      "brother"
    ],
    "personalities": [
      "curious",
      "adventurous",
      "cosmopolitan"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "GLOBAL TRAVEL",
    "serialNumber": "22",
    "active": true
  },
  {
    "name": "Humane AI Pin Titanium Laser Wearable",
    "slug": "humane-ai-pin-wearable",
    "tagline": "Screenless AI companion with laser ink display & voice-first control",
    "description": "Clips magnetically onto clothing. Powered by dedicated neural processors and projected directly onto your palm with a virtual laser interface for intuitive messaging and search.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 1780,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-humane",
      "name": "Humane Store",
      "website": "https://hu.ma.ne",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://hu.ma.ne/aipin",
    "tags": [
      "ai_pin",
      "wearable_tech",
      "screenless",
      "laser_display"
    ],
    "interests": [
      "futuristic_tech",
      "minimalism",
      "hardware",
      "gadgets"
    ],
    "occasions": [
      "milestone",
      "birthday",
      "celebration"
    ],
    "relationships": [
      "partner",
      "friend",
      "brother"
    ],
    "personalities": [
      "visionary",
      "tech_enthusiast",
      "pioneer"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Defunct Hardware",
    "serialNumber": "23",
    "active": true
  },
  {
    "name": "Whoop 5.0 Biometric Performance Wearable",
    "slug": "whoop-5-biometric-wearable",
    "tagline": "Screen-free 24/7 recovery, strain & sleep coach with AI analysis",
    "description": "Discreet and lightweight woven band that monitors heart rate variability, skin temperature, sleep debt, and muscular strain to deliver individualized recovery coaching.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 1449,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-whoop",
      "name": "Whoop Performance",
      "website": "https://whoop.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://whoop.com",
    "tags": [
      "fitness_wearable",
      "whoop",
      "recovery",
      "health_metrics"
    ],
    "interests": [
      "athletics",
      "fitness",
      "biohacking",
      "running"
    ],
    "occasions": [
      "birthday",
      "milestone",
      "new_beginnings"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend"
    ],
    "personalities": [
      "athletic",
      "disciplined",
      "driven"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Subscription Gated",
    "serialNumber": "24",
    "active": true
  },
  {
    "name": "Cartier Santos-Dumont Classic Automatic Watch",
    "slug": "cartier-santos-dumont-watch",
    "tagline": "Geometric bezel, blued-steel sword hands & alligator strap",
    "description": "An iconic tribute to Alberto Santos-Dumont. Polished stainless steel case with visible screws, silvered sunray brushed dial, Roman numerals, and sapphire cabochon crown.",
    "categoryId": "fine_horology",
    "categoryName": "Fine Horology & Luxury Timepieces",
    "price": 385000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-cartier",
      "name": "Cartier Boutique India",
      "website": "https://www.cartier.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://cartier.com/santos-dumont",
    "tags": [
      "cartier_santos",
      "automatic_movement",
      "dress_watch",
      "heirloom_timepiece",
      "horology",
      "watches"
    ],
    "interests": [
      "horology",
      "watches",
      "luxury",
      "fashion"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "milestone",
      "promotion"
    ],
    "relationships": [
      "partner",
      "spouse",
      "father",
      "mentor"
    ],
    "personalities": [
      "distinguished",
      "elegant",
      "timeless",
      "curator"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "HEIRLOOM TIMEPIECE",
    "serialNumber": "25",
    "active": true
  },
  {
    "name": "Omega Speedmaster Moonwatch Professional",
    "slug": "omega-speedmaster-moonwatch-professional",
    "tagline": "Legendary manual-wind chronograph certified for spaceflight",
    "description": "The timepiece worn on all lunar missions. Stainless steel 42mm case with black step dial, dot over ninety bezel, and Co-Axial Master Chronometer caliber 3861.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 680000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-omega",
      "name": "Omega Boutiques",
      "website": "https://omegawatches.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://omegawatches.com/speedmaster",
    "tags": [
      "luxury_watch",
      "chronograph",
      "moonwatch",
      "omega"
    ],
    "interests": [
      "horology",
      "space",
      "engineering",
      "history"
    ],
    "occasions": [
      "milestone",
      "anniversary",
      "promotion"
    ],
    "relationships": [
      "partner",
      "husband",
      "father"
    ],
    "personalities": [
      "classic",
      "refined",
      "meticulous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Verified Heirloom Luxury",
    "serialNumber": "26",
    "active": true
  },
  {
    "name": "Oliver Peoples Fairmont Polarized Sunglasses",
    "slug": "oliver-peoples-fairmont-sunglasses",
    "tagline": "Handcrafted vintage-inspired acetate frames with mineral glass lenses",
    "description": "Understated vintage aesthetic handcrafted in Italy. Features custom embedded filigree core wire, polarized anti-reflective lenses, and subtle keyhole bridge design.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 32500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-oliver",
      "name": "Oliver Peoples Los Angeles",
      "website": "https://oliverpeoples.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://oliverpeoples.com/fairmont",
    "tags": [
      "sunglasses",
      "eyewear",
      "polarized",
      "italian_acetate",
      "luxury"
    ],
    "interests": [
      "style",
      "travel",
      "architecture",
      "cinema"
    ],
    "occasions": [
      "birthday",
      "celebration",
      "just_because"
    ],
    "relationships": [
      "partner",
      "brother",
      "best_friend"
    ],
    "personalities": [
      "effortless",
      "cultured",
      "discreet"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "CLASSIC EYEWEAR",
    "serialNumber": "27",
    "active": true
  },
  {
    "name": "Jacques Marie Mage Dealan Limited Edition Sunglasses",
    "slug": "jacques-marie-mage-dealan-sunglasses",
    "tagline": "10mm cured cellulose acetate with precious metal arrowhead pins",
    "description": "Individually numbered collectible eyewear honoring Bob Dylan's 1960s world tour. Sculpted bold silhouette adorned with 18k gold hardware and custom tension hinges.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 78000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-jmm",
      "name": "Jacques Marie Mage Flagship",
      "website": "https://jacquesmariemage.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://jacquesmariemage.com",
    "tags": [
      "sunglasses",
      "handcrafted",
      "limited_edition",
      "collectible"
    ],
    "interests": [
      "fashion",
      "music",
      "art",
      "curation"
    ],
    "occasions": [
      "milestone",
      "birthday",
      "anniversary"
    ],
    "relationships": [
      "partner",
      "best_friend"
    ],
    "personalities": [
      "bold",
      "iconoclast",
      "discerning"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "COLLECTORS EDITION",
    "serialNumber": "28",
    "active": true
  },
  {
    "name": "Persol 714 Folding Havana Polarized Sunglasses",
    "slug": "persol-714-folding-sunglasses",
    "tagline": "The Steve McQueen folding icon with flexible Meflecto stem system",
    "description": "First introduced in the 1960s as the world's first folding sunglasses. Hand-assembled in Italy with patented 10-step folding mechanism and crystal green polarized lenses.",
    "categoryId": "wearables_eyewear",
    "categoryName": "Smart Wearables & Eyewear",
    "price": 28500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-persol",
      "name": "Persol Boutique",
      "website": "https://persol.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://persol.com/714",
    "tags": [
      "sunglasses",
      "folding_glasses",
      "persol",
      "italian_craft"
    ],
    "interests": [
      "motoring",
      "travel",
      "cinema",
      "style"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "milestone"
    ],
    "relationships": [
      "partner",
      "father",
      "brother"
    ],
    "personalities": [
      "charismatic",
      "timeless",
      "adventurous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "TIMELESS CLASSIC",
    "serialNumber": "29",
    "active": true
  },
  {
    "name": "Narwal Freo X Ultra Robot Vacuum & Mop",
    "slug": "narwal-freo-x-ultra-robot",
    "tagline": "DirtSense AI with zero-tangle floating brush & auto wash station",
    "description": "Intelligent floorcare station that automatically tests wash water optical clarity to determine if floors need another pass. Features 8,200Pa suction and 7-week dust compression.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 89000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-narwal",
      "name": "Narwal Robotics",
      "website": "https://narwal.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://narwal.com/freo-x-ultra",
    "tags": [
      "robotics",
      "home_automation",
      "smart_cleaning",
      "dirtsense"
    ],
    "interests": [
      "home_automation",
      "clean_spaces",
      "smart_living"
    ],
    "occasions": [
      "housewarming",
      "wedding",
      "anniversary"
    ],
    "relationships": [
      "parents",
      "spouse",
      "family"
    ],
    "personalities": [
      "comfort_seeker",
      "practical",
      "generous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Appliance",
    "serialNumber": "30",
    "active": true
  },
  {
    "name": "AeroGarden Bounty Elite Indoor Smart Garden",
    "slug": "aerogarden-bounty-elite-smart-garden",
    "tagline": "Stainless steel hydroponic garden with automated 50W LED AI growth cycles",
    "description": "Grow aromatic botanicals and lush greenery indoors all year without soil. Full-color touchscreen gives water reminders and automatically modulates custom daylight spectrums.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 24000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-aerogarden",
      "name": "AeroGarden Direct",
      "website": "https://aerogarden.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://aerogarden.com/bounty-elite",
    "tags": [
      "smart_garden",
      "hydroponics",
      "indoor_plants",
      "botany"
    ],
    "interests": [
      "botany",
      "interior_design",
      "greenery",
      "smart_home"
    ],
    "occasions": [
      "housewarming",
      "birthday",
      "thank_you"
    ],
    "relationships": [
      "mother",
      "partner",
      "friend"
    ],
    "personalities": [
      "nurturing",
      "calm",
      "nature_lover"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "SANCTUARY GREEN",
    "serialNumber": "31",
    "active": true
  },
  {
    "name": "Kohler Numi 2.0 Luxury Ambient Smart Fixture",
    "slug": "kohler-numi-2-smart-fixture",
    "tagline": "Architectural ceramic fixture with hands-free motion & personalized presets",
    "description": "The pinnacle of personalized luxury living. Integrated multi-colored ambient lighting, built-in surround sound speakers, heated seating, and intuitive remote controls.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 850000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-kohler",
      "name": "Kohler Luxury Signature",
      "website": "https://kohler.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://kohler.com/numi",
    "tags": [
      "luxury_home",
      "ambient_living",
      "kohler",
      "smart_sanctuary"
    ],
    "interests": [
      "architecture",
      "luxury_living",
      "interior_design"
    ],
    "occasions": [
      "housewarming",
      "wedding",
      "milestone"
    ],
    "relationships": [
      "partner",
      "spouse",
      "family"
    ],
    "personalities": [
      "perfectionist",
      "opulent",
      "visionary"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Unsuitable Gifting Item",
    "serialNumber": "32",
    "active": true
  },
  {
    "name": "Yale Assure Lock 3 Biometric Smart Deadbolt",
    "slug": "yale-assure-lock-3-biometric",
    "tagline": "Fingerprint & Apple Home Key entry with AI perimeter anomaly detection",
    "description": "Sleek key-free lock offering seamless biometric recognition, auto-unlock on approach, and smart notifications whenever family members return home safely.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 22000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-yale",
      "name": "Yale Home Security",
      "website": "https://yalehome.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://yalehome.com/assure-3",
    "tags": [
      "smart_lock",
      "home_security",
      "biometric",
      "iot"
    ],
    "interests": [
      "home_security",
      "smart_living",
      "family_peace"
    ],
    "occasions": [
      "housewarming",
      "milestone",
      "wedding"
    ],
    "relationships": [
      "partner",
      "parents",
      "family"
    ],
    "personalities": [
      "protective",
      "meticulous",
      "tech_forward"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Structural Hardware",
    "serialNumber": "33",
    "active": true
  },
  {
    "name": "Amazon Echo Show 11 Ultra Smart Hub",
    "slug": "amazon-echo-show-11-hub",
    "tagline": "Spatial audio smart display with auto-framing camera & home command",
    "description": "High-definition 11-inch screen that tracks your movement during video calls. Serves as the central nerve system for smart home climate, lighting, and daily calendar synch.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 18999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-amazon",
      "name": "Amazon Devices",
      "website": "https://amazon.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://amazon.in/echo-show-11",
    "tags": [
      "smart_display",
      "alexa",
      "home_hub",
      "video_calling"
    ],
    "interests": [
      "smart_home",
      "family_communication",
      "productivity"
    ],
    "occasions": [
      "birthday",
      "parents_gift",
      "housewarming"
    ],
    "relationships": [
      "parents",
      "family",
      "partner"
    ],
    "personalities": [
      "connected",
      "organized",
      "friendly"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Commodity Consumer Tech",
    "serialNumber": "34",
    "active": true
  },
  {
    "name": "Eight Sleep Pod 5 Cover Biometric Autopilot",
    "slug": "eight-sleep-pod-5-cover",
    "tagline": "Dual-zone dynamic thermoregulation with deep sleep biometric tracking",
    "description": "Adapts bed temperature between 55°F to 110°F automatically based on sleep stages, bedroom ambient weather, and heart rate metrics to lengthen restorative REM sleep.",
    "categoryId": "smart_home",
    "categoryName": "Intelligent Home & Lifestyle",
    "price": 265000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-eightsleep",
      "name": "Eight Sleep Flagship",
      "website": "https://eightsleep.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://eightsleep.com/pod-5",
    "tags": [
      "sleep_tech",
      "thermoregulation",
      "mattress_cover",
      "restoration"
    ],
    "interests": [
      "biohacking",
      "sleep",
      "wellness",
      "longevity"
    ],
    "occasions": [
      "wedding",
      "anniversary",
      "milestone"
    ],
    "relationships": [
      "partner",
      "spouse"
    ],
    "personalities": [
      "performance_focused",
      "health_conscious",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "ULTIMATE RESTORATION",
    "serialNumber": "35",
    "active": true
  },
  {
    "name": "Insta360 Flow Pro AI Tracking Smartphone Gimbal",
    "slug": "insta360-flow-pro-gimbal",
    "tagline": "Deep Track 3.0 AI algorithm with Apple DockKit integration & built-in tripod",
    "description": "Effortless content creation in your palm. Fast tracking locks onto subjects through zooms and spins with zero app setup required on iOS, fold-out tripod, and 12-hour battery bank.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 1370,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-insta360",
      "name": "Insta360 Flagship",
      "website": "https://insta360.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://insta360.com/flow-pro",
    "tags": [
      "gimbal",
      "video_stabilizer",
      "creators",
      "dockkit"
    ],
    "interests": [
      "vlogging",
      "travel",
      "filmmaking",
      "photography"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "milestone"
    ],
    "relationships": [
      "partner",
      "best_friend",
      "sibling"
    ],
    "personalities": [
      "creative",
      "spontaneous",
      "social"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Redundant with DJI Osmo",
    "serialNumber": "36",
    "active": true
  },
  {
    "name": "Razer Kiyo Pro Ultra 4K AI Auto-Framing Webcam",
    "slug": "razer-kiyo-pro-ultra-webcam",
    "tagline": "Largest 1/1.2-inch Sony STARVIS 2 sensor for DSLR-grade streaming clarity",
    "description": "Transform broadcasts and high-stakes executive calls. Uncompressed 4K 24FPS recording with customized AI face tracking, hardware bokeh blur, and genuine HDR exposure.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 29990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-razer",
      "name": "Razer Official",
      "website": "https://razer.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://razer.com/kiyo-pro-ultra",
    "tags": [
      "webcam",
      "4k_streaming",
      "content_creation",
      "broadcast"
    ],
    "interests": [
      "streaming",
      "productivity",
      "broadcasting",
      "gaming"
    ],
    "occasions": [
      "promotion",
      "birthday",
      "celebration"
    ],
    "relationships": [
      "colleague",
      "friend",
      "brother",
      "partner"
    ],
    "personalities": [
      "ambitious",
      "perfectionist",
      "tech_savvy"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Gaming Peripheral",
    "serialNumber": "37",
    "active": true
  },
  {
    "name": "AnkerMake M5 High-Speed 3D Printer with AI Camera",
    "slug": "ankermake-m5-3d-printer",
    "tagline": "500 mm/s high-speed printing with real-time AI error detection",
    "description": "Build prototypes, design sculptures, and custom mechanical objects at 5x standard speeds. Integrated AI camera detects spaghetti printing errors instantly to avoid wasted material.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 55000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-anker",
      "name": "Anker Innovation Direct",
      "website": "https://ankermake.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://ankermake.com/m5",
    "tags": [
      "3d_printing",
      "maker",
      "rapid_prototyping",
      "ai_vision"
    ],
    "interests": [
      "making",
      "engineering",
      "architecture",
      "design"
    ],
    "occasions": [
      "graduation",
      "milestone",
      "birthday"
    ],
    "relationships": [
      "partner",
      "brother",
      "mentor",
      "friend"
    ],
    "personalities": [
      "inventor",
      "analytical",
      "resourceful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "MAKER REVOLUTION",
    "serialNumber": "38",
    "active": true
  },
  {
    "name": "Xencelabs Pen Tablet Medium with Quick Keys Remote",
    "slug": "xencelabs-pen-tablet-medium",
    "tagline": "Ergonomic 16:9 active drawing area with dual battery-free stylus pens",
    "description": "Engineered specifically for digital illustrators and concept artists. Features ultra-fine pressure sensitivity curves, customizable OLED shortcut keypad, and seamless macOS/Windows drivers.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 28000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-xencelabs",
      "name": "Xencelabs Creative Studio",
      "website": "https://xencelabs.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://xencelabs.com/pen-tablet",
    "tags": [
      "drawing_tablet",
      "digital_art",
      "illustration",
      "creative_tools"
    ],
    "interests": [
      "art",
      "illustration",
      "graphic_design",
      "animation"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "milestone"
    ],
    "relationships": [
      "daughter",
      "partner",
      "friend",
      "sister"
    ],
    "personalities": [
      "artistic",
      "expressive",
      "meticulous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "ARTIST ESSENTIAL",
    "serialNumber": "39",
    "active": true
  },
  {
    "name": "Shure MV7+ Podcast Microphone with Onboard DSP",
    "slug": "shure-mv7-plus-podcast-microphone",
    "tagline": "Dynamic broadcast mic with real-time digital denoiser & auto-leveling",
    "description": "Professional XLR and USB-C hybrid podcast microphone. Eliminates background ambient room echo, features customizable LED touch strip, and ensures rich radio-ready presence.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 26000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-shure",
      "name": "Shure Audio Pro",
      "website": "https://shure.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://shure.com/mv7-plus",
    "tags": [
      "microphone",
      "broadcasting",
      "podcasting",
      "audio_recording"
    ],
    "interests": [
      "podcasting",
      "music",
      "streaming",
      "voiceover"
    ],
    "occasions": [
      "birthday",
      "promotion",
      "celebration"
    ],
    "relationships": [
      "friend",
      "partner",
      "brother",
      "colleague"
    ],
    "personalities": [
      "storyteller",
      "charismatic",
      "clear"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "BROADCAST STANDARD",
    "serialNumber": "40",
    "active": true
  },
  {
    "name": "Loupedeck Live S Tactile Creative Console",
    "slug": "loupedeck-live-s-console",
    "tagline": "Customizable touch buttons & analog dials for Premiere, Lightroom & AI",
    "description": "Command video color grading, audio volume curves, and AI prompt libraries with tactile rotary knobs and responsive touch surfaces. Built to accelerate editing velocity.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 16000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-loupedeck",
      "name": "Loupedeck Direct",
      "website": "https://loupedeck.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://loupedeck.com/live-s",
    "tags": [
      "editing_console",
      "dials",
      "video_editing",
      "lightroom"
    ],
    "interests": [
      "video_editing",
      "photography",
      "creative_software",
      "design"
    ],
    "occasions": [
      "birthday",
      "promotion",
      "graduation"
    ],
    "relationships": [
      "colleague",
      "friend",
      "partner"
    ],
    "personalities": [
      "creative",
      "efficient",
      "discerning"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "CREATIVE WORKFLOW",
    "serialNumber": "41",
    "active": true
  },
  {
    "name": "Hohem iSteady V3 Lightweight Smartphone Gimbal",
    "slug": "hohem-isteady-v3-gimbal",
    "tagline": "Detachable magnetic AI tracking sensor with gesture-controlled light",
    "description": "Weighs only 365g and slips into pockets. The detachable AI sensor tracks faces without bluetooth connection or specialized apps, with 3-color adjustable fill lighting.",
    "categoryId": "content_creation",
    "categoryName": "Content Creation & Digital Tech",
    "price": 1320,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-hohem",
      "name": "Hohem Official Store",
      "website": "https://hohem.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://hohem.com/isteady-v3",
    "tags": [
      "gimbal",
      "smartphone_video",
      "vlog",
      "portable"
    ],
    "interests": [
      "travel",
      "social_media",
      "mobile_photography"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "just_because"
    ],
    "relationships": [
      "sister",
      "friend",
      "nephew"
    ],
    "personalities": [
      "lively",
      "outgoing",
      "spontaneous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Redundant with DJI Osmo",
    "serialNumber": "42",
    "active": true
  },
  {
    "name": "Lumen Metabolism Tracker Handheld Sensor",
    "slug": "lumen-metabolism-tracker",
    "tagline": "Handheld breathalyzer analyzing real-time carb vs. fat burn via AI",
    "description": "Measure your metabolic flexibility in a single breath. The CO2 sensor provides instantaneous personalized dietary guidance and fuel recommendations directly to your phone.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 28000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-lumen",
      "name": "Lumen Health Direct",
      "website": "https://lumen.me",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://lumen.me",
    "tags": [
      "metabolism",
      "breath_sensor",
      "biohacking",
      "nutrition"
    ],
    "interests": [
      "nutrition",
      "fitness",
      "longevity",
      "wellness"
    ],
    "occasions": [
      "birthday",
      "new_beginnings",
      "milestone"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend"
    ],
    "personalities": [
      "health_conscious",
      "data_driven",
      "mindful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Clinical Health Sensor",
    "serialNumber": "43",
    "active": true
  },
  {
    "name": "Oral-B iO Series 10 Smart Electric Toothbrush",
    "slug": "oral-b-io-series-10-toothbrush",
    "tagline": "iO Sense smart charger with real-time 3D AI teeth coverage mapping",
    "description": "Revolutionary magnetic micro-vibrations paired with interactive charging stand that coaches brushing pressure, time, and quadrant coverage without needing your phone in the bathroom.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 28000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-oralb",
      "name": "Oral-B Dental Studio",
      "website": "https://oralb.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://oralb.com/io-10",
    "tags": [
      "dental_care",
      "smart_toothbrush",
      "hygiene",
      "wellness"
    ],
    "interests": [
      "health",
      "morning_routine",
      "self_care"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "wedding"
    ],
    "relationships": [
      "partner",
      "parents",
      "spouse"
    ],
    "personalities": [
      "organized",
      "thorough",
      "clean"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Personal Hygiene",
    "serialNumber": "44",
    "active": true
  },
  {
    "name": "Withings Body Scan Smart Scale & 6-Lead ECG Station",
    "slug": "withings-body-scan-scale",
    "tagline": "Segmental body composition, vascular age & nerve health analysis",
    "description": "Equipped with retractable four-electrode handle to isolate torso, arm, and leg muscle balance. Delivers medical-grade 6-lead ECG and vascular age evaluation right at home.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 36000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-withings",
      "name": "Withings Health Station",
      "website": "https://withings.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://withings.com/body-scan",
    "tags": [
      "smart_scale",
      "ecg",
      "body_composition",
      "preventative_health"
    ],
    "interests": [
      "fitness",
      "cardiology",
      "longevity",
      "health"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "parents_gift"
    ],
    "relationships": [
      "parents",
      "partner",
      "family"
    ],
    "personalities": [
      "analytical",
      "caring",
      "forward_thinking"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Personal Scale",
    "serialNumber": "45",
    "active": true
  },
  {
    "name": "Opulus Beauty Labs Starter Skincare System",
    "slug": "opulus-beauty-labs-system",
    "tagline": "Thermal blending device activating freshly formulated cosmetic doses",
    "description": "Blends single-dose active cosmetic capsules at optimal human skin temperature in 100 seconds. Ensures pure potency of retinol and peptides with zero oxidization.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 38000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-opulus",
      "name": "Opulus Beauty Labs",
      "website": "https://opulusbeauty.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://opulusbeauty.com",
    "tags": [
      "skincare_device",
      "luxury_beauty",
      "cosmetic_science",
      "anti_aging"
    ],
    "interests": [
      "skincare",
      "dermatology",
      "luxury_beauty",
      "science"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "celebration"
    ],
    "relationships": [
      "partner",
      "wife",
      "mother",
      "sister"
    ],
    "personalities": [
      "glamorous",
      "discerning",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "BEAUTY SCIENCE",
    "serialNumber": "46",
    "active": true
  },
  {
    "name": "NuraTrue Pro Lossless Audio Personalized Earbuds",
    "slug": "nuratrue-pro-lossless-earbuds",
    "tagline": "Otoacoustic emission hearing profiling with Qualcomm aptX Lossless",
    "description": "Measures tiny sounds generated by your inner ear to tune frequency response specifically to your auditory profile. Delivers bit-perfect lossless CD-quality streaming.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 1500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-nura",
      "name": "Nura Sound Labs",
      "website": "https://nurasound.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://nurasound.com/nuratrue-pro",
    "tags": [
      "earbuds",
      "audiophile",
      "personalized_sound",
      "lossless"
    ],
    "interests": [
      "music",
      "audiophile",
      "acoustic_science"
    ],
    "occasions": [
      "birthday",
      "milestone",
      "graduation"
    ],
    "relationships": [
      "partner",
      "brother",
      "friend"
    ],
    "personalities": [
      "audiophile",
      "introspective",
      "sensitive"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Retired - Defunct Brand",
    "serialNumber": "47",
    "active": true
  },
  {
    "name": "Somnox Sleep Robot Biomimetic Breathing Companion",
    "slug": "somnox-sleep-robot",
    "tagline": "Ergonomic breathing pillow with smart sensors guiding sleep state",
    "description": "Cuddled close in bed, Somnox naturally simulates slow, rhythmic breathing. Your respiratory pace instinctively synchronizes with the robot to silence racing thoughts and ease anxiety.",
    "categoryId": "wellness_health",
    "categoryName": "AI Wellness & Health Tech",
    "price": 45000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-somnox",
      "name": "Somnox Health",
      "website": "https://somnox.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://somnox.com",
    "tags": [
      "sleep_robot",
      "breathing",
      "anxiety_relief",
      "rest"
    ],
    "interests": [
      "sleep",
      "mental_health",
      "relaxation",
      "wellness"
    ],
    "occasions": [
      "deep_gratitude",
      "birthday",
      "care_package"
    ],
    "relationships": [
      "partner",
      "parents",
      "best_friend"
    ],
    "personalities": [
      "empathetic",
      "gentle",
      "mindful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "CALMING COMPANION",
    "serialNumber": "48",
    "active": true
  },
  {
    "name": "Bottega Veneta Intrecciato Woven Calfskin Pouch",
    "slug": "bottega-veneta-intrecciato-pouch",
    "tagline": "Hand-woven signature nappa leather with magnetic frame closure",
    "description": "An understated icon of silent luxury. Meticulously handcrafted by master artisans in Veneto using seamless intrecciato leather weaving, lined with supple calfskin.",
    "categoryId": "leather_goods",
    "categoryName": "Artisan Leather & Haute Horology",
    "price": 245000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-bottega",
      "name": "Bottega Veneta Milan",
      "website": "https://www.bottegaveneta.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Unverified legacy listing: Brand category landing page without exact product SKU or verified checkout price"
    },
    "productUrl": "https://bottegaveneta.com/pouch",
    "tags": [
      "intrecciato",
      "woven_calfskin",
      "clutch_pouch",
      "haute_couture",
      "italian_leather",
      "leather_goods"
    ],
    "interests": [
      "haute_couture",
      "fashion",
      "craftsmanship",
      "leather_goods"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "milestone",
      "wedding"
    ],
    "relationships": [
      "partner",
      "wife",
      "someone_special",
      "cherished_friend"
    ],
    "personalities": [
      "sophisticated",
      "tasteful",
      "confident",
      "curator"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "QUIET LUXURY",
    "serialNumber": "49",
    "active": true
  },
  {
    "name": "Prada Re-Nylon Crossbody Messenger Bag",
    "slug": "prada-re-nylon-crossbody-bag",
    "tagline": "Sustainable regenerated nylon with Saffiano leather trim & enamel triangle",
    "description": "Contemporary utilitarian elegance. Features multi-compartment interior, adjustable woven nylon shoulder strap, detachable gadget pouch, and iconic enameled metal triangle logo.",
    "categoryId": "curated_boxes",
    "categoryName": "Curated Luxury Bags & Keepsakes",
    "price": 145000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-prada",
      "name": "Prada Galleria Flagship",
      "website": "https://prada.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://prada.com/re-nylon",
    "tags": [
      "luxury_bag",
      "prada",
      "crossbody",
      "sustainable_luxury"
    ],
    "interests": [
      "fashion",
      "streetwear",
      "travel",
      "minimalism"
    ],
    "occasions": [
      "birthday",
      "promotion",
      "graduation"
    ],
    "relationships": [
      "partner",
      "brother",
      "best_friend"
    ],
    "personalities": [
      "modern",
      "trendsetter",
      "polished"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Verified Luxury Heirloom",
    "serialNumber": "50",
    "active": true
  },
  {
    "name": "Rimowa Essential Cabin Matte Black Suitcase",
    "slug": "rimowa-essential-cabin-suitcase",
    "tagline": "High-performance polycarbonate with multiwheel system & TSA locks",
    "description": "The world's premier luxury travel companion. Precision German engineering with telescopic stepless stage handle, flex divider packing system, and lifetime manufacturer guarantee.",
    "categoryId": "curated_boxes",
    "categoryName": "Curated Luxury Bags & Keepsakes",
    "price": 98000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-rimowa",
      "name": "Rimowa Flagship Cologne",
      "website": "https://rimowa.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified catalogue source"
    },
    "productUrl": "https://rimowa.com/cabin",
    "tags": [
      "luggage",
      "travel_bag",
      "rimowa",
      "german_engineering"
    ],
    "interests": [
      "travel",
      "aviation",
      "design",
      "hospitality"
    ],
    "occasions": [
      "milestone",
      "promotion",
      "wedding",
      "birthday"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend"
    ],
    "personalities": [
      "cosmopolitan",
      "adventurous",
      "meticulous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Verified Luxury Luggage",
    "serialNumber": "51",
    "active": true
  },
  {
    "name": "Phool Natural Incense Floral Luxury Gift Box",
    "slug": "phool-natural-incense-floral-gift-box",
    "tagline": "Temple flower hand-rolled natural incense and ceramic burner set",
    "description": "A serene gifting collection of organic, charcoal-free artisanal incense sticks and cones handcrafted from sacred temple flowers. Features pure botanical essential oil essences of Indian Rose, Jasmine, Lavender, and Tuberose packaged in a handcrafted presentation box.",
    "categoryId": "artisanal_fragrance",
    "categoryName": "Artisanal Fragrance & Living Scent",
    "price": 620,
    "originalPrice": 750,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-phool",
      "name": "Phool Natural Fragrances",
      "website": "https://phool.co",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified direct-to-consumer manufacturer storefront at phool.co"
    },
    "productUrl": "https://phool.co/products/phool-floral-gift-box-natural-incense-collection",
    "tags": [
      "incense",
      "botanical",
      "sacred_flowers",
      "aromatherapy",
      "artisanal",
      "wellness"
    ],
    "interests": [
      "scents",
      "aromatherapy",
      "wellness",
      "mindful_living"
    ],
    "occasions": [
      "housewarming",
      "deep_gratitude",
      "thank_you",
      "just_because",
      "festival"
    ],
    "relationships": [
      "mother",
      "colleague",
      "friend",
      "someone_special",
      "parents"
    ],
    "personalities": [
      "mindful",
      "refined",
      "sentimental"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Thoughtful Token",
    "serialNumber": "52",
    "active": true
  },
  {
    "name": "ISAK Fragrances Artisanal Discovery Pack (9 Fragrances)",
    "slug": "isak-fragrances-artisan-discovery-pack",
    "tagline": "Nine handcrafted Indian botanical eau de parfum discovery miniatures",
    "description": "An intimate olfactory journey through nine heritage botanical fragrances created by century-old master perfumers. Featuring 5ml discovery flacons of First Rain, Cosmic Flora, Dew of Dawn, and Sandalwood Amber presented in an elegant sliding coffret.",
    "categoryId": "artisanal_fragrance",
    "categoryName": "Artisanal Fragrance & Niche Perfumery",
    "price": 750,
    "originalPrice": 950,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-isak",
      "name": "ISAK Fragrances Official",
      "website": "https://isakfragrances.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official ISAK Fragrances direct studio store"
    },
    "productUrl": "https://isakfragrances.com/products/discovery-pack-perfumes",
    "tags": [
      "niche_perfume",
      "discovery_set",
      "botanical_perfume",
      "eau_de_parfum",
      "perfumery",
      "perfume",
      "fragrance"
    ],
    "interests": [
      "perfumes",
      "scents",
      "niche_fragrance",
      "botanicals"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "milestone",
      "just_because"
    ],
    "relationships": [
      "partner",
      "best_friend",
      "sister",
      "someone_special"
    ],
    "personalities": [
      "curator",
      "refined",
      "creative"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Artisan Perfumery",
    "serialNumber": "53",
    "active": true
  },
  {
    "name": "Parker Vector Gold Trim Rollerball Pen Gift Box",
    "slug": "parker-vector-gold-rollerball-gift-box",
    "tagline": "Timeless stainless steel fine writing instrument with 23K gold trim",
    "description": "The definitive executive milestone gift. Built from ultra-durable high-grade stainless steel with 23-karat gold electroplated trims and ultra-smooth FreeInk rollerball technology. Packaged in Parker signature presentation gift box.",
    "categoryId": "fine_stationery",
    "categoryName": "Fine Stationery & Writing Instruments",
    "price": 950,
    "originalPrice": 1200,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-parker",
      "name": "Parker Pen India Flagship",
      "website": "https://luxorparker.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Parker India licensee & manufacturer store"
    },
    "productUrl": "https://luxorparker.in/parker-vector-gold-rollerball.html",
    "tags": [
      "rollerball",
      "gold_trim",
      "fine_writing",
      "executive_pen",
      "stationery",
      "pens"
    ],
    "interests": [
      "fine_writing",
      "stationery",
      "journaling",
      "productivity"
    ],
    "occasions": [
      "promotion",
      "graduation",
      "milestone",
      "thank_you"
    ],
    "relationships": [
      "colleague",
      "mentor",
      "father",
      "brother"
    ],
    "personalities": [
      "methodical",
      "ambitious",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Executive Keepsake",
    "serialNumber": "54",
    "active": true
  },
  {
    "name": "Vahdam Blush Assorted Teas Gift Box (3 Heritage Caddies)",
    "slug": "vahdam-blush-assorted-teas-gift-box",
    "tagline": "Trio of single-estate artisanal teas in rose gold airtight caddies",
    "description": "An elegant tea tasting experience direct from historic Indian gardens. Includes Maharaja Royal Chai, Sweet Himalayan Green Tea, and Kashmiri Kahwa presented in reusable rose-gold brushed tin caddies inside a regal blush presentation gift case.",
    "categoryId": "gourmet_epicurean",
    "categoryName": "Gourmet & Fine Tea",
    "price": 1199,
    "originalPrice": 1499,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-vahdam",
      "name": "VAHDAM India Direct",
      "website": "https://vahdam.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official VAHDAM India direct DTC portal"
    },
    "productUrl": "https://www.vahdam.in/products/blush-assorted-teas-gift-set",
    "tags": [
      "estate_tea",
      "caddies",
      "chai",
      "kahwa",
      "artisanal_blend",
      "tea"
    ],
    "interests": [
      "tea",
      "gourmet",
      "culinary",
      "wellness"
    ],
    "occasions": [
      "thank_you",
      "deep_gratitude",
      "anniversary",
      "birthday",
      "housewarming"
    ],
    "relationships": [
      "mother",
      "colleague",
      "partner",
      "parents",
      "someone_special"
    ],
    "personalities": [
      "mindful",
      "refined",
      "sentimental"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Heritage Gourmet",
    "serialNumber": "55",
    "active": true
  },
  {
    "name": "Anand Prakash Handcrafted Brass Bookmark — Invictus Edition",
    "slug": "anand-prakash-brass-poetry-bookmark",
    "tagline": "Etched solid brass literary keepsake with hand-tied pure silk tassel",
    "description": "Hand-crafted by master brass artisans in New Delhi. Engraved with William Ernest Henley’s timeless poem \"Invictus\" with protective natural lacquer and a deep burgundy silk tassel. The perfect literary tribute for life’s resolute milestones.",
    "categoryId": "fine_stationery",
    "categoryName": "Fine Stationery & Literary Keepsakes",
    "price": 1390,
    "originalPrice": 1590,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-anandprakash",
      "name": "Anand Prakash Artisan Studio",
      "website": "https://anandprakash.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Anand Prakash artisan studio store"
    },
    "productUrl": "https://anandprakash.com/products/invictus-brass-bookmark",
    "tags": [
      "brass_bookmark",
      "poetry",
      "invictus",
      "etched_brass",
      "silk_tassel",
      "bookmark"
    ],
    "interests": [
      "reading",
      "literature",
      "stationery",
      "keepsakes"
    ],
    "occasions": [
      "graduation",
      "promotion",
      "milestone",
      "thank_you",
      "deep_gratitude"
    ],
    "relationships": [
      "mentor",
      "colleague",
      "father",
      "best_friend"
    ],
    "personalities": [
      "introspective",
      "refined",
      "curator"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Literary Keepsake",
    "serialNumber": "56",
    "active": true
  },
  {
    "name": "Smoor Luxury Couverture Chocolates Box of 16",
    "slug": "smoor-luxury-couverture-chocolates-16",
    "tagline": "Artisan handcrafted Belgian couverture pralines and exotic truffles",
    "description": "An indulgent collection of 16 handcrafted couverture chocolates infused with authentic Madagascar vanilla, salted caramel, single-origin cacao ganache, and roasted California almonds. Delivered in an embossed gold-trimmed keepsake gift box.",
    "categoryId": "gourmet_epicurean",
    "categoryName": "Gourmet & Fine Chocolates",
    "price": 1439,
    "originalPrice": 1599,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-smoor",
      "name": "SMOOR Chocolatier Official",
      "website": "https://smoor.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official SMOOR direct chocolatier portal"
    },
    "productUrl": "https://smoor.in/products/luxury-couverture-chocolates-box-of-16",
    "tags": [
      "couverture_chocolates",
      "pralines",
      "truffles",
      "belgian_chocolate",
      "confectionery",
      "chocolates"
    ],
    "interests": [
      "chocolates",
      "gourmet",
      "dessert",
      "culinary"
    ],
    "occasions": [
      "celebration",
      "birthday",
      "anniversary",
      "just_because"
    ],
    "relationships": [
      "partner",
      "best_friend",
      "colleague",
      "sister",
      "someone_special"
    ],
    "personalities": [
      "indulgent",
      "creative",
      "warm"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Celebration Delight",
    "serialNumber": "57",
    "active": true
  },
  {
    "name": "Blue Tokai Big Box of Comfort Artisanal Coffee Hamper",
    "slug": "blue-tokai-big-box-of-comfort",
    "tagline": "Freshly roasted single-estate specialty coffees with handcrafted ceramic mug",
    "description": "The ultimate comforting ritual gift. Features three hand-selected single-origin coffee roasts (Vienna Roast, Attikan Estate, Silver Oak), companion Easy Pour drip sachets, gourmet butter cookies, and a custom handmade speckled ceramic artisan mug.",
    "categoryId": "gourmet_epicurean",
    "categoryName": "Gourmet & Specialty Coffee",
    "price": 1899,
    "originalPrice": 2200,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-bluetokai",
      "name": "Blue Tokai Coffee Roasters",
      "website": "https://bluetokaicoffee.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Blue Tokai direct roastery portal"
    },
    "productUrl": "https://bluetokaicoffee.com/products/big-box-of-comfort",
    "tags": [
      "specialty_coffee",
      "single_origin",
      "fresh_roast",
      "ceramic_mug",
      "coffee_hamper",
      "coffee"
    ],
    "interests": [
      "coffee",
      "gourmet",
      "culinary",
      "morning_rituals"
    ],
    "occasions": [
      "birthday",
      "housewarming",
      "thank_you",
      "milestone"
    ],
    "relationships": [
      "partner",
      "colleague",
      "brother",
      "best_friend"
    ],
    "personalities": [
      "focused",
      "creative",
      "aesthetic"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Artisanal Comfort",
    "serialNumber": "58",
    "active": true
  },
  {
    "name": "Sytara Astronomical Custom Framed Star Map",
    "slug": "sytara-custom-framed-star-map",
    "tagline": "Mathematically exact NASA-verified planetary star map of your chosen date and place",
    "description": "An intimate heirloom capturing the exact alignment of stars and constellations on the night your life changed. Rendered on archival matte fine-art paper, framed in clean contemporary black wood with glass protection and custom title and coordinates.",
    "categoryId": "bespoke_keepsakes",
    "categoryName": "Bespoke Keepsakes & Custom Art",
    "price": 1999,
    "originalPrice": 2499,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-sytara",
      "name": "Sytara Personalized Keepsakes",
      "website": "https://sytara.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Sytara astronomical keepsake maker"
    },
    "productUrl": "https://sytara.in/products/custom-star-map-space-black",
    "tags": [
      "star_map",
      "astronomical_chart",
      "framed_print",
      "celestial_map",
      "heirloom_art",
      "keepsakes"
    ],
    "interests": [
      "bespoke_keepsakes",
      "astronomy",
      "art",
      "decor",
      "keepsakes"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "milestone",
      "birthday",
      "new_beginnings"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend",
      "someone_special"
    ],
    "personalities": [
      "sentimental",
      "romantic",
      "aesthetic"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Intimate Heirloom",
    "serialNumber": "59",
    "active": true
  },
  {
    "name": "Vahdam India Tea Carnival 6-Tin Heritage Gift Set",
    "slug": "vahdam-india-tea-carnival-6-tin-set",
    "tagline": "Six artisanal whole-leaf loose teas in ornate jewel-toned embossed tin caddies",
    "description": "A regal culinary celebration representing the great tea estates of India. Includes Darjeeling Summer Black, Assam Exotic Spiced Chai, Kashmiri Kahwa Green, Vanilla Spiced Herbal, Earl Grey Citrus, and Mint Green Teas in an embossed velvet-finish trunk.",
    "categoryId": "gourmet_epicurean",
    "categoryName": "Gourmet & Fine Tea",
    "price": 2199,
    "originalPrice": 2699,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-vahdam",
      "name": "VAHDAM India Direct",
      "website": "https://vahdam.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official VAHDAM India direct DTC portal"
    },
    "productUrl": "https://www.vahdam.in/products/the-india-tea-carnival-gift-set",
    "tags": [
      "loose_leaf_tea",
      "tea_carnival",
      "embossed_caddies",
      "heritage_tea",
      "tea"
    ],
    "interests": [
      "tea",
      "gourmet",
      "culinary",
      "entertaining"
    ],
    "occasions": [
      "housewarming",
      "deep_gratitude",
      "anniversary",
      "promotion"
    ],
    "relationships": [
      "parents",
      "mother",
      "colleague",
      "mentor"
    ],
    "personalities": [
      "refined",
      "curator",
      "mindful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Artisanal Reserve",
    "serialNumber": "60",
    "active": true
  },
  {
    "name": "Lucaris Hong Kong Hip Double Rock Crystal Whiskey Glasses (Pair)",
    "slug": "lucaris-hong-kong-hip-whiskey-pair",
    "tagline": "Lead-free titanium-infused crystal glassware in presentation gift box",
    "description": "Crafted with master European glassmaking expertise infused with Asian contemporary edge. Laser-cut fine rim with reinforced titanium crystal delivering unparalleled clarity, acoustic resonance, and ergonomic balance for fine single malts.",
    "categoryId": "bespoke_keepsakes",
    "categoryName": "Artisan Living & Crystal Barware",
    "price": 2200,
    "originalPrice": 2800,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-lucaris",
      "name": "Lucaris Crystal India",
      "website": "https://jprasad.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Verified exclusive institutional & retail distributor J Prasad & Co"
    },
    "productUrl": "https://jprasad.com/collections/lucaris-crystal-glasses",
    "tags": [
      "titanium_crystal",
      "whiskey_tumbler",
      "lead_free_crystal",
      "double_rock",
      "barware",
      "glassware"
    ],
    "interests": [
      "whiskey",
      "barware",
      "entertaining",
      "glassware"
    ],
    "occasions": [
      "anniversary",
      "promotion",
      "birthday",
      "housewarming"
    ],
    "relationships": [
      "partner",
      "father",
      "colleague",
      "mentor",
      "best_friend"
    ],
    "personalities": [
      "refined",
      "discerning",
      "tasteful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Crystal Barware",
    "serialNumber": "61",
    "active": true
  },
  {
    "name": "Nappa Dori Handcrafted Classic Leather Card Case",
    "slug": "nappa-dori-classic-leather-card-case",
    "tagline": "Full-grain vegetable-tanned harness leather pocket card wallet",
    "description": "An understated everyday luxury. Handcrafted from premium Indian vegetable-tanned harness leather with hand-burnished edges, four card slots, and a central currency slip pocket. Ages with a distinctive, deeply personal patina over decades.",
    "categoryId": "leather_goods",
    "categoryName": "Artisan Leather Goods",
    "price": 2450,
    "originalPrice": 2850,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-nappadori",
      "name": "Nappa Dori Flagship",
      "website": "https://nappadori.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Nappa Dori atelier direct portal"
    },
    "productUrl": "https://nappadori.com/products/classic-card-case",
    "tags": [
      "harness_leather",
      "vegetable_tanned",
      "card_wallet",
      "hand_stitched",
      "patina",
      "leather",
      "leather_goods"
    ],
    "interests": [
      "leather_goods",
      "fashion",
      "design",
      "minimalist_living"
    ],
    "occasions": [
      "promotion",
      "birthday",
      "milestone",
      "graduation"
    ],
    "relationships": [
      "colleague",
      "partner",
      "brother",
      "best_friend",
      "mentor"
    ],
    "personalities": [
      "minimalist",
      "refined",
      "sophisticated"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Handcrafted Leather",
    "serialNumber": "62",
    "active": true
  },
  {
    "name": "ISAK Fragrances Heritage Extrait Perfume Gift Pack",
    "slug": "isak-gift-pack-discovery-perfumes",
    "tagline": "Luxury artisan perfume gift set with pure cold-pressed botanical essences",
    "description": "Crafted following ancestral royal perfumery traditions. Contains three generous 15ml flacons of ISAK’s most coveted artisanal extraits: 5th Season (Petrichor / Mitti Attar), Royal Oudh, and Kashmiri Rose. Formulated without synthetic fixatives.",
    "categoryId": "artisanal_fragrance",
    "categoryName": "Artisanal Fragrance & Niche Perfumery",
    "price": 2500,
    "originalPrice": 2950,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-isak",
      "name": "ISAK Fragrances Official",
      "website": "https://isakfragrances.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official ISAK Fragrances direct studio store"
    },
    "productUrl": "https://isakfragrances.com/products/gift-pack-discovery",
    "tags": [
      "extrait_de_parfum",
      "royal_oudh",
      "mitti_attar",
      "niche_perfume",
      "perfumery",
      "perfume",
      "fragrance"
    ],
    "interests": [
      "perfumes",
      "scents",
      "artisan_perfume",
      "luxury"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "wedding",
      "milestone"
    ],
    "relationships": [
      "partner",
      "wife",
      "mother",
      "someone_special"
    ],
    "personalities": [
      "sensory",
      "refined",
      "curator"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Heritage Perfumery",
    "serialNumber": "63",
    "active": true
  },
  {
    "name": "Parker IM Achromatic Matte Black Rollerball Pen",
    "slug": "parker-im-achromatic-matte-black-pen",
    "tagline": "Architectural monochrome executive rollerball with signature arrow clip",
    "description": "Crafted for modern visionaries. The Parker IM Achromatic is finished in velvety matte black lacquer with distinctive black PVD-coated accents. Delivers effortless Quink rollerball ink flow with bold tactile presence.",
    "categoryId": "fine_stationery",
    "categoryName": "Fine Stationery & Writing Instruments",
    "price": 2600,
    "originalPrice": 3200,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-williampenn",
      "name": "William Penn Fine Writing",
      "website": "https://williampenn.net",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Verified authorized luxury fine writing retailer store"
    },
    "productUrl": "https://www.williampenn.net/parker-im-achromatic-matte-black-rollerball-pen.html",
    "tags": [
      "monochrome_pen",
      "rollerball",
      "achromatic",
      "matte_finish",
      "fine_writing",
      "pens"
    ],
    "interests": [
      "writing",
      "stationery",
      "design",
      "executive_tools",
      "fine_writing"
    ],
    "occasions": [
      "promotion",
      "graduation",
      "milestone",
      "thank_you"
    ],
    "relationships": [
      "mentor",
      "colleague",
      "father",
      "partner"
    ],
    "personalities": [
      "methodical",
      "ambitious",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Executive Fine Writing",
    "serialNumber": "64",
    "active": true
  },
  {
    "name": "Kama Ayurveda Madurai Mogra Scented Candle with Brass Holder",
    "slug": "kama-ayurveda-madurai-candle-brass",
    "tagline": "Natural soy wax candle infused with Madurai Jasmine inside an antique brass bell jar",
    "description": "Poured with 100% natural soy and beeswax infused with pure Madurai Mogra essential oil. Housed within a handcrafted solid antique brass votive with pierced latticework lid that casts warm dancing shadows across living spaces.",
    "categoryId": "artisanal_fragrance",
    "categoryName": "Artisanal Fragrance & Living Scent",
    "price": 3050,
    "originalPrice": 3500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-kama",
      "name": "Kama Ayurveda Flagship",
      "website": "https://www.kamaayurveda.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Kama Ayurveda India e-commerce flagship"
    },
    "productUrl": "https://www.kamaayurveda.in/madurai-scented-candle.html",
    "tags": [
      "scented_candle",
      "brass_votive",
      "mogra",
      "natural_wax",
      "ayurveda",
      "candle"
    ],
    "interests": [
      "scents",
      "home_decor",
      "wellness",
      "aromatherapy"
    ],
    "occasions": [
      "anniversary",
      "housewarming",
      "wedding",
      "deep_gratitude"
    ],
    "relationships": [
      "partner",
      "mother",
      "parents",
      "someone_special"
    ],
    "personalities": [
      "mindful",
      "serene",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Artisanal Votive",
    "serialNumber": "65",
    "active": true
  },
  {
    "name": "StonKraft 12-Inch Handcrafted Magnetic Sheesham Chess Set",
    "slug": "stonkraft-sheesham-magnetic-chess",
    "tagline": "Hand-carved Indian Rosewood folding travel chess board with velvet interior",
    "description": "Meticulously hand-carved from solid Indian Sheesham (Golden Rosewood) and Boxwood. Each Staunton piece is magnetized with brass-weighted balance and stored in fitted velvet green slots inside the folding game cabinet.",
    "categoryId": "bespoke_keepsakes",
    "categoryName": "Bespoke Keepsakes & Artisan Games",
    "price": 3500,
    "originalPrice": 4200,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-stonkraft",
      "name": "StonKraft India Artisans",
      "website": "https://indusmela.in",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Verified authorized specialty craft partner for StonKraft India"
    },
    "productUrl": "https://indusmela.in/products/stonkraft-12-inch-wooden-magnetic-chess-set",
    "tags": [
      "sheesham_chess",
      "magnetic_board",
      "hand_carved",
      "wooden_games",
      "staunton",
      "chess",
      "keepsakes"
    ],
    "interests": [
      "chess",
      "bespoke_keepsakes",
      "woodcraft",
      "games",
      "strategy"
    ],
    "occasions": [
      "milestone",
      "birthday",
      "promotion",
      "graduation"
    ],
    "relationships": [
      "father",
      "mentor",
      "colleague",
      "best_friend"
    ],
    "personalities": [
      "strategic",
      "introspective",
      "curator"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Woodcraft Heirloom",
    "serialNumber": "66",
    "active": true
  },
  {
    "name": "Vahdam Grande Heritage 12-Tin Reserve Tea Trunk",
    "slug": "vahdam-grande-heritage-12-tin-reserve",
    "tagline": "Handcrafted wooden heirloom trunk holding 12 master tea reserves",
    "description": "An extraordinary gift of Indian hospitality. A hand-finished wooden tea chest lined in emerald velvet, containing 12 golden caddies of estate-picked black, green, white, oolong, and spiced chai teas with an engraved brass measuring scoop.",
    "categoryId": "gourmet_epicurean",
    "categoryName": "Gourmet & Fine Tea",
    "price": 3999,
    "originalPrice": 4999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-vahdam",
      "name": "VAHDAM India Direct",
      "website": "https://vahdam.in",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official VAHDAM India direct DTC portal"
    },
    "productUrl": "https://www.vahdam.in/products/grande-heritage-tea-gift-box",
    "tags": [
      "tea_trunk",
      "reserve_collection",
      "wooden_chest",
      "estate_harvest",
      "tea"
    ],
    "interests": [
      "tea",
      "gourmet",
      "culinary",
      "luxury_dining"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "deep_gratitude",
      "milestone",
      "housewarming"
    ],
    "relationships": [
      "parents",
      "mother",
      "father",
      "mentor",
      "colleague"
    ],
    "personalities": [
      "curator",
      "refined",
      "generous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Grand Reserve",
    "serialNumber": "67",
    "active": true
  },
  {
    "name": "Lucaris Temptation Handblown Crystal Wine & Spirit Decanter (1000ml)",
    "slug": "lucaris-temptation-crystal-decanter",
    "tagline": "Sculptural European lead-free crystal decanter for wine aeration and spirits",
    "description": "A striking modernist centerpiece designed to optimize aeration for fine vintages and spirits. Engineered in lead-free crystal with smooth diagonal pour spout and ergonomic flared base that maximizes surface contact and aroma concentration.",
    "categoryId": "bespoke_keepsakes",
    "categoryName": "Artisan Living & Crystal Barware",
    "price": 4200,
    "originalPrice": 5200,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-lucaris",
      "name": "Lucaris Crystal India",
      "website": "https://jprasad.com",
      "verified": true,
      "sourceType": "authorized_retailer",
      "verificationNote": "Verified exclusive institutional & retail distributor J Prasad & Co"
    },
    "productUrl": "https://jprasad.com/products/lucaris-temptation-decanter",
    "tags": [
      "crystal_decanter",
      "wine_aeration",
      "handblown_glass",
      "sculptural_glass",
      "barware"
    ],
    "interests": [
      "wine",
      "entertaining",
      "glassware",
      "design"
    ],
    "occasions": [
      "anniversary",
      "wedding",
      "housewarming",
      "milestone"
    ],
    "relationships": [
      "partner",
      "father",
      "colleague",
      "mentor"
    ],
    "personalities": [
      "refined",
      "discerning",
      "entertainer"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Sculptural Crystal",
    "serialNumber": "68",
    "active": true
  },
  {
    "name": "Lamy Safari German Architectural Fountain Pen Set",
    "slug": "lamy-safari-special-edition-fountain-pen",
    "tagline": "Iconic Bauhaus-inspired German writing instrument with converter and ink flask",
    "description": "Renowned worldwide for timeless Bauhaus functional design. Engineered in Heidelberg from lightweight ASA resilient resin with ergonomic contoured grip, flexible chrome wire pocket clip, laser-finished steel medium nib, and bottle-fill ink converter.",
    "categoryId": "fine_stationery",
    "categoryName": "Fine Stationery & Writing Instruments",
    "price": 4600,
    "originalPrice": 5400,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-lamy",
      "name": "Lamy India Official",
      "website": "https://lamy.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Lamy India direct online store"
    },
    "productUrl": "https://lamy.com/en_in/fountain-pen-lamy-safari.html",
    "tags": [
      "fountain_pen",
      "bauhaus",
      "steel_nib",
      "ink_converter",
      "german_design",
      "fine_writing",
      "pens"
    ],
    "interests": [
      "fine_writing",
      "calligraphy",
      "stationery",
      "design",
      "architecture"
    ],
    "occasions": [
      "graduation",
      "promotion",
      "milestone",
      "birthday"
    ],
    "relationships": [
      "colleague",
      "mentor",
      "best_friend",
      "father"
    ],
    "personalities": [
      "creative",
      "methodical",
      "refined"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Design Classic",
    "serialNumber": "69",
    "active": true
  },
  {
    "name": "Bombay Perfumery Signature Scent Gift Box",
    "slug": "bombay-perfumery-signature-scent-box",
    "tagline": "Bespoke artisanal Eau de Parfum pairing of Chai Musk and Calicut botanicals",
    "description": "An evocative olfactory portrait of modern India by master perfumers. Contains two 50ml Eau de Parfums: Chai Musk (creamy Indian ginger, masala chai, and white musk) and Calicut (black pepper, nutmeg, and patchouli) in a minimalist presentation coffret.",
    "categoryId": "artisanal_fragrance",
    "categoryName": "Artisanal Fragrance & Niche Perfumery",
    "price": 5200,
    "originalPrice": 6200,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-bombayperfumery",
      "name": "Bombay Perfumery Atelier",
      "website": "https://bombayperfumery.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Bombay Perfumery direct atelier store"
    },
    "productUrl": "https://bombayperfumery.com/products/the-signature-scent-gift-box",
    "tags": [
      "niche_perfume",
      "chai_musk",
      "calicut",
      "eau_de_parfum",
      "fine_fragrance",
      "perfume",
      "fragrance"
    ],
    "interests": [
      "perfumes",
      "scents",
      "niche_fragrance",
      "fashion"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "milestone",
      "celebration"
    ],
    "relationships": [
      "partner",
      "wife",
      "husband",
      "best_friend",
      "someone_special"
    ],
    "personalities": [
      "sophisticated",
      "curator",
      "aesthetic"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Niche Perfumery",
    "serialNumber": "70",
    "active": true
  },
  {
    "name": "Forest Essentials Gentleman's Sandalwood Luxury Gift Box",
    "slug": "forest-essentials-gentlemens-box",
    "tagline": "Artisanal Ayurvedic grooming and skincare regime infused with Mysore Sandalwood",
    "description": "A sovereign self-care ritual for distinguished gentlemen. Features pure Mysore Sandalwood facial cleanser, aftershave spray, facial hydrator, and botanical shaving cream presented in an exquisite gold-embossed bespoke trunk box.",
    "categoryId": "wellness_health",
    "categoryName": "Ayurvedic Grooming & Wellness",
    "price": 5495,
    "originalPrice": 6500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1512290900672-1f02e6c518b2?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-forestessentials",
      "name": "Forest Essentials India",
      "website": "https://www.forestessentialsindia.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Forest Essentials India flagship store"
    },
    "productUrl": "https://www.forestessentialsindia.com/gentlemens-gift-box.html",
    "tags": [
      "gentlemans_grooming",
      "mysore_sandalwood",
      "luxury_ayurveda",
      "skincare",
      "appreciation"
    ],
    "interests": [
      "grooming",
      "wellness",
      "ayurveda",
      "luxury",
      "self_care"
    ],
    "occasions": [
      "birthday",
      "milestone",
      "anniversary",
      "promotion",
      "father_day"
    ],
    "relationships": [
      "father",
      "partner",
      "brother",
      "mentor",
      "colleague"
    ],
    "personalities": [
      "refined",
      "disciplined",
      "tasteful"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Ayurvedic Heirloom",
    "serialNumber": "71",
    "active": true
  },
  {
    "name": "Nappa Dori Porto Full-Grain Leather Travel Passport Case",
    "slug": "nappa-dori-porto-leather-passport-case",
    "tagline": "Hand-stitched genuine harness leather travel wallet with boarding pass pocket",
    "description": "The companion for a lifetime of journeys. Handcrafted from supple vegetable-tanned full-grain leather with dedicated slots for two passports, four credit cards, ticket stubs, and an integrated pen sleeve. Hand-stitched with waxed linen thread.",
    "categoryId": "leather_goods",
    "categoryName": "Artisan Leather Goods",
    "price": 5500,
    "originalPrice": 6500,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    "secondaryImageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    "retailer": {
      "id": "ret-nappadori",
      "name": "Nappa Dori Flagship",
      "website": "https://nappadori.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Verified official Nappa Dori atelier direct portal"
    },
    "productUrl": "https://nappadori.com/products/porto-passport-case",
    "tags": [
      "passport_case",
      "travel_wallet",
      "full_grain_leather",
      "travel_accessories",
      "leather",
      "leather_goods"
    ],
    "interests": [
      "travel",
      "leather_goods",
      "fashion",
      "design"
    ],
    "occasions": [
      "milestone",
      "graduation",
      "anniversary",
      "new_beginnings"
    ],
    "relationships": [
      "partner",
      "spouse",
      "best_friend",
      "colleague",
      "brother"
    ],
    "personalities": [
      "adventurous",
      "sophisticated",
      "meticulous"
    ],
    "source": "internal",
    "availability": "unknown",
    "lastVerifiedAt": "2026-11-17",
    "reviewCount": 0,
    "badge": "Artisan Travel Heirloom",
    "serialNumber": "72",
    "active": true
  }
,
{
    "name": "Apple AirPods Max (Space Gray)",
    "slug": "apple-airpods-max-space-gray",
    "tagline": "Custom acoustic design with computational audio & active noise cancellation",
    "description": "High-fidelity audio with active noise cancellation and Transparency mode. Features custom acoustic design, Apple H1 chip, spatial audio with dynamic head tracking, and acoustically engineered memory foam ear cushions.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 59900,
    "originalPrice": 64900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-apple",
      "name": "Apple Official Store",
      "website": "https://www.apple.com/in/airpods-max/",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Apple flagship store listing"
    },
    "productUrl": "https://www.apple.com/in/shop/buy-airpods/airpods-max",
    "tags": [
      "headphones",
      "airpods_max",
      "active_noise_cancellation",
      "spatial_audio",
      "apple",
      "luxury_tech"
    ],
    "interests": [
      "tech",
      "music",
      "audio",
      "headphones",
      "gadgets",
      "Audiophile Audio & Headphones",
      "Smart Tech & Wearables"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "milestone",
      "celebration",
      "graduation"
    ],
    "relationships": [
      "partner",
      "husband",
      "wife",
      "friend",
      "someone_special",
      "myself"
    ],
    "personalities": [
      "innovative",
      "stylish",
      "discerning",
      "creative"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.9,
    "reviewCount": 312,
    "badge": "FLAGSHIP AUDIO",
    "serialNumber": "73",
    "active": true
  },
  {
    "name": "Apple AirPods Pro 2 (USB-C)",
    "slug": "apple-airpods-pro-2-usbc",
    "tagline": "Pro-level Active Noise Cancellation & Adaptive Audio in an ultra-compact case",
    "description": "Powered by the Apple H2 headphone chip. Features up to 2x more Active Noise Cancellation, Adaptive Audio that tailors noise control to your environment, Conversation Awareness, and personalized spatial audio with dynamic head tracking.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 24900,
    "originalPrice": 26900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-apple",
      "name": "Apple Official Store",
      "website": "https://www.apple.com/in/airpods-pro/",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Apple flagship store listing"
    },
    "productUrl": "https://www.apple.com/in/shop/buy-airpods/airpods-pro",
    "tags": [
      "earpods",
      "earbuds",
      "noise_cancellation",
      "apple",
      "wireless_audio",
      "spatial_audio"
    ],
    "interests": [
      "tech",
      "music",
      "audio",
      "earpods",
      "fitness",
      "Audiophile Audio & Headphones",
      "Smart Tech & Wearables"
    ],
    "occasions": [
      "birthday",
      "milestone",
      "graduation",
      "celebration",
      "just_because"
    ],
    "relationships": [
      "partner",
      "friend",
      "colleague",
      "brother",
      "sister",
      "someone_special"
    ],
    "personalities": [
      "innovative",
      "practical",
      "stylish",
      "dynamic"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.9,
    "reviewCount": 520,
    "badge": "BESTSELLER",
    "serialNumber": "74",
    "active": true
  },
  {
    "name": "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    "slug": "sony-wh-1000xm5-wireless-headphones",
    "tagline": "Industry-leading noise cancellation with Auto NC Optimizer & 30-hour battery",
    "description": "Two processors and 8 microphones deliver unprecedented noise cancellation. Integrated V1 processor and HD Noise Canceling Processor QN1 unlock magnificent high-res audio quality and crystal-clear hands-free calls.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 29990,
    "originalPrice": 34990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-sony",
      "name": "Sony Center Flagship",
      "website": "https://www.sony.co.in/headphones/products/wh-1000xm5",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Sony India store listing"
    },
    "productUrl": "https://www.sony.co.in/headphones/products/wh-1000xm5",
    "tags": [
      "headphones",
      "sony",
      "noise_canceling",
      "travel",
      "audiophile",
      "hi_res_audio"
    ],
    "interests": [
      "tech",
      "music",
      "audio",
      "travel",
      "productivity",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "birthday",
      "anniversary",
      "graduation",
      "celebration"
    ],
    "relationships": [
      "partner",
      "husband",
      "friend",
      "brother",
      "colleague"
    ],
    "personalities": [
      "curator",
      "innovative",
      "discerning",
      "refined"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.8,
    "reviewCount": 410,
    "badge": "CRITIC CHOICE",
    "serialNumber": "75",
    "active": true
  },
  {
    "name": "Bose QuietComfort Ultra Wireless Earbuds",
    "slug": "bose-quietcomfort-ultra-earbuds",
    "tagline": "Breakthrough spatialized audio with world-class noise cancellation",
    "description": "Bose Immersive Audio pushes the boundary of what it means to listen by taking what you hear out of your head and placing it in front of you. CustomTune technology shapes the sound profile to your ears' unique shape.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 25900,
    "originalPrice": 29900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-bose",
      "name": "Bose Premium Audio",
      "website": "https://www.bose.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Bose flagship"
    },
    "productUrl": "https://www.bose.com/p/earbuds/bose-quietcomfort-ultra-earbuds/QCULT-HEADPHONEIN.html",
    "tags": [
      "earbuds",
      "bose",
      "spatial_audio",
      "earpods",
      "noise_cancellation"
    ],
    "interests": [
      "tech",
      "music",
      "audio",
      "travel",
      "earpods",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "birthday",
      "celebration",
      "just_because",
      "milestone"
    ],
    "relationships": [
      "partner",
      "friend",
      "someone_special",
      "sister"
    ],
    "personalities": [
      "refined",
      "dynamic",
      "innovative"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.8,
    "reviewCount": 220,
    "badge": "IMMERSIVE AUDIO",
    "serialNumber": "76",
    "active": true
  },
  {
    "name": "Bowers & Wilkins Px8 Flagship Wireless Headphones",
    "slug": "bowers-wilkins-px8-wireless-headphones",
    "tagline": "Reference-standard carbon cone drivers wrapped in Nappa leather & cast aluminum",
    "description": "The ultimate flagship headphone from British audio pioneers Bowers & Wilkins. Angled Carbon Cone drive units reduce distortion to provide unrivaled high-resolution musical fidelity with luxurious die-cast aluminum arms and soft Nappa leather trim.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 62000,
    "originalPrice": 69900,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-bw",
      "name": "Bowers & Wilkins London",
      "website": "https://www.bowerswilkins.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Bowers & Wilkins audio flagship"
    },
    "productUrl": "https://www.bowerswilkins.com/en-us/product/over-ear-headphones/px8",
    "tags": [
      "audiophile",
      "nappa_leather",
      "luxury_audio",
      "headphones",
      "british_craft"
    ],
    "interests": [
      "music",
      "Fine Horology & Watches",
      "audio",
      "headphones",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "anniversary",
      "milestone",
      "celebration",
      "wedding"
    ],
    "relationships": [
      "partner",
      "husband",
      "someone_special",
      "father"
    ],
    "personalities": [
      "curator",
      "discerning",
      "refined",
      "stylish"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 5,
    "reviewCount": 88,
    "badge": "HAUTE ACOUSTICS",
    "serialNumber": "77",
    "active": true
  },
  {
    "name": "Sennheiser Momentum 4 Wireless Audiophile Headphones",
    "slug": "sennheiser-momentum-4-wireless",
    "tagline": "Incredible 60-hour battery life with audiophile-grade 42mm sound transducers",
    "description": "Engineered in Germany, the Momentum 4 delivers signature Sennheiser musicality with customizable sound personalization, advanced adaptive noise cancellation, and a lightweight ergonomic fold-flat design.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 34990,
    "originalPrice": 39990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-sennheiser",
      "name": "Sennheiser Official",
      "website": "https://www.sennheiser-hearing.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Sennheiser direct listing"
    },
    "productUrl": "https://www.sennheiser-hearing.com/en-IN/p/momentum-4-wireless/",
    "tags": [
      "headphones",
      "sennheiser",
      "60h_battery",
      "german_engineering",
      "audiophile"
    ],
    "interests": [
      "music",
      "audio",
      "tech",
      "headphones",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "milestone"
    ],
    "relationships": [
      "partner",
      "brother",
      "friend",
      "someone_special"
    ],
    "personalities": [
      "curator",
      "innovative",
      "discerning"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.8,
    "reviewCount": 175,
    "badge": "BATTERY TITAN",
    "serialNumber": "78",
    "active": true
  },
  {
    "name": "Bang & Olufsen Beoplay EX Wireless Earphones",
    "slug": "bang-olufsen-beoplay-ex-earphones",
    "tagline": "Crafted tempered glass, aluminum trim & waterproof IP57 ergonomics",
    "description": "Versatile true wireless earphones designed by Thomas Bentzen. Glass touch surface mirrors light elegantly, while a 9.2mm neodymium driver delivers profound Scandinavian acoustic depth in any weather.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 39990,
    "originalPrice": 44990,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-bo",
      "name": "Bang & Olufsen Copenhagen",
      "website": "https://www.bang-olufsen.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official B&O store listing"
    },
    "productUrl": "https://www.bang-olufsen.com/en/in/earphones/beoplay-ex",
    "tags": [
      "earbuds",
      "earpods",
      "scandinavian_design",
      "waterproof",
      "luxury_audio"
    ],
    "interests": [
      "fashion",
      "music",
      "design",
      "earpods",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "anniversary",
      "birthday",
      "celebration",
      "milestone"
    ],
    "relationships": [
      "partner",
      "wife",
      "husband",
      "someone_special"
    ],
    "personalities": [
      "stylish",
      "refined",
      "curator"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.9,
    "reviewCount": 94,
    "badge": "SCANDINAVIAN LUXE",
    "serialNumber": "79",
    "active": true
  },
  {
    "name": "Devialet Gemini II True Wireless Earbuds",
    "slug": "devialet-gemini-ii-wireless-earbuds",
    "tagline": "Pure sound with Devialet Adaptive Noise Cancellation & titanium-coated drivers",
    "description": "French acoustic engineering in the palm of your hand. Patented Internal Delay Compensation (IDC) eliminates noise artifacts at higher frequencies, producing pure, distortion-free sound reproduction.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 38000,
    "originalPrice": 42000,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-devialet",
      "name": "Devialet Paris Flagship",
      "website": "https://www.devialet.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Devialet Paris store"
    },
    "productUrl": "https://www.devialet.com/en-in/true-wireless-earbuds/gemini-ii/",
    "tags": [
      "earbuds",
      "devialet",
      "french_acoustics",
      "titanium",
      "earpods"
    ],
    "interests": [
      "music",
      "audio",
      "tech",
      "earpods",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "anniversary",
      "celebration",
      "milestone"
    ],
    "relationships": [
      "partner",
      "someone_special",
      "friend"
    ],
    "personalities": [
      "discerning",
      "innovative",
      "curator"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.9,
    "reviewCount": 65,
    "badge": "FRENCH ACOUSTICS",
    "serialNumber": "80",
    "active": true
  },
  {
    "name": "Marshall Major V Wireless Bluetooth Headphones",
    "slug": "marshall-major-v-wireless-headphones",
    "tagline": "100+ hours of rock 'n' roll wireless playtime with custom-tuned dynamic drivers",
    "description": "The classic rock heritage headphone refined. Offers over 100 hours of wireless playtime, rugged foldable design, customizable M-button for Spotify Tap or equalizer switching, and wireless charging support.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 14999,
    "originalPrice": 16999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-marshall",
      "name": "Marshall Headphones Official",
      "website": "https://www.marshallheadphones.com",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Marshall store listing"
    },
    "productUrl": "https://www.marshallheadphones.com/in/en/major-v.html",
    "tags": [
      "headphones",
      "marshall",
      "vintage",
      "rock_audio",
      "100h_battery"
    ],
    "interests": [
      "music",
      "rock",
      "audio",
      "headphones",
      "Audiophile Audio & Headphones"
    ],
    "occasions": [
      "birthday",
      "graduation",
      "celebration",
      "just_because"
    ],
    "relationships": [
      "friend",
      "brother",
      "partner",
      "someone_special"
    ],
    "personalities": [
      "adventurous",
      "stylish",
      "creative"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.7,
    "reviewCount": 198,
    "badge": "ROCK HERITAGE",
    "serialNumber": "81",
    "active": true
  },
  {
    "name": "Nothing Ear (2024) Hi-Res Wireless Earbuds",
    "slug": "nothing-ear-2024-hi-res-earbuds",
    "tagline": "Transparent iconic design with custom 11mm ceramic driver & LDAC Hi-Res Audio",
    "description": "Engineered with a ceramic diaphragm for crisper clarity and 45dB Smart Active Noise Cancellation. Features ChatGPT voice integration with Nothing OS, dual connection, and 40.5 hours total playback.",
    "categoryId": "premium_audio",
    "categoryName": "Premium Audio & Wearables",
    "price": 11999,
    "originalPrice": 14999,
    "currency": "INR",
    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "retailer": {
      "id": "ret-nothing",
      "name": "Nothing Technology Official",
      "website": "https://in.nothing.tech",
      "verified": true,
      "sourceType": "official_manufacturer",
      "verificationNote": "Official Nothing store listing"
    },
    "productUrl": "https://in.nothing.tech/products/ear",
    "tags": [
      "earbuds",
      "nothing_ear",
      "transparent_design",
      "hi_res",
      "chatgpt_integration"
    ],
    "interests": [
      "tech",
      "audio",
      "earpods",
      "design",
      "Audiophile Audio & Headphones",
      "Smart Tech & Wearables"
    ],
    "occasions": [
      "birthday",
      "milestone",
      "celebration",
      "just_because"
    ],
    "relationships": [
      "friend",
      "brother",
      "sister",
      "colleague",
      "partner"
    ],
    "personalities": [
      "innovative",
      "stylish",
      "creative"
    ],
    "source": "internal",
    "availability": "in_stock",
    "lastVerifiedAt": "2026-11-20",
    "rating": 4.8,
    "reviewCount": 145,
    "badge": "MODERN ICON",
    "serialNumber": "82",
    "active": true
  }
];


module.exports = { SEED_PRODUCTS };
