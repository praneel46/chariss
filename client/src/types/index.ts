export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  retailer: {
    id: string;
    name: string;
    website: string;
    verified: boolean;
  };
  productUrl: string;
  tags: string[];
  interests: string[];
  occasions: string[];
  relationships: string[];
  personalities: string[];
  source: 'internal' | 'affiliate';
  availability: 'in_stock' | 'low_stock' | 'made_to_order';
  lastVerifiedAt: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  serialNumber: string; // "01", "02" etc.
}

export interface OccasionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  popularCategories: string[];
  colorAccent: string;
  tag: string;
}

export interface ConsultationProfile {
  recipientName?: string;
  relationship: string;
  occasion: string;
  interests: string[];
  personality: string[];
  desiredEmotion: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  productCategories: string[];
  exclusions: string[];
  notes?: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  theme: 'minimal_floral' | 'modern_typography' | 'warm_editorial' | 'celebration' | 'quiet_luxury';
  bgClass: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans' | 'handwriting';
  stampIcon: string;
  previewNote: string;
}

export interface GiftCardState {
  recipientName: string;
  senderName: string;
  occasion: string;
  templateId: string;
  message: string;
  tone: 'heartfelt' | 'playful' | 'romantic' | 'formal' | 'poetic' | 'short';
  fontSize: 'sm' | 'md' | 'lg';
  alignment: 'left' | 'center' | 'right';
}

export interface BagItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
