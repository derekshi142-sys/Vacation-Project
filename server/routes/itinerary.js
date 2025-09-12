const express = require('express');
const router = express.Router();
const { generateItinerary, getItinerary, updateItinerary } = require('../controllers/itineraryController');

// Generate new itinerary
router.post('/generate', generateItinerary);

// Get existing itinerary
router.get('/:id', getItinerary);

// Update itinerary
router.put('/:id', updateItinerary);

module.exports = router;
