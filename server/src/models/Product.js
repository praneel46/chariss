const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, trim: true },
    description: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    currency: { type: String, default: 'INR' },
    imageUrl: { type: String, required: true },
    secondaryImageUrl: { type: String },
    retailer: {
      id: { type: String, default: 'ret-01' },
      name: { type: String, required: true },
      website: { type: String, required: true },
      verified: { type: Boolean, default: true },
      sourceType: {
        type: String,
        enum: ['official_manufacturer', 'authorized_retailer', 'unverified'],
        default: 'official_manufacturer',
      },
      verificationNote: { type: String },
    },
    productUrl: { type: String, required: true },
    tags: [{ type: String }],
    interests: [{ type: String }],
    occasions: [{ type: String }],
    relationships: [{ type: String }],
    personalities: [{ type: String }],
    source: { type: String, enum: ['internal', 'affiliate'], default: 'internal' },
    availability: {
      type: String,
      enum: ['in_stock', 'low_stock', 'made_to_order', 'unknown'],
      default: 'unknown',
    },
    lastVerifiedAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String },
    serialNumber: { type: String, default: '01' },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

productSchema.index({ active: 1, price: 1 });
productSchema.index({ active: 1, categoryId: 1 });

module.exports = mongoose.model('Product', productSchema);
