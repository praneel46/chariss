const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    recipientName: { type: String, trim: true },
    senderName: { type: String, trim: true },
    occasion: { type: String, default: 'General' },
    templateId: { type: String, required: true },
    message: { type: String, required: true },
    tone: {
      type: String,
      enum: ['heartfelt', 'playful', 'romantic', 'formal', 'short', 'poetic'],
      default: 'heartfelt',
    },
    alignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
    fontSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' },
    designSettings: { type: Object, default: {} },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GiftCard', giftCardSchema);
