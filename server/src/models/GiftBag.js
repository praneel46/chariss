const mongoose = require('mongoose');

const giftBagSchema = new mongoose.Schema(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestSessionHash: {
      type: String,
      default: null,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, default: '' },
      productUrl: { type: String, default: '#' },
      categoryName: { type: String, default: '' },
      retailer: {
        name: { type: String, default: 'Curated Artisan' },
        website: { type: String, default: '' },
        verified: { type: Boolean, default: false },
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    selected: {
      type: Boolean,
      default: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.guestSessionHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index ensuring one entry per product per consultation
giftBagSchema.index({ consultationId: 1, productId: 1 }, { unique: true });

const GiftBag = mongoose.model('GiftBag', giftBagSchema);

module.exports = GiftBag;
