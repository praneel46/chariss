const express = require('express');
const router = express.Router();
const {
  createConsultation,
  generateRecommendations,
} = require('../controllers/consultationController');

router.post('/', createConsultation);
router.post('/generate/:consultationId?', generateRecommendations);

module.exports = router;
