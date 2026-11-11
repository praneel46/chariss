const express = require('express');
const router = express.Router();
const {
  getTemplates,
  createGiftCard,
} = require('../controllers/giftCardController');

router.get('/templates', getTemplates);
router.post('/', createGiftCard);

module.exports = router;
