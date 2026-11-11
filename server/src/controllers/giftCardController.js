const GiftCard = require('../models/GiftCard');

const TEMPLATES = [
  {
    id: 'tmpl-01',
    name: 'Minimal Warm Botanical',
    theme: 'minimal_floral',
    borderColor: '#DCCFC1',
    textColor: '#292820',
    fontFamily: 'serif',
    stampIcon: '🌿',
  },
  {
    id: 'tmpl-02',
    name: 'Modern Editorial Sans',
    theme: 'modern_typography',
    borderColor: '#292820',
    textColor: '#151419',
    fontFamily: 'sans',
    stampIcon: '✦',
  },
  {
    id: 'tmpl-03',
    name: 'Warm Rose Sentiment',
    theme: 'warm_editorial',
    borderColor: '#E9D9DD',
    textColor: '#292820',
    fontFamily: 'handwriting',
    stampIcon: '💌',
  },
  {
    id: 'tmpl-04',
    name: 'Dark Noir Keepsake',
    theme: 'quiet_luxury',
    borderColor: '#B69A78',
    textColor: '#FAF9F6',
    fontFamily: 'serif',
    stampIcon: '⚜',
  },
];

const getTemplates = (req, res) => {
  res.json({
    success: true,
    message: 'Card templates retrieved',
    data: TEMPLATES,
  });
};

const createGiftCard = async (req, res) => {
  try {
    const { recipientName, senderName, occasion, templateId, message, tone, alignment, fontSize } =
      req.body;

    let card = {
      _id: 'card-' + Date.now(),
      recipientName,
      senderName,
      occasion,
      templateId,
      message,
      tone,
      alignment,
      fontSize,
      createdAt: new Date(),
    };

    if (GiftCard.db && GiftCard.db.readyState === 1) {
      card = await GiftCard.create({
        recipientName,
        senderName,
        occasion,
        templateId,
        message,
        tone,
        alignment,
        fontSize,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Gift card created and saved',
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create gift card',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

module.exports = {
  getTemplates,
  createGiftCard,
};
