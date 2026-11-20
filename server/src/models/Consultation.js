const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestSessionId: { type: String, default: null }, // Legacy field preserved
    guestSessionHash: { type: String, default: null },
    guestSessionExpiresAt: { type: Date, default: null },
    idempotencyKey: { type: String, default: null, trim: true },
    requestPayloadHash: { type: String, default: null },
    recipientName: { type: String, trim: true },
    relationship: { type: String, required: true },
    occasion: { type: String, required: true },
    interests: [{ type: String }],
    personality: [{ type: String }],
    desiredEmotion: { type: String, required: true },
    budget: {
      min: { type: Number, default: 500 },
      max: { type: Number, default: 3500 },
      currency: { type: String, default: 'INR' },
    },
    productCategories: [{ type: String }],
    exclusions: [{ type: String }],
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'saved'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

consultationSchema.index({ userId: 1, createdAt: -1 });
consultationSchema.index({ guestSessionId: 1, createdAt: -1 }, { sparse: true });
consultationSchema.index({ guestSessionHash: 1, createdAt: -1 }, { sparse: true });

// Scoped Idempotency Indexes: enforces uniqueness per user or per guest session
consultationSchema.index(
  { userId: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      userId: { $type: 'objectId' },
      idempotencyKey: { $type: 'string' },
    },
  }
);

consultationSchema.index(
  { guestSessionHash: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      guestSessionHash: { $type: 'string' },
      idempotencyKey: { $type: 'string' },
    },
  }
);

module.exports = mongoose.model('Consultation', consultationSchema);
