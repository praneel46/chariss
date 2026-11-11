const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestSessionId: { type: String, default: null },
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

module.exports = mongoose.model('Consultation', consultationSchema);
