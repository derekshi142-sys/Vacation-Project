const express = require('express');
const router = express.Router();
const { serperSearch } = require('../controllers/searchController');

router.post('/serper', serperSearch);

module.exports = router;



