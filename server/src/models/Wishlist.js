const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
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
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      imageUrl: { type: String },
      productUrl: { type: String },
      categoryName: { type: String },
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
wishlistSchema.index({ consultationId: 1, productId: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
