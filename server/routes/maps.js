const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

// Get place details
router.get('/place/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY,
        fields: ['name', 'formatted_address', 'geometry', 'rating', 'photos', 'opening_hours']
      }
    });

    res.json(response.data.result);
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

// Search for places
router.get('/search', async (req, res) => {
  try {
    const { query, location } = req.query;
    
    const response = await client.textSearch({
      params: {
        query: query,
        location: location,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ error: 'Failed to search places' });
  }
});

// Get directions between two points
router.get('/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;
    
    const response = await client.directions({
      params: {
        origin: origin,
        destination: destination,
        mode: mode,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error getting directions:', error);
    res.status(500).json({ error: 'Failed to get directions' });
  }
});

module.exports = router;
